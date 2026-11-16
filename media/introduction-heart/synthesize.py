#!/usr/bin/env python3
"""Generate Kokoro Heart phrases that fit the original introduction scenes."""
import hashlib
import importlib.metadata
import json
from pathlib import Path
import subprocess

HERE=Path(__file__).resolve().parent

def digest(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()

def main():
    import numpy as np
    import soundfile as sf
    import torch
    from huggingface_hub import hf_hub_download
    from kokoro import KModel,KPipeline
    plan=json.loads((HERE/'narration.json').read_text())
    out=HERE/'output';out.mkdir(exist_ok=True)
    torch.set_num_threads(2);torch.manual_seed(0)
    def download(name):return Path(hf_hub_download(plan['model'],name,revision=plan['revision']))
    model_config=download('config.json');weights=download('kokoro-v1_0.pth')
    voice_file=download('voices/'+plan['voice']+'.pt')
    assert digest(weights)==plan['model_sha256'] and digest(voice_file)==plan['voice_sha256']
    model=KModel(repo_id=plan['model'],config=str(model_config),model=str(weights)).to('cpu').eval()
    pipeline=KPipeline(lang_code='a',repo_id=plan['model'],model=False)
    voice=torch.load(voice_file,map_location='cpu',weights_only=True)
    vocab=json.loads(model_config.read_text())['vocab'];rate=plan['sample_rate']
    track=np.zeros(round(plan['duration']*rate),dtype=np.float32)
    previous=0;measurements=[]
    for i,cue in enumerate(plan['cues']):
        assert previous<=cue['start']<cue['end']<=plan['duration'];previous=cue['end']
        results=list(pipeline(cue['text']))
        for result in results:
            for token in result.tokens or []:
                if any(c.isalnum() for c in token.text) and not token.phonemes:
                    raise ValueError('Missing pronunciation: '+token.text)
        phones=[r.phonemes for r in results]
        assert phones and all(p and len(p)<=510 and not(set(p)-set(vocab)) for p in phones)
        speed=plan['speed'];budget=cue['end']-cue['start']-.08
        for attempt in range(5):
            parts=[]
            with torch.inference_mode():
                for p in phones:
                    if parts:parts.append(np.zeros(round(.1*rate),dtype=np.float32))
                    parts.append(model(p,voice[len(p)-1],speed=speed).numpy().astype(np.float32))
            samples=np.concatenate(parts)
            # Kokoro includes edge silence. Retain 60 ms before and 100 ms after
            # audible content; never remove internal pauses or stretch speech.
            active=np.flatnonzero(np.abs(samples)>max(.0001,float(np.abs(samples).max())*.002))
            if not len(active):raise ValueError(f'Cue {i} is silent')
            first=max(0,int(active[0])-round(.06*rate))
            last=min(len(samples),int(active[-1])+1+round(.10*rate))
            samples=samples[first:last]
            seconds=len(samples)/rate
            print(f'Cue {i+1} attempt {attempt+1}: {seconds:.3f}s / {budget:.3f}s, speed {speed:.3f}',flush=True)
            if seconds<=budget:break
            if speed>=plan['max_speed']:raise ValueError(f'Cue {i} does not fit naturally; edit narration')
            speed=min(plan['max_speed'],speed*seconds/budget*1.01)
        else:raise ValueError('Timing did not converge')
        assert np.isfinite(samples).all() and np.sqrt(np.mean(samples**2))>.0005
        peak=float(np.abs(samples).max())
        if peak>.95:samples*=.95/peak
        start=round(cue['start']*rate);track[start:start+len(samples)]=samples
        sf.write(out/f'cue-{i:02d}.wav',samples,rate,subtype='PCM_16')
        measurements.append({**cue,'speech_seconds':seconds,'actual_end':cue['start']+seconds,'synthesis_speed':speed})
        print(f'Cue {i+1}: {seconds:.3f}s at speed {speed:.3f}',flush=True)
    sf.write(out/'raw.wav',track,rate,subtype='PCM_16')
    wav=out/'Lets_Fix_Money_Introduction_Heart.wav'
    subprocess.run(['ffmpeg','-v','error','-y','-i',str(out/'raw.wav'),'-af','loudnorm=I=-17:TP=-2:LRA=7','-ar',str(rate),str(wav)],check=True)
    subprocess.run(['ffmpeg','-v','error','-y','-i',str(wav),'-codec:a','libmp3lame','-b:a','192k',str(out/'Lets_Fix_Money_Introduction_Heart.mp3')],check=True)
    (out/'Lets_Fix_Money_Introduction_Narration.txt').write_text('\n\n'.join(c['text'] for c in plan['cues'])+'\n')
    (out/'timing.json').write_text(json.dumps({'engine':'Kokoro-82M','voice':plan['voice'],'duration':plan['duration'],
        'sample_rate':rate,'model_revision':plan['revision'],'cues':measurements,
        'model_sha256':digest(weights),'voice_sha256':digest(voice_file),
        'dependencies':{n:importlib.metadata.version(n) for n in ['kokoro','misaki','torch','numpy','soundfile','spacy']}},indent=2)+'\n')

if __name__=='__main__':main()
