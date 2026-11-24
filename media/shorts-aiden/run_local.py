"""Start a checked Qwen3-TTS server and render queued manifests in the same runtime."""
import argparse,hashlib,os,pathlib,subprocess,sys,tempfile,time
from render_speech import TALKER,CODEC
root=pathlib.Path(__file__).resolve().parent
p=argparse.ArgumentParser()
p.add_argument('kit',type=pathlib.Path)
p.add_argument('jobs',nargs='+',type=pathlib.Path)
p.add_argument('--batch',type=int,default=6)
p.add_argument('--threads',type=int,default=5)
p.add_argument('--port',type=int,default=19305)
p.add_argument('--watch',action='store_true')
args=p.parse_args()
model=args.kit/'qwen-talker-1.7b-customvoice-Q4_K_M.gguf'
codec=args.kit/'qwen-tokenizer-12hz-Q8_0.gguf'
for path,expect in ((model,TALKER),(codec,CODEC)):
 with path.open('rb') as f:
  if hashlib.file_digest(f,'sha256').hexdigest()!=expect:raise ValueError('Unexpected weights: '+path.name)
with tempfile.TemporaryDirectory(dir=root,prefix='.tensors-') as cache, (root/'engine.log').open('a') as log:
 env=os.environ|{'QWEN_NARRATION_THREADS':str(args.threads),'QWEN_NARRATION_CONTEXT':'384','MALLOC_ARENA_MAX':'1','OMP_NUM_THREADS':str(args.threads),'OPENBLAS_NUM_THREADS':'1'}
 if (args.kit/'libtensor-cache.so').is_file():env.update(AIDEN_TENSOR_CACHE=cache,LD_PRELOAD=str(args.kit/'libtensor-cache.so'))
 server=subprocess.Popen([str(args.kit/'tts-server'),'--model',str(model),'--codec',str(codec),'--alias','qwen3-tts','--lang','English','--host','127.0.0.1','--port',str(args.port),'--max-batch',str(args.batch),'--codec-chunk-dur','1.28'],env=env,stdout=log,stderr=log)
 try:
  jobs=list(args.jobs)
  while jobs:
   job=jobs.pop(0)
   result=subprocess.run([sys.executable,str(root/'render_speech.py'),str(job),'--parallel',str(args.batch),'--url',f'http://127.0.0.1:{args.port}'],env=os.environ|{'OPENBLAS_NUM_THREADS':'1'})
   if result.returncode:raise RuntimeError('Incomplete voice manifest: '+str(job))
   if server.poll() is not None:raise RuntimeError('Engine exited')
   if args.watch and not jobs:
    todo=root/'next-jobs.txt'
    while not todo.exists() and not (root/'stop-after-batch').exists():time.sleep(3)
    if todo.exists():
     jobs=[pathlib.Path(line) for line in todo.read_text().splitlines() if line];todo.unlink()
 finally:
  server.terminate()
  try: server.wait(8)
  except subprocess.TimeoutExpired:server.kill();server.wait()
