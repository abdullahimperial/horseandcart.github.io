"""Narrate a private list of lessons in Qwen3-TTS CustomVoice. Run inside production directory."""
import argparse, concurrent.futures as futures, hashlib, io, json, math, os, re, shutil, subprocess, threading, time, urllib.request, wave, zipfile
from pathlib import Path
import numpy as np
from scipy.io import wavfile
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
W=Path("speech-work")
DIRECT=urllib.request.build_opener(urllib.request.ProxyHandler({}))
STYLE="Speak in warm, natural North American English, like a thoughtful friend sitting across a kitchen table. Use a steady conversational pace, gentle emphasis on amounts, and an inviting tone for questions."
def clean(t):
    aliases={"RRSP":"R R S P","RESP":"R E S P","RDSP":"R D S P","FHSA":"F H S A","TFSA":"T F S A","CRA":"C R A","CESG":"C E S G","Mohiuddin":"Mohee Uddin"}
    return re.sub(r'\b('+'|'.join(aliases)+r')\b',lambda m:aliases[m.group()],t)
def utterances(t):
    sentences=re.split(r'(?<=[.!?])\s+',t)
    chunks=[]
    for s in sentences:
        if chunks and len((chunks[-1]+' '+s).split())<=28 and not chunks[-1].endswith('?'):chunks[-1]+=' '+s
        else:chunks.append(s)
    return chunks
def synth(task):
    ident,phase,index,t=task
    out=W/ident/f'{phase:02}-{index:02}.wav';out.parent.mkdir(parents=True,exist_ok=True)
    if out.exists():return
    n=len(t.split()); seed=int(hashlib.sha256((ident+str(phase)+str(index)).encode()).hexdigest()[:7],16)
    for attempt in range(3):
        cap=max(65,math.ceil((2.4+.78*n)*12.5))
        opts=dict(model='qwen3-tts',voice='aiden',language='English',instructions=STYLE,input=clean(t),response_format='wav',seed=seed+1013*attempt,temperature=.72,top_p=.88,subtalker_temperature=.78,max_new_tokens=cap)
        req=urllib.request.Request('http://127.0.0.1:18751/v1/audio/speech',data=json.dumps(opts).encode(),headers={'Content-Type':'application/json'})
        with DIRECT.open(req,timeout=1600) as resp:sr,a=wavfile.read(io.BytesIO(resp.read()))
        assert sr==24000 and a.ndim==1
        if a.dtype.kind=='f':a=(np.clip(a,-1,1)*32767).astype(np.int16)
        if len(a)>=(cap-1)*1920 and attempt<2:continue
        block=a[:len(a)//240*240].astype('float32').reshape(-1,240)
        energy=np.sqrt(np.mean(block**2,axis=1)); ix=np.flatnonzero(energy>max(40,np.percentile(energy,88)*.018))
        if not len(ix):continue
        a=a[max(0,(int(ix[0])-5)*240):min(len(a),(int(ix[-1])+8)*240)].astype(np.int16)
        if len(a)/sr<max(.23,n*.15) or len(a)/sr>n*1.05+1.8:continue
        edge=min(60,len(a)//6);a[:edge]=(a[:edge]*np.linspace(0,1,edge)).astype(np.int16);a[-edge:]=(a[-edge:]*np.linspace(1,0,edge)).astype(np.int16)
        tmp=out.with_suffix('.tmp');wavfile.write(tmp,sr,a);tmp.replace(out);return
    raise RuntimeError(f'Unusable take {ident} {phase} {index}')
def render(e,jobs,outdir,key):
    ide=e['id'];tasks=[(ide,k,j,t) for k,s in enumerate(e['scenes']) for j,t in enumerate(utterances(s['voice']))]
    with futures.ThreadPoolExecutor(max_workers=jobs) as ex:list(ex.map(synth,tasks))
    dest=W/ide;meta=[];parts=[];total=0
    def add(a):
        nonlocal total
        parts.append(a);total+=len(a)
    for k,s in enumerate(e['scenes']):
        begin=total;units=[];add(np.zeros(3600 if k else 6200,np.int16))
        for j,t in enumerate(utterances(s['voice'])):
            _,a=wavfile.read(dest/f'{k:02}-{j:02}.wav');st=total;add(a);units.append(dict(start=round(st/24000,4),end=round(total/24000,4),text=t))
            add(np.zeros(11520 if t.endswith('?') else 4300,np.int16))
        add(np.zeros(13500 if k<len(e['scenes'])-1 else 29000,np.int16))
        meta.append(dict(start=begin/24000,end=total/24000,units=units))
    wavfile.write(dest/'voice.wav',24000,np.concatenate(parts))
    subprocess.run(['ffmpeg','-loglevel','error','-y','-i',str(dest/'voice.wav'),'-c:a','flac',str(dest/'voice.flac')],check=True)
    manifest={'id':ide,'voice':'Qwen3-TTS 1.7B CustomVoice / Aiden','style':STYLE,'duration':total/24000,'script_sha256':hashlib.sha256(json.dumps(e['scenes'],ensure_ascii=False,sort_keys=True).encode()).hexdigest(),'scenes':meta}
    (dest/'timing.json').write_text(json.dumps(manifest,ensure_ascii=False))
    mem=io.BytesIO()
    with zipfile.ZipFile(mem,'w',compression=zipfile.ZIP_STORED) as z:
        for f in ['voice.flac','timing.json']:z.write(dest/f,f)
    outdir.mkdir(parents=True,exist_ok=True)
    if key:
        nonce=os.urandom(12);(outdir/(ide+'.sealed')).write_bytes(nonce+AESGCM(key).encrypt(nonce,mem.getvalue(),ide.encode()))
    else:(outdir/(ide+'.zip')).write_bytes(mem.getvalue())
    print(ide,round(total/24000,1),'seconds',flush=True)
if __name__=='__main__':
    import base64
    p=argparse.ArgumentParser();p.add_argument('json');p.add_argument('--jobs',type=int,default=6);p.add_argument('--out',default='sealed-audio');args=p.parse_args()
    inp=json.loads(Path(args.json).read_text());key=base64.b64decode(inp['result_key']) if inp.get('result_key') else None
    for _ in range(90):
        try:DIRECT.open('http://127.0.0.1:18751/v1/models',timeout=2).close();break
        except OSError:time.sleep(1)
    for ep in inp['episodes']:render(ep,args.jobs,Path(args.out),key)
