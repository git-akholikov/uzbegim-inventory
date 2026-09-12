/**
 * Uzbegim Warehouse — Sheets backend (v1, inventory only).
 *
 * This script must be BOUND to the Google Sheet built from
 * apps-script/uzbegim-warehouse-inventory.xlsx (Extensions > Apps Script,
 * opened from inside that Sheet) so SpreadsheetApp.getActiveSpreadsheet()
 * resolves automatically — no Sheet ID to configure. See DEPLOYMENT.md.
 *
 * Deployed as a Web App (Execute as: Me, Who has access: Anyone), it serves
 * as a small JSON API the app.js frontend calls with fetch():
 *   GET  ?               -> current products, live stock, customers, suppliers,
 *                            staff, recent movements, recent change logs
 *   POST {action:...}    -> append movement(s) / add or edit a product,
 *                            customer, supplier or staff member. addStaff
 *                            and updateStaff are manager-only (403 for a
 *                            calling staff whose Role isn't 'manager').
 *                            Every add/edit (except movements, which already
 *                            have their own ledger) writes a row to the Logs
 *                            tab — auto-created on first use.
 *
 * Auth model: this is a small internal tool for 2-3 known staff, not a
 * public system. Because the web app runs for "Anyone" (no Google sign-in
 * prompt on the phone), Session.getActiveUser() is not reliable here, so
 * every write is authorized by checking the staffEmail the client sends
 * against the Staff tab (must exist there with Active = Y). Do not widen
 * this app's audience without adding real Google sign-in.
 *
 * POST requests must use Content-Type: text/plain (not application/json).
 * That keeps them a CORS "simple request" so the browser skips a preflight
 * OPTIONS call, which this script does not implement. The body is still a
 * JSON string — read via e.postData.contents and JSON.parse().
 */

var TAB = {
  staff: 'Staff', products: 'Products', customers: 'Customers',
  suppliers: 'Suppliers', movements: 'Movements', stock: 'Stock', logs: 'Logs'
};

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var stockBySku = computeStockMap(ss);
    var payload = {
      ok: true,
      products: readProducts(ss, stockBySku),
      customers: readCustomers(ss),
      suppliers: readSuppliers(ss),
      movements: readMovements(ss),
      staff: readStaffList(ss),
      logs: readLogs(ss),
      generatedAt: new Date().toISOString()
    };
    return json(payload);
  } catch (err) {
    return json({ ok: false, error: String(err) }, 500);
  }
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    var body = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var staff = findActiveStaff(ss, body.staffEmail);
    if (!staff) return json({ ok: false, error: 'Unknown or inactive staff email: ' + body.staffEmail }, 403);

    if (body.action === 'addMovements') {
      var ids = appendMovements(ss, body.movements || [], staff);
      return json({ ok: true, ids: ids, products: readProducts(ss, computeStockMap(ss)) });
    }
    if (body.action === 'addProduct') {
      var newId = appendProduct(ss, body.product);
      appendLog(ss, staff, 'Add', 'Product', 'Added product ' + newId + ((body.product && body.product.name) ? ' — ' + body.product.name : ''));
      return json({ ok: true, id: newId, products: readProducts(ss, computeStockMap(ss)) });
    }
    if (body.action === 'updateProduct') {
      updateProduct(ss, body.product);
      appendLog(ss, staff, 'Edit', 'Product', 'Edited product ' + (body.product && body.product.sku));
      return json({ ok: true, products: readProducts(ss, computeStockMap(ss)) });
    }
    if (body.action === 'addCustomer') {
      var custId = appendCustomer(ss, body.customer);
      appendLog(ss, staff, 'Add', 'Customer', 'Added customer ' + custId + ((body.customer && body.customer.name) ? ' — ' + body.customer.name : ''));
      return json({ ok: true, id: custId, customers: readCustomers(ss) });
    }
    if (body.action === 'updateCustomer') {
      updateCustomer(ss, body.customer);
      appendLog(ss, staff, 'Edit', 'Customer', 'Edited customer ' + (body.customer && body.customer.id));
      return json({ ok: true, customers: readCustomers(ss) });
    }
    if (body.action === 'addSupplier') {
      var supId = appendSupplier(ss, body.supplier);
      appendLog(ss, staff, 'Add', 'Supplier', 'Added supplier ' + supId + ((body.supplier && body.supplier.name) ? ' — ' + body.supplier.name : ''));
      return json({ ok: true, id: supId, suppliers: readSuppliers(ss) });
    }
    if (body.action === 'updateSupplier') {
      updateSupplier(ss, body.supplier);
      appendLog(ss, staff, 'Edit', 'Supplier', 'Edited supplier ' + (body.supplier && body.supplier.id));
      return json({ ok: true, suppliers: readSuppliers(ss) });
    }
    if (body.action === 'addStaff') {
      if (!isManagerRole(staff['Role'])) return json({ ok: false, error: 'Only managers can manage staff' }, 403);
      appendStaffRow(ss, body.staff || {});
      appendLog(ss, staff, 'Add', 'Staff', 'Added staff ' + (body.staff && body.staff.name) + ' (' + ((body.staff && body.staff.role) || 'worker') + ')');
      return json({ ok: true, staff: readStaffList(ss) });
    }
    if (body.action === 'updateStaff') {
      if (!isManagerRole(staff['Role'])) return json({ ok: false, error: 'Only managers can manage staff' }, 403);
      updateStaffRow(ss, body.staff || {});
      appendLog(ss, staff, 'Edit', 'Staff', 'Edited staff ' + (body.staff && body.staff.name) + ' — role: ' + ((body.staff && body.staff.role) || 'worker'));
      return json({ ok: true, staff: readStaffList(ss) });
    }
    return json({ ok: false, error: 'Unknown action: ' + body.action }, 400);
  } catch (err) {
    return json({ ok: false, error: String(err) }, 500);
  } finally {
    lock.releaseLock();
  }
}

