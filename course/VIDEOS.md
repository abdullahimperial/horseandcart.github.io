# Lesson videos: publication and continuation

The course supports relevant narrated YouTube Shorts within lessons, with a direct YouTube link as an alternative. The public channel is https://www.youtube.com/@letsfixmoneycom/shorts.

## Source of truth

`assets/lesson-videos.js` contains 62 planned associations: O01–O12 (original videos) and N01–N50 (new videos). Module and lesson numbers are one-based and match existing `module-N.html#slide-N` URLs. Do not confuse O01 with N01. A video is assigned to its most relevant existing lesson; the course remains complete without it.

The `published` registry starts empty. As checked on 17 November 2026, the narrated series was scheduled and its first scheduled entry was still pending. No live YouTube IDs were confirmed. Pending videos produce no heading, empty player, fake link or student-facing release promise.

## Add each confirmed publication

1. Check the existing Metricool entry and the actual channel. A scheduling receipt, media URL, planner URL, or disappearance from the pending queue does not establish publication. Avoid creating duplicate uploads.
2. Match the title and narration to the intended O/N identifier. Check that the public video has the intended voice, readable captions and permitted embedding. Never substitute an old silent version.
3. Add `published.KEY = {videoId, title, verifiedOn}` using the actual 11-character YouTube ID, published title and ISO verification date. Edit the registry literal in the source file; do not paste a full URL into `videoId`. Add only public information. Keep Metricool account details, private media links and receipts outside this public repository.
4. Run `node --test course/tests/*.test.cjs` and `python3 scripts/check.py`; check the affected lesson in both interface languages. Commit through the normal repository workflow and confirm Pages deployed the intended commit. The course does not poll Metricool or discover new IDs automatically.
5. Check the live lesson and its Watch on YouTube link. Record the ID in the private production checkpoint as well to preserve publication history.

First expected association: O11 (cashback versus interest) → `module-3.html#slide-5`. Then O12 (repair versus replacement) → `module-3.html#slide-6`; O01 (horse and cart) → `module-2.html#slide-1`.

Private continuation files are named `Lets_Fix_Money_New_50_Video_Progress.md` and `Lets_Fix_Money_Publication_Recovery_Checkpoint.json`. Their current versions supersede historical media queue dates. Retrieve these from the owner's saved files when managing publication; do not commit their contents.

## Player behavior and verification

No YouTube iframe, remote thumbnail or player script loads until the learner presses **Load video**. The portrait player uses `youtube-nocookie.com`, retains an origin referrer and does not autoplay. A direct Shorts link stays available if embedding is unavailable. The video and its published title stay English; controls and explanatory copy follow English/Urdu. The small `video-copy.js` catalog is loaded before the shared language runtime snapshots translations. Navigation removes the previous iframe and leaves learner storage unchanged.

`tests/videos.test.cjs` checks identities, valid lesson mappings, missing/invalid IDs and dependency ordering. `tests/videos-browser.py` uses a local intercepted player fixture to check keyboard loading, no pre-click YouTube request, escaped titles, navigation and layouts at 320, 390 and 1280 pixels in both languages. It does not prove real YouTube playback, narration quality or publication. Run against the root server with `SITE_TEST_URL=http://localhost:8010 python3 course/tests/videos-browser.py`; set `CHROMIUM_EXECUTABLE` if using a system browser. The **Course video browser checks** workflow runs this in CI.

Official player references: https://developers.google.com/youtube/player_parameters and https://support.google.com/youtube/answer/171780.
