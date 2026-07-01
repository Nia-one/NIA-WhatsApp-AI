const {
    getCart,
    clearCart
} = require("../../services/cartService");

const {
    getProductById
} = require("../../services/productService");

const {
    updateConversation
} = require("../../services/conversationService");

async function cartFlow({
    mobile,
    userMessage,
    sendWhatsAppMessage,
    sendHomeMenu,
    sendProductCatalogue,
    sendProductList,
    sendCartButtons,
    sendEmptyCartButtons,
    sendCheckoutButtons
}) {

    const items = await getCart(mobile);

    // =========================
// EMPTY CART
// =========================
if (!items.length) {

    await sendEmptyCartButtons(
        mobile
    );

    return true;
}

    // =========================
    // BUILD CART MESSAGE
    // =========================
    let total = 0;
    let msg = `🛒 *Your Cart*\n\n━━━━━━━━━━━━━━\n\n`;

    for (const item of items) {

        const product = await getProductById(item.product_id);

        if (!product) continue;

        const lineTotal = item.price * item.quantity;
        total += lineTotal;

        msg += `📦 ${product.product_name}
Qty: ${item.quantity}
Price: ₹${item.price}
Subtotal: ₹${lineTotal}

`;
    }

    msg += `━━━━━━━━━━━━━━

💰 *Total: ₹${total}*`;

    // =========================
    // SEND DEFAULT CART VIEW
    // =========================
    // =========================
// SHOW CART AFTER ADD TO CART
// =========================
if (
    !userMessage ||
    userMessage === "add_to_cart"
) {

    console.log("Showing cart buttons...");

    await sendCartButtons(
        mobile,
        msg
    );

    return true;
}

    // =========================
    // CHECKOUT
    // =========================
    if (
    userMessage === "1" ||
    userMessage === "checkout"
) {

    await updateConversation(mobile, {
        current_state: "CHECKOUT"
    });

    await sendCheckoutButtons(
        mobile
    );

    return true;
}

    // =========================
    // CONTINUE SHOPPING
    // =========================
    if (
    
    userMessage === "2" ||
    userMessage === "browse_products"
) {

    const page = await require("../../services/productBrowser")
        .getProductsPage(1);

    await sendProductList(
        mobile,
        page
    );

    return true;
}

    // =========================
    // CLEAR CART
    // =========================
    if (
    userMessage === "3" ||
    userMessage === "clear_cart"
) {

        await clearCart(mobile);

        await sendWhatsAppMessage(
            mobile,
            "🧹 Cart cleared successfully."
        );

        await sendHomeMenu(mobile);

        return true;
    }

    // =========================
    // HOME
    // =========================
    if (userMessage === "0") {

        await sendHomeMenu(mobile);
        return true;
    }

    // =========================
    // DEFAULT → SHOW CART AGAIN
    // =========================
    await sendWhatsAppMessage(mobile, msg);

    return true;
}

module.exports = {
    cartFlow
};