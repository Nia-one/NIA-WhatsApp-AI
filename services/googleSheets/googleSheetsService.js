const sheets = require("../../config/google");
require("dotenv").config();

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

console.log("================================");
console.log("GOOGLE_SPREADSHEET_ID =", SPREADSHEET_ID);
console.log("================================");


// Read data from a sheet
async function readSheet(sheetName) {

    const response = await sheets.spreadsheets.values.get({

        spreadsheetId: SPREADSHEET_ID,

        range: `${sheetName}!A:ZZZ`

    });

    return response.data.values || [];

}


// Write data to a sheet
async function writeSheet(sheetName, values) {

    let range = sheetName;


    // Add A1 only when caller provides only sheet name
    if (!sheetName.includes("!")) {

        range = `${sheetName}!A1`;

    }


    await sheets.spreadsheets.values.update({

        spreadsheetId: SPREADSHEET_ID,

        range,

        valueInputOption: "RAW",

        requestBody: {

            values

        }

    });


    console.log(`✅ Written data to ${range}`);

}

// Update or append one delivery lifecycle row without rewriting the tab.
async function upsertDeliveryStatus(orderId, status, deliveryOwner = "Admin") {
    const sheetName = "Delivery_Status";
    const rows = await readSheet(sheetName);
    const headers = rows[0] || [];
    const required = [
        "order_id", "dispatched_at", "delivered_at",
        "delivery_status", "delivery_owner", "updated_at"
    ];

    for (const header of required) {
        if (!headers.includes(header)) {
            throw new Error(`${sheetName} is missing ${header}`);
        }
    }

    const now = new Date().toISOString();
    const normalizedStatus = (status || "").trim().toLowerCase();
    const orderIdIndex = headers.indexOf("order_id");
    const existingIndex = rows.findIndex(
        (row, index) => index > 0 && String(row[orderIdIndex] || "") === String(orderId)
    );
    const row = existingIndex > 0
        ? headers.map((_, index) => rows[existingIndex][index] || "")
        : headers.map(() => "");

    row[orderIdIndex] = orderId;
    row[headers.indexOf("delivery_status")] =
        normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1);
    row[headers.indexOf("delivery_owner")] = deliveryOwner || "Admin";
    row[headers.indexOf("updated_at")] = now;

    if (normalizedStatus === "shipped" && !row[headers.indexOf("dispatched_at")]) {
        row[headers.indexOf("dispatched_at")] = now;
    }
    if (normalizedStatus === "delivered") {
        row[headers.indexOf("delivered_at")] = now;
    }

    const rowNumber = existingIndex > 0 ? existingIndex + 1 : rows.length + 1;
    await writeSheet(`${sheetName}!A${rowNumber}`, [row]);
}

// Merge database-managed values back into a master sheet without clearing it.
// Existing rows retain their formatting/formulas; database-only rows are appended.
async function reconcileMasterSheet(sheetName, dbRows, keyField, managedFields) {
    const rows = await readSheet(sheetName);
    if (!rows.length) throw new Error(`${sheetName} is empty`);

    const headers = rows[0].map(header => String(header || "").trim());
    const keyIndex = headers.indexOf(keyField);
    if (keyIndex === -1) throw new Error(`${sheetName} is missing ${keyField}`);

    const normalizeKey = value => {
        const text = String(value || "").trim();
        return keyField === "mobile_number"
            ? text.replace(/\D/g, "").slice(-10)
            : text;
    };
    const sheetRowsByKey = new Map();
    rows.slice(1).forEach((row, index) => {
        const key = normalizeKey(row[keyIndex]);
        if (key && !sheetRowsByKey.has(key)) {
            sheetRowsByKey.set(key, { row, rowNumber: index + 2 });
        }
    });

    const updates = [];
    const appends = [];

    for (const dbRow of dbRows) {
        const key = normalizeKey(dbRow[keyField]);
        if (!key) continue;

        const sheetRow = sheetRowsByKey.get(key);
        if (!sheetRow) {
            appends.push(headers.map(header => dbRow[header] ?? ""));
            continue;
        }

        for (const field of managedFields) {
            const columnIndex = headers.indexOf(field);
            if (columnIndex === -1) continue;

            const nextValue = dbRow[field] ?? "";
            const currentValue = sheetRow.row[columnIndex] ?? "";
            if (String(currentValue) === String(nextValue)) continue;

            updates.push({
                range: `${sheetName}!${columnToLetter(columnIndex + 1)}${sheetRow.rowNumber}`,
                values: [[nextValue]]
            });
        }
    }

    for (let index = 0; index < updates.length; index += 500) {
        await sheets.spreadsheets.values.batchUpdate({
            spreadsheetId: SPREADSHEET_ID,
            requestBody: {
                valueInputOption: "RAW",
                data: updates.slice(index, index + 500)
            }
        });
    }

    if (appends.length) {
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: `${sheetName}!A:${columnToLetter(headers.length)}`,
            valueInputOption: "RAW",
            insertDataOption: "INSERT_ROWS",
            requestBody: { values: appends }
        });
    }

    console.log(`Master sheet ${sheetName} reconciled: ${updates.length} cells updated, ${appends.length} rows appended`);
    return { updatedCells: updates.length, appendedRows: appends.length };
}

