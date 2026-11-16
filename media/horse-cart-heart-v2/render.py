#!/usr/bin/env python3
"""Render continuous horse/cart animation from measured speech timestamps.

Preview mode is explicitly silent and uses estimated timing. Production mode
requires the Kokoro output and checks every caption boundary against its audio.
"""
import argparse
import hashlib
import json
import math
from pathlib import Path
import subprocess
import tempfile
import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
FPS = 30
W, H = 720, 1280
BG = '#0b2025'
CREAM = '#f4edd6'
GOLD = '#e9bc68'
GREEN = '#85d7be'
MUTED = '#a3bcba'
RED = '#e9968d'
SOURCE_TIMES = [0,4.3,8.5,13.2,18.5,23,27.8,33,39,41.5,43.5,46,49]
TITLES = [
    ('SAME EFFORT.', 'WRONG ORDER.'),
    ('ONE HORSE.', 'ONE CART.'),
    ('PUSHING', 'IS A STRUGGLE.'),
    ('CHANGE', 'THE ORDER.'),
    ('SAME EFFORT.', 'EASIER JOURNEY.'),
    ('NOW THINK', 'ABOUT MONEY.'),
    ('BUY TODAY.', 'REPAY TOMORROW.'),
    ('EARN. SAVE.', 'THEN BUY.'),
    ('SAVE FOR', 'YOUR NEXT CAR.'),
    ('KEEP SAVING', 'FOR THE NEXT ONE.'),
    ('PAYMENTS', 'BECOME SAVINGS.'),
    ('PUT THE', 'HORSE FIRST.')]

def font(size, bold=False):
    return ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans'+('-Bold' if bold else '')+'.ttf', size)

def center(d, text, y, size, fill=CREAM, bold=False):
    f=font(size,bold); box=d.textbbox((0,0),text,font=f)
    d.text(((W-(box[2]-box[0]))/2,y),text,font=f,fill=fill)

def wrap(text, f, width):
    d=ImageDraw.Draw(Image.new('RGB',(1,1))); lines=[]; line=''
    for word in text.split():
        trial=(line+' '+word).strip()
        if d.textlength(trial,font=f)>width and line:
            lines.append(line);line=word
        else:line=trial
    if line:lines.append(line)
    return lines