/* ───────────────── reading ───────────────── */

function readTable(ss, tabName) {
  var sh = ss.getSheetByName(tabName);
  if (!sh) return [];
  var values = sh.getDataRange().getValues();
  var headers = values[0];
  var out = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    if (row.every(function (c) { return c === '' || c === null; })) continue;
    var obj = {};
    for (var c = 0; c < headers.length; c++) obj[headers[c]] = row[c];
    out.push(obj);
  }
  return out;
}

function computeStockMap(ss) {
  // Computed directly from the Movements ledger rather than read from the
  // Stock tab's SUMIFS formulas: that avoids any dependency on the Stock
  // tab's formula ranges being correct, or having recalculated in time when
  // this reads it back right after a write. The Stock tab still works as a
  // human-readable view inside the spreadsheet itself, but Code.gs does not
  // rely on it.
  var rows = readTable(ss, TAB.movements);
  var map = {};
  rows.forEach(function (r) {
    var sku = r['Product ID'];
    if (!sku) return;
    var signed = Number(r['Signed Qty (calculated)']);
    if (isNaN(signed)) signed = 0;
    map[sku] = (map[sku] || 0) + signed;
  });
  return map;
}

function readProducts(ss, stockBySku) {
  return readTable(ss, TAB.products)
    .filter(function (r) { return r['Product ID'] && r['Active (Y/N)'] === 'Y'; })
    .map(function (r) {
      var flavor = r['Flavor / Variant'] ? (' - ' + r['Flavor / Variant']) : '';
      return {
        sku: r['Product ID'],
        brand: r['Brand'] || r['Product Name'],
        name: (r['Product Name'] || '') + flavor,
        cat: r['Category'] || '',
        unit: r['Unit'] || '',
        upb: Number(r['Units per Box']) || 1,
        min: Number(r['Min Boxes (reorder point)']) || 0,
        boxes: stockBySku[r['Product ID']] || 0,
        price: 0, cost: 0
      };
    });
}

function readCustomers(ss) {
  return readTable(ss, TAB.customers).map(function (r) {
    return { id: r['Customer ID'], name: r['Customer Name'], type: r['Type'],
      contact: r['Contact Name'], phone: r['Phone'], active: r['Active (Y/N)'] };
  }).filter(function (c) { return c.active === 'Y' && c.id; });
}

function readSuppliers(ss) {
  return readTable(ss, TAB.suppliers).map(function (r) {
    return { id: r['Supplier ID'], name: r['Supplier Name'],
      contact: r['Contact Name'], phone: r['Phone'], active: r['Active (Y/N)'] };
  }).filter(function (s) { return s.active === 'Y' && s.id; });
}

