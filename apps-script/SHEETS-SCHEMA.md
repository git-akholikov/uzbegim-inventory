# Google Sheets schema (v1, inventory only)

Source workbook: `uzbegim-warehouse-inventory.xlsx` (built for the owner to upload to Google Drive and convert to Google Sheets). This file is the source of truth for the tab layout `apps-script/Code.gs` should read from and write to once Sheets persistence is implemented.

## Tabs

### Staff
`Staff ID, Name, Email (Google Account), Role (Manager/Worker), Active (Y/N)`
Used to enforce roles server-side by matching `Session.getActiveUser().getEmail()` against this tab — never trust the client to say who is a manager.

Test accounts already entered: `abduraufkholikov@gmail.com` (Manager), `abduraufkholikov0@gmail.com` (Worker). Real staff (2-3 managers, 2-3 workers max) get added here before real deployment.

### Products
`Product ID, Product Name, Brand, Flavor / Variant, Size, Category, Unit, Min Qty (reorder point), Active (Y/N), Notes`
~100 SKUs expected. Product ID is the stable key other tabs and any future Pricing tab should join on.

### Customers
`Customer ID, Customer Name, Type (Own Market / Wholesale Restaurant), Contact Name, Phone, Active (Y/N)`
Pre-filled with the known destinations: Uzbegim Market and Cafe Bistro by Uzbegim (Own Market), Chaykhana N1, Turkistan Restaurant, Registan Restaurant, Caravan, Oasis (Wholesale Restaurant). Doubles as the "internal transfer" destination list — a transfer to Uzbegim Market is just a movement whose destination Customer ID is C01.

### Suppliers
`Supplier ID, Supplier Name, Contact Name, Phone, Active (Y/N)`

### Movements (the ledger — no price fields, by design)
`Movement ID, Date, Type, Quantity (entered positive), Signed Qty (calculated), Product ID, Customer / Destination ID, Supplier ID, Staff Email, Notes`

- `Type` is one of: `Receiving`, `Customer Stock-Out`, `Internal Transfer`, `Stock Count Adjustment`.
- `Signed Qty` is a formula in the spreadsheet today (`Receiving`/`Stock Count Adjustment` keep the entered sign, `Customer Stock-Out`/`Internal Transfer` are negated). Once Apps Script writes rows directly, compute this sign in code instead of relying on the sheet formula.
- No price/amount column here — see "Future pricing" below.

### Stock (read-only, calculated)
`Product ID, Product Name, Current Qty on Hand, Min Qty (reorder point), Status`
`Current Qty on Hand` is `SUMIFS` over `Movements!Signed Qty` by Product ID. `Status` is `REORDER` when qty on hand is below the product's min qty, else `OK`. This tab should stay derived/read-only — the app never writes to it directly, only to Movements.

## Future pricing (not built now)

When a later version reintroduces per-customer pricing, add a new `Pricing` tab keyed by `Customer ID + Product ID + Rate`, joined in at reporting time. Do not add price columns to `Movements` or `Products` — that would force a rework of the ledger this schema deliberately avoids.
