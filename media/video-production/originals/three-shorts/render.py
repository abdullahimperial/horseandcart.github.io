#!/usr/bin/env python3
"""Three continuous-scene, 1080 × 1920 motion-graphic Shorts.

Python 3 + Pillow + NumPy + FFmpeg. No stock media, external audio or network.
Usage: python3 render.py --preview | --render 1 2 3 | --package
"""
from pathlib import Path
from functools import lru_cache
import math, json, subprocess, sys, wave, zipfile
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT=Path(__file__).resolve().parent
OUT=ROOT.parent/'output'; QA=ROOT.parent/'qa'
OUT.mkdir(exist_ok=True); QA.mkdir(exist_ok=True)
W,H,FPS=1080,1920,30
BG=(7,25,30); INK=(13,44,48); CREAM=(248,237,212)
MUTED=(151,182,178); DIM=(41,77,79); GOLD=(234,185,99)
MINT=(107,222,184); RED=(241,125,111); WHITE=(252,248,238)
SANS='/usr/share/fonts/truetype/open-sans/OpenSans-Regular.ttf'
BOLD='/usr/share/fonts/truetype/open-sans/OpenSans-Bold.ttf'
MONO='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
DUR={1:49,2:46,3:59}
NAMES={1:'01_Horse_and_Cart',2:'02_The_True_Cost',3:'03_The_Financial_Spiral'}

# Complete on-screen story, deliberately readable without speech.
CAPTIONS={
1:[(0,4,['Working hard.','Still going nowhere?']),
   (4,8.5,['Two brothers. One horse.','One cart.']),
   (8.5,13,['One brother tied the horse behind','the cart. Now it had to push.']),
   (13,18.5,['His brother changed the order.']),
   (18.5,23,['Same horse. Same cart.','A much easier journey.']),
   (23,28,['That is how I think','about my money.']),
   (28,33,['Buy first, and tomorrow’s income','can pay for yesterday’s purchase.']),
   (33,39,['Save first, and the order changes:','earn, save, then buy.']),
   (39,44,['My “payments” can build savings','for the next purchase.']),
   (44,49,['Put the cart behind the horse.'])],
2:[(0,4,['A $100 purchase can require','$140 in earnings.']),
   (4,9,['The price tag is only','the starting point.']),
   (9,14,['Add $5 in sales tax.','Now I need $105 to spend.']),
   (14,20.5,['If I keep 75% of my pay,','I have to earn $140.']),
   (20.5,27,['The other $35 goes to income tax','and payroll deductions.']),
   (27,34,['At $20 an hour before deductions,','that is seven hours of work.']),
   (34,40.5,['Is this purchase worth','that much of my time?']),
   (40.5,46,['The real price includes my time.'])],
3:[(0,4,['The holy grail of','personal finance?']),
   (4,10,['Income minus expenses.','What is left each month?']),
   (10,17,['Save the surplus. A buffer can','help avoid fees and borrowing.']),
   (17,24,['Lower costs can leave','an even bigger surplus.']),
   (24,28,['Now rewind. Same starting point.','A different monthly gap.']),
   (28,35,['Spend $500 more than you earn.','Borrow the difference.']),
   (35,43,['Interest adds another expense.','Next month, the gap grows.']),
   (43,49,['I work on both sides:','earn more, spend less.']),
   (49,55,['A surplus can turn the direction','before net worth turns positive.']),
   (55,59,['Change the equation.','Change the direction.'])]}

def clamp(x,a=0.,b=1.): return max(a,min(b,x))
def smooth(x): x=clamp(x); return x*x*(3-2*x)
def ramp(t,a,b): return smooth((t-a)/(b-a))
def mix(a,b,u): return a+(b-a)*u
def color(a,b,u): return tuple(round(mix(x,y,u)) for x,y in zip(a,b))
def rgb(c,a=1): return color(BG,c,clamp(a))+(255,)
def window(t,a,b,fade=.3): return ramp(t,a,a+fade)*(1-ramp(t,b-fade,b))

@lru_cache(maxsize=200)
def font(size,bold=False,mono=False):
    return ImageFont.truetype(MONO if mono else BOLD if bold else SANS,round(size))

@lru_cache(maxsize=1500)
def sprite(txt,size,bold=False,col=CREAM,tracking=0,mono=False):
    f=font(size,bold,mono); bb=f.getbbox(txt)
    width=round(f.getlength(txt)+max(0,len(txt)-1)*tracking)+12
    im=Image.new('RGBA',(width,bb[3]-bb[1]+12)); d=ImageDraw.Draw(im)
    if tracking:
        x=6
        for c in txt:
            d.text((x,6-bb[1]),c,font=f,fill=col); x+=f.getlength(c)+tracking
    else: d.text((6,6-bb[1]),txt,font=f,fill=col)
    return im

