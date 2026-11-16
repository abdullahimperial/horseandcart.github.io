# Architecture and decisions

GitHub Pages serves static HTML/CSS/JavaScript and local images/fonts. There is no application server, database, bank integration or LLM dependency. Preserve relative paths between nested pages and shared assets; `CNAME` contains the domain name, not DNS credentials.

| Area | Main source | Ownership |
| --- | --- | --- |
| Shared website | Root HTML, `assets/experience.js`, `assets/journey.js` and shared CSS | Navigation, homepage experience, shell |
| Course | `course/assets/course-data.js`, `course.js` | Lessons, quizzes, activities, workbook and export |
| Visual teaching | `learning-data.js`, `learning-lab.js`, `learning-math.js` under course assets | Activity mappings, fictional Noor household, scenes and pure arithmetic |
| Snapshot import/totals | `apps/financial-reset/engine.js`, `bank-files.js` | Imports, classification, coverage, income/spending/transfers |
| Snapshot reports/plans | `guidance.js`, `resilience.js`, `intelligence.js`, `planner.js`, `plan-ui.js`, `dashboard.js` in that app | Assumptions, readiness, saved schema, action planning and reports |
| Snapshot interaction | `app.js`, `journey.js`, `explore-engine.js`, `explore-ui.js`, `review-chart.js` | Five steps, editable review, charts and optional scenarios |
| Merchant evidence | `merchant-extra.js`, `merchant-rules.js`, `MERCHANT-SOURCES.md` | Suggestions, source attribution and editable classification |
| English/Urdu | `assets/i18n/ur.js`, `i18n.js`, `i18n.css` | Authored translation map, runtime language control and RTL fonts/styles |
| Currency | `assets/currency.js`, `assets/CURRENCY.md` | Scenario/display currency; never converts Snapshot CAD records |
| Games | `games/assets/life-engine.js`, `life.js`, `board-geometry.js`, `snakes.js` | Arithmetic, interaction and artwork positioning |
| Android | `android/app/src/`, `android/web/`, `android/scripts/bundle_web.py` | Restricted local WebView, native import/export/print and generated bundle |

## Decisions to preserve

**One engine for web and Android.** Android copies runtime files during its build. Its explicit dependency allowlist avoids bundling unrelated/private files. Add dependencies and tests when shared pages change, including dependent fonts/licences.

**Language changes presentation, not data.** English is the source language. Urdu changes authored labels/explanations; dynamic placeholders remain intact. Raw/user data is isolated with `translate="no"` or `data-lfm-private`. Input/category values stay stable. Canvas and some exports call `window.LFM.t` explicitly. See [localization instructions](../assets/i18n/README.md).

**Repayments are not new spending.** Purchases count once. Settlements stay visible as transfers, fees/interest as expenses and refunds as reductions. Classification uses account/description/type, not amount-only deduplication. Preserve coverage/review gates and `card-payments.test.cjs`.

**Learning state differs from financial records.** Course answers/progress and site preferences may use browser storage. Snapshot records/context stay in memory; users explicitly export reports/plans. Validate plan imports, retain compatibility, and mark reports stale after data changes.

**The course stands alone.** Book references are supplementary. Activities remain in lessons and the workbook. Fictional scenarios must not become claims about the author.

**Continuity is source-controlled.** `AGENTS.md` defines the workflow, `DEVELOPMENT.md` its commands, `PROJECT_STATUS.md` the current checkpoint and `CHANGELOG.md` the history. Component READMEs explain local assumptions. Editorial originals have a separate source register.


## Video production

`media/video-production/queue.json` owns job identities and source checksums; `plans/` owns timed scripts. `pipeline.py` separates speech synthesis from picture mixing so Actions can generate audio without source-video access. Cached phrases are keyed by text, model/voice hashes, speed, sample rate, synthesis version and available duration. Only validated entries are reused. State updates are atomic; source/audio checksums prevent stale mixing. Existing speech/animation generators are preserved in sibling folders. Media bytes currently remain in owner-accessible saved files because public-upload approval review blocked transfer; exact references and restore steps are documented.

The offline engine workflow packages only public model/dependency files. `LFM_KOKORO_MODEL_DIR` lets local synthesis use those exact checksum-verified weights while keeping scripts private. `run_queue.py` records batch progress atomically, continues after per-video failure, and leaves phrase recovery to the existing pipeline. Unpublished plans/queues live in the named private production checkpoint until public disclosure is authorized.
