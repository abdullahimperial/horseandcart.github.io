# Changelog

Meaningful changes belong here; Git commits hold the full diff and `docs/PROJECT_STATUS.md` holds the current handover.

## 2026-11-15 — Introduction Heart voiceover

- Add an eight-phrase voiceover for the original 28-second introduction, synchronized to its existing on-screen messages.
- Preserve original video packets and lower the synthesized effects under Heart narration.
- Include generation, mixing and original visual source. Audio generation and final verification are pending.

## 2026-11-15 — Completed narrated horse-and-cart short

- Add the 101-word narration, pinned Kokoro Heart synthesis, source animation, caption renderer and rebuild documentation on the media work branch.
- Generate narration first; measured sentence boundaries drive the 42.905-second vertical video. Speech is not stretched or cut off.
- Save final MP4, MP3, WAV and SRT. Record timing, hashes, model provenance and successful Actions run 43737278861.
- All twelve recorded lines match their timing; full export decode and visual contact-sheet checks passed. Unchanged website baseline passed 162 JavaScript and six Python tests.
- Owner explicitly approved public repository production files and GitHub Actions. No website/Android runtime changes or new deployment.

## 2026-11-14 — Repository-based continuation

- Record the owner’s standing requirement: repository instructions, decisions, verification and unfinished-work context must support continuation without chat history.
- Replace the outdated root README; add AGENTS, development/architecture guides, current status and an editorial source register. Mark historical book-sync instructions as historical.
- Add `python3 scripts/check.py` and the **Repository checks** workflow for source JavaScript and Android-bundle tests. Ignore local outputs and signing material.
- Repair Urdu-related test regressions: merchant assertions include untranslatable RTL-isolated names; the board fixture models window/language events. Existing financial/game assertions remain.
- Include Urdu runtime, styles, fonts and licence in the offline Android bundle. Add byte-equality coverage and browser checks preserving categories across language changes.
- Local verification: 162 JavaScript and six Python bundle tests passed. Local Chromium is blocked; GitHub verified the mobile browser flow including offline Urdu, native unit tests, lint and debug/release APK compilation at `41ff28a3`. Repository checks and Pages deployment also succeeded. Run links are in the project checkpoint; physical-device testing remains pending.

## Earlier milestones

- `0116c3f`: English/Urdu site and manuscript-based copy; Pages succeeded, Android CI failed on a stale renderer assertion.
- `9020f194`: earlier successful Android build, predating Urdu.
- Course and historical manuscript work are documented in `course/README.md` and `docs/BOOK_SYNC_STATUS.md`; these are not new verification claims.
