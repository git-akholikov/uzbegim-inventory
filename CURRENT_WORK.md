# Current work checkpoint

This file is the crash-recovery record. Update, commit, and push it continuously while working. Another assistant must be able to continue without access to the previous chat.

## Task

- GitHub issue: None yet (repo not published to GitHub yet)
- Branch: `main`
- Pull request: None
- Current assistant: Claude
- Last checkpoint date and time: 2026-09-06
- Checkpoint commit: this commit

## Requested outcome

Owner uploaded their own `Warehouse_Inventory_v16_1.xlsx` (a mature, pre-existing Excel inventory system with 91 real products) to answer "where is my product list", and asked to pull whatever's needed into the Sheets workbook, strip pricing out of the actual app entirely, and send back a runnable HTML he can test on phone and web.

## Completed and pushed

- Discovered `index.html` already contained the owner's real 91-product catalog and real movement history (with cost/price fields) baked in from an earlier version — not placeholder sample data as the docs previously implied.
- Audited every reachable screen for live pricing: Dashboard, Stock, Move, Receive, New/Edit Product, Customers/Suppliers, History (list + detail), and Stats were already price-free (a previous session had already hidden the New/Edit Product cost/price fields via `display:none` and disconnected the "Prices and cost" screen from navigation, and new movements already hardcode price/cost to 0). The two remaining live pricing surfaces were `buildPDF()`'s PRICE/BOX and TOTAL columns (would show real $ for old historical records) and `drawGrouped()`'s revenue-based sort/bar-sizing in grouped History views.
- Added `SHOW_PRICING = false` as a single flag (top of `source/data.js`) and gated both of those surfaces on it, without deleting any pricing data or logic — flipping it to `true` later restores the fuller version, per the owner's explicit ask to keep that easy.
- Verified in a headless browser: clicked through every screen, confirmed zero "$" text visible anywhere and zero console/page errors introduced (only the two external CDN library loads fail, which is this sandbox's network, not the edit).
- Split the app into `source/markup.html`, `source/styles.css`, `source/app.js`, `source/data.js` (data = the product/history/pricing data blob, app.js = all logic) and kept `index.html` as the single-file bundled version for actually opening/testing.
- Regenerated `apps-script/uzbegim-warehouse-inventory.xlsx`: Products tab now has all 91 real SKUs (brand, flavor, unit, category, units per box, min boxes, supplier where known), Suppliers has the 4 real suppliers found in the data, Movements has one opening-balance row per product with today's real box count plus a few labeled example rows. Recalculated clean (0 errors, 1600 formulas).
- Delivered `index.html`, the 4 `source/` files, and the updated workbook to the owner, and published a live phone/web preview as an Artifact (barcode scanning won't load there — unpkg is blocked by the preview's sandbox — but everything else works; it works fully when the owner opens the real `index.html`).
- Updated `PROJECT_STATE.md` and `apps-script/SHEETS-SCHEMA.md` to describe the flag, the real catalog, and the future-pricing pattern.

## In progress

Nothing in progress. Waiting on the owner to test the app on phone/web and report back, and to upload the workbook to Google Drive when ready.

## Exact next action

Once the owner confirms the app looks right and has uploaded the workbook to Google Drive/Sheets, get the resulting Spreadsheet ID and start implementing `apps-script/Code.gs` functions that read/write the Products and Movements tabs per `apps-script/SHEETS-SCHEMA.md`, enforcing roles server-side via the Staff tab.

## Files changed in this task

- `index.html`, `source/markup.html`, `source/styles.css`, `source/app.js`, `source/data.js` (new split)
- `apps-script/uzbegim-warehouse-inventory.xlsx` (real catalog + opening balances)
- `PROJECT_STATE.md`, `apps-script/SHEETS-SCHEMA.md`, `CURRENT_WORK.md`

## Verification completed

- Headless-browser click-through of every screen: 0 visible "$" anywhere, `SHOW_PRICING` reads `false`, `node --check` passed on the edited script, 0 new console/page errors.
- Workbook recalculated with LibreOffice: 0 errors, 1600 formulas; spot-checked BEV-MOX-001's computed stock (opening 36 + example movements = 39, correctly flagged REORDER against its min of 40).

## Errors, risks, or decisions needed

- The app's historical `HISTORY` data still contains real-looking price/cost figures internally (never deleted, per the "keep it easy to bring back" instruction) — anyone reading `source/data.js` directly will see them even though the UI never displays them. Not a UI bug, just worth knowing before sharing that file outside the owner.
- Barcode scanning needs a real browser with internet access (unpkg is blocked in the sandboxed Artifact preview) — not an issue on the owner's own phone/computer.
