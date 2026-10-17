# Website currency selection

The shared same-origin currency.js runs before app scripts. It chooses a currency from a known device time zone, then a browser region, with CAD fallback. This is an estimate of country, not geolocation. No IP lookup, exchange-rate call, location permission, or financial data transmission is used. Manual selection is stored in localStorage as lfm-currency; Automatic removes the override. Invalid/stale preferences and unavailable storage are handled safely.

Currency changes interpret unchanged editable scenario numbers in the chosen units; they do not perform FX conversion. Fixed book slides, quizzes and game amounts remain CAD. Generic course worksheets use the selected currency; Canadian registered-account worksheets remain CAD. Financial Reset remains CAD-only and still rejects non-CAD CSVs, preserving transaction/accounting integrity and Canadian guidance. True Cost keeps its editable Canadian CPP/EI/tax model and says so explicitly.

Run node --test assets/tests/currency.test.cjs and serve the repository before running assets/tests/currency-browser.py.
