# Financial Reset

A static, browser-local transaction review and book-based action-plan app for *Let’s Fix Money* by Abdullah Mohiuddin. Open `apps/financial-reset/index.html` through the site's HTTP server. The fictional demo requires no files.

## Privacy and data lifecycle

- CSV, OFX, QFX and QBO files are read with the browser File API. No financial data is uploaded, sent to an AI service, or written to local/session storage. The site-wide currency selector may save only its manual preference on this device; it does not change the CAD-only report or CAD requirements.
- Only session memory holds transactions, context, and notes. Reloading clears the analysis. A user can explicitly download a plain-text report.
- A Content Security Policy prevents fetch/XHR/WebSocket connections and disallows inline scripts, object embeds, external assets, and form submissions.
- Descriptions, filenames, and user notes are escaped before HTML rendering. Reports use plain text rather than a spreadsheet-compatible CSV export.

## Supported imports

One credit-card and one chequing CSV, with a header row or a headerless five-column Date / Description / Debit / Credit / Balance layout, up to 5 MB / 10,000 rows each. Comma, semicolon, and tab separators; quoted fields, escaped quotes, BOM, and CRLF are handled. Mappings support combined descriptions, signed amounts, optional debit/credit types, or separate debit/credit columns; decimal point or comma; ISO dates or explicit month/day versus day/month interpretation. Currency is CAD only. Missing currency columns require user confirmation; known non-CAD/missing currency values block analysis. Malformed rows block analysis rather than silently biasing the result. All account/cash coverage remains the user's responsibility.

## Accounting model

Chequing credits categorized as Income or Government benefits & support count toward income. Unresolved chequing credits do not. Card purchases and direct chequing outflows count toward spending; classified purchase refunds offset spending. Identified settlements and transfers are excluded to avoid counting a card purchase and its payment twice. The Investments category separates contributions, purchases and withdrawals from both spending and income, with money-in and money-out totals in the report. Identifiable earnings deposited into chequing can be categorized as Income; gross investment withdrawals are not automatically earnings. Spending surplus is before investment movements and is not cash available to invest. Income is selectable only for incoming chequing transactions. These categories describe the spending view, not tax treatment. Generic transfers are deliberately left for user review. Mortgage and loan payments remain cash obligations, including principal. Imported chequing inflows/outflows are separately reported, even for rows excluded from the spending view.

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

Government support descriptions receive a reviewable category. A prominent report section lists categorized support deposits, or explicitly states none were identified in the selected account/period. Users can correct missed deposits; absence is not proof of no support elsewhere. Covered entered reserves plus observed surplus trigger investment planning even before full readiness, with outstanding checks retained. Only full readiness triggers the stronger verified-surplus guidance.

Annual-payment guidance detects stable near-monthly insurance, subscription and phone/internet charges. Users supply all-in annual quotes; demo quotes are explicitly fictional. Comparisons show savings, renewal provision, reserve target impact for essential costs, and liquidity after paying from entered reserves. Only price savings divided by 12 reduce the essential budget; the whole prepaid bill is not subtracted. The main report remains unchanged until assumptions are explicitly updated.

## Household insights and action/progress loop

`intelligence.js` connects reviewed transaction clues with confirmed profile context: CCB/childcare, medical records, RRSP receipts, rising bills, employer benefits, disability-support questions, province and goal. CCB suggests child-related context; a no-dependent-children answer overrides it. RRSP guidance explains that deductions claimed may affect adjusted family net income and later CCB/GST-HST benefits; it never estimates an optimum deduction or guaranteed refund. Medical prompts prioritize itemized receipts and insurance reconciliation.

`planner.js` and `plan-ui.js` provide prioritized actions, status, review dates, user-estimated impact and notes. A user downloads a validated JSON plan explicitly and loads it alongside the next period's bank exports. The plan holds summary statistics and actions, not raw transactions. No history is saved automatically. Comparisons distinguish monthly-equivalent flow measures from entered balance measures, flag overlapping windows, retain unknowns and do not attribute changes to actions. Recommendations added but never edited can disappear when a context correction removes the signal; meaningful tracked actions are retained for review.

The Family demo includes fictional CCB and RRSP contribution transactions plus medical expenses. Context and actions remain educational. Independent professional review and real intended-user validation have not been completed.

