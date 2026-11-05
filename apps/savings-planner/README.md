# Four Pillars Savings Planner

A browser-only planning table with 15 prefilled expense categories and 120 expanded ideas inspired by the book's saving framework. Suggestions cover Remove leakages, Reduce living costs, Benefits & free resources, and Mindset & strategies. Users can filter categories, add categories and their own ideas, select suggestions, and edit concrete actions with owners, deadlines, review dates and notes.

Up to three active actions may be priorities. Removing an action retains its draft in memory; Undo/reselection cannot bypass the three-priority limit. Other selected actions remain in the plan for later. No entries are uploaded or stored. Reloading clears the plan; the site's independent currency preference may persist.

## Financial estimates

Amounts are optional and represent recurring monthly changes, not guaranteed savings. Expense reductions can use an explicit estimate or current cost minus target cost. Additional support requires an explicit amount; benefits, grants and tax-credit opportunities start unclassified. Non-monetary, unclassified and dropped actions do not inflate totals. Multiple estimates for one category trigger an overlap reminder, and combined totals require an explicit no-overlap/recurrence confirmation. Financial edits or currency changes clear that confirmation. Recorded actual amounts are separately self-reported. Negative improvements remain negative; invalid costs prevent export.

## PDF and printing

`pdf.js` creates real PDF 1.4 documents locally without dependencies or external requests. The personal plan includes priorities, later actions, estimates, cautions and notes. The blank landscape worksheet includes all categories, prompts across four pillars, writing space and a three-action worksheet (four pages for the default 15 categories).

PDF pages use compressed canvas images so browser fonts can render Unicode and currency symbols. Their text is not selectable. The separate **Print my plan** view provides accessible/selectable HTML text and can be saved as a text PDF through the browser. Large plans paginate, and canvases are compressed one page at a time.

## Verification

Serve the repository with Python and run:

```
node --test apps/savings-planner/tests/engine.test.cjs
APP_TEST_URL=http://localhost:8040 python apps/savings-planner/tests/browser.py
```

The browser suite requires Playwright/Chromium and PyMuPDF. It verifies selections, edits, priority limits and Undo, estimates/overlap, currency-state preservation, safe text, real PDF download/geometry, browser printing, custom categories and mobile layout.
