const {
    readSheet,
    writeSheet
} = require("./googleSheetService");

async function updateInventorySheet(
    productName,
    totalStock,
    availableStock,
    inventoryStatus,
    lastUpdated
) {

    const sheetName = "Inventory_Master";

    const rows = await readSheet(sheetName);

    if (!rows.length) {
        throw new Error("Inventory_Master sheet is empty.");
    }

    const header = rows[0];

    const productIndex = header.indexOf("product_name");
    const totalStockIndex = header.indexOf("total_stock");
    const availableStockIndex = header.indexOf("available_stock");
    const statusIndex = header.indexOf("inventory_status");
    const updatedIndex = header.indexOf("last_stock_update");

    if (
        productIndex === -1 ||
        totalStockIndex === -1 ||
        availableStockIndex === -1
    ) {
        throw new Error(
            "Inventory_Master column mapping not found."
        );
    }

    const rowIndex = rows.findIndex((row, index) => {

        if (index === 0) return false;

        return row[productIndex] === productName;

    });

    if (rowIndex === -1) {

        throw new Error(
            `${productName} not found in Inventory_Master`
        );

    }

    rows[rowIndex][totalStockIndex] = totalStock;
    rows[rowIndex][availableStockIndex] = availableStock;

    if (statusIndex !== -1) {
        rows[rowIndex][statusIndex] = inventoryStatus;
    }

    if (updatedIndex !== -1) {
        rows[rowIndex][updatedIndex] = lastUpdated;
    }

    await writeSheet(sheetName, rows);

    console.log(
        `✅ Inventory Sheet Updated : ${productName}`
    );

}

module.exports = {
    updateInventorySheet
};