Run `APP_TEST_URL=http://localhost:8011 python apps/financial-reset/tests/plan-browser.py` for family insights, overrides, plan round-tripping, next-quarter comparisons, stale/malformed plans, blocked browser storage and mobile behavior. Run all pure engine tests with `node --test apps/financial-reset/tests/*.test.cjs`.

Netflix remains in the spending/subscription review but is excluded from annual-payment candidates. No annual Netflix quote or prepaid discount is implied in the fictional demos. Other subscription candidates require a provider-confirmed offer; recurring billing alone does not establish a discount.

## Compact report dashboard

The default report starts with financial status, three expandable priorities and a next-action prompt. The prompt advances when an action is marked done; all actions and their notes remain accessible. `dashboard.js` groups supporting evidence, four-pillar matrices, annual-payment quotes, month-by-month figures and resources into closed native details sections. The action tracker is the single location for individual recommendations, replacing repeated insight/recommendation lists.

Report downloads temporarily expand every section and restore its prior state; print events do the same. Exports contain the detailed analysis, current annual-quote results and action records. Financial assumptions and calculations are unchanged. Use `APP_TEST_URL=http://localhost:8015 python apps/financial-reset/tests/dashboard-browser.py` to verify the compact defaults, next-action progression, details, exports, print state restoration and mobile behavior.



## Headerless account-activity imports

Date-leading files retain their first transaction. Five-column headerless exports receive editable suggested mappings; consistent unambiguous slash dates suggest month/day or day/month, while fully ambiguous dates still require a choice. Validation errors reference the original CSV row. The suggested review window is the overlap of observed dates, not a claim of complete statement coverage. Starting file import after a demo clears both demo accounts, household assumptions, debts and demo action records before either uploaded account is analyzed. Regression fixtures are fictional; private bank exports are never included in the repository.

## Merchant suggestions and review chart

Recreation, Shopping and Home renovation have dedicated categories and four-pillar guidance. Specific merchant matches precede general keywords, with separate treatment for food delivery, ride trips, subscriptions and store-card settlements. School wording suggests education; a PAY suffix on an incoming chequing entry suggests income. INV suggests investment after specific merchant checks and remains editable. Matching explanations appear below each category; manual corrections are retained until re-import.

The transaction-review page includes a local SVG spending pie for the selected dates. Category edits and date changes refresh it. Its legend filters the table without changing chart totals. Refunds reduce their categories; only positive net category totals form slices. Income, investments, transfers and excluded rows stay outside the pie. No chart libraries or external services receive transactions.

## Taxes and emergency-cushion scenarios

Tax descriptions, including COE/Edmonton tax wording, use the Taxes category. Benefits retain their separate treatment, and specific merchant matches precede generic tax words.

The review page and exported report show 3-, 6- and 12-month scenarios, estimated cash runway, and additional savings needed. A complete-calendar-month window uses its actual monthly average; partial windows scale net spending by 30.4375 days and identify the observed days. Entered essential spending overrides the estimate. Investment movements and card settlements remain outside spending.

Only chequing balances supply recorded cash. The last dated balance is shown with its date; same-day conflicts require a unique chronological order supported by reconciled running balances, otherwise cash stays unknown. Reverse-ordered exports are supported. Negative balances supply no emergency cash. Available savings entered by the user override recorded cash for comparisons. These estimates never silently populate verified reserve/budget fields or establish investment readiness. Unknown and zero-budget cases do not produce infinite runway or false coverage.


## OFX, QFX and QBO imports and sourced merchant rules (8 November 2026)

`bank-files.js` adds dependency-free local OFX 1 SGML and OFX 2 XML imports, including QFX and QBO bank downloads. CSV mapping remains unchanged. Bank files auto-read posting dates and signed amounts, require CAD and compatible account types, present a masked account selector, and carry dated ledger balances separately from transaction balances. Pending records and identical repeated FITIDs are disclosed and excluded; invalid rows and conflicting IDs block analysis. Correction streams and conversion fields require a fresh CAD CSV export. Multi-account files do not silently combine accounts.

`merchant-rules.js` adds 53 curated entries from the BSD-3-Clause Name Suggestion Index, with retained NSI and Wikidata identifiers. Longer specific merchant names win over generic retailers, while financial context rules take precedence. Categories remain editable. See [sources, matching notes and format limits](MERCHANT-SOURCES.md) and [the retained licence](LICENSE-merchant-data.txt). No paid SDK, lookup service, account login or remote financial-data processing is used.