// Update only backend-managed values for one inventory row. This preserves
// manually maintained columns instead of rewriting the complete sheet.
async function updateInventoryRow(inventory) {
    const sheetName = "Inventory_Master";
    const rows = await readSheet(sheetName);

    if (!rows.length) {
        throw new Error("Inventory_Master sheet is empty");
    }

    const headers = rows[0].map(header => String(header).trim());
    const productCodeIndex = headers.indexOf("product_code");

    if (productCodeIndex === -1) {
        throw new Error("Inventory_Master is missing product_code");
    }

    const dataRowIndex = rows.findIndex((row, index) =>
        index > 0 &&
        String(row[productCodeIndex] || "").trim() ===
            String(inventory.product_code || "").trim()
    );

    if (dataRowIndex === -1) {
        throw new Error(`Inventory row not found for ${inventory.product_code}`);
    }

    const managedFields = [
        "id",
        "total_stock",
        "reserved_stock",
        "available_stock",
        "inventory_status",
        "last_stock_update",
        "updated_at",
        "product_id",
        "product_name"
    ];

    const data = managedFields.flatMap(field => {
        const columnIndex = headers.indexOf(field);
        if (columnIndex === -1) return [];

        return [{
            range: `${sheetName}!${columnToLetter(columnIndex + 1)}${dataRowIndex + 1}`,
            values: [[inventory[field] ?? ""]]
        }];
    });

    if (!data.length) {
        throw new Error("Inventory_Master has no managed inventory columns");
    }

    await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: { valueInputOption: "RAW", data }
    });

    console.log(`✅ Inventory sheet row updated: ${inventory.product_code}`);
}

function columnToLetter(columnNumber) {
    let result = "";

    while (columnNumber > 0) {
        const remainder = (columnNumber - 1) % 26;
        result = String.fromCharCode(65 + remainder) + result;
        columnNumber = Math.floor((columnNumber - 1) / 26);
    }

    return result;
}


// Clear a sheet
async function clearSheet(sheetName) {

    await sheets.spreadsheets.values.clear({

        spreadsheetId: SPREADSHEET_ID,

        // Use an explicit full-column range. Clearing only the sheet title can
        // leave stale trailing rows behind when the replacement dataset is
        // shorter than the previous one.
        range: `${sheetName}!A:ZZZ`

    });

}

// Clear only data rows and preserve header row
async function clearSheetData(sheetName) {

    await sheets.spreadsheets.values.clear({

        spreadsheetId: SPREADSHEET_ID,

        range: `${sheetName}!A2:ZZZ`

    });

    console.log(
        `✅ Data rows cleared from ${sheetName}; header preserved`
    );

}


// Get spreadsheet details
async function getSpreadsheet() {

    return await sheets.spreadsheets.get({

        spreadsheetId: SPREADSHEET_ID

    });

}


// Check if sheet exists
async function sheetExists(sheetName) {

    const spreadsheet = await getSpreadsheet();

    return spreadsheet.data.sheets.some(

        sheet =>
            sheet.properties.title === sheetName

    );

}


// Create new sheet
async function createSheet(sheetName) {

    await sheets.spreadsheets.batchUpdate({

        spreadsheetId: SPREADSHEET_ID,

        requestBody: {

            requests: [

                {

                    addSheet: {

                        properties: {

                            title: sheetName

                        }

                    }

                }

            ]

        }

    });


    console.log(`✅ Created Google Sheet: ${sheetName}`);

}

// ======================================
// Sync Studio Master to Google Sheets
// ======================================

const supabase = require("../../config/supabase");

async function syncStudioMaster() {

    const { data, error } = await supabase
        .from("studio_master")
        .select("*")
        .order("theatre_name", { ascending: true })
        .order("studio_name", { ascending: true });

    if (error) {
        throw error;
    }

    const values = [

        [
            "id",
            "studio_code",
            "studio_name",
            "theatre_code",
            "theatre_name",
            "city",
            "state",
            "address",
            "contact_person",
            "contact_number",
            "is_active",
            "created_at",
            "updated_at"
        ],

        ...data.map(studio => [

            studio.id,
            studio.studio_code,
            studio.studio_name,
            studio.theatre_code,
            studio.theatre_name,
            studio.city,
            studio.state,
            studio.address,
            studio.contact_person,
            studio.contact_number,
            studio.is_active,
            studio.created_at,
            studio.updated_at

        ])

    ];

    await writeSheet("Studio_Master", values);

    console.log("✅ Studio Master synced to Google Sheet");

}

module.exports = {

    readSheet,

    writeSheet,

    upsertDeliveryStatus,

    reconcileMasterSheet,

    updateInventoryRow,

    clearSheet,

    clearSheetData,

    getSpreadsheet,

    sheetExists,

    createSheet,

    syncStudioMaster

};
