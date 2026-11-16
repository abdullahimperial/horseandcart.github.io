# Current project checkpoint

Updated: 16 November 2026 (Edmonton).

## Active goal

Continue all-video narration without losing work at chat limits. The production entry point is [media/video-production/README.md](../media/video-production/README.md), its [queue](../media/video-production/queue.json), and [checkpoint](../media/video-production/CHECKPOINT.md). Work branch: `video-resume-workflow`; base main `04e8e8a9a7aec00530a96933664c9396f4457e69`.

The queue contains 12 numbered shorts, two teasers and the two completed narrated versions. The 49-second original horse/cart is separate from the finished 42.905-second version. Heart (`af_heart`) is the selected voice. Existing work is preserved; only missing/stale phrases regenerate.

The phrase-resume pipeline, first-three timed scripts, recoverable Actions build, source register and tests are implemented. Local baseline passed: 162 JavaScript tests, six Android bundle tests, and four video-resume tests. The integration test deliberately fails after one phrase and confirms that phrase is reused. Actual new Kokoro build and output review are pending; see the media checkpoint for subsequent updates.

Source video public upload was rejected by automatic review even after explicit permission. The queue records the saved originals and checksums. No source MP4 upload completed, so a completely self-contained Git clone remains blocked at that media boundary. Code/checkpoints can continue independently.

## Next action

Build job 01, retrieve/save its complete or partial audio checkpoint, mix with the saved original, verify/listen and save the finished video. Record exact durable file references and run/commit evidence in the media checkpoint. Continue 02–03, then inspect later scenes before scripting. Never claim all 12 videos have narration until each has verified output.

## Website / Android status

The previous verified workflow checkpoint, CI links and known limitations are preserved in [WORKFLOW_STATUS_2026-11-14.md](WORKFLOW_STATUS_2026-11-14.md). Website product behavior and Android code were not changed in this media task. See `AGENTS.md` for the owner's standing repository-first instruction.
