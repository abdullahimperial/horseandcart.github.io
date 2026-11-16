# Introduction — Kokoro Heart voiceover

Requested 15 November 2026, continuing the approved Heart production workflow. This adds voiceover to the existing 28-second 1080×1920 introduction. It follows the text on screen: earn, spend, then what; change the pattern; small decisions; Let's Fix Money; coming soon; subscribe.

The original compressed video frames are copied unchanged. The original ticks, transitions and chimes are mixed at 18% amplitude under the voice. `narration.json` holds eight scene windows. Speech is generated at 0.98 speed, with a maximum of 1.12 only if a phrase needs it. A phrase that cannot fit fails the build instead of being clipped.

## Rebuild

Use Python 3.12, FFmpeg and espeak-ng. Install CPU Torch 2.8.0, then `pip install -r requirements.txt`. Run `python synthesize.py` to create voice files and measured timings.

For the original visuals, use the supplied 28-second MP4 or recreate it with `python source/render_short.py`. That source requires Pillow, NumPy, SciPy, P052-Roman.otf and OpenSans-Regular.ttf as specified in `source/README.txt`.

Then run `python mix.py --source /path/to/Lets_Fix_Money_YouTube_Short_1080x1920.mp4`. It expects the audio build in `output/`. It checks phrase boundaries, 28-second duration, complete decoding and an identical compressed video stream.

The original source renderer is included. Its `banner.png` will be added in the final checkpoint; the initial Actions build only needs text and synthesis code. Generation/verification are currently pending.

The Kokoro model and `af_heart` hashes are pinned to the same approved voice used in the horse-and-cart short. Model: https://huggingface.co/hexgrad/Kokoro-82M (Apache-2.0). No paid voice API or voice cloning is used.
