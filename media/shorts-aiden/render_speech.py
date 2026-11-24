"""Render a resumable set of Qwen3-TTS Aiden utterances on a private local server."""
import argparse, concurrent.futures, hashlib, io, json, math, os, pathlib, time, urllib.request, wave
import numpy as np
from scipy.io import wavfile

BASE = pathlib.Path(__file__).resolve().parent
STYLE = "Speak in warm, natural, conversational North American English. Use a relaxed, friendly pace, clear words, and gentle emphasis."
MODEL = 'Qwen3-TTS-12Hz-1.7B-CustomVoice'
TALKER = 'cc328834a631bc08bf9f43e62fa23f8a1383d9b429864ce6690cfb172077fc4a'
CODEC = '1883beeed99348fc35e23dd225e9082f93f6f8c109330a33d935baa8acdbfd94'
direct = urllib.request.build_opener(urllib.request.ProxyHandler({}))
def render(task, directory, url):
    key, text = task['id'], task['spoken']
    style = task.get('style', STYLE)
    signature = hashlib.sha256(json.dumps([MODEL,TALKER,CODEC,'Aiden',text,style,task.get('take',0)],ensure_ascii=False).encode()).hexdigest()
    out = directory / (key+'.wav')
    receipt = out.with_suffix('.json')
    if out.is_file() and receipt.is_file():
        last=json.loads(receipt.read_text())
        if last.get('request')==signature and hashlib.sha256(out.read_bytes()).hexdigest()==last.get('sha256'):return
    out.parent.mkdir(exist_ok=True,parents=True)
    count=len(text.split())
    cap=max(48,math.ceil((2.7+.78*count)*12.5))
    for attempt in range(3):
        seed=int(signature[:7],16)+attempt*313
        body={'model':'qwen3-tts','voice':'aiden','language':'English','instructions':style,'input':text,'response_format':'wav','seed':seed,'temperature':.72,'top_p':.88,'subtalker_temperature':.78,'max_new_tokens':cap}
        req=urllib.request.Request(url+'/v1/audio/speech',data=json.dumps(body).encode(),headers={'Content-Type':'application/json'})
        with direct.open(req,timeout=1800) as response:
            sr,x=wavfile.read(io.BytesIO(response.read()))
        if sr!=24000 or x.ndim!=1:raise ValueError('Unexpected Qwen output format')
        if x.dtype.kind=='f':x=(np.clip(x,-1,1)*32767).astype('<i2')
        if x.dtype!=np.int16:raise ValueError('Unexpected Qwen sample width')
        if len(x)>=(cap-1)*1920:continue
        if len(x)<240:continue
        rms=np.sqrt(np.mean(x[:len(x)//240*240].astype('float32').reshape(-1,240)**2,axis=1))
        active=np.flatnonzero(rms>max(36,np.percentile(rms,90)*.016))
        if not len(active):continue
        y=x[max(0,(active[0]-4)*240):min(len(x),(active[-1]+8)*240)]
        if len(y)/24000<max(.16,count*.11) or len(y)/24000>2.7+count*.95:continue
        edge=min(100,len(y)//6)
        y[:edge]=(y[:edge]*np.linspace(0,1,edge)).astype('<i2')
        y[-edge:]=(y[-edge:]*np.linspace(1,0,edge)).astype('<i2')
        temp=out.with_suffix('.tmp')
        with wave.open(str(temp),'wb') as wav:
            wav.setparams((1,2,24000,0,'NONE',''));wav.writeframes(y.tobytes())
        temp.replace(out)
        receipt.write_text(json.dumps({'request':signature,'model':MODEL,'speaker':'Aiden','instructions':style,'text':text,'seed':seed,'seconds':len(y)/24000,'sha256':hashlib.sha256(out.read_bytes()).hexdigest(),'talker_sha256':TALKER,'codec_sha256':CODEC},indent=2)+'\n')
        print(key,round(len(y)/24000,2),flush=True)
        return
    raise RuntimeError(f'No usable complete take: {key}, {text}')
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('jobs',type=pathlib.Path);p.add_argument('--output',type=pathlib.Path,default=BASE/'tts');p.add_argument('--url',default='http://127.0.0.1:19305');p.add_argument('--parallel',type=int,default=6);a=p.parse_args()
    for i in range(200):
        try:
            direct.open(a.url+'/v1/models',timeout=2).close();break
        except OSError:time.sleep(1)
    failures=[]
    with concurrent.futures.ThreadPoolExecutor(max_workers=a.parallel) as pool:
        taskmap={pool.submit(render,t,a.output,a.url):t for t in json.loads(a.jobs.read_text())}
        for f in concurrent.futures.as_completed(taskmap):
            if f.exception():failures.append((taskmap[f]['id'],str(f.exception())));print('ERROR',failures[-1],flush=True)
    if failures:raise SystemExit(f'{len(failures)} failed')
