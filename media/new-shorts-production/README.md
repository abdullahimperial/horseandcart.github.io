# Resumable illustrated Shorts

This producer makes portrait explainers from private book-based scripts. Narration is generated first; four illustrated scenes follow the measured audio. N-prefixed IDs distinguish this series from the older numbered jobs.

## Resume without chat history

Restore the newest `Lets_Fix_Money_New_50_Video_Production_Checkpoint.zip` from the owner's saved files. Read `Lets_Fix_Money_New_50_Video_Progress.md`, then `queue.json` and `preservation.json`. The archive includes scripts, storyboards, voice settings, sentence audio, SRT files, generation state, operational scripts, reviews and private publication receipts. Finished MP4s are saved individually; their persistent file identities are in `preservation.json`. The archive excludes those MP4s to keep frequent saves practical.

Refresh current saved-file versions before replacing them: a restored archive records its own previous save receipt. Do not blindly reuse an old version number. Generated, checked, saved, scheduled and published are distinct states. A scheduled post is not evidence of publication; verify its external status and live URL. Before retrying, check stable scheduling UUIDs and video hashes to prevent duplicate uploads.

Public reusable code and tests are here. Content, media and account-specific state remain in the private checkpoint. Do not commit those files or send them to a public Actions job. Respect existing public-disclosure and PR-merge restrictions. Work does not continue automatically when a chat environment ends.

## Runtime and commands

Use Python 3.12, system FFmpeg/FFprobe and DejaVu Sans/Serif fonts in `/usr/share/fonts/truetype/dejavu/`. The renderer was verified with Pillow 13.0.0 and NumPy 2.3.5. It can run separately from the voice environment.

For voice dependencies, follow the [existing offline engine instructions](../video-production/README.md#private-scripts-and-offline-generation). `heart_engine.py` is the existing checked implementation. The restored `inputs/voice_settings.json` specifies the pinned model revision and SHA-256 checksums. Use Kokoro `af_heart`.

From the restored production directory:

```bash
LFM_KOKORO_MODEL_DIR=/path/to/model HF_HUB_OFFLINE=1 /path/to/voice-venv/bin/python code/generate_audio.py --ids 1-50
python3 code/render_videos.py --ids 1-50
python3 tests/test_resume.py
```

Use `--ids 1-5` for a batch, or renderer `--preview` for contact sheets. Two processes may render different IDs. Per-job locks prevent concurrent writes to one video. Save each finished MP4 and a guarded checkpoint after each batch; keep returned file IDs and versions. Do not rely solely on expiring Actions artifacts or the workspace.

## Resume and validation guarantees

- Sentence cache keys include prepared text, pronunciation, voice settings and version. Reused WAVs must match SHA-256 and expected PCM format. Corrupt sentences are regenerated; unchanged ones survive script edits.
- Missing captions are recreated from completed timing metadata. Sentence boundaries use measured audio; shorter caption chunks have estimated intra-sentence timing, not forced word alignment.
- Rendering fingerprints the script, storyboard, audio and renderer. Verified completed MP4s are reused. Writes use temporary files and atomic replacement.
- Video checks cover 1080 × 1920 H.264, AAC audio, matching duration, full decoding, finite non-silent audio and caption bounds. Four scene previews are inspected separately. Technical verification is not a human listening pass.
- `tests/test_resume.py` uses a tone fixture without loading the voice model. It exercises corrupted-cache repair, unchanged-audio reuse, selective regeneration, acronym boundaries, SRT restoration, complete rendering and reuse without invoking the encoder.

## Private input contract

`inputs/scripts.json` contains a `scripts` list. Each entry has `id`, `title`, four `narration` paragraphs and four short `text` headings. An optional top-level `pronunciation_guide` maps acronyms to spoken forms. `inputs/storyboards.json` maps string IDs to four scene objects with `kind`, `icon`, `items` and `note`.

Templates include checklists, comparisons, equations, calendars, flows and growth diagrams. Keep arithmetic exact and mark historical or illustrative amounts. Historical stories do not establish current product terms or eligibility. Refresh applicable official sources before materially changing rule-sensitive content.
