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

async function getProductsPage(page = 1) {

    const products = await getProducts();

    const pageSize = 5;

    const start = (page - 1) * pageSize;

    const end = start + pageSize;

    return {
        products: products.slice(start, end),
        page,
        totalProducts: products.length,
        totalPages: Math.ceil(products.length / pageSize)
    };

}

async function getNextPage(currentPage) {

    return getProductsPage(currentPage + 1);

}

async function getPreviousPage(currentPage) {

    if (currentPage <= 1) {

        return getProductsPage(1);

    }

    return getProductsPage(currentPage - 1);

}
module.exports = {
    getProductByIndex,
    getNextProduct,
    getProductsPage,
    getNextPage,
    getPreviousPage
};