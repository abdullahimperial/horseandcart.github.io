# Video checkpoint

Updated 16 November 2026 (Edmonton). Source build: `801c72e7f0190493c72394a40277c007e61599a7`. This handover is on `main`; look up its commit with `git log -1 -- media/video-production/CHECKPOINT.md`.

## Delivered and preserved

- Queue contains 12 numbered shorts, two teasers and two existing narrated versions, with exact source hashes and saved-file names.
- Original **01, 49 seconds**, now has Kokoro `af_heart` narration. All ten phrases fit at speed 0.98. The entire MP4 decoded successfully. Video packet SHA-256 matches the original, so picture frames are unchanged. Audio peak is -2.0 dBFS. Scene/caption alignment was inspected; human listening review has not been performed.
- [Speech build 43815645652](https://github.com/abdullahimperial/horseandcart.github.io/actions/runs/43815645652) succeeded at `801c72e7`. Artifact 14202302760 was downloaded and verified, then preserved as a durable checkpoint; do not rely on its 90-day Actions retention.
- Existing 28-second introduction and 42.905-second horse-cart-v2 remain separate and preserved.
- Local checks: 162 JavaScript tests, six Android bundle tests, four resume tests. The new Actions build also passed resume tests and real synthesis.

## Durable files

| File | Retrieval | Purpose |
| --- | --- | --- |
| Lets_Fix_Money_01_Horse_and_Cart_Heart_49s.mp4 | Search the exact filename in the owner’s saved files | Finished 49-second narrated MP4 |
| Lets_Fix_Money_Video_01_Heart_Checkpoint.zip | Search the exact filename in the owner’s saved files | Ten validated phrase WAVs, metadata, narration track, captions and state |

Checksums are in `queue.json` and `verification-01.json`. Restore the checkpoint ZIP into `media/video-production/work/`. The original source MP4 filename is also in the queue. No chat history is needed to identify any input or output.

## Next concrete action

Continue **02 — The True Cost**, then **03 — The Financial Spiral**, using their existing timed scripts. Use the manual workflow job selector, download/save the checkpoint, and mix locally with the registered source. For 04–12 inspect source scenes and create timed scripts first. A source-04 contact sheet has been inspected; see `SCENE_NOTES.md`. Do not describe the remaining shorts as narrated.

## Public-media limitation

Automatic approval review rejected public source-MP4 upload, even after explicit owner permission. The code, workflow, queue, verification and restore instructions are committed. Original/final media bytes remain in owner-accessible saved files. A clone is sufficient for the workflow and scripts, but currently requires those referenced media files for mixing. No alternate route was used to publish the rejected video.

## Merge status

[PR #4](https://github.com/abdullahimperial/horseandcart.github.io/pull/4) was merged into `main` on 16 November 2026 after the owner explicitly approved that merge. Merge commit: `fe6647fe04ff53cd2f73e03ffda39710a7934552`. [Repository checks 43817688949](https://github.com/abdullahimperial/horseandcart.github.io/actions/runs/43817688949) passed for that commit. The earlier default-branch approval block is resolved; the separate public-media upload limitation above remains.

Resume future work from current `main`. The manual **Resumable Kokoro Heart narration** workflow is now available on the default branch. Select job `02` for the next video. This merge did not start that job automatically.