def text(im,txt,x,y,size=44,bold=False,col=CREAM,alpha=1,anchor='center',tracking=0,mono=False,maxw=None):
    if alpha<=.001 or not txt:return
    # Open Sans on this renderer lacks arrows; use a complete glyph fallback.
    if '→' in txt:mono=True
    if maxw:
        while font(size,bold,mono).getlength(txt)+max(0,len(txt)-1)*tracking>maxw: size-=1
    s=sprite(txt,size,bold,col,tracking,mono)
    if alpha<.998:
        s=s.copy(); s.putalpha(s.getchannel('A').point(lambda n:round(n*clamp(alpha))))
    x=x if anchor=='left' else x-s.width if anchor=='right' else x-s.width/2
    im.alpha_composite(s,(round(x),round(y-s.height/2)))

def multiline(im,lines,x,y,size=70,leading=None,**kw):
    leading=leading or size*1.22
    for i,line in enumerate(lines):text(im,line,x,y+i*leading,size,**kw)

def line(im,pts,col=DIM,width=3,alpha=1):
    ImageDraw.Draw(im).line([(round(x),round(y)) for x,y in pts],fill=rgb(col,alpha),width=round(width),joint='curve')

def dot(im,x,y,r,col=GOLD,alpha=1):
    ImageDraw.Draw(im).ellipse((round(x-r),round(y-r),round(x+r),round(y+r)),fill=rgb(col,alpha))

def rr(im,box,r=24,fill=INK,outline=None,width=2,alpha=1):
    ImageDraw.Draw(im).rounded_rectangle(tuple(round(z) for z in box),round(r),fill=rgb(fill,alpha) if fill else None,outline=rgb(outline,alpha) if outline else None,width=width)

def arrow(im,a,b,col=GOLD,width=4,size=15,alpha=1):
    line(im,[a,b],col,width,alpha)
    ang=math.atan2(b[1]-a[1],b[0]-a[0])
    line(im,[(b[0]-size*math.cos(ang-.5),b[1]-size*math.sin(ang-.5)),b,(b[0]-size*math.cos(ang+.5),b[1]-size*math.sin(ang+.5))],col,width,alpha)

def cubic(a,b,c,d,n=24):
    return [((1-u)**3*a[0]+3*(1-u)**2*u*b[0]+3*(1-u)*u*u*c[0]+u**3*d[0],(1-u)**3*a[1]+3*(1-u)**2*u*b[1]+3*(1-u)*u*u*c[1]+u**3*d[1]) for u in np.linspace(0,1,n)]

def path_points(start,segments):
    p=[start]; last=start
    for seg in segments:
        if len(seg)==2:p.append(seg);last=seg
        else:
            b,c,d=seg;p.extend(cubic(last,b,c,d));last=d
    return p

def make_bg():
    yy,xx=np.mgrid[0:H,0:W]; rng=np.random.default_rng(25)
    v=np.exp(-(((xx-440)/620)**2+((yy-850)/950)**2))*14
    grain=rng.normal(0,.65,(H,W)); arr=np.zeros((H,W,3),dtype=np.uint8)
    for i,n in enumerate(BG):arr[:,:,i]=np.clip(n+v+grain,0,255)
    im=Image.fromarray(arr).convert('RGBA')
    # Fixed quiet drafting grid grounds each animation in a single continuous space.
    d=ImageDraw.Draw(im)
    for x in range(80,1000,80):
        for y in range(480,1300,80):d.ellipse((x,y,x+2,y+2),fill=(34,64,66))
    return im

BASE=make_bg()

def frame_shell(ep,t,title,subtitle=None):
    im=BASE.copy()
    text(im,'LET’S FIX MONEY',76,130,28,True,CREAM,anchor='left',tracking=3)
    text(im,f'0{ep} / 03',900,130,25,col=MUTED,anchor='right',tracking=2)
    line(im,[(76,181),(904,181)],DIM,2)
    line(im,[(76,181),(76+828*clamp(t/DUR[ep]),181)],GOLD,3)
    # Headings change on the same stage with a short fade-through, never a cut.
    changes={1:[13,23,33],2:[9,27],3:[4,24,28,43]}
    nearest=min(changes[ep],key=lambda v:abs(t-v))
    title_alpha=smooth(abs(t-nearest)/.28) if abs(t-nearest)<.28 else 1
    multiline(im,title,490,275,72,leading=89,bold=True,maxw=830,alpha=title_alpha)
    if subtitle:text(im,subtitle,490,440,27,col=MUTED,tracking=1,maxw=830)
    # Safe subtitle region remains above YouTube's description and right-hand controls.
    for a,b,ls in CAPTIONS[ep]:
        op=window(t,a,b,.28)
        if op:
            for j,s in enumerate(ls):text(im,s,488,1400+j*61,43,col=WHITE,alpha=op,maxw=825)
    text(im,'letsfixmoney.com',490,1606,32,True,col=GOLD)
    text(im,'FROM THE BOOK · LET’S FIX MONEY',490,1660,20,col=MUTED,tracking=1)
    return im

