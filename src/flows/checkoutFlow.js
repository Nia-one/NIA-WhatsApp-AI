const {
    createOrder
} = require("../../services/orderService");

const {
    updateConversation
} = require("../../services/conversationService");

async function checkoutFlow({
    mobile,
    userMessage,
    sendWhatsAppMessage,
    sendHomeMenu
}) {

    // =========================
    // Confirm Order
    // =========================

    if (userMessage === "1") {
        console.log("================================");
console.log("CHECKOUT STARTED");
console.log("Mobile:", mobile);
console.log("Message:", userMessage);
console.log("================================");

        const result = await createOrder(mobile);

        if (!result) {

            await sendWhatsAppMessage(
                mobile,
                "🛒 Your cart is empty. Add items before checkout."
            );

            return true;
        }

        await sendWhatsAppMessage(
            mobile,
`🎉 *Order Placed Successfully!*

🧾 Order ID: ${result.orderId}

💰 Total Paid: ₹${result.total}

🚚 Your order is being processed.

Thank you for shopping with NIA Essentials! 🙌`
        );

        await updateConversation(mobile, {
            current_state: "HOME"
        });

        await sendHomeMenu(mobile);

        return true;
    }

    // =========================
    // Cancel & Go Home
    // =========================

    if (userMessage === "2") {

        await updateConversation(mobile, {
            current_state: "HOME"
        });

        await sendHomeMenu(mobile);

        return true;
    }

    // =========================
    // Default Checkout Screen
    // =========================

    await sendWhatsAppMessage(
        mobile,
`💳 *Checkout*

1️⃣ Confirm Order
2️⃣ Cancel & Go Home`
    );

    return true;
}

module.exports = {
    checkoutFlow
};