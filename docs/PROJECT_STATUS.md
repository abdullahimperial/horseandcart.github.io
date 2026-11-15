# Current project checkpoint

Updated: 15 November 2026 (Edmonton). Branch: `media/horse-cart-heart-v2`.

## Completed task

The owner approved the public repository production build. Created and saved Kokoro Heart narration and a 42.905-second vertical horse-and-cart video with captions and continuous animation timed to recorded speech. Delivered MP4, MP3, WAV and SRT.

## Rebuild and provenance

All source, including the cropped animation asset, is in [the component](../media/horse-cart-heart-v2/README.md). Run `synthesize.py` and then `render.py` with its documented dependencies. The successful speech build is [Actions 43737278861](https://github.com/abdullahimperial/horseandcart.github.io/actions/runs/43737278861), source commit `e29fdaf6135a75f5ad1c6d485cd6e5e35a5aadff`. `measured-timing.json` and `verification.json` preserve final cue timing, hashes and checks.

## Verification

- All 12 line WAV durations match recorded cue windows within 1 ms; speech was not stretched or clipped.
- Video 720×1280 at 30 fps. Audio duration 42.905 s; video duration 42.900 s. Final speech ends at 41.915 s, with 0.99 s tail.
- WAV peak -2.0 dBFS, complete media decode passed; visual contact sheet inspected.
- Unchanged website baseline: 162 JavaScript and six Python bundle tests passed with `python3 scripts/check.py`.
- Website/Android runtime files were not changed; no new site deployment or Android release was requested.

## Continuation

Media task is complete on this work branch. Keep these production files together when integrating future repository work. For edits, change the narration first, regenerate the voice, and render using the new measured timings. Do not use `preview-timing.json` for a final recording. Existing website/Android limitations and prior CI evidence remain in the base checkpoint at `04e8e8a9a7aec00530a96933664c9396f4457e69`.
