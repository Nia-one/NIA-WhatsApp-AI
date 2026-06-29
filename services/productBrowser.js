const { getProducts } = require("./productService");

async function getProductByIndex(index) {

    const products = await getProducts();

    if (!products || index >= products.length) {
        return null;
    }

    return {
        product: products[index],
        total: products.length
    };

}

module.exports = {
    getProductByIndex
};