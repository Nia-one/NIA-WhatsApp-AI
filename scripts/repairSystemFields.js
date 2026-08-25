require("dotenv").config();

const supabase = require("../config/supabase");
const sheets = require("../config/google");
const { readSheet } = require("../services/googleSheets/googleSheetsService");
const { syncProducts } = require("../services/googleSheets/inbound/productSync");
const { syncInventory } = require("../services/googleSheets/inbound/inventorySync");
const { syncStudios } = require("../services/googleSheets/inbound/studioSync");
const { syncGuests } = require("../services/googleSheets/inbound/guestSync");
const { syncTable } = require("../services/googleSheets/syncEngine");

async function fixDuplicateProductSkus() {
    const rows = await readSheet("Product_Master");
    const headers = rows[0];
    const codeIndex = headers.indexOf("product_code");
    const skuIndex = headers.indexOf("sku");
    const { data: databaseProducts, error } = await supabase
        .from("product_master")
        .select("product_code,sku");
    if (error) throw error;
    const skuOwner = new Map(databaseProducts.map(row => [row.sku, row.product_code]));
    const seen = new Map();
    let changed = 0;
    const updates = [];

    for (const [index, row] of rows.slice(1).entries()) {
        const code = String(row[codeIndex] || "").trim();
        let sku = String(row[skuIndex] || "").trim();
        if (!code) continue;
        const conflictsWithDatabase = skuOwner.has(sku) && skuOwner.get(sku) !== code;
        const conflictsInSheet = seen.has(sku) && seen.get(sku) !== code;
        if (!sku || conflictsWithDatabase || conflictsInSheet) {
            sku = `AUTO-${code}`;
            updates.push({
                range: `Product_Master!${columnToLetter(skuIndex + 1)}${index + 2}`,
                values: [[sku]]
            });
            changed++;
        }
        seen.set(sku, code);
    }

    for (let index = 0; index < updates.length; index += 500) {
        await sheets.spreadsheets.values.batchUpdate({
            spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
            requestBody: {
                valueInputOption: "RAW",
                data: updates.slice(index, index + 500)
            }
        });
    }
    return changed;
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

async function main() {
    const duplicateSkusReplaced = await fixDuplicateProductSkus();
    await syncProducts();
    await syncInventory();
    await syncStudios();
    await syncGuests();

    for (const [table, sheet] of [
        ["product_master", "Product_Master"],
        ["inventory_master", "Inventory_Master"],
        ["studio_master", "Studio_Master"],
        ["guest_master", "Guest_Master"]
    ]) await syncTable(table, sheet);

    console.log(JSON.stringify({ duplicateSkusReplaced }, null, 2));
}

main().catch(error => {
    console.error(error);
    process.exit(1);
});
