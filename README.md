# Horse & Cart — Personal Finance Story companion

Static book companion for Abdullah Mohiuddin's *Personal Finance Story: From Fighting Affordability to Generational Wealth*. No build step or package installation is required. Serve the repository root with `python -m http.server 8010`.

## Website journey

- `index.html`: homepage with book, course and tool entry points.
- `start-here.html`: guided route through understanding, saving, resilience, preservation, growth, transfer and giving.
- `tools.html`: directory of the CSV Financial Reset app, True Cost of a Purchase, Money Spiral, Sink vs. Tap, mortgage calculator and two games.
- `book.html` / `about.html`: book overview, purchase/video placeholders and author/project context drawn from the manuscript.
- `workshops.html` / `contact.html`: proposed pilot outline and a local inquiry-draft form. The form does **not** send or store messages; copy/download works in the browser. Public email and booking details are not configured.
- `course/`: nine modules with visual lessons, workshops, local workbook notes and relevant tool links. Tools link back to the lessons.

All canonical pages use `assets/site-shell.css` and the shared website header/footer markup. Standalone website pages use `assets/companion.css`. Keep relative paths correct when updating shared navigation in pages at different directory depths. The under-construction/simulation banner remains visible everywhere.

## Publishing actual contact destinations

Replace the labeled placeholders on `book.html` with the author's purchase and YouTube URLs. Add the verified public email or booking link to `contact.html`. Sending the inquiry form requires a separately configured endpoint or email workflow; do not label local draft generation as submission. No financial statements should be collected through the contact form.

## Checks

```sh
node --test apps/financial-reset/tests/*.test.cjs apps/true-cost/tests/engine.test.cjs
node games/tests/game.test.cjs
SITE_TEST_URL=http://localhost:8010 python tests/site-browser.py
APP_TEST_URL=http://localhost:8010 python apps/financial-reset/tests/report-browser.py
APP_TEST_URL=http://localhost:8010 python apps/true-cost/tests/browser.py
APP_TEST_URL=http://localhost:8010 python games/tests/browser.py
```

Browser checks require Playwright and `/usr/bin/chromium`. The website suite checks local destinations, desktop/mobile navigation, layout, course connections and the inquiry-draft flow. Individual app directories document their calculation assumptions and privacy behavior.
