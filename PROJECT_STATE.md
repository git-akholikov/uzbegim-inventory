# Project state

Last updated: 2026-09-06

## Current objective

Prototype a simple inventory-only warehouse web app that will later use Google Apps Script and Google Sheets/Drive.

## Current working version

- Main file: `index.html`
- Runs by opening the HTML file directly
- Responsive on phones and computers
- No deployment yet
- Multi-assistant recovery files are included for future GitHub collaboration
- Apps Script skeleton (`apps-script/Code.gs`, `apps-script/appsscript.json`) added; not yet connected to Google Sheets

## Access model

- Worker: Daily Work and Records
- Manager: Daily Work, Records, and Manager controls
- Workers may view movement records

## Current product decisions

- Inventory only for the first version — this is a deliberate, confirmed decision, not a placeholder
- Pricing, cost, margin, markup, profit, revenue, and invoice tools are excluded entirely from v1 (data, interface, and reports)
- No horizontal category chooser; use dropdown filters
- Inventory Report supports 7 days, 30 days, and From/To dates
- Movement History uses product and brand filters instead of Group By
- Customers and suppliers are managed in one area with separate tabs
- Customer stock-out and internal transfers remain separate movement types

## Future direction (do not build this now — design so it stays possible)

The owner wants a later version that reintroduces per-customer pricing (each wholesale customer has its own rate per product) without a rework of the inventory core. To keep that easy later:

- Keep the Movements ledger price-free: date, quantity, product, movement type, customer/destination (for stock-out), who moved it, staff. No price or amount fields on movements in v1.
- When pricing returns, add it as a separate lookup (e.g. a Pricing sheet keyed by customer + product + rate) joined at reporting time — not as new columns bolted onto Movements.
- Keep a stable product identifier (SKU/ID) and a stable customer identifier now, even though v1 has no pricing UI, so a future Pricing sheet can key off them without renaming anything.
- Do not name variables, sheet columns, or UI labels in a way that assumes "no price ever" (e.g. avoid removing customer identifiers entirely) — assume pricing comes back later and avoid decisions that would need undoing.

## Known prototype limitations

- Data is sample in-browser data and resets when the page reloads
- Authentication and role detection are simulated
- Google Sheets/Drive persistence is not connected
- Language buttons are visual placeholders
- Barcode scanning depends on browser camera support

## Next recommended milestone

Split the standalone prototype into Google Apps Script files and connect inventory records to Google Sheets while preserving the same interface and role rules. See "Future direction" above for how to keep the schema pricing-ready without adding pricing now.

## Active task

None. Create or claim an item in `TASKS.md` and a matching GitHub issue before starting.

Active implementation details belong in `CURRENT_WORK.md`, not in this file. This file contains durable product decisions only.

## Last verification

- The standalone JavaScript syntax was validated after the latest inventory-report and history-filter changes.
- Multi-assistant instructions were checked for continuous checkpoint and recovery consistency.
