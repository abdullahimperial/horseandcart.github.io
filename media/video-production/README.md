# Resumable video narration

The owner approved a repository-first workflow for all existing silent videos on 16 November 2026: preserve completed work, use Kokoro **af_heart**, and continue without chat history. This folder is the production entry point. Read `queue.json`, then the selected `plans/<id>.json` and latest `work/<id>/state.json`.

## Inventory and preservation

The queue identifies 12 numbered shorts, two teaser formats, and two completed narrated videos. The original 49-second short **01** and the completed 42.905-second **horse-cart-v2** are different videos. Do not replace one with the other. The 28-second introduction is already narrated. An audio stream does not prove a source has narration: older shorts contain sound tracks.

Each item records exact source filename, SHA-256, duration, dimensions, saved-file name, current stage and next action. **Production is complete:** all numbered shorts and both teaser formats are covered; see `CHECKPOINT.md` for the final fifteen-video set and private recovery archive. The public first-three scripts were recovered from original captions. All remaining scripts were subsequently recovered, scene-checked and narrated privately; their current versions are in the permanent checkpoint identified below. Do not infer current script content from historical public files. The portrait teaser has identical picture packets to the completed introduction, so it is already covered.

Existing production source was recovered from `media/narrated-videos` at `7a98a3c6ee68ee9e2e88216777ac3936483ecb5f` into sibling `horse-cart-heart-v2` and `introduction-heart` folders. Original first-three-short rendering source is in `originals/three-shorts/`; it is archival code with historical absolute paths, not the new entry point. Later editable sources remain in their existing saved archives because public source/script disclosure was blocked.

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

`Resumable Kokoro Heart narration` generates speech without uploading source video. On the `video-resume-workflow` branch, changes to the pipeline, plans, requirements or workflow trigger job 01. Its manual Run workflow control supports historical public jobs 01–03; restore the current private checkpoint for later work. A rerun of a failed job is also supported.

The workflow restores phrase cache and always uploads complete/partial `work/` as `Video-<id>-Heart-Checkpoint`, including failures. Actions caches can be evicted and artifacts expire after 90 days: **neither is the permanent source of truth**. Before ending a session, download the checkpoint artifact, save a durable checkpoint ZIP to the owner's saved files, and record the exact filename, run ID, commit and checksum in `CHECKPOINT.md`. Future sessions restore that ZIP into `work/`. Do not leave an artifact link as the only backup. A hard runner kill may bypass final artifact upload; previous durable checkpoints remain usable.

After mixing, decode the whole MP4, verify every phrase ends inside its scene, listen to the narration, inspect scene alignment, save the final video, and update the queue and checkpoint. `verified` in generated state means technical checks passed; `human_review: pending` is separate. A script-ready item is not a completed video.

## Checks

```sh
python -m unittest discover -s media/video-production -p 'test_*.py'
python3 scripts/check.py
```

Tests exercise overlap rejection, voice/speed constraints, input-based invalidation, corrupted WAV rejection, and a deliberate mid-job failure followed by reuse. The synthesis integration fixture is synthetic and does not claim voice quality; actual Kokoro requires the Actions/dependency environment.

## Private scripts and offline generation

Recovered scripts for the later videos could not be published to this public repository: automatic approval review rejected that disclosure. `CHECKPOINT.md` identifies the permanent private working archive. Restore its plans/queue locally before continuing those jobs. The existing portrait teaser is already covered by the completed introduction; their video packet checksums match.

The `Build offline Heart voice engine` workflow packages the public pinned model and Python 3.12 Linux wheels into two downloadable artifacts, with `SHA256.json` and model-card/license metadata. No private scripts or source video are uploaded. Extract the engine artifact into `engine/` and the model artifact into `engine/model/`. Verify every entry in `engine/SHA256.json`. Create a Python 3.12 virtual environment, install `engine/wheels/*.whl` using `pip install --no-index --no-deps`, then install `engine/wheels/docopt-0.6.2.tar.gz` with `--no-index --no-deps --no-build-isolation`. The second step is required: docopt is supplied as a source archive. Set `LFM_KOKORO_MODEL_DIR` to the extracted model folder and `HF_HUB_OFFLINE=1`. The original model/voice SHA256 checks still apply. Then run `python media/video-production/run_queue.py --job pending`. This selects only `script_ready` jobs, records an atomic batch report, and continues to the next job after a failure. Reruns preserve validated completed tracks and phrases.

Engine artifacts expire after 30 days but the workflow can rebuild them. Narration/audio checkpoints must still be saved permanently. Never treat the public queue as evidence that private scripts or final videos have been published.

Offline execution was verified on Linux with Python 3.12 and the bundled espeakng-loader; source/model hashes and successful real speech generation are separate from the synthetic interruption tests.
