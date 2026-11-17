import contextlib,hashlib,io,json,pathlib,sys,tempfile,unittest,wave
import numpy as np
from unittest import mock
sys.path.insert(0,str(pathlib.Path(__file__).resolve().parents[1]/'code'))
import generate_audio as audio
import render_videos as video
class FakeHeart:
 def __init__(self):self.calls=[]
 def generate(self,settings,phrase):
  self.calls.append(phrase['text']);t=np.arange(12000)/24000
  return (.1*np.sin(2*np.pi*220*t)).astype(np.float32),{'synthetic_test_fixture':True}
class ResumeTests(unittest.TestCase):
 def setUp(self):
  self.temp=tempfile.TemporaryDirectory();self.root=pathlib.Path(self.temp.name);(self.root/'outputs').mkdir();self.old=(audio.ROOT,video.ROOT);audio.ROOT=video.ROOT=self.root
  self.s={'id':1,'title':'A sample household decision','narration':['This is the first sentence of the sample narration.','Here is another sentence with more than seven words.','Consider the available choices.','Make a clear decision.'],'text':['The beginning','The second step','Consider the options','Make a decision']};self.e=FakeHeart()
 def tearDown(self):audio.ROOT,video.ROOT=self.old;self.temp.cleanup()
 def make(self):
  with contextlib.redirect_stdout(io.StringIO()):audio.make_audio(self.s,[self.e],{}, {})
 def test_completed_audio_is_reused_and_corrupt_sentence_is_repaired(self):
  self.make();self.assertEqual(len(self.e.calls),4)
  (self.root/'work/N01/captions.srt').unlink();self.make();self.assertEqual(len(self.e.calls),4);self.assertTrue((self.root/'work/N01/captions.srt').exists())
  state=json.loads((self.root/'work/N01/audio_state.json').read_text());key=state['completed_sentences'][1]['cache_key']
  (self.root/'work/speech-cache'/f'{key}.wav').write_bytes(b'corrupt')
  (self.root/'work/N01/narration.wav').unlink();self.make();self.assertEqual(len(self.e.calls),5)
  self.assertEqual(self.e.calls[-1],self.s['narration'][1])
 def test_script_edit_reuses_unchanged_sentences(self):
  self.make();self.s['narration'][2]='An edited third sentence.';self.make();self.assertEqual(len(self.e.calls),5)
  state=json.loads((self.root/'work/N01/audio_state.json').read_text());self.assertEqual(state['sentences'][2]['text'],self.s['narration'][2])
  for c in state['captions']:self.assertGreater(c['end'],c['start']);self.assertLess(c['end'],state['duration'])
 def test_acronyms_use_whole_word_replacements(self):
  self.assertEqual(audio.speech_text('RESP and RESPOND—TFSA.',{'RESP':'R E S P','TFSA':'T F S A'}),'R E S P and RESPOND, T F S A.')
 def test_video_decode_and_resume_without_encoder(self):
  self.make();specs=[{'kind':k,'icon':'bank','items':items,'note':'An illustrative example.'} for k,items in [('hero',['A choice']),('compare',['First option','Second option']),('equation',['100 + 10','110']),('checklist',['Costs','Access','Timing'])]]
  with contextlib.redirect_stdout(io.StringIO()):video.render(self.s,specs)
  state=json.loads((self.root/'work/N01/render_state.json').read_text());self.assertEqual(state['status'],'complete');self.assertIn('full decode passed',state['checks'])
  old=state['sha256']
  with mock.patch('subprocess.Popen',side_effect=AssertionError('Encoder should not run')),contextlib.redirect_stdout(io.StringIO()):video.render(self.s,specs)
  self.assertEqual(json.loads((self.root/'work/N01/render_state.json').read_text())['sha256'],old)
if __name__=='__main__':unittest.main()
