#!/usr/bin/env python3
"""Create Heart narration first; measured audio boundaries drive the video."""
import hashlib
import importlib.metadata
import json
from pathlib import Path
import subprocess

HERE = Path(__file__).resolve().parent

def digest(path):
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()

def main():
    import numpy as np
    import soundfile as sf
    import torch
    from huggingface_hub import hf_hub_download
    from kokoro import KModel, KPipeline
    config = json.loads((HERE / 'narration.json').read_text())
    output = HERE / 'output'
    output.mkdir(exist_ok=True)
    torch.set_num_threads(2)
    torch.manual_seed(0)
    def download(name):
        return Path(hf_hub_download(config['model'], name, revision=config['revision']))
    model_config = download('config.json')
    weights = download('kokoro-v1_0.pth')
    voice_file = download('voices/' + config['voice'] + '.pt')
    assert digest(weights) == config['model_sha256']
    assert digest(voice_file) == config['voice_sha256']
    model = KModel(repo_id=config['model'], config=str(model_config), model=str(weights)).to('cpu').eval()
    pipeline = KPipeline(lang_code='a', repo_id=config['model'], model=False)
    voice = torch.load(voice_file, map_location='cpu', weights_only=True)
    vocab = json.loads(model_config.read_text())['vocab']
    rate = config['sample_rate']
    track = [np.zeros(round(.3 * rate), dtype=np.float32)]
    position = len(track[0])
    cues = []
    for index, text in enumerate(config['lines']):
        results = list(pipeline(text))
        for result in results:
            for token in result.tokens or []:
                if any(c.isalnum() for c in token.text) and not token.phonemes:
                    raise ValueError('Missing pronunciation: ' + token.text)
        phones = [r.phonemes for r in results]
        assert phones and all(p and len(p) <= 510 and not(set(p)-set(vocab)) for p in phones)
        parts = []
        with torch.inference_mode():
            for p in phones:
                if parts:
                    parts.append(np.zeros(round(.1 * rate), dtype=np.float32))
                parts.append(model(p, voice[len(p)-1], speed=config['speed']).numpy().astype(np.float32))
        samples = np.concatenate(parts)
        assert np.isfinite(samples).all() and np.sqrt(np.mean(samples ** 2)) > .0005
        peak = float(np.abs(samples).max())
        if peak > .95:
            samples *= .95 / peak
        sf.write(output / f'line-{index:02d}.wav', samples, rate, subtype='PCM_16')
        cues.append({'index':index, 'text':text, 'start':position / rate, 'end':(position + len(samples))/rate})
        track.append(samples)
        gap = np.zeros(round(config['gap_seconds'] * rate), dtype=np.float32)
        track.append(gap)
        position += len(samples) + len(gap)
        print(f'Line {index + 1}: {len(samples)/rate:.2f}s', flush=True)
    track.append(np.zeros(round(.85 * rate), dtype=np.float32))
    raw = np.concatenate(track)
    sf.write(output/'raw.wav', raw, rate, subtype='PCM_16')
    subprocess.run(['ffmpeg','-v','error','-y','-i',str(output/'raw.wav'),'-af',
                    'loudnorm=I=-17:TP=-2:LRA=7','-ar',str(rate),str(output/'Horse_and_Cart_Kokoro_Heart.wav')],check=True)
    subprocess.run(['ffmpeg','-v','error','-y','-i',str(output/'Horse_and_Cart_Kokoro_Heart.wav'),
                    '-codec:a','libmp3lame','-b:a','192k',str(output/'Horse_and_Cart_Kokoro_Heart.mp3')],check=True)
    (output/'Horse_and_Cart_Narration.txt').write_text('\n\n'.join(config['lines'])+'\n')
    manifest = {'engine':'Kokoro-82M', 'voice':config['voice'], 'revision':config['revision'],
                'sample_rate':rate,'speed':config['speed'],'duration':len(raw)/rate,'cues':cues,
                'model_sha256':digest(weights),'voice_sha256':digest(voice_file),
                'dependencies':{n:importlib.metadata.version(n) for n in ['kokoro','misaki','torch','numpy','soundfile','spacy']}}
    (output/'timing.json').write_text(json.dumps(manifest,indent=2)+'\n')
    print('Duration:',manifest['duration'],flush=True)

if __name__ == '__main__':
    main()
