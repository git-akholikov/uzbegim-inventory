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

Owner supplied a separate "deployment package" zip (Code.gs, appsscript.json, standalone.html, plus a second, non-GitHub handoff doc set). Pull in only what's actually new/needed for Google Apps Script deployment, skip the redundant duplicate docs, and get the app ready to actually deploy.

## Completed and pushed

- Verified `standalone.html`/`Index.html` from the supplied package are byte-identical (same md5) to this repo's existing `index.html` — no new application code arrived.
- Added `apps-script/Code.gs` — the Apps Script web-app entry point (`doGet`). Currently just serves the HTML; does not yet read/write Google Sheets.
- Added `apps-script/appsscript.json` — minimal Apps Script manifest.
- Added `apps-script/DEPLOYMENT.md` — manual step-by-step for creating the Apps Script project and deploying it as a web app.
- Deliberately did NOT bring in the package's README.md/PROJECT-BRIEF.md/HANDOFF.md/SEND-THIS-TO-CLAUDE.md/CLAUDE.md — those set up a second, non-GitHub handoff/checkpoint system that duplicates and conflicts with this repo's own COLLABORATION.md/CURRENT_WORK.md/TASKS.md system. This repo's system stays the single source of truth.

## In progress

Nothing committed yet beyond the files above. Waiting on the owner for the Google Sheets schema decisions below before writing any Sheets read/write code.

## Exact next action

Do not write Google Sheets integration code yet. First get answers from the owner to the open decisions below, record them in `PROJECT_STATE.md`, then implement `apps-script/Code.gs` functions to read/write Products and Movements sheets, matching the ledger approach (Products / Movements / Stock tabs, stock calculated from movements, min-quantity reorder warnings) already agreed with the owner.

## Files changed in this task

- `apps-script/Code.gs` (new)
- `apps-script/appsscript.json` (new)
- `apps-script/DEPLOYMENT.md` (new)
- `CURRENT_WORK.md` (this checkpoint)

## Verification completed

- md5 comparison confirmed no drift between the supplied package's HTML and this repo's `index.html`.

## Errors, risks, or decisions needed

- Names of the two Google Sheets files the owner wants staff to be able to open directly in Drive.
- Required tabs/columns in each (Products, Movements, Stock — confirm exact columns).
- Which real Google accounts are manager vs. worker.
- Whether access should be restricted to a Workspace domain or to specific accounts.
- Backup frequency/retention for the sheets.
- The owner's earlier note that "workers should be able to see prices" conflicts with `PROJECT_STATE.md`'s locked-in decision to exclude pricing from v1 — confirm whether pricing stays out of v1 or was meant to be added back before deployment.
