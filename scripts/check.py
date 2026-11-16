#!/usr/bin/env python3
"""Run repository checks without installing packages or requiring an Android SDK."""
from pathlib import Path
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
TEST_DIRS = [
    'tests', 'assets/tests', 'assets/i18n/tests', 'activities/tests',
    'course/tests', 'games/tests', 'android/tests',
]


def main():
    node = shutil.which('node')
    if node is None:
        raise SystemExit('Node.js 22 or newer is required; see docs/DEVELOPMENT.md.')
    tests = {p for directory in TEST_DIRS for p in (ROOT/directory).glob('*.test.cjs')}
    tests.update((ROOT/'apps').glob('*/tests/*.test.cjs'))
    # This legacy entry point requires three tests already discovered above.
    tests.discard(ROOT/'games/tests/game.test.cjs')
    if not tests:
        raise SystemExit('No JavaScript tests were found.')
    commands = [
        [node, '--test', *[str(p.relative_to(ROOT)) for p in sorted(tests)]],
        [sys.executable, '-m', 'unittest', 'discover', '-s', 'android/tests', '-p', 'test_*.py'],
        [sys.executable, '-m', 'unittest', 'discover', '-s', 'media/video-production', '-p', 'test_*.py'],
    ]
    for command in commands:
        print('+ ' + ' '.join(command), flush=True)
        subprocess.run(command, cwd=ROOT, check=True)
    print('Repository checks passed. Browser, native Android and device checks are separate.')


if __name__ == '__main__':
    try:
        main()
    except subprocess.CalledProcessError as error:
        sys.exit(error.returncode)

