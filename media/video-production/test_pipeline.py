import copy
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest.mock import patch
import wave

SPEC = importlib.util.spec_from_file_location('pipeline', Path(__file__).with_name('pipeline.py'))
p = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(p)


class ResumeTests(unittest.TestCase):
    def setUp(self):
        self.job, self.plan = p.load_plan('01')

    def test_invalid_windows_and_voice(self):
        for mutate in [lambda d: d['cues'][1].update(start=0),
                       lambda d: d['cues'][0].update(end=d['duration'] + 1),
                       lambda d: d.update(voice='af_bella'),
                       lambda d: d.update(max_speed=1.4)]:
            plan = copy.deepcopy(self.plan)
            mutate(plan)
            with self.assertRaises(ValueError):
                p.validate(plan)

    def test_cache_key_changes_when_inputs_change(self):
        cue = self.plan['cues'][0]
        key = p.phrase_key(self.plan, cue)
        for field, value in [('voice_sha256', 'different'), ('speed', 1.0), ('revision', 'changed')]:
            changed = dict(self.plan, **{field: value})
            self.assertNotEqual(key, p.phrase_key(changed, cue))
        self.assertNotEqual(key, p.phrase_key(self.plan, dict(cue, text='New phrase')))
        self.assertNotEqual(key, p.phrase_key(self.plan, dict(cue, end=cue['end'] + 1)))
        shifted = dict(cue, start=cue['start'] + 2, end=cue['end'] + 2)
        self.assertEqual(key, p.phrase_key(self.plan, shifted))

    def test_corrupt_and_truncated_cache_is_not_reused(self):
        with tempfile.TemporaryDirectory() as directory:
            cache = Path(directory)
            key = 'test'
            wav = cache / 'test.wav'
            with wave.open(str(wav), 'wb') as f:
                f.setnchannels(1); f.setsampwidth(2); f.setframerate(24000)
                f.writeframes(b'\0\0' * 2400)
            p.atomic_json(cache / 'test.json', {'key': key, 'sha256': p.digest(wav), 'seconds': .1})
            self.assertIsNotNone(p.cached_phrase(cache, key, 24000, 1))
            self.assertIsNone(p.cached_phrase(cache, key, 24000, .05))
            wav.write_bytes(wav.read_bytes()[:-10])
            self.assertIsNone(p.cached_phrase(cache, key, 24000, 1))

    def test_resume_after_interruption_and_reject_changed_plan(self):
        try:
            import numpy as np
        except ImportError:
            self.skipTest('NumPy required for synthesis integration')
        plan = copy.deepcopy(self.plan)
        plan['cues'] = plan['cues'][:2]
        generated = []
        class FakeHeart:
            def __init__(self, _): pass
            def generate(self, config, cue):
                generated.append(cue['text'])
                if len(generated) == 2:
                    raise RuntimeError('simulated interruption')
                return np.ones(2400, dtype=np.float32) * .1, {'seconds': .1, 'synthesis_speed': .98}
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            with patch.object(p, 'load_plan', return_value=(self.job, plan)), patch.object(p, 'Heart', FakeHeart):
                with self.assertRaisesRegex(RuntimeError, 'interruption'):
                    p.synthesize('01', root)
                state = json.loads((root / '01/state.json').read_text())
                self.assertEqual(state['next_phrase'], 1)
                self.assertEqual(state['stage'], 'failed')
                p.synthesize('01', root)
                state = json.loads((root / '01/state.json').read_text())
                self.assertEqual(state['stage'], 'audio_ready')
                self.assertTrue(state['completed'][0]['reused'])
                self.assertEqual(generated.count(plan['cues'][0]['text']), 1)


if __name__ == '__main__':
    unittest.main()
