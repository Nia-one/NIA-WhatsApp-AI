const supabase = require("../config/supabase");

async function getProducts() {
    const { data, error } = await supabase
        .from("product_master")
        .select("*")
        .eq("is_active", true)
        .order("product_name");

    if (error) {
        console.error("Error fetching products:", error);
        return [];
    }

    return data;
}

// Build the category catalogue from sellable inventory without changing the
// legacy getProducts() behaviour used by other working flows.
async function getAvailableProducts(category = null) {
    const { data: products, error: productError } = await supabase
        .from("product_master")
        .select("*")
        .eq("is_active", true)
        .order("product_name");

    if (productError) {
        console.error("Error fetching active products:", productError);
        return [];
    }

    const productIds = products.map(product => product.id);
    if (!productIds.length) return [];

    const { data: inventory, error: inventoryError } = await supabase
        .from("inventory_master")
        .select("product_id,available_stock")
        .in("product_id", productIds)
        .gt("available_stock", 0);

    if (inventoryError) {
        console.error("Error fetching available inventory:", inventoryError);
        return [];
    }

    const availableIds = new Set(inventory.map(row => String(row.product_id)));
    const wantedCategory = String(category || "").trim().toLocaleLowerCase();

    return products.filter(product => {
        const productCategory = String(product.category || "").trim();
        return productCategory &&
            availableIds.has(String(product.id)) &&
            (!wantedCategory || productCategory.toLocaleLowerCase() === wantedCategory);
    });
}

async function getAvailableCategories() {
    const products = await getAvailableProducts();
    const categories = new Map();

    for (const product of products) {
        const category = String(product.category || "").trim();
        const key = category.toLocaleLowerCase();
        if (!categories.has(key)) categories.set(key, category);
    }

    return [...categories.values()].sort((a, b) => a.localeCompare(b));
}

async function getProductById(id) {

    const { data, error } = await supabase
        .from("product_master")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        console.error(error);
        return null;
    }

    return data;

}
module.exports = {
    getProducts,
    getAvailableProducts,
    getAvailableCategories,
    getProductById
};
