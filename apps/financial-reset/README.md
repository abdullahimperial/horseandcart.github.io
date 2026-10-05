# Financial Reset

A static, browser-local transaction review and book-based action-plan app for *Personal Finance Story* by Abdullah Mohiuddin. Open `apps/financial-reset/index.html` through the site's HTTP server. The fictional demo requires no files.

## Privacy and data lifecycle

- CSVs are read with the browser File API. No financial data is uploaded, sent to an AI service, or written to local/session storage.
- Only session memory holds transactions, context, and notes. Reloading clears the analysis. A user can explicitly download a plain-text report.
- A Content Security Policy prevents fetch/XHR/WebSocket connections and disallows inline scripts, object embeds, external assets, and form submissions.
- Descriptions, filenames, and user notes are escaped before HTML rendering. Reports use plain text rather than a spreadsheet-compatible CSV export.

## Supported imports

One credit-card and one chequing CSV, with a header row, up to 5 MB / 10,000 rows each. Comma, semicolon, and tab separators; quoted fields, escaped quotes, BOM, and CRLF are handled. Mappings support combined descriptions, signed amounts, optional debit/credit types, or separate debit/credit columns; decimal point or comma; ISO dates or explicit month/day versus day/month interpretation. Currency is CAD only. Missing currency columns require user confirmation; known non-CAD/missing currency values block analysis. Malformed rows block analysis rather than silently biasing the result. All account/cash coverage remains the user's responsibility.

## Accounting model

Confirmed chequing credits categorized as Income count toward income. Unresolved chequing credits do not. Card purchases and direct chequing outflows count toward spending; classified purchase refunds offset spending. Identified settlements and transfers are excluded to avoid counting a card purchase and its payment twice. Generic transfers are deliberately left for user review. Mortgage and loan payments remain cash obligations, including principal. Imported chequing inflows/outflows are separately reported, even for rows excluded from the spending view.

The selected period's totals are reported directly. Monthly equivalents scale totals to 30.4375 days, with explicit limits; a short period is not a durable trend. Transaction dates do not establish statement coverage, and a running balance is never assumed to be accessible emergency savings.

The classification and merchant rules are deterministic heuristics. Users can correct every row, manually exclude an export duplicate, and mark charges they do not recognize. Duplicate and recurring-merchant patterns are review candidates, not fraud or unwanted-subscription verdicts. Nothing is silently deduplicated.

## Context and conclusions

The report uses the book's four saving pillars, then its emergency-system and preservation/growth frameworks. User-entered accessible savings, essential budget, reserve horizon, stable surplus, debt balances/rates, and a configurable APR screening threshold determine scenarios. Unknowns stay unknown. The app neither estimates tax/benefit eligibility nor recommends a product or optimal investment allocation. A growth-education suggestion requires a verified user-entered reserve target, stable income/obligations, sustainable surplus, complete debt details, no screened expensive debt or financing charges, and no unresolved review items. Even then, it asks users to verify rules and suitability.

Changing mappings requires re-import. Changing transactions/context marks the existing report stale and disables export until rebuilt. Top-three-action notes are retained across a rebuild within the session.

## Tests

No package installation or build required:

```sh
node --test apps/financial-reset/tests/*.test.cjs
```

Browser validation additionally covers real file upload, demo arithmetic, transaction corrections, confirmations, debt/reserve scenarios, stale reports, preserved notes, downloading/printing, malformed and non-CAD data, text injection, mobile layout, blocked storage APIs, and absence of external requests.

## Report guidance and demonstration

`guidance.js` builds expense-category rows with four pillar action cells, transaction evidence, and prioritized recommendations. Medical, donation, education and childcare expenses prompt eligibility checks, not automatic tax claims. Official CRA and benefits links let readers verify current Canadian rules. No LLM or financial data transmission is used.

`demo.js` supplies three complete fictional months and explicit context for deficit, recovery and growth cases. One click imports, reviews known fictional transfers, supplies fictional coverage/debt/reserve assumptions, and generates the report. Actual uploads still require users to verify mappings and period coverage.

For browser tests, serve the repository and run `APP_TEST_URL=http://localhost:8004 python apps/financial-reset/tests/report-browser.py` (Playwright and Chromium required). Tests cover all demos, actual CSV uploads, medical guidance, the category-by-pillar table, download, stale reports and mobile layout.

The report starts with an observed money-spiral assessment: cash-flow direction, borrowing pressure and reserve adequacy are separate dimensions. Unresolved rows make the direction provisional. Complete-month deficits and first/latest monthly surplus provide context without claiming a durable trend. A workflow overview connects the report sections to the manual book exercise.
