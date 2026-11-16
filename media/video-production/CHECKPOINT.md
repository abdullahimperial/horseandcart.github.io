# Video checkpoint

Updated 16 November 2026 (Edmonton). Active branch: `video-resume-workflow`, based on main `04e8e8a9a7aec00530a96933664c9396f4457e69`.

## Completed

- Inventoried 16 distinct videos with checksums, stream metadata and saved-file identities in `queue.json`.
- Preserved existing narrated introduction and horse-cart-v2; recovered their GitHub production code.
- Recovered original timed scripts and animation code for shorts 01–03.
- Implemented phrase cache validation, atomic checkpoints, timing bounds, narration mixing and full-decode verification.
- Added failure/restart tests and a GitHub Actions build with partial-work artifact preservation.

## Current next action

Run the new workflow for short 01. Retrieve its checkpoint artifact, mix with the exact 49-second source using the documented command, inspect/listen, save the resulting video and a durable checkpoint ZIP, then record those file identities here. Continue with 02 and 03; inspect scenes before drafting 04–12.

At this checkpoint the new speech build has not run. Existing completed videos are recorded separately. No new narrated video is claimed complete.

## Access limitation

Automatic approval review rejected public upload of the original source MP4 even after explicit owner permission. Source videos remain available through the exact saved-file references in the queue. Code/checkpoint publication is being completed independently; no video upload is being routed around that rejection.