def title_for(ep,t):
    if ep==1:
        if t<13:return ['SAME EFFORT.','WRONG ORDER.']
        if t<23:return ['CHANGE','THE ORDER.']
        if t<33:return ['WHAT COMES','FIRST?']
        return ['EARN. SAVE.','THEN BUY.']
    if ep==2:
        if t<9:return ['THE PRICE TAG','IS NOT THE COST.']
        if t<27:return ['WHAT DO I','NEED TO EARN?']
        return ['WHAT DOES IT','COST IN TIME?']
    if t<4:return ['THE HOLY GRAIL','OF PERSONAL FINANCE?']
    if t<24:return ['THE UPWARD','SPIRAL.']
    if t<28:return ['SAME START.','DIFFERENT GAP.']
    if t<43:return ['THE DOWNWARD','SPIRAL.']
    return ['CHANGE YOUR','DIRECTION.']

@lru_cache(maxsize=72)
def horse_sprite(phase):
    # Custom vector horse, facing right. Gait is jointed rather than sliding.
    S=3; im=Image.new('RGBA',(900,780));d=ImageDraw.Draw(im)
    def poly(pts,c):d.polygon([(round(x*S),round(y*S)) for x,y in pts],fill=c)
    def ln(pts,c,w):d.line([(round(x*S),round(y*S)) for x,y in pts],fill=c,width=round(w*S),joint='curve')
    def el(box,c):d.ellipse(tuple(round(x*S) for x in box),fill=c)
    a=phase/72*math.tau
    # Far legs precede torso, near legs follow it; paired phase shifts imply a walk.
    def leg(x,y,p,col):
        knee=(x+16*math.sin(p),y+38)
        hoof=(knee[0]+21*math.sin(p+.4),223-max(0,math.cos(p))*15)
        ln([(x,y),knee,hoof],col,12);ln([(hoof[0]-5,hoof[1]),(hoof[0]+16,hoof[1])],(116,95,67),8)
    leg(81,148,a+math.pi,(177,165,141));leg(181,139,a,(177,165,141))
    tail=path_points((67,123),[((24,115),(28,173),(9,184)),((35,190),(47,169),(49,147))])
    poly(tail,(153,124,80))
    body=path_points((58,123),[
        ((66,100),(90,99),(125,107)),((143,112),(153,111),(167,95)),
        ((174,79),(176,58),(190,48)),(186,28),(200,43),(211,28),(211,53),
        ((221,57),(223,77),(244,87)),((253,91),(252,106),(242,110)),
        (218,106),((213,104),(208,96),(206,90)),
        ((202,111),(202,135),(185,149)),((159,167),(115,169),(84,156)),
        ((66,154),(54,144),(58,123))])
    poly(body,CREAM)
    mane=path_points((190,48),[((168,56),(166,81),(158,102)),(169,109),((180,91),(181,67),(199,52))])
    poly(mane,(171,139,90))
    leg(80,146,a,(231,216,188));leg(172,145,a+math.pi,(241,226,199))
    el((219,71,224,76),BG);ln([(224,98),(245,100)],(150,121,85),3)
    ln([(206,61),(217,102),(241,105)],(78,115,106),4)
    ln([(170,112),(181,144),(199,125)],(78,115,106),5)
    ln([(85,119),(169,119)],(78,115,106),5)
    ln([(94,112),(96,156)],(78,115,106),6)
    # A subtle highlight on the barrel gives the silhouette form.
    ln(cubic((86,111),(110,105),(136,121),(151,116)),(255,247,225),2)
    return im.resize((390,338),Image.Resampling.LANCZOS)

def horse(im,cx,ground,t,moving=True):
    phase=round((t*(1.45 if moving else 2.2)%1)*72)%72
    s=horse_sprite(phase)
    bounce=3*math.sin(t*math.tau*2) if moving else 6*math.sin(t*math.tau*2.2)
    im.alpha_composite(s,(round(cx-195),round(ground-290+bounce)))

