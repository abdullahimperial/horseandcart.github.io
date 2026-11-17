#!/usr/bin/env python3
"""Resumable portrait financial explainers: measured narration, animated diagrams, open captions."""
import argparse,hashlib,json,math,pathlib,subprocess,wave,fcntl,os
import numpy as np
from PIL import Image,ImageDraw,ImageFont
ROOT=pathlib.Path(__file__).resolve().parents[1]
W,H,FPS=720,1280,24
BG='#f8f4e9';INK='#15343c';TEAL='#147d72';MINT='#d9ebe2';GOLD='#dba74b';CORAL='#c85e48';LIGHT='#ffffff';MUTED='#566b6c'
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf';SERIF='/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf'
VERSION='1.0.0'
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def savejson(p,d):
 t=p.with_suffix('.tmp.json');t.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n');t.replace(p)
def font(sz,bold=False,serif=False):return ImageFont.truetype(SERIF if serif else BOLD if bold else FONT,sz)
def wrap(d,s,f,width):
 lines=[];line=''
 for word in s.split():
  trial=(line+' '+word).strip()
  if d.textlength(trial,font=f)>width and line:lines.append(line);line=word
  else:line=trial
 if line:lines.append(line)
 return lines
# Text fits bounded rectangles; never clip text to make a frame look complete.
def txt(d,s,box,size=30,color=INK,bold=False,center=False,maxlines=4,serif=False):
 x,y,r,b=box
 for sz in range(size,14,-1):
  f=font(sz,bold,serif);ls=wrap(d,s,f,r-x);lh=sz*1.29
  if len(ls)<=maxlines and len(ls)*lh<=b-y:break
 else:raise ValueError('Text does not fit: '+s)
 yy=y+max(0,(b-y-len(ls)*lh)/2)
 for l in ls:
  xx=x+(r-x-d.textlength(l,font=f))/2 if center else x
  d.text((xx,yy),l,font=f,fill=color,stroke_width=0);yy+=lh
 return len(ls)
