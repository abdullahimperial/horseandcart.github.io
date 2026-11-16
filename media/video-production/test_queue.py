import json
from pathlib import Path
import tempfile
import unittest

from run_queue import run_batch, select_jobs


class BatchRecoveryTests(unittest.TestCase):
    def test_failure_does_not_discard_success_or_block_following_job(self):
        calls = []
        def generate(job, root):
            calls.append(job)
            if job == '02':
                raise ValueError('phrase needs shortening')
            (root / (job + '.done')).write_text('saved')
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            result = run_batch(['01', '02', '03'], root, generate)
            self.assertEqual(calls, ['01', '02', '03'])
            self.assertEqual(result['completed'], ['01', '03'])
            self.assertEqual(result['failed'], {'02': 'phrase needs shortening'})
            self.assertEqual(json.loads((root / 'batch.json').read_text()), result)
            self.assertEqual((root / '01.done').read_text(), 'saved')
            self.assertEqual((root / '03.done').read_text(), 'saved')

    def test_pending_excludes_completed_and_unscripted_media(self):
        queue = {'jobs': [
            {'id': '01', 'plan': '01.json', 'status': 'narrated_technical_checks_passed'},
            {'id': '02', 'plan': '02.json', 'status': 'script_ready'},
            {'id': '03', 'plan': None, 'status': 'awaiting_script'}]}
        self.assertEqual(select_jobs(queue, 'pending'), ['02'])
        self.assertEqual(select_jobs(queue, '01'), ['01'])
        with self.assertRaises(ValueError):
            select_jobs(queue, '03')


if __name__ == '__main__':
    unittest.main()