def cart(im,cx,ground,t,progress=0,moving=True):
    d=ImageDraw.Draw(im);y=ground-156
    # Cargo rounds into saved-money tokens while the wagon itself remains in place.
    for x,yy,w,h in [(-94,-44,83,59),(-3,-64,94,79),(-42,-109,75,43)]:
        rr(im,(cx+x,y+yy,cx+x+w,y+yy+h),r=mix(5,min(w,h)/2,progress),fill=color((82,125,119),GOLD,progress),outline=color((120,160,146),CREAM,progress),width=2)
        if progress<.8:line(im,[(cx+x+14,y+yy+12),(cx+x+w-14,y+yy+12)],CREAM,2,.4*(1-progress))
    d.polygon([(cx-125,y),(cx+126,y),(cx+108,y+88),(cx-109,y+88)],fill=(39,87,82),outline=GOLD,width=4)
    for k in (28,56):line(im,[(cx-118+k*.1,y+k),(cx+118-k*.1,y+k)],(100,142,122),2)
    line(im,[(cx-125,y),(cx+126,y)],GOLD,6)
    for x in (cx-83,cx+83):
        d.ellipse((x-42,ground-85,x+42,ground-1),fill=BG,outline=GOLD,width=6)
        ang=t*(2.9 if moving else .08)
        for a in np.linspace(0,math.tau,6,endpoint=False):
            line(im,[(x,ground-43),(x+35*math.cos(a+ang),ground-43+35*math.sin(a+ang))],(127,155,137),3)
        dot(im,x,ground-43,8,GOLD)

def flow(im,t):
    a=ramp(t,23,24);u=ramp(t,32,34)
    if not a:return
    col=color(RED,MINT,u)
    labels0=['BUY','REPAY','REPEAT'];labels1=['EARN','SAVE','BUY']
    for k,x in enumerate((215,485,755)):
        rr(im,(x-111,1134,x+111,1216),22,INK,col,2,a)
        text(im,labels0[k],x,1174,33,True,col=RED,alpha=a*(1-u))
        text(im,labels1[k],x,1174,33,True,col=MINT,alpha=a*u)
        if k<2:arrow(im,(x+124,1175),(x+145,1175),col,3,11,a)
    for j in range(3):
        q=(t*.25+j/3)%1
        dot(im,120+730*q,1255,4,col,a*.55)

def frame1(t):
    im=frame_shell(1,t,title_for(1,t),'THE HORSE & CART STORY')
    u=ramp(t,13.5,18.5); finance=ramp(t,33,38)
    hc=mix(305,680,u);cc=mix(678,280,u)
    hg=1000+70*math.sin(math.pi*u);cg=1000-38*math.sin(math.pi*u)
    # Road and dust stay on the same stage throughout.
    line(im,[(84,1004),(900,1004)],DIM,3)
    for j in range(13):
        x=80+(j*76-(t*42 if u>.99 else 0))%820
        line(im,[(x,1035),(x+22,1035)],(50,81,78),2)
    for x,g in [(hc,hg),(cc,cg)]:
        ImageDraw.Draw(im).ellipse((x-140,g-4,x+140,g+14),fill=(5,20,25))
    if 0.05<u<.95:
        pts=cubic((290,650),(390,550),(620,550),(728,680),80)
        line(im,pts,GOLD,3,math.sin(math.pi*u)*.6)
        arrow(im,pts[-3],pts[-1],GOLD,3,14,math.sin(math.pi*u))
    # Unhitch during the swap and reconnect once the horse is in front.
    harness=1-ramp(u,.02,.18) if u<.5 else ramp(u,.82,.98)
    if harness>0:
        if u<.5:line(im,[(hc+105,hg-150),(cc-125,cg-145)],GOLD,4,harness)
        else:
            line(im,[(cc+120,cg-147),(hc-57,hg-147)],GOLD,4,harness)
            line(im,[(cc+120,cg-128),(hc-57,hg-125)],GOLD,3,harness*.8)
    cart(im,cc,cg,t,finance,u>.99)
    horse(im,hc,hg,t,u>.99)
    phase_label='PUSHING' if u<.05 else 'REARRANGING' if u<.99 else 'PULLING'
    tagcol=RED if u<.05 else GOLD if u<.99 else MINT
    rr(im,(322,528,658,588),30,BG,tagcol,2)
    text(im,phase_label,490,558,26,True,col=tagcol,tracking=2)
    label_a=ramp(t,23,24)
    text(im,'EARN FIRST',hc,690,25,True,col=MINT,alpha=label_a*finance,tracking=1)
    text(im,'BUY AFTER',cc,690,25,True,col=GOLD,alpha=label_a*finance,tracking=1)
    flow(im,t)
    return im

def fmt(x,signed=False):
    sign='−' if x<-.5 else '+' if signed and x>.5 else ''
    return f'{sign}${abs(x):,.0f}'

