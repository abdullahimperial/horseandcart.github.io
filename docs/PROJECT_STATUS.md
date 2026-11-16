# Current project checkpoint

Updated: 16 November 2026 (Edmonton).

## Completed goal

All existing silent videos now have Kokoro Heart narration. The complete set contains fifteen unique narrated videos: twelve numbered shorts, the portrait introduction, landscape teaser, and alternate Horse and Cart version. The portrait teaser is a duplicate of the introduction's picture stream and is already covered.

This continuation produced twelve new videos (02–12 and landscape). All 111 phrases fit at speed 0.98. Source hashes, full output decode, scene timing, unchanged picture streams and audio levels passed. Every MP4 and the final cumulative checkpoint were saved. Restoring the final checkpoint recovered all thirteen production tracks byte-for-byte without the speech engine. Human listening review remains separate and was not performed.

## Continue here

Read `media/video-production/CHECKPOINT.md` for permanent filenames, SHA256 values, restore commands, engine build and detailed verification. `Lets_Fix_Money_Complete_Heart_Video_Set.zip` contains the finished set. `Lets_Fix_Money_All_Videos_Heart_Checkpoint.zip` contains current private scripts, queue, audio and phrase states. No synthesis remains pending. Restore that checkpoint before any requested revision; do not overwrite it with historical public scripts.

Automatic approval review blocked public source-video/script disclosure. The safe completed path packages the public engine and runs speech locally. Code, workflow, tests, output records and recovery instructions are in GitHub; referenced media and private scripts are in saved files. The repository can direct continuation without chat history, but those files must be retrieved.

Local checks passed: 162 JavaScript, six Android bundle and six narration tests. Engine build 43820588707 succeeded; branch repository checks 43821022590 passed. Current task branch: `video-narration-remaining`, [PR #5](https://github.com/abdullahimperial/horseandcart.github.io/pull/5). Final code checks passed at `d244108766611a62d9792d2b0b5b431c4a0c3d25` (run 43822404372). Automatic approval review rejected the attempted squash merge because it requires explicit permission for this new PR. PR #5 is ready and open; no merge occurred. The next repository action is owner approval to merge PR #5 into main. Do not work around the merge block.

## Website / Android

Product behavior is unchanged. Earlier verified CI links and known limitations are in `WORKFLOW_STATUS_2026-11-14.md`. The repository-first instruction remains in `AGENTS.md`.