function readMovements(ss) {
  // The frontend groups these flat rows back into the receiving/sale/
  // adjustment records it shows in History (see applyServerMovements in
  // app.js) using the shared "Ref <id>" marker every commit writes into
  // each line's Notes. Capped so a growing ledger doesn't inflate every
  // GET forever — History only really needs a working window of recent
  // activity, not the full permanent record (which still lives in the
  // Sheet itself).
  var LIMIT = 400;
  var rows = readTable(ss, TAB.movements).filter(function (r) { return r['Movement ID']; });
  if (rows.length > LIMIT) rows = rows.slice(rows.length - LIMIT);
  return rows.map(function (r) {
    return {
      id: r['Movement ID'], date: fmtDate(r['Date']), type: r['Type'],
      qty: Number(r['Quantity (enter positive)']) || 0,
      signedQty: Number(r['Signed Qty (calculated)']) || 0,
      productId: r['Product ID'],
      customerId: r['Customer / Destination ID'] || '',
      supplierId: r['Supplier ID'] || '',
      staffEmail: r['Staff Email'] || '',
      notes: r['Notes'] || ''
    };
  });
}

function findActiveStaff(ss, email) {
  if (!email) return null;
  var rows = readTable(ss, TAB.staff);
  for (var i = 0; i < rows.length; i++) {
    if (rows[i]['Email (Google Account)'] === email && rows[i]['Active (Y/N)'] === 'Y') return rows[i];
  }
  return null;
}

function isManagerRole(v) {
  return String(v || '').trim().toLowerCase() === 'manager';
}

function readStaffList(ss) {
  // Normalized to lowercase 'manager'/'worker' here so every caller (the
  // frontend included) can compare with a plain === instead of guessing at
  // the Sheet's capitalization convention (the real Staff tab stores
  // "Manager"/"Worker", capitalized).
  return readTable(ss, TAB.staff).map(function (r) {
    return { email: r['Email (Google Account)'], name: r['Name'], role: isManagerRole(r['Role']) ? 'manager' : 'worker', active: r['Active (Y/N)'] };
  }).filter(function (s) { return s.active === 'Y' && s.email; });
}

function readLogs(ss) {
  // Capped the same way readMovements() is, for the same reason: a growing
  // ledger shouldn't inflate every GET forever. The full permanent record
  // still lives in the Logs tab itself.
  var LIMIT = 300;
  var sh = ss.getSheetByName(TAB.logs);
  if (!sh) return [];
  var rows = readTable(ss, TAB.logs).filter(function (r) { return r['Timestamp']; });
  if (rows.length > LIMIT) rows = rows.slice(rows.length - LIMIT);
  return rows.map(function (r) {
    return {
      ts: fmtTimestamp(r['Timestamp']), staffEmail: r['Staff Email'] || '', staffName: r['Staff Name'] || '',
      action: r['Action'] || '', entity: r['Entity'] || '', details: r['Details'] || ''
    };
  });
}

// Both the Movements "Date" column and the Logs "Timestamp" column are
// written as plain formatted strings ('yyyy-MM-dd' / 'yyyy-MM-dd HH:mm'),
// but Google Sheets silently reinterprets text that looks like a date/time
// as a real Date-typed cell on save -- so reading it back with
// getValues() can hand us a JS Date object instead of the string we wrote,
// which then serializes to a full ISO timestamp ("2026-09-12T07:00:00.000Z")
// in the JSON response. That broke two things client-side: the frontend's
// same-day "Void this movement" check (which compares the movement's date
// against today's date as a plain 'yyyy-MM-dd' string) and its date
// formatting on the History detail screen (which assumes exactly that
// format and garbled into text like "11T07:00:00.000Z Sep 2026" otherwise).
// Reformatting defensively here, at read time, fixes it regardless of
// whatever type the cell actually ended up as.
function fmtDate(v) {
  if (Object.prototype.toString.call(v) === '[object Date]') {
    return Utilities.formatDate(v, Session.getScriptTimeZone() || 'America/New_York', 'yyyy-MM-dd');
  }
  return v;
}
function fmtTimestamp(v) {
  if (Object.prototype.toString.call(v) === '[object Date]') {
    return Utilities.formatDate(v, Session.getScriptTimeZone() || 'America/New_York', 'yyyy-MM-dd HH:mm');
  }
  return v;
}

/* ───────────────── writing ───────────────── */

