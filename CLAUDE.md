# Instructions for Claude

This is Abdu's warehouse inventory app for Uzbegim Food Market — a single-page
app (`index.html`, built from the `source/` files) used by a manager and a
couple of warehouse workers to track stock, receiving, and movements.

Before changing app behavior, skim `CURRENT_WORK.md` for the latest state and
`PROJECT_STATE.md` / `TASKS.md` for the broader picture.

Keep in mind:
- Inventory-only for now — no pricing, cost, revenue, or invoicing UI unless
  explicitly asked for.
- `source/markup.html`, `source/styles.css`, `source/app.js`, `source/data.js`
  are the canonical files. `index.html` is the same content bundled into one
  file (styles and scripts inlined) — keep both in sync when editing.
- The app is also a PWA (`manifest.json`, `sw.js`, icons) and is deployed via
  GitHub Pages at https://git-akholikov.github.io/uzbegim-inventory/. Bump the
  `CACHE_NAME` in `sw.js` when shipping a change, so cached phones pick it up.
- Log meaningful changes in `CURRENT_WORK.md`, commit, and push.
