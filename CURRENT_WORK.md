# Current work checkpoint

This file is the crash-recovery record. Update, commit, and push it continuously while working. Another assistant must be able to continue without access to the previous chat.

## Task

- GitHub issue: None yet (repo not published to GitHub yet)
- Branch: `main`
- Pull request: None
- Current assistant: Claude
- Last checkpoint date and time: 2026-09-07
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
- Owner said the store also sells grocery + kitchen items and asked for more category icons. Expanded `CATICON`/`CATCODE` (in `index.html` and `source/app.js`) from 11 to 25 categories: added Produce, Frozen, Spices & Seasoning, Snacks, Tea & Coffee, Pasta & Noodles, Eggs, Nuts & Dried Fruits, Condiments & Sauces, Seafood, Household & Cleaning, Kitchenware & Cookware, Personal Care, and Paper & Disposables (each with an emoji + 2 colors + a 3-letter SKU code), and gave the 4 categories that already had an icon but no SKU code (Sweets, Dairy, Meat, Bakery) a proper code too. Any category name still not in the list falls back to the existing generic 📦 box icon — that fallback behavior itself was not changed. Verified with `node --check` and a headless-browser reload (25/25 categories resolve, `SHOW_PRICING` still false, no new console errors). Republished the Artifact preview with the same changes.

- Owner felt the emoji icons looked informal ("just icons in messages") and asked for a more modern main-menu UI. Sent preview-only mockups first (per explicit "don't apply right away" instruction): an emoji-based main-menu icon set, then — after the owner rejected emoji as not "real" icons — a hand-designed inline-SVG line-icon set (Lucide/Feather style: `viewBox 0 0 24 24`, `stroke=currentColor`, `stroke-width=2`, rounded caps/joins) for the 12 main-menu buttons, and matching SVG line icons for all 25 category icons. Caught and fixed 6 ambiguous/near-duplicate category icon designs (Flour, Dairy, Meat, Snacks, Condiments & Sauces, Paper & Disposables) via Playwright screenshot review before sending the final preview. Owner approved both sets and said "apply changes".
- Applied both icon sets for real: `CATICON` in `index.html` and `source/app.js` now holds inline SVG markup (still `['<svg…>', '#bg', '#fg']` triples, so `catIcon`/`icoCat` needed no code changes) instead of emoji for all 25 categories, and all 12 main-menu buttons in `index.html` and `source/markup.html` now render inline SVG instead of emoji/HTML-entity glyphs. Icons use `width="1em" height="1em"` + `currentColor` so they inherit size/color from each button's existing CSS — no new styling needed. No external icon font or CDN dependency (kept fully offline-safe for the Apps Script deployment target). Committed as `06b68ca`. Verified via Playwright: 25 CATICON entries and 12 menu buttons render as `<svg>` (37 total), `SHOW_PRICING` still `false`, no new console errors, `node --check` passed. Republished the Artifact preview with the same changes so the owner can test on phone/web.

