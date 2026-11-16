# Current project checkpoint

Updated: 16 November 2026 (Edmonton).

## Active goal

Finish Heart narration for every existing silent video with durable phrase checkpoints. Start with `media/video-production/README.md`, `queue.json` and `CHECKPOINT.md`. Original short 01 (49 seconds), the introduction (28 seconds), and horse-cart-v2 (42.905 seconds) are already saved. The portrait teaser is the same picture stream as the completed introduction, so it needs no duplicate narration.

The remaining timed scripts have been prepared and checked against original scenes, but automatic approval review rejected publishing the recovered scripts and editable source to this public repository. They are preserved privately in `Lets_Fix_Money_Remaining_Narration_Working_Checkpoint.zip` (SHA256 `fda3cd91239057be28c838bbd545cdf9f582f0accdaf1f0b687a66cea749766b`). No private source upload completed. The earlier public-MP4 limitation also remains.

## Next action

Active branch `video-narration-remaining` contains an offline Heart-engine packaging workflow. Build `fde878d7557ead674aa31735be440c5293bfa422` packages only public model/dependency files, so narration can run locally with scripts kept private. Download both engine/model artifacts, verify their hashes, install the offline dependencies, restore the private checkpoint into `media/video-production`, then synthesize and mix each job. Source MP4s are named and hashed in the queue. Save completed MP4s and audio checkpoints permanently, then update this handover.

`run_queue.py` isolates per-video failures and preserves successful tracks; `pipeline.py` accepts `LFM_KOKORO_MODEL_DIR` for checksum-checked offline models. Local pre-generation checks passed: 162 JavaScript, six Android-bundle and six narration tests. The remaining videos are not yet claimed complete.

## Website / Android

Product behavior is unchanged. Previous verified CI links and known limitations are in `WORKFLOW_STATUS_2026-11-14.md`. The owner's repository-first instruction remains in `AGENTS.md`. Repository code and filenames support continuation; private media/script contents still require retrieving the named saved files.
