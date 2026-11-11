import hashlib
import importlib.util
import json
from pathlib import Path
import unittest
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
spec = importlib.util.spec_from_file_location('bundle_web', ROOT/'android/scripts/bundle_web.py')
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

class OfflineBundleTests(unittest.TestCase):
    def setUp(self):
        self.output = ROOT/'android/app/build/test-assets/site'
        self.manifest = module.bundle(self.output)

    def test_calculation_engine_is_byte_identical_to_website(self):
        for name in ['engine.js', 'bank-files.js', 'guidance.js', 'resilience.js']:
            path = Path('apps/financial-reset')/name
            self.assertEqual((ROOT/path).read_bytes(), (self.output/path).read_bytes())

    def test_assets_are_complete_and_data_free(self):
        self.assertGreater(len(self.manifest), 20)
        for path, expected in self.manifest.items():
            self.assertEqual(hashlib.sha256((ROOT/path).read_bytes()).hexdigest(), expected)
        for file in self.output.rglob('*'):
            if file.is_file():
                self.assertNotIn(file.suffix, ['.csv', '.ofx', '.qfx', '.qbo', '.keystore', '.jks'])
                self.assertNotIn('tests', file.parts)
        self.assertTrue((self.output/'apps/financial-reset/LICENSE-merchant-data.txt').exists())

    def test_bridge_loads_before_app_and_sandbox_stays_enabled(self):
        html = (self.output/'apps/financial-reset/index.html').read_text()
        self.assertLess(html.index('android-bridge.js'), html.index('app.js?'))
        self.assertIn("connect-src 'none'", html)
        self.assertNotIn('unsafe-eval', html)
        self.assertEqual(html.count('android-bridge.js'), 1)
        self.assertEqual(html.count('android.css'), 1)
        self.assertTrue((self.output/'android-bridge.js').exists())
        module.bundle(self.output)
        self.assertEqual((self.output/'apps/financial-reset/index.html').read_text(), html)

    def test_output_guard_cannot_delete_source_tree(self):
        with self.assertRaises(ValueError): module.bundle(ROOT/'apps/financial-reset')

    def test_manifest_has_no_network_or_storage_permissions(self):
        tree = ET.parse(ROOT/'android/app/src/main/AndroidManifest.xml')
        self.assertEqual(tree.findall('uses-permission'), [])
        ns = '{http://schemas.android.com/apk/res/android}'
        self.assertEqual(tree.find('application').get(ns+'allowBackup'), 'false')
        self.assertEqual(tree.find('application').get(ns+'usesCleartextTraffic'), 'false')

if __name__ == '__main__': unittest.main()