def frame2(t):
    im=frame_shell(2,t,title_for(2,t),'PRICE → EARNINGS → HOURS')
    receipt=ramp(t,8.4,10);pay=ramp(t,13.3,15);clock=ramp(t,27,31)
    cx=490;cy=mix(mix(815,825,receipt),855,clock)
    ww=mix(mix(590,720,receipt),600,clock); hh=mix(mix(420,620,receipt),600,clock)
    rr(im,(cx-ww/2,cy-hh/2,cx+ww/2,cy+hh/2),mix(34,300,clock),INK,(78,116,109),3)
    ticket_a=1-receipt
    if ticket_a:
        dot(im,cx-235,cy-140,17,BG,ticket_a);dot(im,cx-235,cy-140,6,GOLD,ticket_a)
        text(im,'THE PRICE TAG',cx,710,27,True,col=MUTED,alpha=ticket_a,tracking=2)
        text(im,'$100',cx,830,150,True,alpha=ticket_a)
        text(im,'before sales tax',cx,940,30,col=MUTED,alpha=ticket_a)
    ra=receipt*(1-pay)
    if ra:
        text(im,'AT CHECKOUT',cx,597,27,True,col=MUTED,alpha=ra,tracking=2)
        text(im,'Price',200,703,38,alpha=ra,anchor='left');text(im,'$100',784,703,46,True,alpha=ra,anchor='right')
        text(im,'Sales tax',200,780,38,alpha=ra,anchor='left');text(im,'+$5',784,780,46,True,col=GOLD,alpha=ra,anchor='right')
        line(im,[(204,846),(779,846)],DIM,2,ra)
        text(im,'$105',cx,950,120,True,col=CREAM,alpha=ra)
        text(im,'needed to pay',cx,1050,28,col=MUTED,alpha=ra)
    pa=pay*(1-ramp(t,27,28.5))
    if pa:
        text(im,'GROSS EARNINGS NEEDED',cx,600,25,True,col=MUTED,alpha=pa,tracking=1)
        val=mix(105,140,pay)
        text(im,fmt(val),cx,722,122,True,col=CREAM,alpha=pa)
        # Equal-width units keep the 75% / 25% split exact.
        rr(im,(183,825,798,920),18,DIM,alpha=pa)
        rr(im,(183,825,183+615*.75,920),18,MINT,alpha=pa)
        rr(im,(183+615*.75,825,798,920),18,RED,alpha=pa)
        text(im,'75%',409,873,40,True,col=BG,alpha=pa)
        text(im,'25%',721,873,32,True,col=BG,alpha=pa)
        text(im,'$105',391,986,51,True,col=MINT,alpha=pa)
        text(im,'to spend',391,1040,27,col=MUTED,alpha=pa)
        text(im,'$35',718,986,51,True,col=RED,alpha=pa)
        text(im,'deductions',718,1040,25,col=MUTED,alpha=pa)
    ca=ramp(t,28.5,30.5)
    if ca>0:
        d=ImageDraw.Draw(im);radius=252
        for k in range(12):
            ang=k*math.tau/12-math.pi/2
            line(im,[(cx+(radius-13)*math.cos(ang),cy+(radius-13)*math.sin(ang)),(cx+radius*math.cos(ang),cy+radius*math.sin(ang))],MUTED,4,ca)
        # Seven $20 earnings blocks curve from the pay bar onto a seven-hour arc.
        fill=ramp(t,29,34)
        for k in range(7):
            frac=clamp(fill*7-k)
            ang=-math.pi/2+(k+.5)*math.tau/12
            x=mix(225+k*88,cx+204*math.cos(ang),clock)
            y=mix(873,cy+204*math.sin(ang),clock)
            dot(im,x,y,16,color(DIM,GOLD,frac),ca)
        start=-90;end=-90+210*fill
        if end>start:d.arc((cx-204,cy-204,cx+204,cy+204),start,end,fill=rgb(GOLD,ca),width=8)
        ang=-math.pi/2+math.tau/12*7*fill
        line(im,[(cx,cy),(cx+152*math.cos(ang),cy+152*math.sin(ang))],GOLD,6,ca)
        dot(im,cx,cy,9,GOLD,ca)
        rr(im,(cx-160,cy-62,cx+160,cy+62),20,INK,alpha=ca)
        text(im,'7 HOURS',cx,cy,67,True,col=CREAM,alpha=ca,maxw=300)
    if t>=13:
        a=ramp(t,13,14)
        formula1='($100 + $5) ÷ 0.75 = $140'
        formula2='$140 ÷ $20/hour = 7 hours'
        text(im,formula1,490,1190,37,True,col=MINT,alpha=pa,maxw=830,mono=True)
        text(im,formula2,490,1190,36,True,col=GOLD,alpha=ca,maxw=830,mono=True)
    if t>=9:
        text(im,'ILLUSTRATION · 5% sales tax · 25% payroll deductions',490,1275,23,col=MUTED,alpha=ramp(t,9,10),maxw=830)
    return im

POS=[0,500,1010,1530,2060,2600,3150]
DEBT=[0.]
for _ in range(6):DEBT.append(DEBT[-1]*1.02+500)

def interpolate(values,m):
    lo=min(len(values)-1,int(m));hi=min(len(values)-1,lo+1)
    return mix(values[lo],values[hi],m-lo)

