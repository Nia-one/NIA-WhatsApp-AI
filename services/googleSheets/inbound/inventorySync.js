const { readSheet } = require("../googleSheetsService");
const supabase = require("../../../config/supabase");
const { SHEETS, TABLES } = require("../../core/constants");
const { compareObjects } = require("../../core/comparer");
const { INVENTORY_COMPARE_FIELDS } = require("../../core/constants");
const crypto = require("crypto");

async function getInventoryByProductCode(productCode) {

    const { data, error } = await supabase
        .from(TABLES.INVENTORY_MASTER)
        .select("*")
        .eq("product_code", productCode)
        .single();

    if (error) {
        return null;
    }

    return data;
}

async function createInventory(inventory) {

    console.log("--------------------------------");
    console.log(`Creating Inventory : ${inventory.product_code}`);
    console.log("--------------------------------");

// Find the Product ID from Product Master
const { data: product, error: productError } = await supabase
    .from(TABLES.PRODUCT_MASTER)
    .select("id")
    .eq("product_code", inventory.product_code)
    .single();

if (productError || !product) {
    throw new Error(
        `Product not found : ${inventory.product_code}`
    );
}

    const { error } = await supabase
        .from(TABLES.INVENTORY_MASTER)
        .insert({
            id: crypto.randomUUID(),
            product_id: product.id,
            product_code: inventory.product_code,
            product_name: inventory.product_name,
            total_stock: Number(inventory.total_stock) || 0,
            reserved_stock: Number(inventory.reserved_stock) || 0,
            available_stock: Number(inventory.available_stock) || 0,
            reorder_level: Number(inventory.reorder_level) || 20,
            inventory_status: inventory.inventory_status || "In Stock",
            warehouse_location: inventory.warehouse_location || "Main Warehouse",
            last_stock_update: new Date().toISOString()
        });

    if (error) {
        throw error;
    }

    console.log(`✅ Inventory Created : ${inventory.product_code}`);
}

async function updateInventory(inventory) {

    console.log("--------------------------------");
    console.log(`Updating Inventory : ${inventory.product_code}`);
    console.log("--------------------------------");

    const total = Number(inventory.total_stock);
    const reserved = Number(inventory.reserved_stock);
    const available = Number(inventory.available_stock);
    const reorder = Number(inventory.reorder_level);

    // Validation

    if (
        total < 0 ||
        reserved < 0 ||
        available < 0
    ) {
        console.log("❌ Stock values cannot be negative.");
        return;
    }

    if (reserved > total) {
        console.log("❌ Reserved stock cannot exceed Total stock.");
        return;
    }

    if (available > total) {
        console.log("❌ Available stock cannot exceed Total stock.");
        return;
    }

    // IMPORTANT:
    // Do NOT overwrite stock maintained by the application.
    // Only sync static configuration fields from Google Sheets.

    const { error } = await supabase
        .from(TABLES.INVENTORY_MASTER)
        .update({
            reorder_level: reorder,
            warehouse_location: inventory.warehouse_location
        })
        .eq("product_code", inventory.product_code);

    if (error) {
        throw error;
    }

    console.log(`✅ Inventory Updated : ${inventory.product_code}`);
}

async function syncInventory() {

    console.log("================================");
    console.log("Inventory Sync Started");
    console.log("================================");

    const inventoryList = await readInventoryMaster();

    if (!inventoryList.length) {
        console.log("No inventory records found.");
        return;
    }

    for (const inventory of inventoryList) {

        const dbInventory = await getInventoryByProductCode(
            inventory.product_code
        );

        if (!dbInventory) {

    console.log(`➕ Creating Inventory : ${inventory.product_code}`);

    await createInventory(inventory);

    continue;
}

        const result = compareObjects(
            inventory,
            dbInventory,
            INVENTORY_COMPARE_FIELDS
        );

        if (!result.changed) {
            console.log(`⏩ Skipped : ${inventory.product_code}`);
            continue;
        }

        console.log(`🔄 Changed Field : ${result.field}`);

        await updateInventory(inventory);
    }

    console.log("================================");
    console.log("Inventory Sync Completed");
    console.log("================================");
}

async function readInventoryMaster() {

    console.log("================================");
    console.log("Reading Inventory_Master...");
    console.log("================================");

    const rows = await readSheet(SHEETS.INVENTORY_MASTER);

    if (!rows || rows.length === 0) {
        return [];
    }

    const headers = rows[0];

    return rows.slice(1).map(row => {

        const inventory = {};

        headers.forEach((header, index) => {
            inventory[header] = row[index];
        });

        return inventory;
    });
}

module.exports = {
    readInventoryMaster,
    getInventoryByProductCode,
    updateInventory,
    syncInventory
};