function lastRowWithValue(sh, col) {
  // sh.getLastRow() / sh.appendRow() report the sheet's overall "used range",
  // which Google Sheets can inflate far past where the real data ends --
  // leftover formatting, a value that was typed into a cell far below and
  // later cleared, or anything that once touched a cell keeps it counted as
  // "used" even with nothing showing there anymore. That's what put new
  // rows around row 500 instead of right after the real last row. Scanning
  // the sheet's key column (Movement ID, Product ID, etc. -- always column
  // 1 in every tab this app appends to) for its true last non-empty cell
  // sidesteps that and always lands the next row exactly where it belongs.
  var last = sh.getLastRow();
  if (last < 1) return 0;
  var vals = sh.getRange(1, col, last, 1).getValues();
  for (var r = vals.length - 1; r >= 0; r--) {
    if (vals[r][0] !== '' && vals[r][0] !== null) return r + 1;
  }
  return 0;
}

function maxIdNumber(sh, prefix) {
  var last = sh.getLastRow();
  var max = 0;
  if (last > 1) {
    var vals = sh.getRange(2, 1, last - 1, 1).getValues();
    vals.forEach(function (v) {
      var n = parseInt(String(v[0]).replace(prefix, ''), 10);
      if (!isNaN(n) && n > max) max = n;
    });
  }
  return max;
}

function appendMovements(ss, movements, staff) {
  var sh = ss.getSheetByName(TAB.movements);
  if (!sh) throw new Error('Movements tab not found');
  // Idempotency: every line of one transaction (a receiving, stock-out,
  // transfer, or count adjustment) carries the same "Ref <id>" marker in
  // its Notes (see postMovements in app.js). The phone retries a write it
  // never got a confirmed response for — usually because it truly never
  // reached here, but occasionally because the response was lost on the
  // way back after this already ran. In that second case, re-appending
  // would double-count stock, so check for that marker first and treat a
  // match as "already applied, nothing to do" instead of doing it again.
  var refMatch = movements.length && /Ref\s+([A-Za-z0-9-]+)/.exec(movements[0].notes || '');
  if (refMatch) {
    var already = readTable(ss, TAB.movements).some(function (r) {
      return String(r['Notes'] || '').indexOf('Ref ' + refMatch[1]) > -1;
    });
    if (already) return [];
  }
  var today = Utilities.formatDate(new Date(), Session.getScriptTimeZone() || 'America/New_York', 'yyyy-MM-dd');
  var next = maxIdNumber(sh, 'M') + 1;
  var ids = [];
  var rows = [];
  movements.forEach(function (m) {
    if (!m.productId || !m.type) return;
    var qty = Number(m.qty) || 0;
    var signed;
    // Stock Count Adjustment and Void both send an already-signed delta
    // (can be + or -), since a void has to exactly cancel out whatever the
    // original movement did, in either direction.
    if (m.type === 'Stock Count Adjustment' || m.type === 'Void') signed = qty;
    else if (m.type === 'Receiving') signed = Math.abs(qty);
    else signed = -Math.abs(qty); // Customer Stock-Out, Internal Transfer

    var id = 'M' + String(next).padStart(4, '0');
    next++;
    ids.push(id);
    rows.push([
      id, today, m.type, Math.abs(qty), signed, m.productId,
      m.customerId || '', m.supplierId || '', staff['Email (Google Account)'], m.notes || ''
    ]);
  });
  if (rows.length) {
    sh.getRange(lastRowWithValue(sh, 1) + 1, 1, rows.length, rows[0].length).setValues(rows);
  }
  SpreadsheetApp.flush();
  return ids;
}

function appendProduct(ss, p) {
  var sh = ss.getSheetByName(TAB.products);
  if (!sh) throw new Error('Products tab not found');
  if (!p || !p.sku) throw new Error('Missing product sku');
  // Idempotency: a retried "add product" after a lost response would
  // otherwise create a second row for the same SKU. If it's already here,
  // this is that same product — nothing to add.
  var values = sh.getDataRange().getValues();
  for (var r = 1; r < values.length; r++) {
    if (values[r][0] === p.sku) return p.sku;
  }
  appendRowAt(sh, [
    p.sku, p.name || '', p.brand || '', p.flavor || '', p.unit || '',
    p.cat || '', Number(p.upb) || 1, Number(p.min) || 0, p.supplier || '', 'Y', p.notes || ''
  ]);
  return p.sku;
}

