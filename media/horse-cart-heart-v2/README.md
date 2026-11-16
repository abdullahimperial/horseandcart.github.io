# Horse and cart — Kokoro Heart narrated short

Completed 15 November 2026. The owner approved publishing these production files and using GitHub Actions. The final vertical video is 42.905 seconds, 720×1280 at 30 fps, with Kokoro `af_heart` narration and matching captions.

## Rebuild

1. Use Python 3.12, FFmpeg, espeak-ng and DejaVu Sans fonts. Install CPU Torch 2.8.0 followed by `pip install -r requirements.txt -r requirements-render.txt` from this directory.
2. Run `python synthesize.py`. This produces the WAV, MP3, narration text, individual lines and measured `output/timing.json`.
3. Run `python render.py`. It reads measured voice boundaries, retimes the continuous animation, adds captions and the car-saving indicator, and exports `output/Horse_and_Cart_Kokoro_Heart.mp4` and an SRT. It never speeds up or clips speech.

The branch-scoped `.github/workflows/horse-cart-heart-v2.yml` performs the speech build. Successful run: https://github.com/abdullahimperial/horseandcart.github.io/actions/runs/43737278861 at commit `e29fdaf6135a75f5ad1c6d485cd6e5e35a5aadff`. Download its audio artifact into `output/` to render locally without regenerating speech. Actions artifacts expire; source and pinned model settings remain rebuildable.

## Files and provenance

- `narration.json`: 101-word script, approved Heart voice and pinned model/voice hashes.
- `synthesize.py`: actual Kokoro speech generation at natural speed 1.0 and sample-accurate sentence measurement.
- `animation-source.mp4`: central animated scene from the owner's original 49-second short, cropped to remove old headings and captions, compressed to 696×358. No soundtrack.
- `render.py`: deterministic retiming, text overlays and export. Uses the same twelve-line order and source-scene mapping.
- `measured-timing.json`: exact final recording timings from the successful build.
- `verification.json`: checks, output hashes and build provenance.
- `preview-timing.json`: estimated timing for `python render.py --preview` only. The old silent preview is not the completed video.

The money metaphor follows Chapter 2 of Let's Fix Money: moving the horse in front makes the same effort easier; earning and saving before discretionary purchases when practical can reduce financing costs.

Model: https://huggingface.co/hexgrad/Kokoro-82M (Apache-2.0 weights). Voice generation does not clone a person's voice and uses no paid speech API.

## Verification

All twelve recorded line durations match their timeline boundaries within 1 ms. The final speech ends at 41.915 seconds, leaving 0.99 seconds of tail. Final MP4 audio/video duration differs by 5 ms. WAV peak is -2.0 dBFS; full media decoding passed. A rendered contact sheet was visually inspected. The unchanged website baseline also passed 162 JavaScript and six Python bundle tests. No website deployment or Android release was requested.

Final MP4, MP3, WAV and SRT were delivered separately. Work is complete; future edits should update the script, regenerate speech, then rebuild the video from the new measured timing.
