# Instructions for Claude

This is Abdu's warehouse inventory app for Uzbegim Food Market — a single-page
app (`index.html`, built from the `source/` files) used by a manager and a
couple of warehouse workers to track stock, receiving, and movements.

Keep in mind:
- Inventory-only for now — no pricing, cost, revenue, or invoicing UI unless
  explicitly asked for.
- `source/markup.html`, `source/styles.css`, `source/app.js`, `source/data.js`
  are the canonical files. `index.html` is the same content bundled into one
  file (styles and scripts inlined) — keep both in sync when editing.
- The app is also a PWA (`manifest.json`, `sw.js`, icons) and is deployed via
  GitHub Pages at https://git-akholikov.github.io/uzbegim-inventory/. Bump the
  `CACHE_NAME` in `sw.js` when shipping a change, so cached phones pick it up.
- Real persistence lives in Google Sheets: `apps-script/Code.gs` is a small
  JSON API (bound to a Sheet built from `apps-script/uzbegim-warehouse-inventory.xlsx`,
  schema documented in `apps-script/SHEETS-SCHEMA.md`) that `source/app.js`
  calls via `fetch` once a Sheets web app link is set in Settings — see
  `syncFromServer()` / `postMovements()` in app.js and `apps-script/DEPLOYMENT.md`
  for how it's wired up. Without a link set, the app still runs fully offline
  on the sample data in `source/data.js`.
