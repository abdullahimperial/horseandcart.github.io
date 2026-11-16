# Current project checkpoint

Updated: 14 November 2026 (Edmonton). Repository: `abdullahimperial/horseandcart.github.io`; branch: `main`.

## Goal and current change

Make the repository sufficient to resume development without ChatGPT history. The owner’s instruction is in `AGENTS.md`; README, development/architecture guides, this checkpoint, source register and changelog provide the handover.

Baseline inspected: `0116c3f84e30b10c8273e80eca2ee1e9f9470854`, the English/Urdu update. Workflow and build repairs are committed and verified at `41ff28a3f12cf7bf007d4e615602269e3f5faccd`. This follow-up only records verification; find its commit with `git log -1 -- docs/PROJECT_STATUS.md`. Fetch current main before continuing.

## Implemented scope

- English/Urdu static website, top language control, RTL layouts and local fonts; English default with remembered preference and URL overrides.
- Homepage framework banner/spiral; seven stages; nine-module course with 102 lessons, 55 activities, interactive experiments and workbook.
- Money Snapshot: local CAD CSV/OFX/QFX/QBO import, review, repayment exclusions, reports, scenarios and action-plan import/export. No bank/account/AI-report backend.
- Additional saving tools, calculators, activities and games.
- Android native project in `android/`, bundling the shared app; preview and unsigned-release builds in Actions. Final signing/device acceptance remain separate.
- Complete editorial manuscripts/workshop originals are outside this public repository; see `CONTENT_SOURCES.md`.

## Workflow repairs in this change

The baseline website deployed, but Android CI failed on a merchant-renderer test expecting text without its new RTL isolation markup. A wider run found the board fixture lacked a browser window/language-event environment. Android’s allowlist also omitted new Urdu dependencies.

The fixtures now match the browser markup/environment while retaining escaping, category and game assertions. Android includes Urdu scripts/styles/fonts/licence, with byte-equality and browser switching checks. `scripts/check.py` runs the source suites once plus offline-bundle tests; the new **Repository checks** workflow automates it.

## Verification

| Check | Evidence/status |
| --- | --- |
| Baseline website | [Pages 43145744346](https://github.com/abdullahimperial/horseandcart.github.io/actions/runs/43145744346): success at `0116c3f` |
| Baseline Android | [Android 43145744828](https://github.com/abdullahimperial/horseandcart.github.io/actions/runs/43145744828): shared-test failure; build skipped |
| Earlier Android | [Android 42940649294](https://github.com/abdullahimperial/horseandcart.github.io/actions/runs/42940649294): success at `9020f194`, predating Urdu |
| Current local baseline | `python3 scripts/check.py`: 162 JavaScript tests and six Python bundle tests passed |
| Current offline bundle | 34 shared files plus native adapters, including Urdu assets |
| Local browser smoke | Blocked: Chromium startup fails with `socket() failed: Operation not permitted`; not a browser pass |
| Repository CI | [Checks 43635278509](https://github.com/abdullahimperial/horseandcart.github.io/actions/runs/43635278509): success at `41ff28a3` |
| Android CI | [Android 43635278506](https://github.com/abdullahimperial/horseandcart.github.io/actions/runs/43635278506): success at `41ff28a3`; mobile browser including offline Urdu, native unit tests, lint, debug/release compilation and artifact uploads passed |
| Website deployment | [Pages 43635278129](https://github.com/abdullahimperial/horseandcart.github.io/actions/runs/43635278129): success at `41ff28a3`; no new live visual inspection in this task |
| Physical Android testing | Not performed in this task |

## Next steps and known limitations

1. This workflow task is complete. Begin the next requested change from current main and the instructions in `AGENTS.md`; retain the verification links above as evidence for `41ff28a3`, not for future code changes.
2. Before device distribution, test Android 8.0+ in airplane mode; imports/cancellation, both languages, export/print, keyboard/rotation and external-link return. Debug keys may change between CI runners.
3. No Gradle wrapper is committed. Installed Gradle 8.13 is the documented build path; a verified wrapper can be added separately.
4. `tests/site-browser.py` has older six-link navigation assumptions and scans generated HTML; update it before treating it as a current whole-site acceptance gate.
5. Retrieve editorial originals through `CONTENT_SOURCES.md` for manuscript/workshop tasks; they are not in Git.
6. Current financial-rule verification when content changes, intended-user review, final signing and store release remain separate work. This workflow task does not imply a new public app release or paid service.

No new feature is queued by this workflow instruction. For a new task, read `AGENTS.md`, current code and this checkpoint, then replace the active goal/next action with the new work.