def rr(d,box,fill=LIGHT,outline=None,radius=20,width=2):d.rounded_rectangle(box,radius=radius,fill=fill,outline=outline,width=width)
def line(d,pts,fill=INK,width=5):d.line(pts,fill=fill,width=width,joint='curve')
def icon(d,name,cx,cy,size=90,color=TEAL):
 s=size/100
 def pt(x,y):return(cx+(x-50)*s,cy+(y-50)*s)
 def ln(coords,w=5,c=color):line(d,[pt(*p) for p in coords],c,max(2,int(w*s)))
 def rect(x,y,a,b,fill=None):d.rounded_rectangle((*pt(x,y),*pt(a,b)),radius=6*s,fill=fill,outline=color,width=max(2,int(4*s)))
 def ell(x,y,a,b,fill=None):d.ellipse((*pt(x,y),*pt(a,b)),fill=fill,outline=color,width=max(2,int(4*s)))
 if name=='bank':
  ln([(8,31),(50,9),(92,31),(8,31)]);ln([(8,87),(92,87)])
  for x in [23,50,77]:ln([(x,39),(x,77)],7)
 elif name in ['bike','car','bus']:
  ell(4,58,34,88);ell(66,58,96,88)
  if name=='bike':ln([(19,73),(38,39),(58,73),(19,73),(38,39),(74,39),(81,73)]);ln([(31,33),(45,33)]);ln([(69,28),(74,39)])
  else:ln([(5,62),(16,40),(32,20),(69,20),(85,40),(95,62),(95,72),(85,72)]);ln([(30,72),(70,72)]);ln([(19,40),(80,40)]);ln([(50,23),(50,40)])
 elif name in ['screen','phone']:
  if name=='phone':rect(25,4,75,96);ln([(44,84),(56,84)]);ln([(40,15),(60,15)])
  else:rect(5,12,95,70);ln([(50,70),(50,87),(28,87),(72,87)])
 elif name in ['calendar','ticket','card','document','folder','mail','receipt']:
  rect(12,14,88,88)
  if name=='calendar':
   ln([(13,35),(88,35)]);ln([(30,4),(30,24)]);ln([(70,4),(70,24)])
   for y in [49,67]:
    for x in [30,50,70]:ell(x-3,y-3,x+3,y+3,color)
  elif name=='mail':ln([(15,18),(50,51),(85,18)])
  elif name=='card':ln([(15,34),(85,34)],9);ln([(25,64),(49,64)])
  elif name=='folder':ln([(13,30),(42,30),(51,41),(88,41)])
  else:
   for y in [34,51,68]:ln([(27,y),(74,y)],4)
 elif name=='house':ln([(4,44),(50,6),(96,44)]);ln([(16,37),(16,91),(84,91),(84,37)]);rect(40,58,61,91)
 elif name=='family':
  for x,y,z in [(24,26,18),(75,26,18),(50,48,14)]:ell(x-z/2,y-z/2,x+z/2,y+z/2);ln([(x,y+z/2),(x,y+38)]);ln([(x,y+19),(x-13,y+31)]);ln([(x,y+19),(x+13,y+31)])
 elif name=='basket':ln([(7,40),(20,85),(80,85),(93,40),(7,40)]);ln([(25,40),(43,15)]);ln([(75,40),(57,15)]);ln([(36,52),(40,74)]);ln([(64,52),(60,74)])
 elif name=='bottle':rect(38,4,62,19);ln([(38,19),(38,31),(25,46),(25,92),(75,92),(75,46),(62,31),(62,19)]);ln([(27,58),(73,58)]);ln([(27,78),(73,78)])
 elif name=='globe':ell(5,5,95,95);ell(29,5,71,95);ln([(7,50),(93,50)]);ln([(15,28),(85,28)]);ln([(15,73),(85,73)])
 elif name in ['book','box']:
  ln([(7,18),(50,29),(93,18),(93,82),(50,93),(7,82),(7,18)]);ln([(50,29),(50,93)])
  for y in [40,54,68]:ln([(17,y),(40,y+6)],3);ln([(61,y+6),(83,y)],3)
 elif name=='chart':ln([(10,8),(10,89),(94,89)]);ln([(18,73),(36,62),(53,67),(73,33),(92,17)],7)
 elif name=='search':ell(10,8,68,66);ln([(60,61),(91,92)],9)
 elif name=='city':
  rect(8,35,35,94);rect(39,6,68,94);rect(71,49,94,94)
  for x in [47,59]:
   for y in [23,39,55,71]:ell(x-2,y-2,x+2,y+2,color)
 elif name=='gear':
  ell(19,19,81,81);ell(38,38,62,62)
  for a in range(0,360,45):ln([(50+32*math.cos(math.radians(a)),50+32*math.sin(math.radians(a))),(50+45*math.cos(math.radians(a)),50+45*math.sin(math.radians(a)))],8)
 else:ell(7,7,93,93);ln([(28,51),(44,67),(75,33)],7)
def arrow(d,a,b,color=TEAL):
 line(d,[a,b],color,4);x,y=b;ang=math.atan2(b[1]-a[1],b[0]-a[0]);pts=[(x,y),(x-12*math.cos(ang-.5),y-12*math.sin(ang-.5)),(x-12*math.cos(ang+.5),y-12*math.sin(ang+.5))];d.polygon(pts,fill=color)
