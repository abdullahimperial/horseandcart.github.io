# Current project checkpoint

Updated: 17 November 2026 (Edmonton).

## Current course-video checkpoint

Work branch: `course-youtube-shorts`, based on main `c6d7b33d0440be41c19fa866fa5e97f81a28cfcc`. The user asked when scheduled Shorts will appear and to connect relevant Shorts to course lessons.

Implemented in [PR #6](https://github.com/abdullahimperial/horseandcart.github.io/pull/6): 62 planned video-to-lesson mappings across 51 lessons, an empty confirmed-publication registry, optional portrait players and direct YouTube links, channel link on course home, English/Urdu controls, regression tests and `course/VIDEOS.md`. No live YouTube IDs were available from Metricool analytics; the first scheduled video was still PENDING at the 17 November check. No video is represented as already live. The registry needs verified public IDs before lesson players appear.

Validation passed for code/workflow commit `df7dc63262adf6f070aee104ff0269c3193f3806`: [Repository checks](https://github.com/abdullahimperial/horseandcart.github.io/actions/runs/44215935902) (165 JavaScript tests, six Android bundle tests, three narration tests passed and one existing narration test skipped); [Course video browser checks](https://github.com/abdullahimperial/horseandcart.github.io/actions/runs/44215935881) (320/390/1280-pixel layouts in both English and Urdu, keyboard loading, no pre-click YouTube request, title escaping, navigation cleanup and channel link). Local course/language tests also passed (23). Local Chromium was blocked by socket policy, so browser verification ran in GitHub CI using the preinstalled Chrome, consistent with existing Android CI. Real YouTube playback still requires the first published ID.

Next concrete action: check the first narrated publication, verify its voice and embed availability, and add its actual YouTube ID as O11 for module 3 lesson 5. Follow `course/VIDEOS.md`; preserve private publication records separately. The new integration does not depend on or merge the separate narration work branch/PR.

## Earlier narration checkpoint (historical)

Continue all-video narration without losing work at chat limits. The production entry point is [media/video-production/README.md](../media/video-production/README.md), its [queue](../media/video-production/queue.json), and [checkpoint](../media/video-production/CHECKPOINT.md). Merged into `main` through [PR #4](https://github.com/abdullahimperial/horseandcart.github.io/pull/4), commit `fe6647fe04ff53cd2f73e03ffda39710a7934552`. Resume from current main. [Repository checks](https://github.com/abdullahimperial/horseandcart.github.io/actions/runs/43817688949) passed for the merge.

The queue contains 12 numbered shorts, two teasers and the two completed narrated versions. The 49-second original horse/cart is separate from the finished 42.905-second version. Heart (`af_heart`) is the selected voice. Existing work is preserved; only missing/stale phrases regenerate.

The phrase-resume pipeline, first-three timed scripts, recoverable Actions build, source register and tests are implemented. Local baseline passed: 162 JavaScript tests, six Android bundle tests, and four video-resume tests. The integration test deliberately fails after one phrase and confirms that phrase is reused. Real Kokoro build 43815645652 succeeded, and the original 49-second short is now narrated and saved with its durable phrase checkpoint. All ten phrases fit at speed 0.98; full decode and unchanged picture-stream checks passed. See the media checkpoint for exact filenames; human listening review remains separate.

Source video public upload was rejected by automatic review even after explicit permission. The queue records the saved originals and checksums. No source MP4 upload completed, so a completely self-contained Git clone remains blocked at that media boundary. Code/checkpoints can continue independently.

## Next action

Continue 02–03 from their saved scripts, then inspect later scenes before scripting. Job 01 and its permanent audio checkpoint are saved; retrieve them through the exact filenames in the media checkpoint. Never claim all 12 videos have narration until each has verified output.

## Website / Android status

The previous verified workflow checkpoint, CI links and known limitations are preserved in [WORKFLOW_STATUS_2026-11-14.md](WORKFLOW_STATUS_2026-11-14.md). Website product behavior and Android code were not changed in this media task. See `AGENTS.md` for the owner's standing repository-first instruction.

