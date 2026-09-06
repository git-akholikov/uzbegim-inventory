# Project state

Last updated: 2026-09-06

## Current objective

Prototype a simple inventory-only warehouse web app that will later use Google Apps Script and Google Sheets/Drive.

## Current working version

- Main file: `index.html` (self-contained, double-click to open)
- Split source also kept in `source/` (`markup.html`, `styles.css`, `app.js`, `data.js`) for editing — `index.html` is the one to actually open/test, `source/` is for making changes
- Responsive on phones and computers
- No deployment yet
- Multi-assistant recovery files are included for future GitHub collaboration
- Apps Script skeleton (`apps-script/Code.gs`, `apps-script/appsscript.json`) added; not yet connected to Google Sheets
- Carries the owner's real 91-product catalog (brand, flavor, category, units per box, current box counts) and real movement history, not placeholder sample data
- Pricing is present in the underlying data (existing product cost/price, a customer price-multiplier table, historical invoice amounts) but is switched off everywhere in the UI via a `SHOW_PRICING = false` flag in `source/data.js` — flip it to `true` to bring pricing screens/PDF columns back later. See "Future direction" below.

## Access model

- Worker: Daily Work and Records
- Manager: Daily Work, Records, and Manager controls
- Workers may view movement records

## Current product decisions

- Inventory only for the first version — this is a deliberate, confirmed decision, not a placeholder
- Pricing, cost, margin, markup, profit, revenue, and invoice tools are excluded entirely from v1's visible interface (verified screen by screen: Dashboard, Stock, Move, Receive, Products incl. edit screen, History incl. detail, Stats/Inventory report, and the PDF receipt/invoice/transfer note all show zero pricing with `SHOW_PRICING=false`)
- No horizontal category chooser; use dropdown filters
- Inventory Report supports 7 days, 30 days, and From/To dates
- Movement History uses product and brand filters instead of Group By
- Customers and suppliers are managed in one area with separate tabs
- Customer stock-out and internal transfers remain separate movement types

## Future direction (do not build this now — design so it stays possible)

The owner wants a later version that reintroduces per-customer pricing (each wholesale customer has its own rate per product) without a rework of the inventory core. The existing `index.html`/`source/data.js` already has real cost/price per product and a per-customer price-multiplier table (`CUSTPRICE`) built in from a previous version — none of it was deleted, it's just switched off:

- `SHOW_PRICING = false` at the top of `source/data.js` hides the Prices/cost screen, the New Product and Edit Product cost/price fields, the PDF's PRICE/BOX and TOTAL columns, and the revenue-based sort/sizing in grouped History views. Set it to `true` to restore all of it — the underlying data was never removed.
- The Google Sheets side (`apps-script/SHEETS-SCHEMA.md`) keeps the Movements ledger price-free by design; when pricing returns there, add it as a separate Pricing sheet keyed by customer + product, joined at reporting time — not as new columns on Movements.
- Keep a stable product identifier (SKU) and a stable customer identifier, since both the JS `CUSTPRICE` table and any future Pricing sheet key off them.

## Known prototype limitations

- Data is real product/catalog data pulled from the owner's existing app; movement history includes older sample-like records with pricing that is simply not displayed (see Future direction)
- Authentication and role detection are simulated
- Google Sheets/Drive persistence is not connected
- Language buttons are visual placeholders
- Barcode scanning depends on browser camera support, and its library (loaded from unpkg) won't load inside the sandboxed Artifact preview — it works fine when the owner opens `index.html` in a real browser with internet access

## Next recommended milestone

Split the standalone prototype into Google Apps Script files and connect inventory records to Google Sheets while preserving the same interface and role rules. See "Future direction" above for how to keep the schema pricing-ready without adding pricing now.

## Active task

None. Create or claim an item in `TASKS.md` and a matching GitHub issue before starting.

Active implementation details belong in `CURRENT_WORK.md`, not in this file. This file contains durable product decisions only.

## Last verification

- Loaded the edited `index.html` in a headless browser and clicked through Dashboard, Stock, Move, Receive, Products (list + edit), History (list + detail), and Stats: zero "$" text visible anywhere, `SHOW_PRICING` reads `false`, zero console/page errors introduced by the edit (the only failed requests were the two external CDN libraries, blocked by this sandbox's network, not by the edit).
- Verified the Google Sheets workbook recalculates cleanly (LibreOffice: 0 errors, 1600 formulas) with the real 91-product catalog and today's opening stock counts loaded.