def scenario(t):
    if t<10:return dict(kind='up',p=0,month=0,net=0,inc=4000,exp=3500,delta=500)
    if t<24:
        m=6*clamp((t-10)/12);month=min(6,max(1,math.ceil(m)))
        delta=500+(month-1)*10
        return dict(kind='up',p=m/6,month=m,net=interpolate(POS,m),inc=4000,exp=4000-delta,delta=delta)
    if t<28:
        p=1-ramp(t,24,27.4)
        return dict(kind='rewind',p=p,month=p*6,net=3150*p,inc=4000,exp=mix(4500,3450,p),delta=mix(-500,550,p))
    if t<43:
        m=6*clamp((t-28)/13);month=min(6,max(1,math.ceil(m)))
        extra=DEBT[month-1]*.02;exp=4500+extra
        return dict(kind='down',p=m/6,month=m,net=-interpolate(DEBT,m),inc=4000,exp=exp,delta=4000-exp)
    u=ramp(t,43,46);repay=ramp(t,47,53)
    inc=mix(4000,4500,u);exp=mix(4500+DEBT[5]*.02,3950,u)
    return dict(kind='turn',p=1,month=6+repay,net=-DEBT[-1]+550*repay,inc=inc,exp=exp,delta=inc-exp,repay=repay)

def helix(im,direction,progress,t,col,alpha=1):
    cx=423;cy=878;n=260
    # Perspective ellipse widens with the financial feedback loop.
    pts=[]
    for u in np.linspace(0,clamp(progress),max(2,round(n*progress))):
        theta=u*math.tau*2.5-.5
        radius=70+180*u
        x=cx+radius*math.cos(theta)
        y=cy-direction*u*380+radius*.20*math.sin(theta)
        pts.append((x,y,u,math.sin(theta)))
    if len(pts)<3:return
    line(im,[(p[0],p[1]) for p in pts],color(DIM,col,.18),15,alpha)
    for p,q in zip(pts[:-1],pts[1:]):
        c=color(DIM,col,.40+.6*((p[3]+1)/2))
        line(im,[(p[0],p[1]),(q[0],q[1])],c,5,alpha)
    x,y,_,_=pts[-1];dot(im,x,y,12,col,alpha)
    if len(pts)>4:arrow(im,(pts[-5][0],pts[-5][1]),(x,y),col,4,17,alpha)
    for k in range(3):
        u=((t*.13+k/3)%1)*progress
        theta=u*math.tau*2.5-.5;r=70+180*u
        dot(im,cx+r*math.cos(theta),cy-direction*u*380+r*.20*math.sin(theta),4,col,alpha*.7)

def meter(im,net):
    x=849;top=585;bottom=1195;zero=890;w=44;maxv=4000
    text(im,'NET',x,481,26,True,col=MUTED,tracking=1)
    text(im,'WORTH',x,518,26,True,col=MUTED,tracking=1)
    text(im,'+$4,000',x,558,21,col=MUTED,mono=True)
    rr(im,(x-w/2,top,x+w/2,bottom),22,INK,DIM,2)
    y=zero-net/maxv*305
    if net>0:rr(im,(x-w/2+4,y,x+w/2-4,zero),15,MINT)
    elif net<0:rr(im,(x-w/2+4,zero,x+w/2-4,y),15,RED)
    line(im,[(x-39,zero),(x+39,zero)],CREAM,2)
    text(im,'0',x-53,zero,23,col=CREAM)
    text(im,'−$4,000',x,1222,21,col=MUTED,mono=True)
    text(im,fmt(net,signed=True),x,1280,34,True,col=MINT if net>=0 else RED,maxw=165,mono=True)

def frame3(t):
    s=scenario(t);im=frame_shell(3,t,title_for(3,t),'ONE EQUATION. TWO FEEDBACK LOOPS.')
    if s['kind'] in ('up','rewind'):helix(im,1,s['p'],t,MINT)
    else:
        helix(im,-1,s['p'],t,RED,1-.28*s.get('repay',0))
        if s['kind']=='turn':
            # Improving direction starts below zero, not at a fictitious positive balance.
            p=s['repay'];pts=cubic((420,1234),(610,1240),(670,1140),(594,1107),80)
            cut=max(2,int(len(pts)*p));line(im,pts[:cut],MINT,7,p)
            if p>.05:arrow(im,pts[cut-2],pts[cut-1],MINT,4,18,p)
    meter(im,s['net'])
    cx=424;cy=881;col=MINT if s['delta']>=0 else RED
    rr(im,(93,731,754,1020),32,BG,col,2)
    text(im,'INCOME − EXPENSES',cx,782,40,True,col=CREAM,maxw=610)
    text(im,'TAKE-HOME · MONTHLY',cx,828,21,col=MUTED,tracking=2)
    text(im,f"{fmt(s['inc'])} − {fmt(s['exp'])}",cx,892,45,True,col=CREAM,maxw=605,mono=True)
    text(im,fmt(s['delta'],signed=True),cx,966,73,True,col=col,mono=True)
    if t<24:label='SURPLUS → SAVINGS';tag=MINT
    elif t<28:label='REWIND TO $0';tag=GOLD
    elif t<43:label='SHORTFALL → DEBT';tag=RED
    else:label='SURPLUS → DEBT REDUCTION';tag=MINT
    text(im,label,424,657,25,True,col=tag,tracking=1,maxw=640)
    month=f"MONTH {min(7,math.floor(s['month']+1e-6))}"
    if t<10:month='STARTING NET WORTH: $0'
    if 24<=t<28:month='SAME STARTING POINT'
    rr(im,(270,1070,578,1113),15,BG)
    text(im,month,424,1091,25,True,col=MUTED,tracking=1,maxw=610)
    rr(im,(161,1267,686,1318),15,BG)
    text(im,'NET WORTH = ASSETS − DEBTS',424,1293,24,col=MUTED,maxw=615)
    if t<24:note='Example: surplus saved; costs fall $10 each month.'
    elif t<28:note='Two illustrative paths, not a forecast.'
    elif t<43:note='Example: shortfall borrowed; 2% monthly interest.'
    else:note='One new $550 surplus reduces debt. Net worth is still negative.'
    text(im,note,490,1540,20,col=MUTED,maxw=840)
    return im

