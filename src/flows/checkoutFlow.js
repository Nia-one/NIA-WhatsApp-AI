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
    sendHomeMenu,
    sendCheckoutButtons,
    sendOrderSuccessButtons,
    sendEmptyCartButtons
}) {
    // =========================
    // Confirm Order
    // =========================

    if (
    userMessage === "1" ||
    userMessage === "confirm_order"
) {
        console.log("================================");
console.log("CHECKOUT STARTED");
console.log("Mobile:", mobile);
console.log("Message:", userMessage);
console.log("================================");

        const result = await createOrder(mobile);

        if (!result) {

            await sendEmptyCartButtons(
    mobile
);

return true;

            
        }

        await sendOrderSuccessButtons(
    mobile,
    result.orderId,
    result.total
);

await updateConversation(mobile, {
    current_state: "HOME"
});

return true;
    }

    // =========================
    // Cancel & Go Home
    // =========================

    if (
    userMessage === "2" ||
    userMessage === "cancel_order"
) {

        await updateConversation(mobile, {
            current_state: "HOME"
        });

        await sendHomeMenu(mobile);

        return true;
    }

    // =========================
    // Default Checkout Screen
    // =========================

    await sendCheckoutButtons(
    mobile
);

    return true;
}

module.exports = {
    checkoutFlow
};