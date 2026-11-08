# Merchant sources and import formats

Money Snapshot uses local, editable categorization suggestions. No transaction data is sent to a merchant lookup service. There is no subscription or paid data dependency.

## Merchant names

The original 53 curated entries are derived from the [Name Suggestion Index](https://nsi.guide/) (NSI), snapshot [b4e8deb6e95d0508f2bca9337d96f387d995622f](https://github.com/osmlab/name-suggestion-index/tree/b4e8deb6e95d0508f2bca9337d96f387d995622f), retrieved 7 November 2026 (Edmonton). NSI is an open community-maintained index of brand names, geographic scope and identifiers. It is not an authoritative bank statement descriptor database.

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

## Expanded research and curated subset (7 November 2026, Edmonton)

The current pack contains **122 merchant and service entries**: the 53 NSI entries described above, 57 entries adapted from Merchant Studio, and 12 independently researched entries supported by official merchant/organization websites. Identifiers in this app identify its matching rules or the source dataset; they are **not bank-issued merchant IDs, transaction MCCs, or proof of payment purpose**.

### Merchant Studio

**[Enrichment from Merchant Studio by Jonathan Taveras](https://github.com/jtvargas/merchant-studio)**

The dataset is licensed under **CC BY 4.0**, separately from the application's MIT code licence. The data licence and disclaimer are retained in [LICENSE-merchant-studio.txt](LICENSE-merchant-studio.txt). Adapted material is identified in `merchant-extra.js` and remains subject to those attribution terms. Neither source endorses this app.

Source: [data/merchant_aliases.json at 4f495fbc63a89c9ed8b9faac318d4826e29508d8](https://github.com/jtvargas/merchant-studio/blob/4f495fbc63a89c9ed8b9faac318d4826e29508d8/data/merchant_aliases.json). The researched snapshot contains 2,912 entries and 13,946 aliases. The app bundles a reviewed **57-entry subset**, rather than loading the full database or sending transactions to its public API. There are no remote lookups.

Changes to the source subset:

- Map the source taxonomy into Money Snapshot's existing categories. This app owns these category decisions.
- Separate rides, food delivery and membership fees. The source's DoorDash aliases included DashPass in food/dining; official DoorDash evidence supports a separate subscription rule.
- Remove ambiguous short aliases, such as BK and EB, and avoid generic brand strings such as Subway, Gap and Enterprise that could name another type of purchase.
- Preserve negative aliases and meaningful plus signs. Use bounded name matches and longest matching aliases. Specific departments such as Costco Pharmacy, Food Court, Optical and Gasoline take precedence over the generic retailer.
- Permit a narrowly scoped DoorDash prefix to recognize bank descriptors that join the platform and restaurant names without spaces. This remains an app-maintained descriptor rule, not a guarantee from the bank.
- Leave money-transfer providers and generic bank payments in Other until their purpose is established. Identifying BMO or MoneyGram is not evidence of an internal transfer, debt payment or family-support payment.
- Do not assume all Apple billing is a subscription. Apple's documentation says that the descriptor can cover different purchase types. Separate explicit ChatGPT subscriptions from generic OpenAI/API charges.
- Mark explicit ride-platform authorization-hold wording for review. Do not silently delete a CSV row or decide its posted status from a name alone. OFX pending records continue to use the structured pending/posted distinction.
- Preserve explicit financial context such as salary, card settlement and bank fees ahead of merchant-based categories. Retain source identity metadata independently of that category choice.

### Official name and service evidence

These entries use factual names and independently written matching/category rules. The linked pages substantiate the organization or service, not every bank's abbreviated descriptor. Abbreviations such as CI INV SERVICES or COE EDMTAXES are app-maintained suggestions and remain reviewable.

| Entry | Evidence |
| --- | --- |
| DoorDash DashPass | [Official source](https://help.doordash.com/en-ca/consumers/article/what-is-dashpass) |
| Uber One | [Official source](https://help.uber.com/riders/article/what-is-uber-one?nodeId=301585b0-ff5b-4612-b6e8-07bf4126c833) |
| ChatGPT | [Official source](https://help.openai.com/en/articles/9039756-managing-billing-for-chatgpt-and-the-api-platform) |
| Apple billing | [Official source](https://support.apple.com/en-ca/120164) |
| PC Express | [Official source](https://www.pcexpress.ca/social) |
| PC Express Pass | [Official source](https://www.realcanadiansuperstore.ca/en/pc-express-pass-signup) |
| H&W Produce | [Official source](https://handwproduce.com/) |
| TELUS | [Official source](https://www.telus.com/en/support/article/how-to-pay-your-bill) |
| CI Investment Services | [Official source](https://www.cifinancial.com/ci-is/ca/en/about-us.html) |
| TD Waterhouse / TD Direct Investing | [Official source](https://www.td.com/ca/en/investing/direct-investing/direct-investing-vs-easytrade) |
| City of Edmonton property taxes | [Official source](https://www.edmonton.ca/residential_neighbourhoods/property-taxes) |
| Costco Gasoline | [Official source](https://www.costco.ca/w/-/ab/edmonton/154) |

Additional checks: [BMO's legal identity](https://www.bmo.com/en-ca/main/personal/legal/), [MoneyGram's transfer services](https://www.moneygram.com/ca/en), and [Lyft's authorization explanation](https://help.lyft.com/hc/en-us/all/articles/115012926167-Temporary-authorizations).

### Other sources researched

Large synthetic transaction datasets and open classifier repositories were reviewed as alternatives. [The transaction-classification project](https://github.com/gbadedata/transaction-classification) explicitly notes unverified provenance for its training data. [The FCS project](https://github.com/varchar-io/fcs) describes a server/model workflow using real training transactions. Neither dataset nor model was incorporated. They do not supply the same small, auditable, locally executed lookup needed here.

The final pack does not claim universal coverage or measured accuracy across banks. A sourced name match and a correct category are different measurements. Names, balances, directions and category edits from imported files are not sent to the sources, and private examples are not published as fixtures.