FRAME={1:frame1,2:frame2,3:frame3}

def make_audio(ep):
    """Quiet original foley/tones. No synthetic speech or licensed soundtrack."""
    sr=48000;dur=DUR[ep];n=round(dur*sr);a=np.zeros((n,2),np.float32);rng=np.random.default_rng(ep)
    def add(start,signal,gain=.15,pan=0):
        i=round(start*sr);sig=np.asarray(signal,dtype=np.float32)*gain
        if i<0 or i>=n:return
        sig=sig[:n-i];a[i:i+len(sig),0]+=sig*(1-pan*.5);a[i:i+len(sig),1]+=sig*(1+pan*.5)
    def tick(start,pitch=450,gain=.1,pan=0):
        x=np.arange(round(.095*sr))/sr
        sig=(np.sin(math.tau*pitch*x)*np.exp(-x*65)+.2*rng.normal(size=len(x))*np.exp(-x*95))
        add(start,sig,gain,pan)
    def bell(start,f=700,gain=.10):
        x=np.arange(round(.7*sr))/sr
        sig=(np.sin(math.tau*f*x)+.25*np.sin(math.tau*f*2*x))*np.exp(-x*8)*np.minimum(x/.006,1)
        add(start,sig,gain)
    def whoosh(start,d=.65,gain=.06):
        x=np.arange(round(d*sr))/sr
        noise=rng.normal(size=len(x));noise=np.convolve(noise,np.ones(9)/9,'same')
        add(start,noise*np.sin(math.pi*x/d)**2,gain)
    if ep==1:
        for t in np.arange(.6,13,.43):tick(t,300,.065,-.2);tick(t+.13,230,.05,.2)
        whoosh(13.8,1.1,.10);bell(18.5,660,.12)
        for t in np.arange(19,48,.53):tick(t,370,.038,-.3);tick(t+.2,280,.027,.3)
        whoosh(32.2,.8);bell(34,880,.1)
    elif ep==2:
        bell(.25,740,.12);tick(9,520,.12);bell(10,880,.09)
        whoosh(13.4,.7);tick(15,420,.10);bell(20.5,620,.07)
        whoosh(27,.8)
        for t in np.arange(29,41,.7):tick(t,900,.07)
        bell(34,740,.11)
    else:
        bell(.2,500,.09)
        for k in range(6):bell(10+k*14/6,430*2**(k/12),.075)
        whoosh(24,1,.09)
        for k in range(6):bell(28+k*15/6,440*2**(-k/12),.075)
        whoosh(43,.6);bell(47,580,.1);bell(53,740,.08)
    for ta,tb,_ in CAPTIONS[ep]:
        if ta>0:whoosh(ta,.22,.026)
    # Conservative headroom and a clean ending.
    a*=np.minimum(np.arange(n)/sr/.02,1)[:,None]
    a*=np.minimum((n-np.arange(n))/sr/.8,1)[:,None]
    peak=float(np.max(np.abs(a)))
    if peak>.72:a*=.72/peak
    path=OUT/f'{NAMES[ep]}_Sound.wav'
    with wave.open(str(path),'wb') as w:
        w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((a*32767).astype('<i2').tobytes())
    return path

def timestamp(t):
    ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'

def write_captions(ep):
    s='\n\n'.join(f'{i+1}\n{timestamp(a)} --> {timestamp(b)}\n'+ '\n'.join(ls) for i,(a,b,ls) in enumerate(CAPTIONS[ep]))+'\n'
    (OUT/f'{NAMES[ep]}.srt').write_text(s)

