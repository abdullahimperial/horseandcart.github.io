# Book companion games

These games follow Chapter 1 of the current *Let’s Fix Money* manuscript: Financial Life on pages 17–20 and Snakes & Ladders on pages 21–22. Fixed amounts are fictional teaching assumptions.

## Financial Life

`assets/life-engine.js` contains the rules separately from the interface. Keep one score. At each age, deduct any upfront cost, then apply annual amounts once. Negative scores are accumulated shortfalls without interest. Cash car purchases and home down payments require enough current funds.

- Annual career budgets at ages 23–65 are $44,000, $34,000, $29,000, $24,000, $19,000 or $14,000, plus $5,000 for college or $2,500 for trades. Taxes and unlisted living costs are already allowed for; listed costs are separate. Housing costs $24,000 annually at ages 23–36, replaced by the chosen housing path from 37.
- Car running/replacement allowances are $4,000 annually at ages 24–65, plus the purchase cost. New-car financing is $8,000 annually at ages 24–30. Transit is $1,500 annually.
- Child living costs are $8,000 per child annually at player ages 32–49. All children are born at player age 32.
- RESP contributions are $2,500 per child at ages 33–46, then $1,000 at 47 and stop: $36,000 plus $7,200 basic CESG funds a $43,200 education budget. Assume full basic 20% CESG eligibility, no previous contributions or grants, and no growth or other benefits. The contribution limit is $50,000 per child across all RESPs; grants and bonds do not count toward it.
- Without an RESP, deduct $43,200 per child once at player age 50. RESP users have no extra education deduction. Do not also add an RESP asset to the score.
- A fictional home costs $450,000. Pay the chosen down payment at 37, mortgage amounts at ages 37–61, and add $450,000 home value once at 62. Renters pay $24,000 annually at ages 37–65.
- Replay preserves the three dice results. Keep marriage and child count the same to compare money decisions; changing them produces a different family scenario.

The web game shows all six education and relationship outcomes, records the three die results at the finish, and states that paying for education without an RESP is an education cost, not a government penalty. Its choices and calculations match the manuscript; no extra game decisions are added.

## Snakes & Ladders

The board has 10 columns and 10 rows. Start at 1 and finish at 100 with an exact roll; an oversized roll leaves the token in place. Fixed routes take precedence where artwork overlaps a grid line. Square 7 automatically sends the player to 2; there is no destination chooser.

Snakes: 7 → 2; 18 → 4; 48 → 13; 67 → 46; 82 → 59.

Ladders: 5 → 16; 25 → 36; 44 → 57; 52 → 69; 64 → 77; 85 → 96.

All cells, paths and the token use `assets/board-geometry.js`. The current book artwork and a high-contrast grid are selectable themes. Custom artwork must have matching 10 × 10 numbering. Use “Change background & align the grid” to position boundaries and download/load alignment JSON. Uploaded images and alignment are local to the browser session.

## Verification

Run `node games/tests/game.test.cjs` from the repository root. Tests cover 144 matched RESP/non-RESP paths, career and training choices, annual cutoffs, car and mortgage totals, affordability, replay, UI rendering, all 100 cells, fixed routes, exact finish and restart. Browser visual review should also check desktop/mobile layouts and board alignment when browser access is available.

