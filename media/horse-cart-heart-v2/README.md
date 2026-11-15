# Horse and cart — voice-first short

Requested 15 November 2026: write short narration, generate and save Kokoro Heart audio, then create a video timed to that recording. The metaphor follows Chapter 2 of Let's Fix Money: rearrange the horse and cart; earn and save before buying when practical.

`narration.json` is the complete script and pinned model configuration. `synthesize.py` records each spoken line at a natural fixed speed, measures sample-accurate start/end times, and writes WAV, MP3, text and `timing.json`. Video timing must be derived from those measured boundaries; do not cut or speed up speech to fit existing pictures.

Use Python 3.12, FFmpeg and espeak-ng. Install CPU Torch 2.8.0, then `pip install -r requirements.txt`, then run `python synthesize.py`. The branch-scoped GitHub workflow performs this build with read-only repository permission. Kokoro weights use Apache-2.0; source: https://huggingface.co/hexgrad/Kokoro-82M. The approved `af_heart` voice and model SHA-256 values match the earlier Heart generation setup.

## Current checkpoint — generation underway

The owner explicitly approved publishing the prepared narration/build files to the public repository and using GitHub Actions on 15 November 2026. Branch: `media/horse-cart-heart-v2`. The narration contains 101 words in twelve lines. Audio generation is pending; silent-preview timing is not a completed recording.

The renderer creates a 720×1280, 30 fps continuous animation from measured speech. `preview-timing.json` is estimated and used only with `--preview`. The animation source will be added in the next checkpoint; the first workflow only needs text narration and build code.

## Complete the build

1. Confirm current main and reconcile sources; create branch `media/horse-cart-heart-v2` from current main without changing the website.
2. Commit these files and the branch-scoped workflow in `.github/workflows/horse-cart-heart-v2.yml`, with the required repository checkpoint and changelog updates. It has only read access and uploads the speech output as an Actions artifact.
3. Check the exact commit's workflow and download its complete audio artifact. Inspect `timing.json`, listen to the voice and confirm all twelve lines exist.
4. Put that artifact in this component's `output/` folder and run `python render.py`. This requires NumPy, Pillow, FFmpeg and DejaVu Sans fonts in addition to the synthesis dependencies. The final video uses measured speech duration, holds the scene through each sentence and never changes the audio rate. The renderer fails if input WAV duration differs from the measured timeline by more than 50 ms.
5. Inspect frames and listen to the complete result; verify decode, duration, captions and audio clipping. Save the MP3, WAV, narration text, captions and final MP4. Persist the measured manifest and build evidence in the component and project checkpoint.

For the clearly labelled silent draft, use `python render.py --preview`. That is a review artifact, not a completed narrated video. The initial silent preview is 46.23 seconds; actual timing remains unknown until synthesis.

All generated output is separate from the website and Android app.