- Owner clarified he loves the mobile layout but wanted the desktop/computer-width UI improved specifically, and pointed out that Stock's filters (search + 3 dropdowns) sat stacked on top of the list, leaving little room for products on a wide window — asked for filters on the left and products in the big space on the right. Investigated `source/styles.css` and found an existing but incomplete responsive system (breakpoints at 700/1100/1500px) plus a later "operational data stays in one vertical lane" rule that force-collapsed every list (`#stk-list`, `#mv-list`, `#rc-list`, `#pd-list`, `#aj-list`, `#at-list`, etc.) to a single full-width column at 700px+, which was the root cause.
- Added a new `@media (min-width:1100px)` rule set (source/styles.css, mirrored in index.html's inline `<style>`) that turns the `.sticky` filter panel into a fixed 246px left rail and gives the list a real multi-column grid in the space that opens up, for Stock, New movement, Receive, Stock count and Products. New movement and Receive keep their basket/delivery side panel by reserving the same right-hand gutter they already used. Removed `#s-receive` from an old rule that capped it to 640px centered (it needs full width now). Split lists into two treatments: simple cards (Stock, Products, Stock count) get a 2-up (3-up at 1500px+) card grid; cards with a full quantity stepper (New movement, Receive) stay one per row until 1500px+ since the stepper needs the width. Reverted the old single-lane "document row" `.c-info` grid for Move and Products back to a plain stacked layout so cards stay legible at grid width. Worked around a couple of specificity/inline-style traps found along the way: a legacy `#s-move #mv-list` two-ID rule that kept forcing the list back into the sidebar's column, and `renderReceive()` setting `rc-list.style.display` inline (needed `!important` in CSS to win back `display:grid`).
- Verified with Playwright screenshots at 1440px (Stock, New movement, Receive incl. its New-product form, Stock count, Products, Attention) and confirmed phones (390px) and the 700–1099px tablet range render byte-for-byte the same as before — the new rule only fires at 1100px+. History and Prices screens were intentionally left untouched (Prices is unreachable dead code since `SHOW_PRICING=false`; History's dense per-row layout wasn't part of the complaint). Committed as `72e5ec6`. Republished the Artifact preview with the same changes.
- Owner tried it and didn't like it ("lets get back to previous one") — reverted `index.html` and `source/styles.css` to the commit right before this change (`849a3b1`) with `git checkout 849a3b1 -- index.html source/styles.css`, committed as a revert, and republished the Artifact preview with the pre-sidebar content. Net effect: the desktop UI is back to the plain scaled-up phone layout (filters on top, single-lane lists) exactly as it was after the icon-conversion pass. No further desktop-specific layout changes are in place; if the owner wants desktop tweaks again later, don't reuse this sidebar approach without checking what specifically he didn't like about it first.

- Owner asked specifically to shrink the filter bar on Movement history and Receive stock, since the stacked filter rows were leaving very little room for the product/movement list above the fold (no "desktop-only" qualifier this time - meant to help mobile too, which is the owner's daily-use surface). Designed a progressive-disclosure "Filters" pattern instead of removing anything: kept the primary search input (and, on Receive, the required Supplier/Delivery-note fields, compacted into one row since they're delivery metadata, not filters) always visible, and moved the true list-filtering controls - History's type/customer, date range, product/brand; Receive's category/brand - behind a small icon button next to search that expands a panel on tap, with a badge showing how many filters are currently active. Applied with no media query, so it helps phones and desktop alike.
  - History: 5 stacked rows -> 2 rows collapsed / 3 expanded.
  - Receive: up to 6 stacked rows -> 3 rows collapsed / 4 expanded.
  - New `wireFilterToggle()` helper in `source/app.js` (called once per screen) wires the toggle button, the badge count, and expand/collapse; new `.filtbtn`/`.filtbadge`/`.filterpanel` CSS in `source/styles.css`. Had to add an explicit `.filtbadge[hidden]{display:none}` rule - the badge's own `display:flex` class rule was beating the browser's default `[hidden]` styling and showing a "0" badge at rest.
  - Verified with Playwright at 390px (collapsed/expanded/badge-active states for both screens, plus a tab-switch on Receive between Existing/New product to confirm the panel and badge state survive it) and spot-checked 1440px. No console errors, no regressions on Stock/Products/Adjust.
  - Noticed a pre-existing, unrelated bug while there: at 1440px the Receive screen's floating `rdock` ("Nothing added / Review delivery") panel visually overlaps the Scan/Filters buttons - confirmed via a baseline screenshot that this predates this change (present since before the sidebar revert). Left untouched, given the owner's recent rejection of desktop-layout changes; flag it if he wants it fixed separately.
  - Committed as `831b013`. Republished the Artifact preview with the same changes.

- Owner tried the collapsible "Filters" toggle and asked to undo the hiding: keep every filter unhidden, just pack 3-4 related ones per row instead of 1-2 so they take less vertical space. Reworked both screens again:
  - History: type/customer/product/brand (all plain `<select>` filters) now share one row of 4; the from/to date range kept its own row since date-picker inputs are a different control type and read better paired together than mixed in with selects. That's 2 filter rows total (was 3 rows of 2 before the toggle experiment, 2 rows collapsed/hidden during it). Added a `.frow-4` CSS variant (smaller font/padding + `text-overflow:ellipsis`) so four selects still read cleanly at phone width - verified the ellipsis actually kicks in for a long label like "All invoice parties".
  - Receive: dropped the filter toggle button/badge entirely; category+brand are back to a plain always-visible row. Kept the supplier + delivery-note combined-into-one-row change from two commits ago, since that pairing (delivery metadata, not filters) already worked well and wasn't part of the complaint.
  - Removed `wireFilterToggle()` from `source/app.js` and the `.filtbtn`/`.filtbadge`/`.filterpanel` CSS added for the toggle, since nothing is hidden anymore - net diff for this commit is negative (deletions > insertions).
  - Verified with Playwright at 390px (filters visibly set and still functioning: History 84/133, Receive 38/91) and 1440px (4-select row still reads fine with the extra width). No console errors, no regressions on Stock.
  - Committed as `fe549b4`. Republished the Artifact preview with the same changes.

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
