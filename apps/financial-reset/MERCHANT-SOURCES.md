# Merchant sources and import formats

Money Snapshot uses local, editable categorization suggestions. No transaction data is sent to a merchant lookup service. There is no subscription or paid data dependency.

## Merchant names

53 curated entries are derived from the [Name Suggestion Index](https://nsi.guide/) (NSI), snapshot [b4e8deb6e95d0508f2bca9337d96f387d995622f](https://github.com/osmlab/name-suggestion-index/tree/b4e8deb6e95d0508f2bca9337d96f387d995622f), retrieved 8 November 2026. NSI is an open community-maintained index of brand names, geographic scope and identifiers. It is not an authoritative bank statement descriptor database.

The subset covers Canadian and relevant international grocery, fast-food, pharmacy, home-improvement and cinema brands. Each entry in `merchant-rules.js` retains the NSI identifier, brand Wikidata identifier when supplied, and source JSON path. The source files are:

- `data/brands/shop/supermarket.json`
- `data/brands/amenity/fast_food.json`
- `data/brands/amenity/pharmacy.json`
- `data/brands/shop/doityourself.json`
- `data/brands/amenity/cinema.json`

NSI material is distributed under the BSD 3-Clause licence. See [the retained copyright notice and full terms](LICENSE-merchant-data.txt). The source and its contributors do not endorse this app.

## How suggestions work

The app maintains its own mapping from these merchant types to spending categories, plus a few normalized spelling aliases. These category decisions are not classifications provided by NSI or the bank. Accents, punctuation and apostrophes are normalized, matches use word boundaries, and longer specific names are checked first. Costco Pharmacy and Costco Food Court therefore have different suggestions from the general retailer. Short ambiguous brands such as Metro and IGA are intentionally omitted from this sourced subset.

Explicit financial descriptions (card settlements, bank charges, investment movements and payroll) take precedence over merchant names. Existing keyword rules also remain available, including PC Express, Dollar Tree, school, INV and Edmonton taxes. INV remains a tentative investment clue because it can also be an invoice abbreviation. User category changes take precedence in calculations. A pharmacy or supermarket can sell items belonging to several categories; always review the actual purchase.

## Free bank file imports

The dependency-free reader supports OFX 1.x SGML and OFX 2.x XML, including bank-download QFX and QBO variants, alongside the existing CSV reader. It follows the [Financial Data Exchange OFX Banking Specification 2.3](https://financialdataexchange.org/common/Uploaded%20files/OFX%20files/OFX%20Banking%20Specification%20v2.3.pdf). Buying Microsoft Money, Quicken or QuickBooks is not required to read those exports here. QIF, IIF, accounting backups, investment/loan statements and non-CAD accounts are not supported.

- All processing occurs in browser memory, with the existing 5 MB and 10,000-record file limits.
- Select one card and one deposit account. Multi-account files require a selection when several compatible accounts are present.
- OFX amount signs determine direction for both account types. Posting dates retain the day written by the bank.
- Posted transactions are imported; pending records are counted and excluded. Only identical repeated FITIDs within the selected statement are omitted. Conflicting IDs and invalid rows block analysis. A transaction correction stream requires a fresh complete CSV export.
- The dated ledger balance can support the emergency cash illustration. Available balances and credit limits are not used. Card balances never count as cash. No per-transaction running balance is invented.
- Explicit bank transaction types can identify fees, interest, dividends and incoming card payments. Generic deposits and transfers do not automatically become income or internal transfers.
- OFX SIC values are preserved only as metadata. They are not treated as card-network merchant category codes (MCC).
- Currency conversion fields require a CAD CSV showing the settled amount. Unknown or malformed structures are rejected rather than silently changing the figures.

Bank-specific variants may need further compatibility work. The automated fixtures use fictional records; private development CSVs are not included in this repository. No live bank connection or institution-wide compatibility certification is claimed.

