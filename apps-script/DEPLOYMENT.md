# Connect the app to Google Sheets

This turns the sample data you see in the app into a real, shared Google
Sheet: every delivery, sale, transfer, and stock count gets written there,
and every phone/computer that opens the app reads live numbers from it.

The app itself already lives on GitHub Pages — this step only sets up the
Sheet + a small Apps Script "backend" the app talks to. You do this once.

## 1. Turn the workbook into a Google Sheet

1. Go to https://drive.google.com and sign in with the Google account that
   should own the warehouse data.
2. Upload `apps-script/uzbegim-warehouse-inventory.xlsx` from this repo
   (drag it into Drive, or **New > File upload**).
3. Once it's uploaded, double-click it, then in the preview choose
   **Open with > Google Sheets**. This creates a real Google Sheet copy —
   keep that copy, the original `.xlsx` in Drive is no longer needed.
4. Skim the **ReadMe** tab inside the new Sheet — it explains what's in
   each tab. The **Products**, **Customers**, **Suppliers**, and
   **Movements** tabs already have real data in them (see "About the
   starting numbers" below).

## 2. Attach the backend script to that Sheet

1. With the Sheet open, go to **Extensions > Apps Script**.
2. Delete whatever is in the default `Code.gs` file, then paste in the
   entire contents of `apps-script/Code.gs` from this repo.
3. Click the save icon (or Ctrl/Cmd+S). Name the project
   `Uzbegim Warehouse Backend` if asked.

Binding it this way (opened from inside the Sheet) means the script always
knows which Sheet to use — nothing to configure.

## 3. Deploy it as a web app

1. Top right, click **Deploy > New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Description: `Warehouse backend`.
4. **Execute as:** Me (your account).
5. **Who has access:** Anyone.
6. Click **Deploy**, then **Authorize access** and approve the permissions
   (this is your own script asking to read/write your own Sheet).
7. Copy the **Web app URL** it gives you — it looks like
   `https://script.google.com/macros/s/AKfycb.../exec`. You'll paste this
   into the app next.

## 4. Point the app at it

1. Open the app (the GitHub Pages link, or the installed home-screen icon).
2. Go to **Settings**.
3. Under **Google Sheets sync**, paste the web app URL from step 3 into
   **Sheets web app link**, and put your Google account email (the one
   from step 1 — it must also appear in the Sheet's **Staff** tab with
   Active = Y) into **Your email (for Sheets sync)**.
4. Tap **Save settings**. It syncs immediately — the products list and
   stock numbers should update to match the Sheet.

Every worker's phone needs steps 1-4 of "point the app at it" done once
(same URL, their own staff email — add them to the **Staff** tab first).

## After making changes to Code.gs

Paste the updated file into the Apps Script editor, save, then
**Deploy > Manage deployments**, edit the existing deployment, choose
**New version**, and deploy. The web app URL stays the same.

## About the starting numbers

The Sheet comes pre-loaded with the app's real 91-product catalog and one
opening-balance "Stock Count Adjustment" row per product, dated when this
file was built — see the Notes column in Movements. Treat that as a
starting point, not a guarantee: real deliveries and sales have almost
certainly happened since then. **Do one real physical stock count through
the app's own "Stock count" screen right after connecting everything** —
that posts a fresh, accurate adjustment for every product and brings the
Sheet in line with what's actually on the shelves. From then on, every
receiving, sale, transfer, and count you record keeps it current.

## Security note

Access is by staff email, checked against the Staff tab — not a full
Google sign-in flow. That's a reasonable trade-off for a small team (2-3
people) you know personally; it is not meant to survive a public rollout.
