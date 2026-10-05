# Book companion games

Financial Life uses the chapter 1 manuscript amounts (pages 20–24). `assets/life-engine.js` contains the rules separately from the interface. Annual timing conventions are shown in the game’s rules panel. The simplified total is educational, not financial accounting.

Snakes & Ladders preserves the 11-column, 8-row serpentine board, snakes, ladders, and exact-roll finish at 88. The illustrated board and original `board.png` are selectable themes. All cells, paths and the token use one coordinate model in `assets/board-geometry.js`.

## Replacing the board artwork

Choose “Change background & align the grid,” then upload matching 11 × 8 artwork. The image is read locally and retains its proportions. Enable the grid, then drag the pink handles along the top and left to fit each printed boundary. Handles also support arrow keys (0.2 percentage points; Shift for 1 point). Download the alignment JSON and load it alongside the same image in a later session. Image uploads and alignment are not saved automatically.

For a permanent replacement of `board.png`, update the `book` boundary percentages in `assets/board-geometry.js` with the downloaded JSON’s `x` and `y` arrays. Artwork must preserve the existing square numbering and event endpoints. An unrelated 10 × 10 board will not match these rules.

## Verification

Run `node games/tests/game.test.cjs` for manuscript amounts, recurring-cost durations and all board coordinates. Serve the repository with `python -m http.server 8001`, then run `python games/tests/browser.py` (requires Playwright and `/usr/bin/chromium`) for desktop/mobile gameplay, image/grid/token alignment, keyboard calibration, custom uploads, restart and legacy URL redirects.
