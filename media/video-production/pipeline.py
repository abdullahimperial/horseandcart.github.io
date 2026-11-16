#!/usr/bin/env python3
"""Resume narration at phrase boundaries; never substitute another voice or truncate speech."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import wave

HERE = Path(__file__).resolve().parent
VERSION = 1


def digest(path):
    h = hashlib.sha256()
    with Path(path).open('rb') as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b''):
            h.update(chunk)
    return h.hexdigest()


def atomic_json(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    temporary = path.with_suffix(path.suffix + '.tmp')
    with temporary.open('w', encoding='utf-8') as f:
        json.dump(value, f, indent=2, ensure_ascii=False, allow_nan=False)
        f.write('\n')
        f.flush()
        os.fsync(f.fileno())
    temporary.replace(path)


def load_plan(job_id):
    queue = json.loads((HERE / 'queue.json').read_text())
    job = next((j for j in queue['jobs'] if j['id'] == job_id), None)
    if job is None:
        raise ValueError('Unknown job: ' + job_id)
    if not job.get('plan'):
        raise ValueError('No reviewed timed script for ' + job_id + '; inspect scenes first.')
    plan = json.loads((HERE / job['plan']).read_text())
    validate(plan)
    if plan['source_sha256'] != job['sha256'] or plan['duration'] != job['duration']:
        raise ValueError('Plan and queue source identity differ')
    return job, plan


def validate(plan):
    if plan['voice'] != 'af_heart':
        raise ValueError('Owner selected Kokoro Heart (af_heart)')
    if not 0 < plan['speed'] <= plan['max_speed'] <= 1.12:
        raise ValueError('Invalid natural-speed bounds')
    if not plan['cues']:
        raise ValueError('Empty script')
    previous = 0
    for cue in plan['cues']:
        if not previous <= cue['start'] < cue['end'] <= plan['duration']:
            raise ValueError('Overlapping or out-of-range cue')
        if not cue['text'].strip() or cue['end'] - cue['start'] <= .08:
            raise ValueError('Empty or too-short cue')
        previous = cue['end']


def phrase_key(plan, cue):
    # Absolute start times do not affect speech. The available duration does.
    settings = {k: plan[k] for k in ['model', 'revision', 'voice', 'model_sha256',
                'voice_sha256', 'sample_rate', 'speed', 'max_speed']}
    settings.update(version=VERSION, text=cue['text'], budget=round(cue['end'] - cue['start'] - .08, 6))
    return hashlib.sha256(json.dumps(settings, sort_keys=True).encode()).hexdigest()


def cached_phrase(cache, key, rate, budget):
    wav = cache / (key + '.wav')
    metadata = cache / (key + '.json')
    try:
        info = json.loads(metadata.read_text())
        if info['key'] != key or info['sha256'] != digest(wav):
            return None
        with wave.open(str(wav)) as f:
            seconds = f.getnframes() / f.getframerate()
            if f.getnchannels() != 1 or f.getsampwidth() != 2 or f.getframerate() != rate:
                return None
        if not 0 < seconds <= budget or abs(seconds - info['seconds']) > 1 / rate:
            return None
        return info
    except (OSError, ValueError, KeyError, wave.Error, EOFError):
        return None


def run(command):
    subprocess.run(command, check=True)


def probe(path):
    return json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_streams',
                                             '-show_format', '-of', 'json', str(path)]))


class Heart:
    def __init__(self, plan):
        import numpy as np
        import torch
        from huggingface_hub import hf_hub_download
        from kokoro import KModel, KPipeline
        self.np, self.torch = np, torch
        torch.set_num_threads(2)
        torch.manual_seed(0)
        def download(name):
            return Path(hf_hub_download(plan['model'], name, revision=plan['revision']))
        config, weights = download('config.json'), download('kokoro-v1_0.pth')
        voice = download('voices/' + plan['voice'] + '.pt')
        if digest(weights) != plan['model_sha256'] or digest(voice) != plan['voice_sha256']:
            raise ValueError('Kokoro model or voice checksum mismatch')
        self.model = KModel(repo_id=plan['model'], config=str(config), model=str(weights)).to('cpu').eval()
        self.pipeline = KPipeline(lang_code='a', repo_id=plan['model'], model=False)
        self.voice = torch.load(voice, map_location='cpu', weights_only=True)
        self.vocab = json.loads(config.read_text())['vocab']

    def generate(self, plan, cue):
        np, torch = self.np, self.torch
        results = list(self.pipeline(cue['text']))
        for result in results:
            for token in result.tokens or []:
                if any(c.isalnum() for c in token.text) and not token.phonemes:
                    raise ValueError('Missing pronunciation: ' + token.text)
        phones = [r.phonemes for r in results]
        if not phones or not all(p and len(p) <= 510 and not (set(p) - set(self.vocab)) for p in phones):
            raise ValueError('Invalid pronunciation')
        rate = plan['sample_rate']
        speed = plan['speed']
        budget = cue['end'] - cue['start'] - .08
        for attempt in range(5):
            parts = []
            with torch.inference_mode():
                for p in phones:
                    if parts:
                        parts.append(np.zeros(round(.1 * rate), dtype=np.float32))
                    parts.append(self.model(p, self.voice[len(p) - 1], speed=speed).numpy().astype(np.float32))
            samples = np.concatenate(parts)
            if not np.isfinite(samples).all():
                raise ValueError('Non-finite speech')
            active = np.flatnonzero(np.abs(samples) > max(.0001, float(np.abs(samples).max()) * .002))
            if not len(active):
                raise ValueError('Silent speech')
            samples = samples[max(0, int(active[0]) - round(.06 * rate)):
                              min(len(samples), int(active[-1]) + 1 + round(.10 * rate))]
            seconds = len(samples) / rate
            if seconds <= budget:
                if np.sqrt(np.mean(samples ** 2)) <= .0005:
                    raise ValueError('Speech is too quiet')
                peak = float(np.abs(samples).max())
                if peak > .95:
                    samples *= .95 / peak
                return samples, {'seconds': seconds, 'synthesis_speed': speed}
            if speed >= plan['max_speed']:
                break
            speed = min(plan['max_speed'], speed * seconds / budget * 1.01)
        raise ValueError('Phrase does not fit naturally; shorten its script or adjust scene windows. Never clip it.')


def synthesize(job_id, state_root):
    import numpy as np
    _, plan = load_plan(job_id)
    folder = state_root / job_id
    cache = state_root / 'cache'
    cache.mkdir(parents=True, exist_ok=True)
    folder.mkdir(parents=True, exist_ok=True)
    state = {'schema_version': 1, 'job': job_id, 'plan_sha256': hashlib.sha256(
             json.dumps(plan, sort_keys=True).encode()).hexdigest(), 'stage': 'synthesizing', 'completed': []}
    state_file = folder / 'state.json'
    # Preserve a completed track byte-for-byte, including its normalization.
    # Re-running FFmpeg on another machine can change headers or DSP rounding.
    try:
        previous = json.loads(state_file.read_text())
        completed_track = folder / 'narration.wav'
        if (previous.get('plan_sha256') == state['plan_sha256']
                and previous.get('stage') in ['audio_ready', 'verified']
                and len(previous.get('completed', [])) == len(plan['cues'])
                and digest(completed_track) == previous['audio_sha256']
                and all(cached_phrase(cache, phrase_key(plan, cue), plan['sample_rate'],
                                      cue['end'] - cue['start'] - .08) for cue in plan['cues'])):
            write_captions(plan, folder / 'captions.srt')
            print(f'{job_id}: validated all {len(plan["cues"])} phrases; preserving completed narration', flush=True)
            return
    except (OSError, ValueError, KeyError):
        pass
    atomic_json(state_file, state)
    engine = None
    rate = plan['sample_rate']
    track = np.zeros(round(plan['duration'] * rate), dtype=np.float32)
    try:
        for index, cue in enumerate(plan['cues']):
            key = phrase_key(plan, cue)
            wav = cache / (key + '.wav')
            info = cached_phrase(cache, key, rate, cue['end'] - cue['start'] - .08)
            reused = info is not None
            if info is None:
                if engine is None:
                    engine = Heart(plan)
                samples, info = engine.generate(plan, cue)
                temp = cache / (key + '.tmp.wav')
                write_wave(temp, samples, rate)
                temp.replace(wav)
                info.update(key=key, sha256=digest(wav), text=cue['text'])
                atomic_json(cache / (key + '.json'), info)
            with wave.open(str(wav)) as f:
                samples = np.frombuffer(f.readframes(f.getnframes()), dtype='<i2').astype(np.float32) / 32768
            start = round(cue['start'] * rate)
            track[start:start + len(samples)] = samples
            state['completed'].append({'index': index, 'key': key, 'sha256': info['sha256'],
                'start': cue['start'], 'actual_end': cue['start'] + len(samples) / rate,
                'seconds': info['seconds'], 'synthesis_speed': info['synthesis_speed'], 'reused': reused})
            state['next_phrase'] = index + 1
            atomic_json(state_file, state)
            print(f'{job_id} phrase {index + 1}/{len(plan["cues"])}: ' + ('reused' if reused else 'saved'), flush=True)
        write_wave(folder / 'raw.wav', track, rate)
        run(['ffmpeg', '-v', 'error', '-y', '-i', str(folder / 'raw.wav'), '-af',
             'loudnorm=I=-17:TP=-2:LRA=7', '-ar', str(rate), str(folder / 'narration.wav')])
        state.update(stage='audio_ready', audio_sha256=digest(folder / 'narration.wav'), next_action='mix')
        atomic_json(state_file, state)
        write_captions(plan, folder / 'captions.srt')
    except Exception as error:
        state.update(stage='failed', error=str(error), next_action='fix recorded error, then rerun the same command')
        atomic_json(state_file, state)
        raise


def write_wave(path, samples, rate):
    import numpy as np
    with wave.open(str(path), 'wb') as f:
        f.setnchannels(1)
        f.setsampwidth(2)
        f.setframerate(rate)
        f.writeframes((np.clip(samples, -1, .999969) * 32768).astype('<i2').tobytes())


def write_captions(plan, path):
    def stamp(value):
        ms = round(value * 1000)
        return f'{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02},{ms % 1000:03}'
    Path(path).write_text('\n\n'.join(f'{i + 1}\n{stamp(c["start"])} --> {stamp(c["end"])}\n{c["text"]}'
                                    for i, c in enumerate(plan['cues'])) + '\n', encoding='utf-8')


def mix(job_id, state_root, source_override=None):
    job, plan = load_plan(job_id)
    source = Path(source_override) if source_override else HERE / job['source']
    if digest(source) != job['sha256']:
        raise ValueError('Source checksum mismatch; do not apply timing to a different video')
    folder = state_root / job_id
    state = json.loads((folder / 'state.json').read_text())
    expected = hashlib.sha256(json.dumps(plan, sort_keys=True).encode()).hexdigest()
    if state.get('plan_sha256') != expected or state.get('stage') not in ['audio_ready', 'verified']:
        raise ValueError('Narration is incomplete or the script changed; synthesize first')
    narration = folder / 'narration.wav'
    if digest(narration) != state['audio_sha256']:
        raise ValueError('Narration checksum mismatch')
    if abs(float(probe(source)['format']['duration']) - plan['duration']) > .1:
        raise ValueError('Source duration mismatch')
    out = folder / ('Lets_Fix_Money_' + job_id + '_Kokoro_Heart.mp4')
    temp = folder / 'rendering.tmp.mp4'
    # Original picture is stream-copied. Existing non-speech sound is replaced:
    # some originals contain sound or obsolete narration and must not double-speak.
    run(['ffmpeg', '-v', 'error', '-y', '-i', str(source), '-i', str(narration),
         '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
         '-movflags', '+faststart', '-t', str(plan['duration']), str(temp)])
    run(['ffmpeg', '-v', 'error', '-i', str(temp), '-f', 'null', '-'])
    details = probe(temp)
    types = [s['codec_type'] for s in details['streams']]
    if 'video' not in types or 'audio' not in types:
        raise ValueError('Missing output stream')
    if abs(float(details['format']['duration']) - plan['duration']) > .12:
        raise ValueError('Output duration mismatch')
    if any(c['actual_end'] > plan['cues'][c['index']]['end'] for c in state['completed']):
        raise ValueError('Speech extends beyond scene')
    temp.replace(out)
    state.update(stage='verified', output=out.name, output_sha256=digest(out),
                 full_decode='passed', video_mode='stream copy', human_review='pending',
                 next_action='listen, inspect scene alignment, save output and checkpoint, update queue')
    atomic_json(folder / 'state.json', state)
    print(out)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['status', 'validate', 'synthesize', 'mix'])
    parser.add_argument('--job', default='01')
    parser.add_argument('--state-dir', type=Path, default=HERE / 'work')
    parser.add_argument('--source', type=Path)
    args = parser.parse_args()
    if args.command == 'validate':
        queue = json.loads((HERE / 'queue.json').read_text())
        if len({j['id'] for j in queue['jobs']}) != len(queue['jobs']):
            raise ValueError('Duplicate job id')
        for job in queue['jobs']:
            if job.get('plan'):
                load_plan(job['id'])
        print('Queue and timed scripts valid')
    elif args.command == 'status':
        for job in json.loads((HERE / 'queue.json').read_text())['jobs']:
            path = args.state_dir / job['id'] / 'state.json'
            stage = json.loads(path.read_text()).get('stage') if path.exists() else job['status']
            print(job['id'], stage, job['title'])
    elif args.command == 'synthesize':
        synthesize(args.job, args.state_dir)
    else:
        mix(args.job, args.state_dir, args.source)


if __name__ == '__main__':
    main()
