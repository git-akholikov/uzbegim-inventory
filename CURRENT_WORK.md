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

Owner confirmed v1 is inventory-only with pricing fully excluded, but wants the schema built so a future version can add per-customer pricing without reworking the core. Owner asked for the actual Google Sheets database file (not just a schema doc) to upload to Drive and deploy later; provided two of his own Gmail accounts to test manager/worker roles, and said access is needed for at most 2-3 managers and 2-3 workers.

## Completed and pushed

- Confirmed v1 scope (no pricing) in `PROJECT_STATE.md`, with explicit "Future direction" guidance: keep Movements price-free, add pricing later as a separate Customer x Product x Rate lookup, keep stable Product ID / Customer ID keys now.
- Defined the full Sheets schema in `apps-script/SHEETS-SCHEMA.md`: Staff, Products, Customers, Suppliers, Movements, Stock tabs, with columns.
- Built and delivered `uzbegim-warehouse-inventory.xlsx` to the owner (openpyxl, recalculated with LibreOffice, 1600 formulas, 0 errors): all 6 tabs plus a ReadMe tab, data-validation dropdowns (Type, Role, Active, Product/Customer/Supplier/Staff lookups), Customers tab pre-filled with the 7 known distribution destinations, Staff tab pre-filled with the owner's two test accounts (abduraufkholikov@gmail.com = Manager, abduraufkholikov0@gmail.com = Worker), Stock tab computed live via SUMIFS from Movements. Also committed into this repo at `apps-script/uzbegim-warehouse-inventory.xlsx` so it stays version-controlled alongside the schema doc.
- Checked off "Define Google Sheets tables and columns" in `TASKS.md`.

## In progress

Nothing in progress. Waiting on the owner to actually upload the workbook to Google Drive/Sheets (their action, not something this session can do) before Sheets-connected Apps Script code can be written and tested against real Sheet IDs.

## Exact next action

Once the owner has uploaded `uzbegim-warehouse-inventory.xlsx` to Google Drive and converted it to Google Sheets, get the resulting Spreadsheet ID from them and start implementing `apps-script/Code.gs` functions that read/write the Products and Movements tabs per `apps-script/SHEETS-SCHEMA.md`, enforcing roles server-side via the Staff tab (do not trust client-side role hiding alone).

## Files changed in this task

- `PROJECT_STATE.md`, `apps-script/SHEETS-SCHEMA.md` (new), `TASKS.md`, `CURRENT_WORK.md`

## Verification completed

- Workbook recalculated with LibreOffice: `status: success`, `total_errors: 0`, `total_formulas: 1600`.
- Spot-checked the Stock tab's computed value for the example product (P001) against the example Movements rows by hand: 40 received − 6 stock-out − 10 transfer − 1 count adjustment = 23, matches the sheet's computed value.

## Errors, risks, or decisions needed

- Test accounts are both the owner's own Gmail addresses, not yet real staff accounts — real staff need to replace/join them on the Staff tab before real deployment.
- The two-Gmail-account test will validate role-based UI differences but the app is still sample-data-in-browser until Apps Script is actually wired to the Sheet — deploying before that step would not persist anything.
