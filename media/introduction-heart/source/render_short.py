#!/usr/bin/env python3
"""Let's Fix Money: 28-second portrait teaser for YouTube Shorts.

Requires Python 3, Pillow, NumPy, SciPy and FFmpeg. No network required.
Run: python3 render_short.py [--preview]
"""
from pathlib import Path
from functools import lru_cache
import math, subprocess, sys, wave
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from scipy.signal import butter, sosfilt

ROOT = Path(__file__).resolve().parent
OUT = ROOT.parent
W, H, FPS, DURATION = 1080, 1920, 30, 28
CX = 490  # Reserve additional room on the right for Shorts controls.
CREAM=(239,224,184); GOLD=(204,170,101); MUTED=(160,180,151)
GREEN=(13,48,36); DIM=(52,81,60)
SERIF='/usr/share/fonts/opentype/urw-base35/P052-Roman.otf'
SANS='/usr/share/fonts/truetype/open-sans/OpenSans-Regular.ttf'

def sat(x): return max(0.,min(1.,x))
def ease(x):
    x=sat(x); return x*x*(3-2*x)
def ramp(t,a,b): return ease((t-a)/(b-a))
def rgba(c,a=1): return tuple(c)+(int(sat(a)*255),)
def lerp(a,b,u): return a+(b-a)*u

@lru_cache(maxsize=128)
def font(size,serif=False): return ImageFont.truetype(SERIF if serif else SANS,size)

@lru_cache(maxsize=128)
def text_sprite(text,size,serif=True,tracking=0,color=CREAM):
    f=font(size,serif)
    if tracking:
        widths=[f.getlength(c) for c in text]
        width=int(sum(widths)+tracking*(len(text)-1))+12
    else: width=int(f.getlength(text))+12
    bbox=f.getbbox(text)
    height=bbox[3]-bbox[1]+12
    im=Image.new('RGBA',(width,height))
    d=ImageDraw.Draw(im)
    if tracking:
        x=6
        for c,ww in zip(text,widths):
            d.text((x,6-bbox[1]),c,font=f,fill=color);x+=ww+tracking
    else:d.text((6,6-bbox[1]),text,font=f,fill=color)
    return im

def write(im,text,x,y,size=92,serif=True,alpha=1,tracking=0,color=CREAM):
    if alpha<=0:return
    s=text_sprite(text,size,serif,tracking,color)
    if alpha<.999:
        s=s.copy();s.putalpha(s.getchannel('A').point(lambda a:int(a*sat(alpha))))
    im.alpha_composite(s,(round(x-s.width/2),round(y-s.height/2)))

def line(im,points,color=GOLD,width=3,alpha=1):
    ImageDraw.Draw(im).line([(round(x),round(y)) for x,y in points],fill=rgba(color,alpha),width=width,joint='curve')

def dot(draw,x,y,r,color=CREAM,alpha=1):
    draw.ellipse((x-r,y-r,x+r,y+r),fill=rgba(color,alpha))

def bezier(p0,p1,p2,p3,n=240):
    t=np.linspace(0,1,n)[:,None]
    return (1-t)**3*np.array(p0)+3*(1-t)**2*t*np.array(p1)+3*(1-t)*t*t*np.array(p2)+t**3*np.array(p3)

def background():
    rng=np.random.default_rng(271)
    yy,xx=np.mgrid[0:H,0:W]
    r=((xx-W/2)/(W*.73))**2+((yy-H/2)/(H*.95))**2
    light=np.clip(1-r,0,1)*8
    noise=rng.normal(0,.85,(H,W))
    arr=np.stack([np.clip(GREEN[i]+light+noise,0,255) for i in range(3)],axis=2).astype('uint8')
    return Image.fromarray(arr).convert('RGBA')

BASE=background()
BANNER=Image.open(ROOT/'banner.png').convert('RGB').resize((W,H),Image.Resampling.LANCZOS).convert('RGBA')
UP=bezier((180,1290),(420,1310),(535,990),(820,945))

def top_label(im,t,label):
    a=ramp(t,.15,1.1)
    write(im,label,CX,260,30,False,a,3,MUTED)
    line(im,[(CX-36,325),(CX+36,325)],GOLD,3,a*.7)

def scene_loop(t):
    im=BASE.copy();d=ImageDraw.Draw(im)
    top_label(im,t,'A QUESTION ABOUT MONEY')
    messages=[(.4,2.35,'You earn it.'),(2.35,4.3,'You spend it.'),(4.3,7.5,'Then what?')]
    for start,end,txt in messages:
        a=ramp(t,start,start+.5)*(1-ramp(t,end-.3,end))
        if a:
            write(im,txt,CX,530+22*(1-ramp(t,start,start+.7)),112,True,a)
    # The same little tokens keep circulating: a familiar income/spending loop.
    n=240;theta=np.linspace(-math.pi/2,1.5*math.pi,n)
    points=np.c_[CX+275*np.cos(theta),1040+200*np.sin(theta)]
    a=ramp(t,.2,1)
    line(im,points,DIM,3,a)
    progress=min(n,int(n*ramp(t,.4,2.0)))
    if progress>1:line(im,points[:progress],GOLD,3,a*.55)
    d=ImageDraw.Draw(im)
    for k in range(9):
        ang=2*math.pi*(k/9-t*.13)-math.pi/2
        x=CX+275*math.cos(ang);y=1040+200*math.sin(ang)
        dot(d,x,y,13 if k==0 else 9,CREAM if k<3 else GOLD,a*(1 if k<3 else .7))
    write(im,'INCOME',CX,760,40,False,a*.8,4,MUTED)
    write(im,'SPENDING',CX,1330,40,False,a*.8,4,MUTED)
    return im

