# True Cost of a Purchase

Browser-local educational app for the book's Understanding Actual Costs section. Linked from the homepage calculators area. No dependencies, network calls or storage.

Annual salary converts to hourly gross pay using entered paid hours/week and paid weeks/year. The price is before sales tax. Gross earnings required = price × (1 + sales-tax rate) ÷ (1 − combined effective income-tax/CPP/EI rates). The income-tax, CPP and EI components are calculated on gross earnings, not simply added as percentages of the item price. Working hours = gross earnings ÷ gross hourly wage.

Prefilled rates are expressly fictional editable assumptions. This is a flat-rate approximation, not Canadian tax-bracket or payroll legislation implementation. Exemptions, CPP/CPP2 and EI ceilings, Quebec QPP/QPIP and self-employment differences require appropriate assumptions. Effective annual rates and rates on additional earnings can differ. No official current rate is claimed.

Time blocks represent a workday by default and group multiple days when necessary; the last is fractional. Costs of ownership, financing, foregone returns and existing household obligations are excluded. These are work-time equivalents, not a forecast of saving time. Asset explanations are general category-level patterns rather than appreciation predictions or investment advice.

Run `node --test apps/true-cost/tests/engine.test.cjs`. With the repository served on port 8006, run `python apps/true-cost/tests/browser.py` (Playwright and Chromium). Override the server URL with `APP_TEST_URL`.
