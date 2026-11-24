"""Recover the actual lines from the five existing repository narration sources."""
import argparse,json
from pathlib import Path
def catalog(media):
    result=[]
    for cut,source in [(n,media/'video-production'/'plans'/f'{n}.json') for n in ('01','02','03')]+[('intro',media/'introduction-heart'/'narration.json'),('horse-v2',media/'horse-cart-heart-v2'/'narration.json')]:
        cfg=json.loads(source.read_text())
        lines=cfg.get('lines') or [cue['text'] for cue in cfg['cues']]
        for j,line in enumerate(lines,1):
            result.append({'id':f'finance-{cut}/{j:03}','spoken':line})
    return result
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('--shard',type=int,default=0);p.add_argument('--shards',type=int,default=1);p.add_argument('--output',type=Path,default=Path('shard.json'))
    a=p.parse_args()
    assert 0<=a.shard<a.shards
    a.output.write_text(json.dumps(catalog(Path(__file__).resolve().parents[1])[a.shard::a.shards],indent=2)+'\n')