def subtitles(cues, target):
    def stamp(value):
        ms=round(value*1000);s,ms=divmod(ms,1000);m,s=divmod(s,60);h,m=divmod(m,60)
        return f'{h:02}:{m:02}:{s:02},{ms:03}'
    target.write_text('\n\n'.join(f"{i+1}\n{stamp(c['start'])} --> {stamp(c['end'])}\n{c['text']}" for i,c in enumerate(cues))+'\n')

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--preview',action='store_true')
    parser.add_argument('--output',type=Path,default=HERE/'output')
    args=parser.parse_args();args.output.mkdir(parents=True,exist_ok=True)
    timing_path = HERE/'preview-timing.json' if args.preview else args.output/'timing.json'
    plan=json.loads(timing_path.read_text());cues=plan['cues'];duration=plan['duration']
    assert len(cues)==12
    previous=0
    for c in cues:
        assert previous<=c['start']<c['end']<=duration
        previous=c['end']
    audio=args.output/'Horse_and_Cart_Kokoro_Heart.wav'
    if not args.preview:
        assert plan['engine']=='Kokoro-82M' and plan['voice']=='af_heart'
        assert audio.is_file()
        measured=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(audio)]))
        assert abs(measured-duration)<.05
    filename='Horse_and_Cart_SILENT_PREVIEW.mp4' if args.preview else 'Horse_and_Cart_Kokoro_Heart.mp4'
    target=args.output/filename
    source=HERE/'animation-source.mp4'
    with tempfile.TemporaryDirectory() as tmp:
        raw=Path(tmp)/'scene.rgb'
        subprocess.run(['ffmpeg','-v','error','-y','-i',str(source),'-vf','fps=15,scale=696:358','-f','rawvideo','-pix_fmt','rgb24',str(raw)],check=True)
        count=raw.stat().st_size//(696*358*3)
        movie=np.memmap(raw,dtype='uint8',mode='r',shape=(count,358,696,3))
        yy,xx=np.mgrid[0:358,0:696]
        alpha=np.clip(np.minimum.reduce([xx/30,(695-xx)/30,yy/30,(357-yy)/30]),0,1)
        mask=Image.fromarray((alpha*255).astype('uint8'))
        command=['ffmpeg','-y','-v','error','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-']
        if not args.preview:command+=['-i',str(audio)]
        command+=['-c:v','libx264','-crf','18','-preset','fast','-pix_fmt','yuv420p']
        if not args.preview:command+=['-c:a','aac','-b:a','192k','-ar','48000']
        command+=['-movflags','+faststart','-t',str(duration),str(target)]
        proc=subprocess.Popen(command,stdin=subprocess.PIPE)
        frames=math.ceil(duration*FPS)
        for frame in range(frames):
            t=frame/FPS
            index=max([i for i,c in enumerate(cues) if c['start']<=t] or [0])
            c=cues[index];start=0 if index==0 else c['start']
            end=cues[index+1]['start'] if index+1<len(cues) else duration
            progress=max(0,min(1,(t-start)/(end-start)))
            source_time=SOURCE_TIMES[index]+progress*(SOURCE_TIMES[index+1]-SOURCE_TIMES[index])
            scene=Image.fromarray(np.asarray(movie[min(count-1,int(source_time*15))]))
            im=Image.new('RGB',(W,H),BG);d=ImageDraw.Draw(im)
            d.text((48,58),"LET'S FIX MONEY",font=font(19,True),fill=CREAM)
            d.text((530,61),'THE FIRST STEP',font=font(11),fill=MUTED)
            d.line((48,100,672,100),fill='#345457',width=1)
            d.line((48,100,48+624*t/duration,100),fill=GOLD,width=3)
            for j,line in enumerate(TITLES[index]):center(d,line,162+j*57,42,CREAM,True)
            center(d,'The horse & cart metaphor',292,17,MUTED)
            im.paste(scene,(12,365),mask)
            d=ImageDraw.Draw(im)
            if index<6:
                label='PUSHING' if index<3 else 'REARRANGING' if index==3 else 'PULLING'
                color=RED if index<3 else GOLD if index==3 else GREEN
                d.rounded_rectangle((247,750,473,794),radius=22,outline=color,width=1)
                center(d,label,761,16,color,True)
            else:
                labels=['BUY','REPAY','REPEAT'] if index==6 else ['EARN','SAVE','BUY']
                color=RED if index==6 else GREEN
                for j,label in enumerate(labels):
                    x=54+j*213
                    active=index==6 or index>=8 or progress>(j*.22)
                    d.rounded_rectangle((x,747,x+184,801),radius=12,outline=color if active else '#365556',width=2,fill='#143336' if active else BG)
                    f=font(19,True);tw=d.textlength(label,font=f)
                    d.text((x+(184-tw)/2,762),label,font=f,fill=color if active else MUTED)
                    if j<2:d.text((x+190,764),'›',font=font(22),fill=MUTED)
            if index in (8,9,10):
                x=89;y=846
                d.text((x,y),'NEXT CAR FUND',font=font(13,True),fill=GOLD)
                d.rounded_rectangle((x,y+30,631,y+42),radius=6,fill='#27464a')
                amount=min(1,.15+(index-8+progress)/3*.85)
                d.rounded_rectangle((x,y+30,x+542*amount,y+42),radius=6,fill=GREEN)
            text_lines=wrap(c['text'],font(28),610)
            for j,line in enumerate(text_lines):center(d,line,963+j*40,28)
            center(d,'letsfixmoney.com',1164,22,GOLD,True)
            if args.preview:center(d,'SILENT PREVIEW · voice generation pending',1220,12,MUTED)
            else:center(d,'Kokoro Heart narration',1220,12,MUTED)
            proc.stdin.write(im.tobytes())
            if frame%300==0:print(f'{frame}/{frames} frames',flush=True)
        proc.stdin.close()
        if proc.wait()!=0:raise RuntimeError('Video encode failed')
    subtitles(cues,args.output/('preview-captions.srt' if args.preview else 'Horse_and_Cart_Captions.srt'))
    subprocess.run(['ffmpeg','-v','error','-i',str(target),'-f','null','-'],check=True)
    (args.output/'render-checks.json').write_text(json.dumps({'preview_only':args.preview,'duration':duration,
        'resolution':[W,H],'fps':FPS,'caption_boundary_rounding_max_seconds':1/FPS,
        'narration_complete':not args.preview,'sha256':hashlib.sha256(target.read_bytes()).hexdigest()},indent=2)+'\n')
    print(target,flush=True)

if __name__=='__main__':main()
