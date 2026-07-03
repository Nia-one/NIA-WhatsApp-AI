const supabase = require("../../config/supabase");

const {
    clearSheet,
    writeSheet,
    sheetExists,
    createSheet
} = require("./googleSheetsService");

async function syncTable(tableName, sheetName) {

    console.log("================================");
    console.log(`Sync Started : ${tableName}`);
    console.log("================================");

    const { data, error } = await supabase
        .from(tableName)
        .select("*");

    if (error) {
        throw error;
    }

    if (!data || data.length === 0) {

        console.log(`No data found in ${tableName}`);
        return;
    }

    const headers = Object.keys(data    [0]);

    const rows = data.map(row => headers.map(col => row[col]));

    const values = [
        headers,
        ...rows
    ];

    const exists = await sheetExists(sheetName);

// Check if Google Sheet tab exists
if (!exists) {

    console.log(`📄 ${sheetName} not found. Creating...`);

    await createSheet(sheetName);

}

// Do NOT overwrite master sheets.
// They are maintained in Google Sheets and synced to Supabase.
const masterSheets = [
    "Product_Master",
    "Inventory_Master",
    "Studio_Master"
];

if (masterSheets.includes(sheetName)) {

    console.log(`⏩ Skipping Google Sheet overwrite for ${sheetName}`);

    return;

}

// Transaction sheets are synced from Supabase → Google Sheets
await clearSheet(sheetName);
await writeSheet(sheetName, values);

    console.log(`✅ ${tableName} synced successfully.`);
}

module.exports = {
    syncTable
};