function updateProduct(ss, p) {
  var sh = ss.getSheetByName(TAB.products);
  if (!sh) throw new Error('Products tab not found');
  var values = sh.getDataRange().getValues();
  for (var r = 1; r < values.length; r++) {
    if (values[r][0] === p.sku) {
      var row = r + 1;
      if (p.name !== undefined) sh.getRange(row, 2).setValue(p.name);
      if (p.brand !== undefined) sh.getRange(row, 3).setValue(p.brand);
      if (p.flavor !== undefined) sh.getRange(row, 4).setValue(p.flavor);
      if (p.unit !== undefined) sh.getRange(row, 5).setValue(p.unit);
      if (p.cat !== undefined) sh.getRange(row, 6).setValue(p.cat);
      if (p.upb !== undefined) sh.getRange(row, 7).setValue(Number(p.upb) || 1);
      if (p.min !== undefined) sh.getRange(row, 8).setValue(Number(p.min) || 0);
      return;
    }
  }
  throw new Error('Product not found: ' + p.sku);
}

function appendCustomer(ss, c) {
  var sh = ss.getSheetByName(TAB.customers);
  if (!sh) throw new Error('Customers tab not found');
  if (!c || !c.name) throw new Error('Missing customer name');
  // Idempotency: same reasoning as appendProduct — a retried add after a
  // lost response shouldn't create a second row for the same name.
  var values = sh.getDataRange().getValues();
  for (var r = 1; r < values.length; r++) {
    if (String(values[r][1]).toLowerCase() === c.name.toLowerCase()) return values[r][0];
  }
  var id = 'C' + String(maxIdNumber(sh, 'C') + 1).padStart(2, '0');
  appendRowAt(sh, [id, c.name, c.type || '', c.contact || '', c.phone || '', 'Y']);
  return id;
}

function updateCustomer(ss, c) {
  var sh = ss.getSheetByName(TAB.customers);
  if (!sh) throw new Error('Customers tab not found');
  var values = sh.getDataRange().getValues();
  for (var r = 1; r < values.length; r++) {
    if (values[r][0] === c.id) {
      var row = r + 1;
      if (c.name !== undefined) sh.getRange(row, 2).setValue(c.name);
      if (c.type !== undefined) sh.getRange(row, 3).setValue(c.type);
      if (c.contact !== undefined) sh.getRange(row, 4).setValue(c.contact);
      if (c.phone !== undefined) sh.getRange(row, 5).setValue(c.phone);
      return;
    }
  }
  throw new Error('Customer not found: ' + c.id);
}

function appendSupplier(ss, s) {
  var sh = ss.getSheetByName(TAB.suppliers);
  if (!sh) throw new Error('Suppliers tab not found');
  if (!s || !s.name) throw new Error('Missing supplier name');
  // Idempotency: same reasoning as appendProduct — a retried add after a
  // lost response shouldn't create a second row for the same name.
  var values = sh.getDataRange().getValues();
  for (var r = 1; r < values.length; r++) {
    if (String(values[r][1]).toLowerCase() === s.name.toLowerCase()) return values[r][0];
  }
  var id = 'SUP' + String(maxIdNumber(sh, 'SUP') + 1).padStart(2, '0');
  appendRowAt(sh, [id, s.name, s.contact || '', s.phone || '', 'Y']);
  return id;
}

function updateSupplier(ss, s) {
  var sh = ss.getSheetByName(TAB.suppliers);
  if (!sh) throw new Error('Suppliers tab not found');
  var values = sh.getDataRange().getValues();
  for (var r = 1; r < values.length; r++) {
    if (values[r][0] === s.id) {
      var row = r + 1;
      if (s.name !== undefined) sh.getRange(row, 2).setValue(s.name);
      if (s.contact !== undefined) sh.getRange(row, 3).setValue(s.contact);
      if (s.phone !== undefined) sh.getRange(row, 4).setValue(s.phone);
      return;
    }
  }
  throw new Error('Supplier not found: ' + s.id);
}

