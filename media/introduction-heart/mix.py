#!/usr/bin/env python3
"""Preserve every original introduction video frame; add the measured voice."""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess

HERE=Path(__file__).resolve().parent

def run(*args):return subprocess.check_output(list(map(str,args)),text=True)
def probe(p):return json.loads(run('ffprobe','-v','error','-show_format','-show_streams','-of','json',p))
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def video_hash(p):return run('ffmpeg','-v','error','-i',p,'-map','0:v:0','-c','copy','-f','hash','-hash','sha256','-').strip()

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--source',type=Path,default=HERE/'Lets_Fix_Money_YouTube_Short_1080x1920.mp4')
    parser.add_argument('--output',type=Path,default=HERE/'output')
    args=parser.parse_args();out=args.output;out.mkdir(parents=True,exist_ok=True)
    plan=json.loads((HERE/'narration.json').read_text());timing=json.loads((out/'timing.json').read_text())
    source=probe(args.source);video=next(s for s in source['streams'] if s['codec_type']=='video')
    assert (video['width'],video['height'],video['avg_frame_rate'])==(1080,1920,'30/1')
    assert abs(float(source['format']['duration'])-plan['duration'])<.02
    assert timing['voice']=='af_heart' and len(timing['cues'])==len(plan['cues'])
    for expected,cue in zip(plan['cues'],timing['cues']):
        assert expected['text']==cue['text'] and expected['start']==cue['start']
        assert cue['start']<cue['actual_end']<=cue['end']
    voice=out/'Lets_Fix_Money_Introduction_Heart.wav'
    assert abs(float(probe(voice)['format']['duration'])-plan['duration'])<.02
    target=out/'Lets_Fix_Money_Introduction_Kokoro_Heart.mp4'
    filters=(f"[0:a]volume={plan['background_gain']}[bed];[1:a]aresample=48000,"
        "aformat=channel_layouts=stereo[voice];[bed][voice]amix=inputs=2:duration=longest:normalize=0,"
        "alimiter=limit=0.89:level=false:latency=1[a]")
    run('ffmpeg','-v','error','-y','-i',args.source,'-i',voice,'-filter_complex',filters,
        '-map','0:v:0','-map','[a]','-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-ac','2',
        '-t',str(plan['duration']),'-movflags','+faststart','-metadata',
        'title=Let\'s Fix Money | Introduction | Kokoro Heart',target)
    assert video_hash(args.source)==video_hash(target)
    run('ffmpeg','-v','error','-i',target,'-f','null','-')
    result=probe(target)
    assert abs(float(result['format']['duration'])-plan['duration'])<.03
    checks={'duration':float(result['format']['duration']),'resolution':[1080,1920],'fps':30,
        'video_stream_unchanged':True,'full_decode':'passed','voice':'Kokoro af_heart',
        'cues_fit':True,'background_gain':plan['background_gain'],
        'source_sha256':digest(args.source),'final_sha256':digest(target)}
    (out/'verification.json').write_text(json.dumps(checks,indent=2)+'\n')
    def stamp(t):
        ms=round(t*1000);s,ms=divmod(ms,1000);m,s=divmod(s,60);h,m=divmod(m,60)
        return f'{h:02}:{m:02}:{s:02},{ms:03}'
    (out/'Lets_Fix_Money_Introduction_Captions.srt').write_text('\n\n'.join(
        f"{i+1}\n{stamp(c['start'])} --> {stamp(c['actual_end'])}\n{c['text']}"
        for i,c in enumerate(timing['cues']))+'\n')
    print(json.dumps({'output':str(target),**checks}),flush=True)

if __name__=='__main__':main()
