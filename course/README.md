# Let’s Fix Money course

A static, accessible slide course based on Abdullah Mohiuddin's supplied 77-page print edition of *Let’s Fix Money: From Struggling with Affordability to Building Generational Wealth*.

## Development

Serve the repository root with `python3 -m http.server 8000 --bind 127.0.0.1` and open `course/index.html` in a browser. There is no build step or package dependency. Course pages load three local shared assets:

- `assets/course-data.js`: nine chapter-based modules, 102 slides, 52 workshop activities plus nine next-action plans. Page references identify the manuscript source. Book activities and additional practice are labeled separately.
- `assets/course.js`: slide navigation, conceptual SVG illustrations, calculators, quizzes, local notes, workbook export, and print views.
- `assets/course.css`: responsive presentation, keyboard focus, reduced-motion handling, and print styles.

The course provides readable lesson content when JavaScript is disabled. Most book subheadings have a dedicated slide; closely related saving strategies are grouped and named in the contents list. The final module covers the author's personal story, housing principles, mortgage milestones, and closing checklist.

## Learner data

No learner data is sent to a service. Notes and slide positions live in browser local storage. Old `pf-course-module-N` completion records and earlier reflection/action notes are preserved. Completion is self-reported. Clearing browser data removes saved work; learners can download a plain-text workbook. When storage is blocked, learning still works, with a visible warning and session-only state.

## Calculation scope

All defaults are labeled editable examples, not recommendations. Dollar amounts use CAD. Arithmetic exercises cover cash flow, annualized habits, simplified gross income/working time, a liquid reserve estimate, savings changes, weekly allocation, and sustainable giving. They do not calculate personal tax liability, account eligibility, grants, contribution room, investment returns, or an optimal allocation. Existing games and the mortgage calculator open separately so the workbook remains available.

Diagrams are original conceptual illustrations, not reproductions of image-only game boards. Grant support is kept separate from investment returns; prepaid obligations and credit are kept separate from liquid savings. Account rules link to official sources for verification.

## Validation completed

The updated course was exercised in headless Chromium at desktop and mobile sizes: all 102 slides, nine workshops, quiz feedback, calculator defaults and invalid inputs, persisted notes, completion records, resume navigation, downloads, printing, no-JavaScript reading, and blocked-storage fallback. Independent arithmetic checks covered each calculator type and key boundaries. Local page, asset, and activity-tool links returned HTTP 200. The existing Money Spiral and mortgage prepayment tools were also exercised. External eligibility and tax rules are linked for learners to verify; no individual financial entitlement is calculated.

A malformed class attribute in the linked Money Spiral activity was repaired so its direction and monthly difference display correctly. Empty and negative inputs now show a validation message.


## YouTube Shorts integration (draft)

The integration maps the three existing Shorts to Module 2 slides 1, 6 and 7. Each optional panel has a direct YouTube link, descriptive transcript and matching activity. The course overview links to the precise lesson. Video links open in a new tab; no YouTube player, image, script or video is downloaded by the course.

`assets/youtube-links.js` is the only video-ID configuration. IDs must be verified against the official `@letsfixmoneycom` uploads. The three values are intentionally empty because channel retrieval was unavailable. Unverified entries are hidden. **Do not merge or publish this draft until all three IDs are set and the destinations checked.** Add matching direct links to the no-JavaScript content on the overview and Module 2 when IDs are known.

`shorts-roadmap.json` records proposed follow-ups and the exact course placements. Proposed titles are editorial ideas, not available videos. Existing lessons and learner-storage keys remain unchanged.