def scene_pillars(t):
    im=BASE.copy();top_label(im,t,'A DIFFERENT PERSPECTIVE')
    a=ramp(t,.1,.8)
    write(im,'What if',CX,420+18*(1-a),103,True,a)
    write(im,'the pattern',CX,538+18*(1-a),103,True,a)
    write(im,'could change?',CX,656+18*(1-a),103,True,a)
    ground=1240
    line(im,[(115,ground),(865,ground)],DIM,4,ramp(t,.3,1))
    d=ImageDraw.Draw(im)
    for k in range(4):
        u=ramp(t,.7+k*.25,1.8+k*.25)
        cx=220+k*180;top=ground-300*u;half=52
        d.rounded_rectangle((cx-half,top,cx+half,ground),radius=5,fill=rgba((24,65,45),u),outline=rgba(GOLD,u*.8),width=2)
        d.line((cx-half-10,top,cx+half+10,top),fill=rgba(CREAM,u*.95),width=5)
        d.line((cx-half-10,ground,cx+half+10,ground),fill=rgba(CREAM,u*.65),width=3)
        # Small marks arrive and settle on each pillar in turn.
        land=ramp(t,1.7+k*.28,2.55+k*.28)
        if land>0:
            yy=lerp(815,top-25,land)
            dot(d,cx,yy,11,CREAM,land)
            if land>.99:
                for j in range(2):dot(d,cx+(j*2-1)*26,top-25,7,GOLD,ramp(t,2.9,3.6))
    write(im,'FOUR PILLARS',CX,1370,40,False,ramp(t,1.6,2.5),4,CREAM)
    write(im,'OF SAVINGS',CX,1426,40,False,ramp(t,1.6,2.5),4,CREAM)
    return im

def scene_direction(t):
    im=BASE.copy();top_label(im,t,'EVERYDAY SPENDING')
    a=ramp(t,.1,.9)
    write(im,'Small decisions.',CX,445+15*(1-a),97,True,a)
    write(im,'A different',CX,595+15*(1-a),109,True,a)
    write(im,'direction.',CX,722+15*(1-a),109,True,a)
    prog=ramp(t,.45,3.8);num=int(prog*len(UP))
    if num>1:line(im,UP[:num],GOLD,5,a)
    d=ImageDraw.Draw(im)
    for k,idx in enumerate([20,93,167,229]):
        if num>idx:
            p=UP[idx];ap=ramp(t,.85+k*.7,1.25+k*.7)
            d.ellipse((p[0]-21,p[1]-21,p[0]+21,p[1]+21),outline=rgba(GOLD,ap*.35),width=3)
            dot(d,*p,9,CREAM,ap)
    if num>1:
        p=UP[min(num-1,len(UP)-1)]
        dot(d,*p,13,CREAM,a)
    if prog>.98:
        p=UP[-1];line(im,[(p[0]-21,p[1]-12),tuple(p),(p[0]-16,p[1]+18)],CREAM,3,ramp(t,3.55,4))
    write(im,'Explore the ideas',CX,1435,37,False,ramp(t,3.4,4.4),1,MUTED)
    write(im,'behind the book.',CX,1488,37,False,ramp(t,3.4,4.4),1,MUTED)
    return im

