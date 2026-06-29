const supabase = require("../config/supabase");

async function addToCart(customerMobile, productId, qty) {

    const { data, error } = await supabase
        .from("cart_items")
        .insert({
            customer_mobile: customerMobile,
            product_id: productId,
            quantity: qty
        })
        .select();

    if (error) {
        console.error(error);
        return null;
    }

    return data;

}

async function getCart(customerMobile) {

    const { data, error } = await supabase
        .from("cart_items")
        .select(`
            *,
            product_master(
                product_name,
                nia_price
            )
        `)
        .eq("customer_mobile", customerMobile);

    if (error) {
        console.error(error);
        return [];
    }

    return data;

}

module.exports = {
    addToCart,
    getCart
};
