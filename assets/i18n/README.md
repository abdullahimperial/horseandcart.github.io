# English and Urdu website

English is the source language and the first-visit default. Every public page loads the shared language control, the edited Urdu copy in `ur.js`, and RTL styles. Visitors can switch at the top of the page without losing entered values; `?lang=ur` and `?lang=en` work on any page and override the stored preference.

The Urdu copy follows the professionally edited Urdu manuscript of **آئیے پیسے کے معاملات سنواریں** by Abdullah Mohiuddin. It covers the site, all nine course modules, activities, games, calculators, checklists, Money Snapshot and generated human-readable exports. Proper names, banking identifiers, raw transaction descriptions, user notes and machine-readable plan files retain their original values. External websites and existing videos retain their original language.

## Maintaining copy

- Add exact English text and its edited Urdu counterpart to `ur.js`. Whitespace is normalized for lookup.
- Dynamic messages use `{{0}}`, `{{1}}`, etc. Preserve every placeholder, figure, currency and qualification. Patterns translate the presentation only; calculation engines stay language-neutral.
- Use `window.LFM.t(text)` for canvas text and authored plain-text exports. DOM text and accessibility attributes update automatically, including after renderers insert new results.
- Mark raw/user data with `translate="no"` or `data-lfm-private`. Editable values are never translated. Options without explicit values have their original values frozen before their display text changes.
- `window.LFM.source(element)` returns source labels where older presentation code needs them. Prefer stable data attributes for application logic.
- Listen for `lfmlanguagechange` only where redraw is needed (canvas, date formatting, search). Use `window.LFM.refresh()` before synchronous exports/printing.
- Urdu uses locally hosted Noto Naskh Arabic, with the font copyright and SIL Open Font License in `FONT-LICENSE.txt`. Numeric inputs, charts and equations keep their appropriate direction.

Run `node --test assets/i18n/tests/i18n.test.cjs`, the existing engine tests, and check the changed screens in both languages. Keep `ur.js` before `i18n.js` when adding a page. Update the language asset query version after a release.
