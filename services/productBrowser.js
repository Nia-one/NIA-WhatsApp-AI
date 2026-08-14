const {
    getProducts,
    getAvailableProducts,
    searchAvailableProducts
} = require("./productService");


async function getProductsPage(page = 1, category = null) {

    const products = category
        ? await getAvailableProducts(category)
        : await getProducts();

    const normalizedPage = Math.max(
        1,
        Number.parseInt(page, 10) || 1
    );

    // Category pages reserve rows for Next and Back to Categories so the
    // WhatsApp list never exceeds its 10-row limit.
    const pageSize = category ? 8 : 9;

    const start = (normalizedPage - 1) * pageSize;

    const end = start + pageSize;

    return {
        products: products.slice(start, end),
        page: normalizedPage,
        category,
        totalProducts: products.length,
        totalPages: Math.ceil(products.length / pageSize)
    };

}

async function getSearchProductsPage(query, page = 1) {
    const normalizedQuery = String(query || "").trim().slice(0, 50);
    const products = await searchAvailableProducts(normalizedQuery);
    const normalizedPage = Math.max(1, Number.parseInt(page, 10) || 1);
    // Reserve up to three WhatsApp list rows for Next, Search Again and
    // Back to Categories (WhatsApp allows at most 10 rows per list).
    const pageSize = 7;
    const start = (normalizedPage - 1) * pageSize;

    return {
        products: products.slice(start, start + pageSize),
        page: normalizedPage,
        searchQuery: normalizedQuery,
        totalProducts: products.length,
        totalPages: Math.ceil(products.length / pageSize)
    };
}

async function getNextPage(currentPage, category = null) {

    const normalizedPage = Math.max(
        1,
        Number.parseInt(currentPage, 10) || 1
    );

    return getProductsPage(normalizedPage + 1, category);

}

async function getPreviousPage(currentPage, category = null) {

    if (currentPage <= 1) {

        return getProductsPage(1, category);

    }

    return getProductsPage(currentPage - 1, category);

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
    getSearchProductsPage,
    getNextPage,
    getPreviousPage,
    getProductByPageSelection
};
