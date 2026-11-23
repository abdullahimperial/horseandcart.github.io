# Resumable video narration

The owner approved a repository-first workflow for all existing silent videos on 16 November 2026: preserve completed work, use Kokoro **af_heart**, and continue without chat history. This folder is the production entry point. Read `queue.json`, then the selected `plans/<id>.json` and latest `work/<id>/state.json`.

## Inventory and preservation

The queue identifies 12 numbered shorts, two teaser formats, and two completed narrated videos. The original 49-second short **01** and the completed 42.905-second **horse-cart-v2** are different videos. Do not replace one with the other. The 28-second introduction is already narrated. An audio stream does not prove a source has narration: older shorts contain sound tracks.

Each item records exact source filename, SHA-256, duration, dimensions, saved-file name, current stage and next action. Scripts for 01–03 are recovered from the originals' timed captions, with brief leading/trailing margins. They still require spoken-output review. Later shorts and the two teasers need scene inspection and timed scripts. Do not invent timing from a title.

Existing production source was recovered from `media/narrated-videos` at `7a98a3c6ee68ee9e2e88216777ac3936483ecb5f` into sibling `horse-cart-heart-v2` and `introduction-heart` folders. Original first-three-short rendering source is in `originals/three-shorts/`; it is archival code with historical absolute paths, not the new entry point.

## Retrieve inputs without chat history

Original MP4 bytes are currently saved outside Git. For each source, `queue.json` contains its exact filename and saved-file name. In ChatGPT, retrieve that file through the Library connection and copy it to the recorded `sources/` path, or use `--source /downloaded/file.mp4`. From a regular workstation, download the saved file while signed into the owner's ChatGPT account. SHA-256 verification is mandatory before mixing.

Public upload of the original MP4 was rejected by automatic approval review, including after the owner explicitly gave permission on 16 November. No upload completed. Do not claim the repository contains those video bytes. This external-media boundary remains the one limitation on a completely self-contained clone. Existing tracked animation source in `../horse-cart-heart-v2` is unaffected.

## Run and resume

Use Python 3.12, FFmpeg and espeak-ng. In a virtual environment install CPU `torch==2.8.0`, then `pip install -r media/video-production/requirements.txt`. The existing proven Kokoro dependency/model pins are retained. No paid speech API or API key is needed.

```sh
python media/video-production/pipeline.py status
python media/video-production/pipeline.py validate
python media/video-production/pipeline.py synthesize --job 01
python media/video-production/pipeline.py mix --job 01 --source /path/to/Lets_Fix_Money_01_Horse_and_Cart_Short.mp4
```

Use `--state-dir /persistent/checkpoint` to keep caches and outputs elsewhere. Rerun the same command after interruption: a phrase is reused only if its settings, text, time budget, WAV checksum and format match. Changed or corrupt phrases regenerate. Completed work is never trusted from a filename alone. Files are written atomically at every phrase boundary; `state.json` records the next phrase and any error. An interrupted phrase may regenerate, but earlier completed phrases survive if the work directory was preserved.

The model and voice downloads are pinned to a revision and checked by SHA-256. Speech uses natural synthesis speeds 0.98–1.12. If a sentence does not fit, the job stops and retains preceding phrases. Shorten the script or adjust verified scene timing; never truncate speech or force a large time stretch. Picture frames are stream-copied during mixing; the previous sound track is replaced to prevent overlapping speech.

## GitHub Actions and durable checkpoints

`Resumable Kokoro Heart narration` generates speech without uploading source video. On the `video-resume-workflow` branch, changes to the pipeline, plans, requirements or workflow trigger job 01. After this workflow reaches main, its manual Run workflow control supports 01–03. A rerun of a failed job is also supported.

The workflow restores phrase cache and always uploads complete/partial `work/` as `Video-<id>-Heart-Checkpoint`, including failures. Actions caches can be evicted and artifacts expire after 90 days: **neither is the permanent source of truth**. Before ending a session, download the checkpoint artifact, save a durable checkpoint ZIP to the owner's saved files, and record the exact filename, run ID, commit and checksum in `CHECKPOINT.md`. Future sessions restore that ZIP into `work/`. Do not leave an artifact link as the only backup. A hard runner kill may bypass final artifact upload; previous durable checkpoints remain usable.

After mixing, decode the whole MP4, verify every phrase ends inside its scene, listen to the narration, inspect scene alignment, save the final video, and update the queue and checkpoint. `verified` in generated state means technical checks passed; `human_review: pending` is separate. A script-ready item is not a completed video.

## Checks

```sh
python -m unittest discover -s media/video-production -p 'test_*.py'
python3 scripts/check.py
```

Tests exercise overlap rejection, voice/speed constraints, input-based invalidation, corrupted WAV rejection, and a deliberate mid-job failure followed by reuse. The synthesis integration fixture is synthetic and does not claim voice quality; actual Kokoro requires the Actions/dependency environment.

## Offline Heart narration for long-form films

The [offline asset workflow](../../.github/workflows/kokoro-heart-offline.yml) prepares the public Kokoro 1.0 full-precision ONNX model and the `af_heart` American-English voice for production machines with restricted package access. The workflow has read-only public downloads, no repository-write permission, and takes no script or video as input. Its push trigger is scoped to the production branch and workflow file.

Download the runtime artifact and all eight numbered model artifacts from a successful run. Extract them to one directory, concatenate `model.00` through `model.07` in numeric order into `model.onnx`, then run `sha256sum -c SHA256SUMS`. The wheel targets CPython 3.12 on x86-64 Linux. The phonemizer npm archive, voice file, and tokenizer are included. Retention is three days. Rerun the workflow to regenerate expired assets from the pinned upstream revision.

For the seven-stage film, use Heart throughout, including the household example, reflections, chapter openings and the close. Let speech set each scene’s duration. Rebuild the captions, chapter markers and transcript timestamps from the same final audio timeline. Natural pauses after questions and exercises give the viewer time to follow the numbers.
