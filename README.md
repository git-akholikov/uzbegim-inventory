# Uzbegim Inventory

Mobile- and desktop-friendly warehouse inventory app for Uzbegim Food Market.

**Live app:** https://git-akholikov.github.io/uzbegim-inventory/ — installable
as a PWA (open the link on a phone, then "Add to Home Screen").

## Open it locally

Open `index.html` in a browser. No installation is required.

## Current scope

- Manager and worker roles
- Stock on hand and low-stock alerts
- Receiving, customer stock-out, and internal transfers
- Stock counts and movement history
- Product, barcode, customer, supplier, and staff management
- Inventory reporting with 7-day, 30-day, and custom date ranges
- Optional Google Sheets sync (set once in Settings) so stock is shared and
  saved across every phone and computer — see `apps-script/DEPLOYMENT.md`.
  Without it, the app still works fully offline on sample data.
- No pricing, cost, revenue, or invoicing interface

## Working on this project

`source/markup.html`, `source/styles.css`, `source/app.js`, and
`source/data.js` are the canonical files; `index.html` is the same content
bundled into one file for the live deploy — keep both in sync. `CLAUDE.md`
has Claude-specific notes. `apps-script/` has the Google Sheets backend
(`Code.gs`), its schema (`SHEETS-SCHEMA.md`), and setup steps
(`DEPLOYMENT.md`).

## Important

Never commit API keys, passwords, service-account files, or `.env` files.
