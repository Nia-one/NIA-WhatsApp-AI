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

        const product = {};

        headers.forEach((header, index) => {

            product[header] = row[index];

        });

        return product;

    });

    console.log(`Products Found : ${products.length}`);

    return products;

}

async function getProductById(id) {

    const { data, error } = await supabase
        .from(TABLES.PRODUCT_MASTER)

        .select("*")
        .eq("id", id)
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

    // Check whether the product exists
    const { data: existingProduct, error: fetchError } = await supabase
        .from(TABLES.PRODUCT_MASTER)
        .select("id")
        .eq("id", product.id)
        .single();

    if (fetchError || !existingProduct) {

        console.log(`⚠ Product not found: ${product.product_name}`);
        return;

    }

    // Update product
    const { error } = await supabase
        .from(TABLES.PRODUCT_MASTER)
        .update({

            product_code: product.product_code,
            sku: product.sku,
            product_name: product.product_name,
            category: product.category,
            brand: product.brand,
            description: product.description,
            mrp: Number(product.mrp),
            nia_price: Number(product.nia_price),
            nia_savings: Number(product.nia_savings),
            unit: product.unit,
            hsn_code: product.hsn_code,
            image_url: product.image_url,
            is_active: String(product.is_active).toUpperCase() === "TRUE"

        })
        .eq("id", product.id);

    if (error) {
        throw error;
    }

    console.log("✅ Updated Successfully");

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

    const dbProduct = await getProductById(product.id);

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
    getProductById,
    updateProduct,
    syncProducts
};