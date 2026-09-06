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

## Access model

- Worker: Daily Work and Records
- Manager: Daily Work, Records, and Manager controls
- Workers may view movement records

## Current product decisions

- Inventory only for the first version
- Pricing, cost, margin, markup, profit, revenue, and invoice tools are excluded from the interface
- No horizontal category chooser; use dropdown filters
- Inventory Report supports 7 days, 30 days, and From/To dates
- Movement History uses product and brand filters instead of Group By
- Customers and suppliers are managed in one area with separate tabs
- Customer stock-out and internal transfers remain separate movement types

## Known prototype limitations

- Data is sample in-browser data and resets when the page reloads
- Authentication and role detection are simulated
- Google Sheets/Drive persistence is not connected
- Language buttons are visual placeholders
- Barcode scanning depends on browser camera support

## Next recommended milestone

Split the standalone prototype into Google Apps Script files and connect inventory records to Google Sheets while preserving the same interface and role rules.

## Active task

None. Create or claim an item in `TASKS.md` and a matching GitHub issue before starting.

Active implementation details belong in `CURRENT_WORK.md`, not in this file. This file contains durable product decisions only.

## Last verification

- The standalone JavaScript syntax was validated after the latest inventory-report and history-filter changes.
- Multi-assistant instructions were checked for continuous checkpoint and recovery consistency.
