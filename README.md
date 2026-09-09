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
- No pricing, cost, revenue, profit, or invoicing interface

## Working on this project

`source/markup.html`, `source/styles.css`, `source/app.js`, and
`source/data.js` are the canonical files; `index.html` is the same content
bundled into one file for the live deploy — keep both in sync. See
`CURRENT_WORK.md` for the latest checkpoint and `PROJECT_STATE.md` /
`TASKS.md` for the wider picture. `CLAUDE.md` has Claude-specific notes.

## Important

Never commit API keys, passwords, service-account files, or `.env` files.
