# Current project checkpoint

Updated: 16 November 2026 (Edmonton).

## Active goal

Continue all-video narration without losing work at chat limits. The production entry point is [media/video-production/README.md](../media/video-production/README.md), its [queue](../media/video-production/queue.json), and [checkpoint](../media/video-production/CHECKPOINT.md). Merged into `main` through [PR #4](https://github.com/abdullahimperial/horseandcart.github.io/pull/4), commit `fe6647fe04ff53cd2f73e03ffda39710a7934552`. Resume from current main. [Repository checks](https://github.com/abdullahimperial/horseandcart.github.io/actions/runs/43817688949) passed for the merge.

The queue contains 12 numbered shorts, two teasers and the two completed narrated versions. The 49-second original horse/cart is separate from the finished 42.905-second version. Heart (`af_heart`) is the selected voice. Existing work is preserved; only missing/stale phrases regenerate.

The phrase-resume pipeline, first-three timed scripts, recoverable Actions build, source register and tests are implemented. Local baseline passed: 162 JavaScript tests, six Android bundle tests, and four video-resume tests. The integration test deliberately fails after one phrase and confirms that phrase is reused. Real Kokoro build 43815645652 succeeded, and the original 49-second short is now narrated and saved with its durable phrase checkpoint. All ten phrases fit at speed 0.98; full decode and unchanged picture-stream checks passed. See the media checkpoint for exact filenames; human listening review remains separate.

Source video public upload was rejected by automatic review even after explicit permission. The queue records the saved originals and checksums. No source MP4 upload completed, so a completely self-contained Git clone remains blocked at that media boundary. Code/checkpoints can continue independently.

## Next action

Continue 02–03 from their saved scripts, then inspect later scenes before scripting. Job 01 and its permanent audio checkpoint are saved; retrieve them through the exact filenames in the media checkpoint. Never claim all 12 videos have narration until each has verified output.

## Website / Android status

The previous verified workflow checkpoint, CI links and known limitations are preserved in [WORKFLOW_STATUS_2026-11-14.md](WORKFLOW_STATUS_2026-11-14.md). Website product behavior and Android code were not changed in this media task. See `AGENTS.md` for the owner's standing repository-first instruction.
