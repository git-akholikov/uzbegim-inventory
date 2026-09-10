# Uzbegim Inventory

Mobile- and desktop-friendly warehouse inventory app for Uzbegim Food Market.

**Live app — everyone (workers and managers both use this one):**
https://git-akholikov.github.io/uzbegim-inventory/ — installable as a PWA
(open the link on a phone, then "Add to Home Screen").

**Live app — manager's second icon (optional):**
https://git-akholikov.github.io/uzbegim-inventory/manager.html — same app,
same login, just a gold-accent home-screen icon so a manager's phone looks
different from a worker's at a glance. What each person can actually see
(Staff, Activity log) is decided by their Role in the Staff tab, not by
which of these two links they installed from — installing the manager icon
does not itself grant manager access.

There is nothing separate to "download" beyond these two links — this is a
web app, not a native app or an app-store listing. Open the link, then use
the browser's "Add to Home Screen" / install option to get an icon like any
other app.

## Open it locally

Open `index.html` (or `manager.html`) in a browser. No installation is
required, though the service worker (offline support) and "Add to Home
Screen" install prompt only work when served over HTTPS or localhost, not
from a raw `file://` path.

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
`source/data.js` are the canonical files. Run `python3 build.py` after
editing anything under `source/` — it regenerates both `index.html` and
`manager.html` from those same files (they differ only in the manifest/icon
links each points to), so the two never drift apart by hand-editing one and
forgetting the other. Do not edit `index.html` or `manager.html` directly.
`CLAUDE.md` has Claude-specific notes. `apps-script/` has the Google Sheets
backend (`Code.gs`, one script shared by both apps — see "Backend" below),
its schema (`SHEETS-SCHEMA.md`), and setup steps (`DEPLOYMENT.md`).

## Backend

Both `index.html` and `manager.html` talk to the exact same Google Apps
Script Web App — there is only one script to keep in sync
(`apps-script/Code.gs`), not one per app. It's already deployed; to ship a
future change to it: open the Sheet → Extensions → Apps Script → paste in
the updated `Code.gs` → Deploy → Manage deployments → pencil icon on the
existing deployment → **New version** → Deploy. That keeps the same
deployment URL, so nothing needs to change in each device's Settings
screen. (Using "New deployment" instead of "New version" creates a
different URL and breaks every device already configured with the old
one — see `apps-script/DEPLOYMENT.md`.)

Role (manager vs. worker) comes from the **Role** column on the Staff tab
in the Sheet, matched to whichever email is entered in that device's
Settings — it is not tied to which app (index.html vs. manager.html) was
installed.

## Important

Never commit API keys, passwords, service-account files, or `.env` files.
