const { getProducts } = require("./productService");


async function getProductsPage(page = 1) {

    const products = await getProducts();

    const normalizedPage = Math.max(
        1,
        Number.parseInt(page, 10) || 1
    );

    const pageSize = 9;

    const start = (normalizedPage - 1) * pageSize;

    const end = start + pageSize;

    return {
        products: products.slice(start, end),
        page: normalizedPage,
        totalProducts: products.length,
        totalPages: Math.ceil(products.length / pageSize)
    };

}

async function getNextPage(currentPage) {

    const normalizedPage = Math.max(
        1,
        Number.parseInt(currentPage, 10) || 1
    );

    return getProductsPage(normalizedPage + 1);

}

async function getPreviousPage(currentPage) {

    if (currentPage <= 1) {

        return getProductsPage(1);

    }

    return getProductsPage(currentPage - 1);

}

async function getProductByPageSelection(page, selection) {

    const products = await getProducts();

   const pageSize = 9;

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
