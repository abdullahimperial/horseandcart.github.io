#!/usr/bin/env python3
"""Generate pending scripts; preserve successes even when another job needs a fix."""
import argparse
import json
from pathlib import Path

from pipeline import HERE, atomic_json, synthesize


def select_jobs(queue, selection):
    if selection == 'pending':
        return [j['id'] for j in queue['jobs']
                if j.get('plan') and j['status'] == 'script_ready']
    job = next((j for j in queue['jobs'] if j['id'] == selection), None)
    if not job or not job.get('plan'):
        raise ValueError('Select pending or a job with a timed script')
    return [selection]


def run_batch(ids, state_dir, generate=synthesize):
    report = {'requested': ids, 'completed': [], 'failed': {}}
    atomic_json(state_dir / 'batch.json', report)
    for job_id in ids:
        try:
            generate(job_id, state_dir)
            report['completed'].append(job_id)
        except Exception as error:
            report['failed'][job_id] = str(error)
            print(f'{job_id}: {error}; preserving checkpoint and continuing', flush=True)
        atomic_json(state_dir / 'batch.json', report)
    return report


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--job', default='pending')
    parser.add_argument('--state-dir', type=Path, default=HERE / 'work')
    args = parser.parse_args()
    queue = json.loads((HERE / 'queue.json').read_text())
    report = run_batch(select_jobs(queue, args.job), args.state_dir)
    print(json.dumps(report, indent=2), flush=True)
    return 1 if report['failed'] else 0


if __name__ == '__main__':
    raise SystemExit(main())
