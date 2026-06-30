const supabase = require("../config/supabase");

// ==========================================
// Add Product to Cart
// ==========================================

async function addToCart(customerMobile, product) {

    // Check if product already exists
    const { data: existing, error } = await supabase
        .from("cart")
        .select("*")
        .eq("customer_mobile", customerMobile)
        .eq("product_id", product.id)
        .maybeSingle();

    if (error) {
        console.error("Cart Lookup Error:", error);
        return false;
    }

    // Product already in cart → increase quantity
    if (existing) {

        const { error: updateError } = await supabase
            .from("cart")
            .update({
                quantity: existing.quantity + 1,
                updated_at: new Date().toISOString()
            })
            .eq("id", existing.id);

        if (updateError) {
            console.error("Cart Update Error:", updateError);
            return false;
        }

        return true;
    }

    // Insert new product
    const { error: insertError } = await supabase
        .from("cart")
        .insert({
            customer_mobile: customerMobile,
            product_id: product.id,
            quantity: 1,
            price: product.nia_price
        });

    if (insertError) {
        console.error("Cart Insert Error:", insertError);
        return false;
    }

    return true;
}

// ==========================================
// Get Cart
// ==========================================

async function getCart(customerMobile) {

    console.log("Checkout Mobile:", customerMobile);

    const { data, error } = await supabase
        .from("cart")
        .select("*")
        .eq("customer_mobile", customerMobile);

    console.log("Cart Data:", data);
    console.log("Cart Error:", error);

    if (error) {
        console.error(error);
        return [];
    }

    return data || [];
}

// ==========================================
// Clear Cart
// ==========================================

async function clearCart(customerMobile) {

    const { error } = await supabase
        .from("cart")
        .delete()
        .eq("customer_mobile", customerMobile);

    if (error) {
        console.error("Cart Delete Error:", error);
    }

}

module.exports = {
    addToCart,
    getCart,
    clearCart
};