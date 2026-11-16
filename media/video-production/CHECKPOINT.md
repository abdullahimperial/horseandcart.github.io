# Video checkpoint

Updated: 16 November 2026 (Edmonton). **Narration production complete.** The public commit containing this handover is discoverable with `git log -1 -- media/video-production/CHECKPOINT.md`.

## Delivered

All twelve numbered shorts now have Kokoro `af_heart` narration. This continuation produced 02–12 and the landscape teaser: twelve new outputs, 111 phrases, all at speed 0.98. The original 49-second short 01, existing 28-second introduction, and separate 42.905-second horse-cart-v2 are preserved. The portrait teaser is already represented by the introduction: their picture-stream SHA256 is identical. There are fifteen unique narrated videos across the sixteen inventory entries.

The complete set and every new MP4 were saved successfully. The cumulative audio checkpoint was saved after each completed output (final version 11). Exact individual filenames and hashes are in `queue.json`.

| Permanent saved file | SHA256 | Contents |
| --- | --- | --- |
| Lets_Fix_Money_Complete_Heart_Video_Set.zip | d84e2fc9289aa2c2473f778325df87b1324e7fa04d678ac81100f7579f356b87 | Fifteen MP4s, available captions, file index |
| Lets_Fix_Money_All_Videos_Heart_Checkpoint.zip | cd43e2722c4bca54732681d65fc2a68dab36f90ca686a912334e04582fb2e045 | Current private plans/queue, phrase cache, narration WAVs, captions and states |

Search these exact filenames in the owner's saved files. The earlier working-checkpoint archive is historical; use the final cumulative checkpoint above.

## Verification

- Source MP4 hashes matched before mixing; all twelve new outputs fully decoded.
- Every phrase finishes within its scene; all 111 new phrases fit at 0.98 without truncation or time stretching.
- Each output's video-packet hash matches its original: picture frames are unchanged.
- Encoded audio peaks range from -2.0 to -1.9 dBFS. Detailed output checks are in `verification-remaining.json`; 01's earlier verification remains separate.
- Restored the final ZIP into an empty directory, then validated all thirteen production audio checkpoints (01–12 and landscape) without the speech engine installed. Every completed narration WAV remained byte-identical.
- Local repository checks passed: 162 JavaScript, six Android-bundle and six narration tests. [Branch CI](https://github.com/abdullahimperial/horseandcart.github.io/actions/runs/43821022590) passed for `e4ea2eb7`.
- Human listening review has **not** been performed. Technical checks do not certify pronunciation or editorial delivery; preview the saved videos before publication.

## Resume without conversation history

No unfinished synthesis jobs remain. For a requested revision, retrieve the final checkpoint, verify its SHA256, and extract it into `media/video-production/`. This restores the current private `plans/`, `queue.json` and `work/`. Do not use historical public plans as replacements for those scripts. The public queue deliberately leaves private-plan entries unset and names the required checkpoint.

Use `pipeline.py synthesize --job ID` to reuse validated speech, then `pipeline.py mix --job ID --source /path/to/original.mp4`. Exact original filenames/hashes are in the restored queue. `run_queue.py --job pending` selects only `script_ready` jobs; mark a deliberately revised job ready before batching. The final queue is complete, so the pending batch is empty.

The [offline engine build](https://github.com/abdullahimperial/horseandcart.github.io/actions/runs/43820588707) succeeded at `fde878d7557ead674aa31735be440c5293bfa422`. It contains public dependencies/model files only. Download the engine and model artifacts (30-day retention), or rebuild them using `.github/workflows/voice-engine-bundle.yml`. See README for installation, including the docopt source archive. Set `LFM_KOKORO_MODEL_DIR` and `HF_HUB_OFFLINE=1`; the pinned model/voice hashes remain mandatory.

## Public/private boundary

Automatic approval review rejected public upload of source MP4s and, separately, recovered scripts/editable source because the latter came from saved material without approval for that specific public disclosure. No rejected content was published through an alternate route. The safer path packaged the public engine and generated narration locally. The public repository contains code, workflows, tests, verification, source/output filenames and restore instructions. Private scripts, media and audio checkpoints remain in the owner's saved files. A bare clone therefore needs the referenced checkpoint/media for full production continuity.

All deliverables are complete; only owner listening review and any explicitly requested revisions or publication remain.