def render(ep):
    sound=make_audio(ep);write_captions(ep)
    dest=OUT/f'Lets_Fix_Money_{NAMES[ep]}_Short.mp4'
    cmd=['ffmpeg','-y','-v','error','-f','rawvideo','-vcodec','rawvideo','-pixel_format','rgb24','-video_size',f'{W}x{H}','-framerate',str(FPS),'-i','-','-i',str(sound),'-c:v','libx264','-preset','fast','-crf','19','-threads','3','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-movflags','+faststart','-t',str(DUR[ep]),str(dest)]
    proc=subprocess.Popen(cmd,stdin=subprocess.PIPE)
    for f in range(FPS*DUR[ep]):
        proc.stdin.write(FRAME[ep](f/FPS).convert('RGB').tobytes())
        if f%(FPS*5)==0:print(f'Video {ep}: {f/FPS:.0f}/{DUR[ep]} seconds rendered',flush=True)
    proc.stdin.close();code=proc.wait()
    if code:raise RuntimeError(f'FFmpeg failed: {code}')
    print(f'COMPLETE {dest.name} {dest.stat().st_size/1e6:.1f} MB',flush=True)

def preview():
    times={1:[2,10,15.8,20,30,36,42,47],2:[2,11,17,23,29,33,38,43],3:[2,12,21,26,32,40,50,57]}
    for ep,ts in times.items():
        sheet=Image.new('RGB',(4*270,2*508),(235,235,229));d=ImageDraw.Draw(sheet)
        for i,t in enumerate(ts):
            frame=FRAME[ep](t).convert('RGB');frame.save(QA/f'{ep}_{t:04.1f}.jpg',quality=92)
            thumb=frame.resize((270,480),Image.Resampling.LANCZOS);x=(i%4)*270;y=(i//4)*508
            sheet.paste(thumb,(x,y));d.text((x+10,y+483),f'{NAMES[ep]} | {t}s',font=font(15),fill=(20,30,30))
        sheet.save(QA/f'contact_{ep}.jpg',quality=94)
    print('Preview sheets created',flush=True)

def package():
    for ep in (1,2,3):write_captions(ep)
    assumptions={
      'format':'1080x1920, 30 fps, H.264/AAC. Single continuous animated stage in each video. On-screen narration; original sound effects; no spoken voice.',
      'book_source':'Let’s Fix Money, edited manuscript version 11, Chapter 2, pp. 24–29 in the 79-page rendering.',
      'true_cost':{'price':100,'sales_tax':5,'take_home_fraction':.75,'gross_required':140,'gross_hourly_pay':20,'work_hours':7},
      'positive_spiral':{'monthly_income':4000,'monthly_expenses':[3500,3490,3480,3470,3460,3450],'cumulative_net_worth':POS},
      'negative_spiral':{'starting_net_worth':0,'income':4000,'base_expenses':4500,'monthly_debt_interest':.02,'end_month_debt':DEBT,'recovery_income':4500,'recovery_expenses_including_interest':3950,'new_debt_repayment':550,'recovery_net_worth':-DEBT[-1]+550},
      'scope':'Illustrations only; assumed rates are not tax advice or forecasts. Surpluses saved or applied to debt; deficits borrowed. No asset-price changes. Expenses exclude saving and extra principal repayments.',
      'captions':CAPTIONS}
    (ROOT/'story_and_assumptions.json').write_text(json.dumps(assumptions,indent=2,ensure_ascii=False))
    (ROOT/'README.txt').write_text('Let’s Fix Money — Three continuous-scene Shorts\n\nRun: python3 render.py --render 1 2 3\nPreview: python3 render.py --preview\n\nRequires Python 3, Pillow, NumPy, FFmpeg with libx264, and system Open Sans / DejaVu Sans fonts. Update font paths at the top for another system. No network or licensed stock media is used.\n\nEach video has complete on-screen narration and original subtle sound effects. No synthetic spoken narration is included. The SRT files can be imported into an editor or uploaded as captions. Avoid displaying duplicate subtitles if the burned-in captions are enough.\n\nThe original manuscript is unchanged. The scripts are adaptations of Chapter 2. All values in the examples are illustrative. The third video resets to zero before showing the alternative negative path, then shows a debt repayment that improves net worth while it remains negative.\n')
    target=OUT/'Lets_Fix_Money_Three_Shorts_Editable_Source.zip'
    with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as z:
        for p in ROOT.iterdir():
            if p.suffix in ('.py','.txt','.json'):z.write(p,'project/'+p.name)
        for p in OUT.iterdir():
            if p.suffix in ('.srt','.wav'):z.write(p,'media/'+p.name)
    print(target)

if __name__=='__main__':
    if '--preview' in sys.argv:preview()
    if '--render' in sys.argv:
        for ep in map(int,sys.argv[sys.argv.index('--render')+1:]):render(ep)
    if '--package' in sys.argv:package()
