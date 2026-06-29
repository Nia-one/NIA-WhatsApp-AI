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

module.exports = {
    getProducts
};