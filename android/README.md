# Money Snapshot for Android

Installable, offline Android edition of the existing Let’s Fix Money app. All Android-specific code lives in this folder. The only supporting file outside it is `.github/workflows/android.yml`, which builds the APK.

## Included

- The existing five-step Money Snapshot experience, fictional demos, charts, four-pillar guidance, emergency-reserve scenarios and action plans.
- CSV, OFX, QFX and QBO statement import through Android’s document picker, plus saved JSON action-plan import.
- The shared credit-card repayment fix: purchases count once, settlements are excluded from spending/income, and fees/interest remain expenses.
- Native Save As for text reports and JSON plans; native print / Save as PDF.
- Native app toolbar, launcher icon, safe-area/keyboard spacing and exit/reset confirmation.
- Course, book and other external links open in the user’s browser, keeping external pages outside the app’s trusted content.

This is a preview of the existing educational tool. It does not add bank connections, user accounts, cloud synchronization or an OpenAI API integration.

## Privacy

The manifest requests **no Internet or broad storage permissions**. The bundled page uses a restricted local HTTPS origin, blocks remote resources, and retains its `connect-src 'none'` policy. The native message interface is limited to the bundled main frame. No general JavaScript-to-Java interface is exposed.

Statements, financial context and unsaved notes stay in session memory. They are not logged or placed in preferences, a database or browser storage. A fresh launch after Android kills the process starts a new session. Rotation preserves the current Activity. Backups are disabled. Exports are written only after the user selects a destination; a document provider may itself be cloud-backed. Choosing local storage keeps those files local. Reports and plans can contain sensitive information.

## Build an APK

The GitHub **Android Money Snapshot** workflow runs on relevant pushes to `main` and can also be run manually. Its artifacts are:

1. **Money-Snapshot-Android-Preview** — debug-signed APK for installation/testing.
2. **Money-Snapshot-Android-Unsigned-Release** — release APK, requiring your private signing key before distribution.
3. **Money-Snapshot-Android-Checks** — Android lint and unit-test reports.

Download and unzip the preview artifact, copy `app-debug.apk` to an Android phone, open it and allow installation from the chosen file app if Android requests it. Android 8.0 / API 26 or newer and an up-to-date Android System WebView/Chrome are required. Debug keys on separate CI runners can differ; a later preview may require uninstalling the previous preview. Export anything needed first. Do not distribute a debug build through Google Play.

### Local prerequisites

- JDK 17, Gradle **8.13**, Python 3, Node.js 22 or newer.
- Android SDK platform **36** and build tools **35.0.0**, with SDK licences accepted.
- Set `ANDROID_HOME`, or put the local SDK path in an untracked `android/local.properties` file.

From the repository root:

```sh
node --test apps/financial-reset/tests/*.test.cjs android/tests/*.test.cjs
python3 -m unittest discover -s android/tests -p 'test_*.py'
gradle -p android testDebugUnitTest lintDebug assembleDebug
```

The installable result is `android/app/build/outputs/apk/debug/app-debug.apk`.

Open `android/` as the project in Android Studio. This source uses an installed Gradle 8.13 distribution. To generate the standard wrapper after installing Gradle, run `gradle -p android wrapper --gradle-version 8.13`; then `cd android` and use `./gradlew assembleDebug` (Windows: `gradlew.bat assembleDebug`). No keystore or signing password belongs in Git. For a public release, choose **Build → Generate Signed App Bundle / APK** and retain your release key securely.

## How shared changes reach Android

`app:bundleWeb` runs before builds. It copies only the runtime files from `../apps/financial-reset` and required shared styles/scripts into generated assets, then injects the Android-only adapter and styling. Generated assets are ignored by Git. Website source is never rewritten. `bundle-manifest.json` records source hashes; tests confirm the engine is byte-for-byte identical. Rebuild the APK after a website update; installed offline apps cannot update themselves.

## Validation and device checklist

Automated checks cover shared arithmetic, repayment handling, all bank formats, the offline asset boundary, document export rules and the JavaScript adapter. CI compiles debug/release APKs and runs Android unit tests and lint. Browser tests of bundled content do **not** replace a device test.

Before a public release, test on a real phone or emulator:

- Launch and generate all four fictional reports in airplane mode.
- Import fictional CSV and OFX/QFX/QBO statements from Downloads, including cancellation and malformed input.
- Save/reopen a JSON action plan; save a text report; print to PDF.
- Rotate, background/resume, open/close the keyboard, and verify clear/exit confirmation.
- Open course links and return without losing the session.
- Check TalkBack, larger text, compact screens and a current System WebView.

The project is not published to Google Play. Store publication, final app identity/signing and device acceptance testing are separate release steps.

## References

- [Android local WebView content](https://developer.android.com/develop/ui/views/layout/webapps/load-local-content)
- [Origin-restricted WebView messages](https://developer.android.com/reference/androidx/webkit/WebViewCompat)
- [Android HTML printing](https://developer.android.com/training/printing/html-docs)
- [AGP 8.13 compatibility](https://developer.android.com/build/releases/agp-8-13-0-release-notes)

Merchant-data licences are bundled from the shared application. See its `LICENSE-merchant-data.txt`, `LICENSE-merchant-studio.txt` and `MERCHANT-SOURCES.md`.