## Expanded merchant evidence (7 November 2026, Edmonton)

The current pack has 122 entries: 53 NSI names, 57 adapted Merchant Studio entries (CC BY 4.0) and 12 entries backed by official merchant/organization pages. `merchant-extra.js` loads before `merchant-rules.js`. Sourced identities and links now appear in transaction review, including when a financial-context rule controls the category. Explicit ride-platform payout wording can identify incoming earnings.

The matcher separates memberships from orders, preserves retailer departments and meaningful plus signs, avoids ambiguous short aliases, and keeps generic bank/remittance purposes unresolved. Authorization-hold wording is surfaced for review without dropping CSV records. The names are sourced suggestions, not bank-issued identifiers or proof of what was purchased. User categories remain authoritative. The pack and licence notices are bundled locally; no lookup API or new data transmission is introduced. See `MERCHANT-SOURCES.md` for the pinned dataset, attribution, primary evidence and modifications.


## Guided exploration (November 2026)

The existing visual theme and local-only import/report engine are retained. Five steps show Import, Review, Your situation, Your snapshot and Action plan. Imported data unlocks review/context; a generated report unlocks snapshot/plan. Steps preserve their fields in memory. Secondary household and debt fields are expandable.

The review and report pies open a category, then a matched merchant, then optional transaction selections. Keyboard controls and equivalent legend buttons are supported. Refunds reduce net cost; income, investments, transfers and excluded rows stay out of spending scenarios. The category list initially shows six entries with the remainder expandable.

New modules:

- `journey.js`: step navigation and report/plan/full-report views.
- `explore-engine.js`: pure selection, work-time, annual cost, cashback, reduction, emergency and lump-sum growth calculations.
- `explore-ui.js`: optional analyses, context-specific buttons, temporary pay assumptions and explicit action saving.
- `explore.css`: responsive explorer and step styles using the existing book theme.

Work-time inputs use gross hourly pay and an entered combined deduction rate. Imported spending already includes charged sales tax. Annualisation requires explicit recurrence. Cashback compares 1%, 2% and 3% as alternatives after entered additional costs, and requires an eligibility check. Annual quotes use the existing price/renewal/upfront-cash comparison. Emergency scenarios hold cash fixed while reducing a confirmed essential budget. Growth is a one-time amount with an explicit hypothetical return, excluding tax, fees and inflation.

Survival Budget, Mortgage Prepayment and Statement Calendar open as separate existing tools; the selected amount/date remain visible in the explorer for reference. No transaction data is put in URLs or transferred to those tools. Four-pillar guidance and Tap vs Leak reflection are available inside the explorer.

### Feature preservation

- CSV/OFX/QFX/QBO import, mapping, currency/coverage gates, merchant attribution, transaction editing and recognition flags remain.
- Monthly comparisons, income/spending/investment/cash movement, tax and benefit questions, medical/donation record checks and the full four-pillar table remain in the supporting report.
- Emergency 3/6/12-month visuals, custom duration, entered balances/budget and the wider emergency-system notes remain.
- Annual-payment comparisons, debt checks, improvement fields, action notes/status/review dates, earlier-plan loading/comparison and downloads remain.
- Full-report display, text export and print reveal all supporting report sections; the temporary explorer is not part of the report. Save its chosen conclusions to the action plan first.
- Editing input data marks an old report stale, disables downloads and closes any scenario based on the old data. Generating a demo or clearing the session clears temporary explorer assumptions.

Exploration never changes the main report numbers. An explicit Add to my plan action saves notes and an optional expected monthly change. Positive estimates based on overlapping transaction selections in the same period are rejected; the user must retain one combined estimate or save the second action without an amount. Other overlapping estimates require the user's review. Selection metadata is optional in the existing version-1 plan format, preserving compatibility with earlier plan files. Saved actions survive report rebuilds, and are included in plan JSON and report text.

Validation: `node --test apps/financial-reset/tests/*.test.cjs` (99 checks). Includes pure calculations, selection/refund handling, controller consent flow, plan compatibility/overlap and five-step state transitions. Browser layout and end-to-end interaction verification were unavailable because the managed browser and native input providers failed; controller tests do not substitute for that visual verification.
