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

async function getNextProduct(currentIndex) {

    const products = await getProducts();

    const nextIndex = currentIndex + 1;

    if (nextIndex >= products.length) {
        return null;
    }

    return {
        product: products[nextIndex],
        index: nextIndex,
        total: products.length
    };

}

module.exports = {
    getProductByIndex,
    getNextProduct
};