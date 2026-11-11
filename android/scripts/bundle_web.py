#!/usr/bin/env python3
"""Bundle the shared app, only its runtime dependencies, and Android adapters.

No bank files, test fixtures, secrets, or other repository files are bundled.
Run from any directory; Gradle also runs this before every build.
"""
import argparse
import hashlib
import json
from pathlib import Path
import re
import shutil

ROOT = Path(__file__).resolve().parents[2]
APP = Path('apps/financial-reset')
SUPPORT = [
    'assets/currency.js', 'assets/experience.js', 'assets/experience.css',
    'assets/site-shell.css', 'assets/site-notice.css', 'assets/legal.css',
    'course/assets/course.css',
]

def bundle(output: Path):
    output = output.resolve()
    # Only write generated build output. Never delete arbitrary user paths.
    allowed = (ROOT / 'android/app/build').resolve()
    if not output.is_relative_to(allowed) or output == allowed:
        raise ValueError('Output must be a subdirectory of android/app/build.')
    if output.exists():
        shutil.rmtree(output)
    output.mkdir(parents=True)
    files = [p.relative_to(ROOT) for p in (ROOT / APP).iterdir()
             if p.is_file() and (p.suffix in {'.js', '.css', '.html'} or p.name.startswith('LICENSE-'))]
    files += [Path(p) for p in SUPPORT]
    manifest = {}
    for relative in sorted(files):
        source = ROOT / relative
        target = output / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        data = source.read_bytes()
        target.write_bytes(data)
        manifest[str(relative)] = hashlib.sha256(data).hexdigest()
    index = output / APP / 'index.html'
    html = index.read_text(encoding='utf-8')
    if not html.count('<head>') == 1 or not html.count('</head>') == 1:
        raise ValueError('Shared app HTML structure changed; review Android adapter injection.')
    html = html.replace('<head>', '<head><script src="../../android-bridge.js" defer></script>', 1)
    html = html.replace('</head>', '<link rel="stylesheet" href="../../android.css"></head>', 1)
    index.write_text(html, encoding='utf-8')
    for name in ['android-bridge.js', 'android.css']:
        shutil.copyfile(ROOT / 'android/web' / name, output / name)
    (output / 'bundle-manifest.json').write_text(json.dumps(manifest, indent=2)+'\n', encoding='utf-8')
    # Fail before building if the shared app adds an unbundled local resource.
    for raw in re.findall(r'(?:src|href)="([^"]+)"', html):
        if raw.startswith(('https:', '#')) or not raw.split('?')[0].endswith(('.js', '.css')):
            continue
        target = (index.parent / raw.split('?')[0]).resolve()
        if not target.is_relative_to(output) or not target.is_file():
            raise ValueError('Missing bundled dependency: '+raw)
    return manifest

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--output', type=Path, default=ROOT/'android/app/build/generated/assets/site')
    args = parser.parse_args()
    files = bundle(args.output)
    print(f'Bundled {len(files)} shared files plus Android adapters; no transaction data.')