def scene_reveal(t):
    # A matching portrait illustration is a complete background layer.
    # All typography is separately rendered for sharpness on a phone.
    z=1+.025*ease(t/8.7)
    bw,bh=int(W*z),int(H*z)
    im=BANNER.resize((bw,bh),Image.Resampling.BICUBIC).crop(((bw-W)//2,(bh-H)//2,(bw+W)//2,(bh+H)//2))
    write(im,'A NEW VIDEO SERIES',CX,300,32,False,ramp(t,.15,1.1),4,CREAM)
    title_a=ramp(t,.1,.95)
    write(im,'LET’S FIX',CX,865+20*(1-title_a),109,True,title_a)
    write(im,'MONEY',CX,998+20*(1-title_a),132,True,title_a)
    write(im,'Abdullah Mohiuddin',CX,1110,37,False,title_a,1,CREAM)
    a=ramp(t,.7,1.7)
    write(im,'COMING SOON!',CX,1290+22*(1-a),78,True,a)
    # Hand-drawn line reveal beneath the final announcement.
    leng=450*ramp(t,1.5,2.4)
    line(im,[(CX-leng/2,1355),(CX+leng/2,1355)],GOLD,3,a*.9)
    write(im,'letsfixmoney.com',CX,1435,43,False,ramp(t,1.7,2.4),1,CREAM)
    write(im,'Subscribe for the first episode.',CX,1510,31,False,ramp(t,2.1,3),0,CREAM)
    return im

SCENES=[(0,7.3,scene_loop),(7.3,13.25,scene_pillars),(13.25,19.3,scene_direction),(19.3,28,scene_reveal)]

def frame(t):
    for i,(start,end,fn) in enumerate(SCENES):
        if t<end or i==len(SCENES)-1:
            im=fn(t-start)
            if i>0 and t<start+.55:
                prev=SCENES[i-1]
                old=prev[2](prev[1]-prev[0]-.03)
                im=Image.blend(old,im,ramp(t,start,start+.55))
            if t<.6:im=Image.blend(Image.new('RGBA',(W,H),GREEN+(255,)),im,ramp(t,0,.6))
            return im.convert('RGB')

def make_audio():
    # Original synthesized sound design: soft ticks, air transitions, two chimes.
    # No sampled music, third-party recordings, or voice likenesses.
    sr=48000;n=int(sr*DURATION);mix=np.zeros((n,2),np.float64)
    rng=np.random.default_rng(82)
    def add(s,at,gain=1,pan=0):
        ix=int(at*sr);end=min(n,ix+len(s));s=s[:end-ix]*gain
        if end<=ix:return
        mix[ix:end,0]+=s*math.sqrt((1-pan)/2)
        mix[ix:end,1]+=s*math.sqrt((1+pan)/2)
    def chime(freq,dur=.8):
        x=np.arange(int(dur*sr))/sr
        env=(1-np.exp(-x*180))*np.exp(-x*5)
        return env*(np.sin(2*np.pi*freq*x)+.2*np.sin(2*np.pi*freq*2*x))
    def air(dur=.9):
        x=np.linspace(0,1,int(dur*sr))
        raw=rng.normal(0,1,len(x))
        filt=sosfilt(butter(2,[250,3200],btype='bandpass',fs=sr,output='sos'),raw)
        return filt*np.sin(np.pi*x)**2
    for at in [.8,2.7,4.7]:add(chime(285,.35),at,.115)
    for at in [7.25,13.2,19.25]:add(air(),at,.12)
    for k in range(4):add(chime([392,440,494,587][k],.6),8.4+k*.3,.1,(k-1.5)/3)
    for at,f in [(14.3,294),(15.0,392),(15.7,440),(16.4,523)]:add(chime(f,.7),at,.09)
    add(chime(392,1.6),20.2,.17,-.15)
    add(chime(587,2.0),20.7,.15,.15)
    mix*=np.minimum(np.arange(n)/(sr*.3),1)[:,None]
    mix*=np.minimum((n-np.arange(n))/(sr*1.2),1)[:,None]
    mix=np.clip(mix*4,-.95,.95)
    with wave.open(str(OUT/'sound_design.wav'),'wb') as w:
        w.setnchannels(2);w.setsampwidth(2);w.setframerate(sr);w.writeframes((mix*32767).astype('<i2').tobytes())

def contact_sheet():
    times=[1.3,3.2,5.5,8.4,9.6,11.7,14.4,16.8,18.7,20.7,22,26.5]
    thumbs=[]
    for i,t in enumerate(times):
        im=frame(t)
        im.save(OUT/'qa'/f'frame_{t:04.1f}.jpg',quality=92)
        th=im.resize((360,640),Image.Resampling.LANCZOS)
        draw=ImageDraw.Draw(th);draw.rectangle((0,610,92,640),fill=(5,23,16));draw.text((10,612),f'{t:04.1f}s',font=font(19),fill=CREAM)
        thumbs.append(th)
    sheet=Image.new('RGB',(1440,1920))
    for i,im in enumerate(thumbs):sheet.paste(im,((i%4)*360,(i//4)*640))
    sheet.save(OUT/'qa'/'contact_sheet.jpg',quality=92)

def render():
    make_audio()
    path=OUT/'Lets_Fix_Money_YouTube_Short_1080x1920.mp4'
    cmd=['ffmpeg','-y','-hide_banner','-loglevel','warning','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-',
         '-i',str(OUT/'sound_design.wav'),'-c:v','libx264','-preset','medium','-crf','19','-pix_fmt','yuv420p','-profile:v','high','-level','4.1',
         '-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709','-c:a','aac','-b:a','192k','-movflags','+faststart','-shortest',str(path)]
    p=subprocess.Popen(cmd,stdin=subprocess.PIPE)
    try:
        for i in range(DURATION*FPS):
            p.stdin.write(frame(i/FPS).tobytes())
            if i%90==0:print(f'Rendered {i//FPS}/{DURATION} seconds',flush=True)
        p.stdin.close()
        if p.wait():raise RuntimeError('FFmpeg failed')
    except BaseException:
        p.kill();raise
    print(path,flush=True)

if __name__=='__main__':
    (OUT/'qa').mkdir(exist_ok=True)
    contact_sheet()
    if '--preview' not in sys.argv:render()