def scene(s,spec,beat,p=1):
 im=Image.new('RGB',(W,H),BG);d=ImageDraw.Draw(im)
 d.rectangle((0,0,W,12),fill=TEAL)
 txt(d,'LET’S FIX MONEY',(50,43,530,80),22,TEAL,True)
 txt(d,f'N{s["id"]:02d}',(580,43,650,80),20,MUTED,True,True)
 txt(d,s['title'].replace('—',' — '),(50,98,632,249),39,INK,True,maxlines=3,serif=True)
 for i in range(4):rr(d,(50+i*145,275,180+i*145,282),TEAL if i<=beat else '#dedfd5',radius=3)
 rr(d,(45,318,650,825),LIGHT,radius=28)
 txt(d,s['text'][beat],(75,334,620,402),29,INK,True,True,maxlines=2)
 kind=spec['kind'];items=spec['items'];n=len(items);motion=[]
 if kind in ['hero','warning','book']:
  icon(d,spec['icon'],347,482,110,CORAL if kind=='warning' else TEAL)
  if n==1:txt(d,items[0],(76,558,616,675),47,CORAL if kind=='warning' else INK,True,True,maxlines=3)
  else:
   for j,x in enumerate(items):txt(d,x,(80,550+j*65,615,610+j*65),31,INK,True,True,maxlines=2)
  motion=[(156,721),(540,721)]
 elif kind in ['checklist','receipt','layers']:
  icon(d,spec['icon'],108,447,55)
  txt(d,'CHECK' if kind=='checklist' else 'THE PARTS' if kind=='layers' else 'IN THE PICTURE',(153,420,608,475),18,MUTED,True)
  hh=min(79,245/max(n,1))
  for j,x in enumerate(items):
   yy=486+j*hh;active=p>j/max(n,1)
   rr(d,(77,yy,616,yy+hh-10),MINT if active else '#f1f2ec',radius=12)
   if kind=='checklist':icon(d,'check',105,yy+(hh-10)/2,27)
   else:txt(d,str(j+1),(90,yy+3,123,yy+hh-13),19,TEAL,True,True)
   txt(d,x,(139,yy+2,602,yy+hh-12),27,INK,True,maxlines=2)
  motion=[(65,490),(65,704)]
 elif kind in ['compare','balance','split']:
  icon(d,spec['icon'],347,449,66)
  for j,x in enumerate(items[:2]):
   xx=77+j*274;rr(d,(xx,510,xx+263,704),MINT if j==0 else '#f4ead7',radius=19)
   txt(d,x,(xx+17,530,xx+246,674),29,INK,True,True,maxlines=4)
  if kind=='balance':line(d,[(174,731),(518,731)],TEAL,4);d.polygon([(345,712),(328,749),(362,749)],fill=TEAL)
  else:arrow(d,(338,607),(356,607))
  motion=[(90,728),(605,728)]
 elif kind in ['flow','journey','gate']:
  icon(d,spec['icon'],105,444,51);txt(d,'CONSIDER THE STEPS',(152,417,605,474),18,MUTED,True)
  for j,x in enumerate(items):
   yy=490+j*(235/max(n,1));hh=min(70,225/max(n,1));rr(d,(110,yy,597,yy+hh),MINT if j/max(n,1)<p else '#f1f2ec',radius=15)
   txt(d,x,(127,yy+4,580,yy+hh-5),27,INK,True,True,maxlines=2)
   if j<n-1:arrow(d,(352,yy+hh+1),(352,yy+235/n-2))
  motion=[(86,500),(86,700)]
 elif kind=='equation':
  icon(d,spec['icon'],347,452,75)
  txt(d,items[0],(78,518,616,585),39,INK,True,True,maxlines=1)
  arrow(d,(347,595),(347,623))
  txt(d,items[1],(78,630,616,727),55,TEAL,True,True,maxlines=2)
  motion=[(157,745),(536,745)]
 elif kind=='calendar':
  icon(d,'calendar',347,445,68)
  for j in range(28):
   x=134+(j%7)*62;y=493+(j//7)*45
   rr(d,(x,y,x+44,y+30),TEAL if j<int(28*p) else MINT,radius=6)
  txt(d,' → '.join(items),(77,689,615,750),27,INK,True,True,maxlines=2)
 elif kind=='bucket':
  rr(d,(220,482,478,726),None,TEAL,12,5)
  d.rectangle((226,714-int(185*p),472,719),fill=MINT)
  arrow(d,(115,485),(240,560));arrow(d,(460,649),(579,714),CORAL)
  txt(d,items[0],(80,421,297,474),26,TEAL,True,True);txt(d,items[1],(417,740,620,790),26,CORAL,True,True)
  icon(d,'bank',348,623,75)
  motion=[(120,486),(232,553)]
 elif kind=='growth':
  for j,(x,val) in enumerate(zip(items,[100,110,121])):
   xx=126+j*159;hh=val*1.65*p;rr(d,(xx,708-hh,xx+116,708),TEAL if j==2 else MINT,radius=9)
   txt(d,x,(xx-15,724,xx+132,772),29,INK,True,True)
  txt(d,'ILLUSTRATION',(115,425,585,470),19,MUTED,True,True)
 else:raise ValueError(kind)
 txt(d,spec['note'],(75,758,620,813),21,MUTED,False,True,maxlines=2)
 # Room for platform controls and readable captions above the bottom UI area.
 rr(d,(45,858,650,1056),INK,radius=24)
 txt(d,'letsfixmoney.com',(50,1082,640,1122),23,TEAL,True,True)
 return im,motion

def endcard(s):
 im=Image.new('RGB',(W,H),INK);d=ImageDraw.Draw(im)
 icon(d,'book',350,353,135,'#e4bc6a')
 txt(d,'Let’s Fix Money',(70,490,630,650),62,LIGHT,True,True,3,True)
 txt(d,'Small steps. More breathing room.',(70,690,630,780),30,'#d9ebe2',False,True)
 txt(d,'letsfixmoney.com',(70,835,630,904),32,'#e4bc6a',True,True)
 return im

def drawcaption(im,text):
 if not text:return
 d=ImageDraw.Draw(im);txt(d,text,(72,876,621,1034),33,LIGHT,True,True,maxlines=3)

def render(s,specs,preview_only=False):
 job=f'N{s["id"]:02d}';w=ROOT/'work'/job;w.mkdir(exist_ok=True,parents=True)
 with (w/'render.lock').open('a') as lock:
  fcntl.flock(lock,fcntl.LOCK_EX)
  a=json.loads((w/'audio_state.json').read_text());assert a['status']=='complete'
  inp=hashlib.sha256(json.dumps([s,specs,a['sha256'],VERSION,digest(pathlib.Path(__file__))],sort_keys=True).encode()).hexdigest()
  out=ROOT/'outputs'/f'Lets_Fix_Money_{job}.mp4';statefile=w/'render_state.json'
  if statefile.exists() and out.exists():
   old=json.loads(statefile.read_text())
   if old.get('status')=='complete' and old.get('input_sha256')==inp and old.get('sha256')==digest(out):print(job+': verified existing render',flush=True);return
  sheet=Image.new('RGB',(720,640),BG)
  for b in range(4):
   im,_=scene(s,specs[b],b);c=next(c for c in a['captions'] if c['start']>=a['beats'][b]['start']-.01);drawcaption(im,c['text']);im.resize((180,320),Image.Resampling.LANCZOS).save(w/f'scene-{b+1}.jpg',quality=90)
   sheet.paste(im.resize((360,640),Image.Resampling.LANCZOS),((b%2)*360,0)) if False else None
  # Four complete frames side-by-side, designed for review at full resolution.
  sheet=Image.new('RGB',(1440,640),BG)
  for b in range(4):
   im,_=scene(s,specs[b],b);c=next(c for c in a['captions'] if c['start']>=a['beats'][b]['start']-.01);drawcaption(im,c['text']);sheet.paste(im.resize((360,640),Image.Resampling.LANCZOS),(b*360,0))
  sheet.save(w/'contact-sheet.jpg',quality=91)
  if preview_only:print(job+': preview prepared',flush=True);return
  state={'job':job,'status':'rendering','input_sha256':inp,'renderer_version':VERSION,'audio_sha256':a['sha256'],'listening_review':'not_performed'};savejson(statefile,state)
  tmp=out.with_suffix('.tmp.mp4');log=w/'render.log';duration=a['duration'];frames=math.ceil(duration*FPS)
  cmd=['ffmpeg','-v','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','pipe:0','-i',str(w/'narration.wav'),'-map','0:v:0','-map','1:a:0','-vf','scale=1080:1920:flags=lanczos','-c:v','libx264','-preset','veryfast','-crf','21','-threads','3','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-ar','48000','-t',str(duration),'-movflags','+faststart',str(tmp)]
  try:
   cache={};end=endcard(s);lastb=-1;cap_idx=0
   with log.open('w') as err:
    proc=subprocess.Popen(cmd,stdin=subprocess.PIPE,stderr=err)
    for f in range(frames):
     t=f/FPS
     if t>=a['end_card_start']:im=end.copy()
     else:
      b=max(i for i,beat in enumerate(a['beats']) if beat['start']<=max(t,a['beats'][0]['start']))
      if b!=lastb:cache={};lastb=b
      elapsed=max(0,t-a['beats'][b]['start']);phase=min(18,int(elapsed*18/1.2))
      if phase not in cache:cache[phase]=scene(s,specs[b],b,phase/18)
      base,motion=cache[phase];im=base.copy();d=ImageDraw.Draw(im)
      if motion:
       aa,bb=motion;u=(elapsed*.28)%1;x=aa[0]+(bb[0]-aa[0])*u;y=aa[1]+(bb[1]-aa[1])*u;d.ellipse((x-5,y-5,x+5,y+5),fill=GOLD)
      while cap_idx+1<len(a['captions']) and a['captions'][cap_idx]['end']<=t:cap_idx+=1
      c=a['captions'][cap_idx]
      if c['start']<=t<c['end']:drawcaption(im,c['text'])
      d.rounded_rectangle((50,1142,645,1148),radius=3,fill='#dce0d4');d.rounded_rectangle((50,1142,50+595*min(1,t/duration),1148),radius=3,fill=TEAL)
     proc.stdin.write(im.tobytes())
    proc.stdin.close();rc=proc.wait()
   if rc:raise RuntimeError(log.read_text()[-2000:])
   probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(tmp)]))
   video=next(x for x in probe['streams'] if x['codec_type']=='video');audio=next(x for x in probe['streams'] if x['codec_type']=='audio')
   assert (video['width'],video['height'])==(1080,1920);assert video['codec_name']=='h264';assert audio['codec_name']=='aac'
   assert abs(float(probe['format']['duration'])-duration)<.15
   subprocess.run(['ffmpeg','-v','error','-i',str(tmp),'-f','null','-'],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
   with wave.open(str(w/'narration.wav')) as wavefile:pcm=np.frombuffer(wavefile.readframes(wavefile.getnframes()),dtype=np.int16)/32768
   assert np.isfinite(pcm).all() and np.sqrt(np.mean(pcm**2))>.005 and np.max(np.abs(pcm))<1
   assert len(a['captions'])>5 and a['captions'][-1]['end']<duration
   tmp.replace(out);state.update(status='complete',sha256=digest(out),duration=float(probe['format']['duration']),bytes=out.stat().st_size,audio_peak=float(np.max(np.abs(pcm))),audio_rms=float(np.sqrt(np.mean(pcm**2))),checks=['1080x1920 H264','AAC audio present','full decode passed','duration matches narration','non-silent finite audio','caption bounds valid'],review_status='technical_checks_passed',contact_sheet=str(w/'contact-sheet.jpg'))
   savejson(statefile,state);print(f'{job}: COMPLETE {duration:.2f}s {out.stat().st_size/1e6:.1f}MB',flush=True)
  except Exception as e:
   state.update(status='failed',error=str(e));savejson(statefile,state);raise

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--ids',default='1-50');ap.add_argument('--preview',action='store_true');args=ap.parse_args();ids=[]
 for item in args.ids.split(','):
  if '-' in item:a,b=map(int,item.split('-'));ids.extend(range(a,b+1))
  else:ids.append(int(item))
 scripts=json.loads((ROOT/'inputs/scripts.json').read_text());boards=json.loads((ROOT/'inputs/storyboards.json').read_text())
 for s in scripts['scripts']:
  if s['id'] in ids:render(s,boards[str(s['id'])],args.preview)
if __name__=='__main__':main()
