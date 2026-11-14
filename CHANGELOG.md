# Changelog

Meaningful changes belong here; Git commits hold the full diff and `docs/PROJECT_STATUS.md` holds the current handover.

## 2026-11-14 — Repository-based continuation

- Record the owner’s standing requirement: repository instructions, decisions, verification and unfinished-work context must support continuation without chat history.
- Replace the outdated root README; add AGENTS, development/architecture guides, current status and an editorial source register. Mark historical book-sync instructions as historical.
- Add `python3 scripts/check.py` and the **Repository checks** workflow for source JavaScript and Android-bundle tests. Ignore local outputs and signing material.
- Repair Urdu-related test regressions: merchant assertions include untranslatable RTL-isolated names; the board fixture models window/language events. Existing financial/game assertions remain.
- Include Urdu runtime, styles, fonts and licence in the offline Android bundle. Add byte-equality coverage and browser checks preserving categories across language changes.
- Local verification: 162 JavaScript and six Python bundle tests passed. Chromium is blocked by the local environment; remote build/browser/deployment results are recorded in the project checkpoint.

## Earlier milestones

- `0116c3f`: English/Urdu site and manuscript-based copy; Pages succeeded, Android CI failed on a stale renderer assertion.
- `9020f194`: earlier successful Android build, predating Urdu.
- Course and historical manuscript work are documented in `course/README.md` and `docs/BOOK_SYNC_STATUS.md`; these are not new verification claims.
