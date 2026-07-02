require("dotenv").config();

const {
    readProductMaster,
    updateProduct
} = require("./services/googleSheets/googleToSupabase");

(async () => {

    const products = await readProductMaster();

    if (!products.length) {
        console.log("No products found.");
        return;
    }

    // Update ONLY the first product
    await updateProduct(products[0]);

})();