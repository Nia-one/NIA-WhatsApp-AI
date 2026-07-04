const { readSheet } = require("../googleSheetsService");
const supabase = require("../../../config/supabase");
const { SHEETS, TABLES } = require("../../core/constants");
const { compareObjects } = require("../../core/comparer");

const {
    PRODUCT_COMPARE_FIELDS
} = require("../../core/constants");

async function readProductMaster() {

    console.log("================================");
    console.log("Reading Product_Master...");
    console.log("================================");

    const rows = await readSheet(SHEETS.PRODUCT_MASTER);

    if (!rows || rows.length === 0) {

        console.log("No data found.");

        return [];

    }

    const headers = rows[0];

    const products = rows.slice(1).map(row => {

        console.log(products[0]);
console.log(Object.keys(products[0]));
        const product = {};

        headers.forEach((header, index) => {

            product[header] = row[index];

        });

        return product;

    });

    console.log(`Products Found : ${products.length}`);

    return products;

}

async function getProductByCode(productCode) {

    const { data, error } = await supabase
        .from(TABLES.PRODUCT_MASTER)
        .select("*")
        .eq("product_code", productCode)
        .single();

    if (error) {
        return null;
    }

    return data;

}

async function updateProduct(product) {

    console.log("--------------------------------");
    console.log("Updating Product");
    console.log(product.product_name);
    console.log("--------------------------------");

    

    // Update product
    const { error } = await supabase
        .from(TABLES.PRODUCT_MASTER)
        .update({

            product_code: product.product_code,
            sku: product.sku,
            product_name: product.product_name,
            category: product.category,
            brand: product.brand,
purchase_rate: Number(
    product.purchase_rate ||
    product["Purchase Rate"] ||
    product["purchase_rate"] ||
    0
),
description: product.description,
mrp: Number(product.mrp),
            nia_price: Number(product.nia_price),
            nia_savings: Number(product.mrp) - Number(product.nia_price),
            unit: product.unit,
            hsn_code: product.hsn_code,
            image_url: product.image_url,
            is_active: String(product.is_active).toUpperCase() === "TRUE"

        })
        .eq("product_code", product.product_code);

    if (error) {
        throw error;
    }

    console.log("✅ Updated Successfully");

}

async function createProduct(product) {

    console.log("--------------------------------");
    console.log("Creating New Product");
    console.log(product.product_name);
    console.log("--------------------------------");

    const { error } = await supabase
        .from(TABLES.PRODUCT_MASTER)
        .insert({

        
            product_code: product.product_code,
            sku: product.sku,
            product_name: product.product_name,
            category: product.category,
            brand: product.brand,
purchase_rate: Number(
    product.purchase_rate ||
    product["Purchase Rate"] ||
    product["purchase_rate"] ||
    0
),
description: product.description,
mrp: Number(product.mrp),
            nia_price: Number(product.nia_price),
            nia_savings: Number(product.mrp) - Number(product.nia_price),
            unit: product.unit,
            hsn_code: product.hsn_code,
            image_url: product.image_url,
            is_active: String(product.is_active).toUpperCase() === "TRUE"

        });

    if (error) {
        throw error;
    }

    console.log("✅ New Product Created");

}

async function syncProducts() {

    console.log("================================");
    console.log("Product Sync Started");
    console.log("================================");

    const products = await readProductMaster();

    if (!products.length) {

        console.log("No products found.");
        return;

    }

    for (const product of products) {

    const dbProduct = await getProductByCode(product.product_code);

// ========================================
// NEW PRODUCT
// ========================================

if (!dbProduct) {

    console.log("🆕 New Product Found :", product.product_code);
    console.log(product);

    await createProduct(product);

    continue;

}

const result = compareObjects(
    product,
    dbProduct,
    PRODUCT_COMPARE_FIELDS
);

    if (!result.changed) {

        console.log(`⏩ Skipped : ${product.product_name}`);
        continue;

    }

    console.log(`🔄 Changed Field : ${result.field}`);

    await updateProduct(product);

}

    console.log("================================");
    console.log("Product Sync Completed");
    console.log("================================");

}
module.exports = {
    readProductMaster,
    getProductByCode,
    createProduct,
    updateProduct,
    syncProducts
};