function appendStaffRow(ss, s) {
  var sh = ss.getSheetByName(TAB.staff);
  if (!sh) throw new Error('Staff tab not found');
  if (!s || !s.name) throw new Error('Missing staff name');
  // Idempotency: same reasoning as appendProduct — a retried add after a
  // lost response shouldn't create a second row for the same person.
  var already = readTable(ss, TAB.staff).some(function (r) {
    var sameEmail = s.email && String(r['Email (Google Account)'] || '').toLowerCase() === s.email.toLowerCase();
    var sameName = String(r['Name'] || '').toLowerCase() === s.name.toLowerCase();
    return sameEmail || sameName;
  });
  if (already) return;
  // Written capitalized ("Manager"/"Worker") to match the existing Staff
  // tab's convention — reading it back always normalizes to lowercase via
  // isManagerRole(), so the exact casing here doesn't matter functionally,
  // but keeping it consistent makes the sheet itself readable to a human.
  appendRowByHeaders(sh, {
    'Staff ID': 'S' + String(maxIdNumber(sh, 'S') + 1).padStart(2, '0'),
    'Email (Google Account)': s.email || '',
    'Name': s.name,
    'Role': isManagerRole(s.role) ? 'Manager' : 'Worker',
    'Active (Y/N)': 'Y'
  });
}

function updateStaffRow(ss, s) {
  // Matched by Name (not email, which this same edit may be changing for the
  // first time) — the Staff screen doesn't offer a rename, so Name is the
  // stable key here, the same way Product ID / Customer ID / Supplier ID are
  // the stable keys for those tabs.
  var sh = ss.getSheetByName(TAB.staff);
  if (!sh) throw new Error('Staff tab not found');
  if (!s || !s.name) throw new Error('Missing staff name');
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  var nameCol = headers.indexOf('Name');
  var values = sh.getDataRange().getValues();
  for (var r = 1; r < values.length; r++) {
    if (String(values[r][nameCol]).toLowerCase() === String(s.name).toLowerCase()) {
      var row = r + 1;
      if (s.email !== undefined) setByHeader(sh, headers, row, 'Email (Google Account)', s.email);
      if (s.role !== undefined) setByHeader(sh, headers, row, 'Role', isManagerRole(s.role) ? 'Manager' : 'Worker');
      return;
    }
  }
  throw new Error('Staff not found: ' + s.name);
}

function setByHeader(sh, headers, row, headerName, value) {
  var col = headers.indexOf(headerName);
  if (col === -1) return;
  sh.getRange(row, col + 1).setValue(value);
}

function appendRowByHeaders(sh, dataObj) {
  // Writes by header NAME rather than a hardcoded column order, so this
  // never has to guess the real sheet's column layout (the class of bug
  // that has bitten this project before — a mismatched assumption about a
  // tab's shape silently writing into the wrong column).
  var headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  var row = headers.map(function (h) { return dataObj.hasOwnProperty(h) ? dataObj[h] : ''; });
  appendRowAt(sh, row);
}

function appendRowAt(sh, row) {
  // sh.appendRow(row) is just sh.getRange(sh.getLastRow()+1, ...) under the
  // hood, so it inherits the same "used range can be inflated way past the
  // real data" quirk -- see lastRowWithValue() above. Every tab this app
  // writes to always has column 1 filled in on every real row (Movement ID,
  // Product ID, Customer ID, Supplier ID, Staff ID, Timestamp), so that's a
  // reliable column to find the true next empty row from.
  sh.getRange(lastRowWithValue(sh, 1) + 1, 1, 1, row.length).setValues([row]);
}

function getOrCreateLogsSheet(ss) {
  var sh = ss.getSheetByName(TAB.logs);
  if (!sh) {
    sh = ss.insertSheet(TAB.logs);
    sh.appendRow(['Timestamp', 'Staff Email', 'Staff Name', 'Action', 'Entity', 'Details']);
    sh.setFrozenRows(1);
  }
  return sh;
}

function appendLog(ss, staff, action, entity, details) {
  // Logging must never break the write it's describing — if the Logs tab
  // is unreachable for some reason, swallow the error rather than fail the
  // whole request.
  try {
    var sh = getOrCreateLogsSheet(ss);
    var tz = Session.getScriptTimeZone() || 'America/New_York';
    var ts = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd HH:mm');
    appendRowByHeaders(sh, {
      'Timestamp': ts,
      'Staff Email': staff ? staff['Email (Google Account)'] : '',
      'Staff Name': staff ? staff['Name'] : '',
      'Action': action,
      'Entity': entity,
      'Details': details
    });
  } catch (e) { }
}

/* ───────────────── helpers ───────────────── */

function json(obj, status) {
  var out = ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
  return out;
}
