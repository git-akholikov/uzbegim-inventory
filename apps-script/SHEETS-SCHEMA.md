# Google Sheets schema (v1, inventory only)

Source workbook: `apps-script/uzbegim-warehouse-inventory.xlsx` (built for the owner to upload to Google Drive and convert to Google Sheets). This file is the source of truth for the tab layout `apps-script/Code.gs` should read from and write to once Sheets persistence is implemented. The Products tab is already filled with the owner's real 91-item catalog, and Movements already carries one opening-balance row per product with today's real box count, pulled from the existing app's data.

## Tabs

### Staff
`Staff ID, Name, Email (Google Account), Role (Manager/Worker), Active (Y/N)`
Used to enforce roles server-side by matching `Session.getActiveUser().getEmail()` against this tab — never trust the client to say who is a manager.

Test accounts already entered: `abduraufkholikov@gmail.com` (Manager), `abduraufkholikov0@gmail.com` (Worker). Real staff (2-3 managers, 2-3 workers max) get added here before real deployment.

> **Implementation note (Code.gs v1):** the deployed web app runs with
> "Execute as: Me, Anyone can access", so `Session.getActiveUser()` is not
> reliably populated for anonymous callers. Instead, `Code.gs` requires the
> client to send a `staffEmail` with every write and checks it against this
> tab (must exist, Active = Y). See the auth note at the top of `Code.gs`.

### Products
`Product ID, Product Name, Brand, Flavor / Variant, Unit, Category, Units per Box, Min Boxes (reorder point), Supplier, Active (Y/N), Notes`
All 91 real SKUs already loaded, pulled from the existing app's product data (brand, flavor, unit, category, units per box, current reorder minimum) plus supplier where known from the owner's own spreadsheet. Product ID is the stable key other tabs and any future Pricing tab should join on. No price or cost column, by design.

### Customers
`Customer ID, Customer Name, Type (Own Market / Wholesale Restaurant), Contact Name, Phone, Active (Y/N)`
Pre-filled with the known destinations: Uzbegim Market and Cafe Bistro by Uzbegim (Own Market), Chaykhana N1, Turkistan Restaurant, Registan Restaurant, Caravan, Oasis (Wholesale Restaurant). Doubles as the "internal transfer" destination list — a transfer to Uzbegim Market is just a movement whose destination Customer ID is C01.

### Suppliers
`Supplier ID, Supplier Name, Contact Name, Phone, Active (Y/N)`
Pre-filled with the 4 real suppliers found in the owner's product data: Baraka Trading, Foodielux, M&B International Services Inc, Shov-Shuv Corp.

### Movements (the ledger — no price fields, by design)
`Movement ID, Date, Type, Quantity (entered positive), Signed Qty (calculated), Product ID, Customer / Destination ID, Supplier ID, Staff Email, Notes`

- `Type` is one of: `Receiving`, `Customer Stock-Out`, `Internal Transfer`, `Stock Count Adjustment`.
- `Signed Qty` is a formula in the spreadsheet today (`Receiving`/`Stock Count Adjustment` keep the entered sign, `Customer Stock-Out`/`Internal Transfer` are negated). Once Apps Script writes rows directly, compute this sign in code instead of relying on the sheet formula.
- Rows 2-92 are one `Stock Count Adjustment` per real product, dated today, carrying that product's current box count from the existing app — an opening balance so Stock doesn't start at zero. A few more example rows follow, using a real SKU/customer/supplier, clearly marked as samples.
- No price/amount column here — see "Future pricing" below.

> **Implementation note (Code.gs v1):** `appendMovements()` computes and
> writes the numeric `Signed Qty` itself for every row it appends (per the
> point above), it does not rely on a sheet formula for new rows.

### Stock (read-only, calculated)
`Product ID, Product Name, Current Boxes on Hand, Min Boxes (reorder point), Status`
`Current Boxes on Hand` is `SUMIFS` over `Movements!Signed Qty` by Product ID. `Status` is `REORDER` when qty on hand is below the product's min boxes, else `OK`. This tab should stay derived/read-only — the app never writes to it directly, only to Movements.

> **Implementation note (Code.gs v1):** the backend does **not** read this
> tab. `doGet`/`doPost` compute each product's current boxes by summing
> `Movements!Signed Qty` directly in Apps Script (`computeStockMap()`),
> so the numbers the app shows never depend on this tab's formulas having
> recalculated yet. This tab is still useful as a human-readable view
> inside the spreadsheet itself — just don't wire anything to read from it.

## Future pricing (not built now)

When a later version reintroduces per-customer pricing, add a new `Pricing` tab keyed by `Customer ID + Product ID + Rate`, joined in at reporting time. Do not add price columns to `Movements` or `Products` — that would force a rework of the ledger this schema deliberately avoids. Note that `index.html`/`source/data.js` already carries real cost/price per product and a per-customer price-multiplier table from an earlier version, switched off by a `SHOW_PRICING` flag rather than deleted — the Sheets side should follow the same pattern (add pricing as a new layer, don't touch the ledger) so both sides stay consistent.
