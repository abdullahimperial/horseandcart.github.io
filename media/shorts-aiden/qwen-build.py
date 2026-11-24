"""Bound the CPU engine's voice context and threads for short CivicPost takes."""
from pathlib import Path
import sys
src=Path(sys.argv[1])/'src'
p=src/'pipeline-tts.cpp'
s=p.read_text();old='pt->talker.head_dim, 4096, pt->max_batch'
assert s.count(old)==1
s=s.replace(old,'pt->talker.head_dim, 512, pt->max_batch')
p.write_text(s)
p=src/'backend.h';s=p.read_text();old='return n > 0 ? n : 1;'
assert s.count(old)==1
s=s.replace(old,'const char * threads = std::getenv("QWEN_NARRATION_THREADS");\n    return threads ? std::max(1, std::min(64, std::atoi(threads))) : (n > 0 ? n : 1);')
p.write_text('#include <algorithm>\n#include <cstdlib>\n'+s)
