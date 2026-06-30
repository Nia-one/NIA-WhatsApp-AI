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
    sendProductCatalogue
}) {

    const items = await getCart(mobile);

    // =========================
    // EMPTY CART
    // =========================
    if (!items.length) {

        await sendWhatsAppMessage(
            mobile,
            "🛒 Your cart is empty.\n\n1️⃣ Continue Shopping\n0️⃣ Home"
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

    msg += `━━━━━━━━━━━━━━\n\n💰 *Total: ₹${total}*

1️⃣ Checkout
2️⃣ Continue Shopping
3️⃣ Clear Cart
0️⃣ Home`;

    // =========================
    // SEND DEFAULT CART VIEW
    // =========================
    if (!userMessage) {
        await sendWhatsAppMessage(mobile, msg);
        return true;
    }

    // =========================
    // CHECKOUT
    // =========================
    if (userMessage === "1") {

        await updateConversation(mobile, {
            current_state: "CHECKOUT"
        });

        await sendWhatsAppMessage(
            mobile,
`💳 *Checkout*

1️⃣ Confirm Order
2️⃣ Cancel & Go Home`
        );

        return true;
    }

    // =========================
    // CONTINUE SHOPPING
    // =========================
    if (userMessage === "2") {

        await sendProductCatalogue(
            mobile,
            await require("../../services/productBrowser")
                .getProductsPage(1)
        );

        return true;
    }

    // =========================
    // CLEAR CART
    // =========================
    if (userMessage === "3") {

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