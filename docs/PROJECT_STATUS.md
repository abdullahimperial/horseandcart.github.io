# Current project checkpoint

Updated: 15 November 2026 (Edmonton). Branch: `media/horse-cart-heart-v2`.

## Active goal

Generate and save Kokoro Heart narration, then deliver the horse/cart short with visuals synchronized to measured speech. The owner approved public repository uploads and Actions execution for this task. Base: `04e8e8a9a7aec00530a96933664c9396f4457e69`.

## Current work

`media/horse-cart-heart-v2/` contains the script, synthesis recipe and renderer. `.github/workflows/horse-cart-heart-v2.yml` generates the audio and timing manifest; it only has repository read permission and runs on the media branch. No website deployment is requested.

## Verification and next action

- Python synthesis syntax checked; silent preview rendered and visually inspected. Estimated preview duration: 46.23 s.
- Kokoro recording and final synchronized render are pending. Inspect the exact commit's Actions run, download the audio artifact and continue using the component README.
- Add the cropped animation-source.mp4 next; persist final manifest and verification after production.
- Keep the website/Android baseline evidence in the parent version of this checkpoint and the changelog. No changes to those runtimes.
