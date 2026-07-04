const { getProducts } = require("./productService");


async function getProductsPage(page = 1) {

    const products = await getProducts();

    const pageSize = 15;

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

async function getProductByPageSelection(page, selection) {

    const products = await getProducts();

   const pageSize = 15;

    const index = ((page - 1) * pageSize) + (selection - 1);

    if (index < 0 || index >= products.length) {
        return null;
    }

    return {
        product: products[index],
        index,
        total: products.length
    };

}

module.exports = {
    getProductsPage,
    getNextPage,
    getPreviousPage,
    getProductByPageSelection
};