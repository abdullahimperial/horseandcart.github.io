# Development and delivery

## Setup

Clone `https://github.com/abdullahimperial/horseandcart.github.io.git`. A normal clone includes website/app sources, images, fonts and tests. There is no website build or package manifest.

Use Python 3.10+ (CI: 3.12), Node.js 22+ (CI: 22), and Git. From the repository root:

```sh
python3 -m http.server 8010
```

Open `http://localhost:8010/`, `/course/index.html` or `/apps/financial-reset/`. Append `?lang=ur` or `?lang=en`. Windows users can substitute `py -3` for `python3`. No financial data or API key is required.

## Baseline checks

```sh
python3 scripts/check.py
```

The runner discovers JavaScript suites in the source test directories and runs Python offline-bundle tests. It skips the legacy `games/tests/game.test.cjs` aggregate because its three constituent suites are already included. A failed check returns a nonzero exit status. Add new test locations to the runner when outside its existing roots.

Targeted examples:

```sh
node --test apps/financial-reset/tests/*.test.cjs
node --test course/tests/learning.test.cjs
node --test assets/i18n/tests/i18n.test.cjs
node games/tests/game.test.cjs
python3 -m unittest discover -s android/tests -p 'test_*.py'
```

The **Repository checks** workflow runs the baseline on main pushes and pull requests. It does not compile Java, deploy or prove browser layout.

## Browser checks

Existing Python browser scripts need Playwright and `/usr/bin/chromium`; their headers define `APP_TEST_URL` or `SITE_TEST_URL`. Install the browser tools on a development machine, serve the root and run the affected component suite, for example:

```sh
APP_TEST_URL=http://localhost:8010 python3 apps/financial-reset/tests/report-browser.py
APP_TEST_URL=http://localhost:8010 python3 apps/financial-reset/tests/plan-browser.py
APP_TEST_URL=http://localhost:8010 python3 apps/financial-reset/tests/dashboard-browser.py
```

Those environment assignments use POSIX syntax; PowerShell uses `$env:APP_TEST_URL='http://localhost:8010'`. Inspect the script before adapting its browser path to another OS.

**Known legacy limitation:** `tests/site-browser.py` expects an older six-link header; current navigation has four links. It also scans generated HTML if Android build output exists. Update its assertions/source discovery before treating it as a whole-site acceptance gate. Do not alter working navigation just to satisfy stale expectations.

For changed UI verify English/Urdu, phone/desktop, keyboard, retained values, saved-work reload and reduced motion where relevant. Record exactly what was exercised.

## Android

See [android/README.md](../android/README.md) for device/privacy details.

| Toolchain | Declared version |
| --- | --- |
| JDK | 17 |
| Gradle | 8.13, installed separately; no committed wrapper |
| Android Gradle plugin | 8.13.2 |
| Compile/target SDK | 36 |
| CI-installed build tools | 35.0.0 |
| Minimum device | API 26 / Android 8.0 |

Set `ANDROID_HOME` or untracked `android/local.properties`, install the SDK/tools and accept licences:

```sh
gradle -p android --no-daemon testDebugUnitTest lintDebug assembleDebug assembleRelease
```

Gradle runs `android/scripts/bundle_web.py`. Never edit generated files under `android/app/build/`. The bundle copies Money Snapshot, explicit shared dependencies, Urdu fonts and licences; `bundle-manifest.json` records source hashes.

The **Android Money Snapshot** workflow supplies the toolchain and runs shared calculations, adapters, bundle checks, mobile browser smoke, native unit tests, lint and APK compilation. Its YAML is the complete dependency-install recipe. To run its browser smoke locally with the same installed Playwright package:

```sh
python3 android/scripts/bundle_web.py
CHROMIUM_EXECUTABLE=/usr/bin/chromium node android/tests/web-smoke.cjs
```

If Playwright is outside module resolution, set `PLAYWRIGHT_MODULE` to its installed module path. The test intercepts offline-origin requests and fails for missing assets; it exercises demos, imports, export/print requests and language switching. Restricted environments may block Chromium; use CI and record that limitation honestly.

Outputs:
- `android/app/build/outputs/apk/debug/app-debug.apk`
- `android/app/build/outputs/apk/release/app-release-unsigned.apk`

Download artifacts from the successful run for the intended commit. Preview artifacts expire after 30 days; the repository can rebuild them. Runner debug keys can differ, requiring uninstall of an older preview after exporting needed data. Final signing, private key backup, version increments and store publication are separate release steps. Keep signing material outside Git.

## GitHub Pages and publishing

The repository root is the static source. Preserve `CNAME` (`www.letsfixmoney.com`). The existing GitHub-managed **pages build and deployment** publishes the site; there is no custom Pages YAML here. Hosting settings and DNS are external account configuration, not missing application code.

For fresh hosting, configure Pages for `main` / repository root and set the custom domain/DNS in the owning accounts. Verify actual settings before changing them.

After an authorized push, inspect **Repository checks**, **Android Money Snapshot** when triggered, and **pages build and deployment** for that commit. Pages does not currently wait for test workflows, so report test success and deployment separately. Use a work branch/PR for incomplete changes.

Installed offline apps require rebuilt APKs. Durable distributions should use authorized GitHub release assets with version/commit/check information; Actions artifacts expire.

## Checkpoint requirements

Keep `docs/PROJECT_STATUS.md` current with date, goal, branch/source commit, completed paths, actual commands/results and CI links, known limitations, and the next reproducible step. Store durable rationale with the relevant README/architecture section and changes in `CHANGELOG.md`.

Avoid temporary local paths, unexplained “continue here” notes and chat-only decisions. If a session stops, the pushed checkpoint and source must explain how to resume.
