#!/usr/bin/env python3
"""Audio-first, sentence-checkpointed production; never truncate or time-stretch speech."""
import argparse, contextlib, fcntl, hashlib, json, math, os, re, subprocess, sys, wave
from pathlib import Path
import numpy as np
from heart_engine import Heart, digest, atomic_json, write_wave
ROOT=Path(__file__).resolve().parent.parent
VERSION=1

def speech_text(text, guide):
    for token, spoken in sorted(guide.items(),key=lambda x:-len(x[0])):
        text=re.sub(r'\b'+re.escape(token)+r'\b',spoken,text)
    return text.replace('—',', ').replace('–',' to ')

def subtitle_time(t):
    n=round(t*1000); return f'{n//3600000:02d}:{n//60000%60:02d}:{n//1000%60:02d},{n%1000:03d}'

def captions_for(sentence,start,end):
    words=sentence.split()
    pieces=[' '.join(words[i:i+7]) for i in range(0,len(words),7)]
    weights=[len(p) for p in pieces]; total=sum(weights); t=start; out=[]
    for text,w in zip(pieces,weights):
        stop=t+(end-start)*w/total
        out.append({'start':round(t,4),'end':round(stop,4),'text':text})
        t=stop
    return out

def valid_wav(path, meta):
    try:
        with wave.open(str(path)) as w:
            return w.getframerate()==24000 and w.getnchannels()==1 and w.getsampwidth()==2 and w.getnframes()>100 and digest(path)==meta['sha256']
    except (OSError,KeyError,wave.Error,EOFError): return False

def restore_srt(folder, captions):
    target=folder/'captions.srt'; tmp=folder/'captions.tmp.srt'
    tmp.write_text('\n\n'.join(f'{i+1}\n{subtitle_time(c["start"])} --> {subtitle_time(c["end"])}\n{c["text"]}' for i,c in enumerate(captions))+'\n')
    tmp.replace(target)

def make_audio(script,engine,settings,guide):
    job=f"N{script['id']:02d}"; folder=ROOT/'work'/job; folder.mkdir(parents=True,exist_ok=True)
    identity={'version':VERSION,'text':script['narration'],'guide':guide,'settings':settings}
    key=hashlib.sha256(json.dumps(identity,sort_keys=True).encode()).hexdigest()
    statefile=folder/'audio_state.json'
    with (folder/'audio.lock').open('w') as lock:
        fcntl.flock(lock,fcntl.LOCK_EX)
        old=json.loads(statefile.read_text()) if statefile.exists() else {}
        if old.get('input_sha256')==key and old.get('status')=='complete' and valid_wav(folder/'narration.wav',old):
            restore_srt(folder,old['captions'])
            print(job+': validated existing narration',flush=True); return
        state={'job':job,'status':'generating','input_sha256':key,'voice':'af_heart','completed_sentences':[],'human_listening_review':'not_performed'}
        atomic_json(statefile,state)
        audio=[]; cursor=.18; rate=24000; audio.append(np.zeros(round(cursor*rate),dtype=np.float32))
        beats=[]; captions=[]; full=[]
        cache=ROOT/'work'/'speech-cache'; cache.mkdir(exist_ok=True)
        try:
            for beat_index,paragraph in enumerate(script['narration']):
                beat_start=cursor
                sentences=re.split(r'(?<=[.!?])\s+',paragraph.strip())
                for sentence in sentences:
                    spoken=speech_text(sentence,guide)
                    ck=hashlib.sha256(json.dumps({'speech':spoken,'settings':settings,'version':VERSION},sort_keys=True).encode()).hexdigest()
                    wp=cache/(ck+'.wav'); jp=cache/(ck+'.json')
                    meta=json.loads(jp.read_text()) if jp.exists() else {}
                    if not valid_wav(wp,meta):
                        if engine[0] is None: engine[0]=Heart(settings)
                        samples,result=engine[0].generate(settings,{'text':spoken,'start':0,'end':120})
                        tmp=wp.with_suffix('.tmp.wav'); write_wave(tmp,samples,rate); tmp.replace(wp)
                        meta={'sha256':digest(wp),'text':sentence,'spoken':spoken,**result}; atomic_json(jp,meta)
                    with wave.open(str(wp)) as w: samples=np.frombuffer(w.readframes(w.getnframes()),dtype='<i2').astype(np.float32)/32768
                    seconds=len(samples)/rate
                    audio.append(samples)
                    captions.extend(captions_for(sentence,cursor,cursor+seconds))
                    full.append({'start':round(cursor,4),'end':round(cursor+seconds,4),'text':sentence})
                    state['completed_sentences'].append({'cache_key':ck,'sha256':meta['sha256'],'beat':beat_index,'start':round(cursor,4),'end':round(cursor+seconds,4)})
                    cursor+=seconds
                    gap=.13; audio.append(np.zeros(round(gap*rate),dtype=np.float32)); cursor+=gap
                    atomic_json(statefile,state)
                    print(f'{job}: saved sentence {len(full)} ({cursor:.1f}s)',flush=True)
                gap=.25; audio.append(np.zeros(round(gap*rate),dtype=np.float32)); cursor+=gap
                beats.append({'index':beat_index,'start':round(beat_start,4),'end':round(cursor,4),'text':paragraph})
            end_card_start=cursor
            audio.append(np.zeros(round(2*rate),dtype=np.float32)); cursor+=2
            raw=folder/'raw.tmp.wav'; write_wave(raw,np.concatenate(audio),rate)
            target=folder/'narration.wav'; tmp=folder/'narration.tmp.wav'
            subprocess.run(['ffmpeg','-v','error','-y','-i',str(raw),'-af','loudnorm=I=-17:TP=-2:LRA=7','-ar',str(rate),'-ac','1',str(tmp)],check=True)
            tmp.replace(target); raw.unlink()
            with wave.open(str(target)) as w: duration=w.getnframes()/w.getframerate()
            state.update(status='complete',sha256=digest(target),duration=duration,beats=beats,captions=captions,sentences=full,end_card_start=end_card_start,next_action='render',
                         caption_alignment='Sentence audio bounds measured; seven-word chunk timings estimated within each sentence.')
            atomic_json(statefile,state)
            restore_srt(folder,captions)
            print(f'{job}: COMPLETE {duration:.3f}s, {len(full)} sentences',flush=True)
        except Exception as e:
            state.update(status='failed',error=str(e)); atomic_json(statefile,state); raise

def main():
    ap=argparse.ArgumentParser(); ap.add_argument('--ids',default='1-50'); args=ap.parse_args()
    ids=[]
    for item in args.ids.split(','):
        if '-' in item:
            a,b=map(int,item.split('-')); ids.extend(range(a,b+1))
        else: ids.append(int(item))
    d=json.loads((ROOT/'inputs/scripts.json').read_text()); settings=json.loads((ROOT/'inputs/voice_settings.json').read_text()); engine=[None]
    for s in d['scripts']:
        if s['id'] in ids: make_audio(s,engine,settings,d.get('pronunciation_guide',{}))
if __name__=='__main__': main()

