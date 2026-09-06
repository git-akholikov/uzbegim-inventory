# Uzbegim Inventory

Mobile- and desktop-friendly warehouse inventory prototype intended for a future Google Apps Script and Google Sheets deployment.

## Open the prototype

Open `index.html` in a browser. No installation is required.

## Current scope

- Manager and worker roles
- Stock on hand and low-stock alerts
- Receiving, customer stock-out, and internal transfers
- Stock counts and movement history
- Product, barcode, customer, supplier, and staff management
- Inventory reporting with 7-day, 30-day, and custom date ranges
- No pricing, cost, revenue, profit, or invoicing interface

## Multi-AI collaboration

Begin with `START-HERE.md`. Before making changes, every assistant must then read:

1. `COLLABORATION.md`
2. `PROJECT_STATE.md`
3. `CURRENT_WORK.md`
4. `TASKS.md`

Agent-specific instruction files (`AGENTS.md`, `CLAUDE.md`, and `GEMINI.md`) all point to the same shared workflow.

Progress is saved continuously in the task branch and `CURRENT_WORK.md`, so a different assistant can recover after an unexpected usage-limit stop.

The repository stores the work and instructions. Starting a replacement assistant is manual unless API-based automation is configured; see `AUTOMATION.md`.

## Important

Never commit API keys, passwords, service-account files, or `.env` files. Use GitHub repository secrets for future automation.
