# Current project checkpoint

Updated: 15 November 2026 (Edmonton). Branch: `media/narrated-videos`, based on the completed horse/cart branch at `eaf572adc3e4decdded395dad6805a1fce6ce642`.

## Active task

Add Kokoro Heart voiceover to the existing introduction. Selected the original 28-second 1080×1920 vertical teaser: “You earn it. You spend it. Then what?” through the “Coming soon” closing. Preserve its compressed video frames and lower the existing sound design under the narration.

## Current checkpoint

`media/introduction-heart/` contains the eight narration windows, pinned speech synthesis, lossless video-copy mixing, and original rendering code. The portrait banner asset will be added with the final checkpoint. `.github/workflows/introduction-heart.yml` generates audio on this branch with repository read-only permissions.

Python syntax checked; original video format/duration and storyboard inspected. Initial Actions run 43752673619 failed because cue 1 included edge silence and exceeded its window. The opening windows now begin with their text fade-ins; synthesis trims only low-level edge silence with 60/100 ms speech padding. Audio generation and final export are pending. Inspect the exact commit's Actions run, download its output and run `mix.py` as documented in the component README. Persist final timing and verification here.

## Completed related work

The 42.905-second horse/cart narrated short and all rebuild sources are in `media/horse-cart-heart-v2/`. Its successful speech build was Actions run 43737278861; verification is in its component. Website and Android runtime files are unchanged by these media tasks.
