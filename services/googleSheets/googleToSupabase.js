const { readSheet } = require("./googleSheetsService");
const supabase = require("../../config/supabase");

async function readProductMaster() {

    console.log("================================");
    console.log("Reading Product_Master...");
    console.log("================================");

    const rows = await readSheet("Product_Master");

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



async function updateProduct(product) {

    console.log("--------------------------------");
    console.log("Updating Product");
    console.log(product.product_name);
    console.log("--------------------------------");


    const { data: existingProduct, error: fetchError } =
        await supabase
            .from("product_master")
            .select("id")
            .eq("product_code", product.product_code)
            .single();


    if (fetchError || !existingProduct) {

        console.log(
            `⚠ Product not found: ${product.product_code}`
        );

        return;

    }


    const { error } = await supabase
        .from("product_master")
        .update({

            product_code: product.product_code,

            sku: product.sku,

            product_name: product.product_name,

            category: product.category,

            brand: product.brand,

            description: product.description,

            purchase_rate: Number(product.purchase_rate),

            mrp: Number(product.mrp),

            nia_price: Number(product.nia_price),

            nia_savings: Number(product.nia_savings),

            unit: product.unit,

            hsn_code: product.hsn_code,

            image_url: product.image_url,


            // Google Sheet TRUE/FALSE conversion
            is_active:
                String(product.is_active).toUpperCase() === "TRUE"

        })
        .eq(
            "product_code",
            product.product_code
        );


    if (error) {

        console.error(error);

        throw error;

    }


    console.log(
        "✅ Updated Successfully:",
        product.product_code
    );

}

module.exports = {
    readProductMaster,
    updateProduct
};