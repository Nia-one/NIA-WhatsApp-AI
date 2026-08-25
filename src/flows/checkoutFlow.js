const {
    createOrder
} = require("../../services/orderService");

const {
    updateConversation
} = require("../../services/conversationService");

async function checkoutFlow({
    mobile,
    state,
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

        const result = await createOrder(mobile, {
            userType: state?.user_type || "DIRECT_CUSTOMER",
            beneficiaryMobile: state?.beneficiary_mobile || mobile,
            retailerId: state?.retailer_id || null,
            retailerName: state?.retailer_name || null
        });

        if (!result || result.code === "EMPTY_CART") {

            await sendEmptyCartButtons(
                mobile
            );

            return true;
        }

        if (!result.success) {
            const message = result.code === "MISSING_ORDER_CONTEXT"
                ? "Customer details are missing. Please type *hi* and select the customer again."
                : "Sorry, we could not confirm your order right now. Your cart is still available. Please try again.";
            await sendWhatsAppMessage(
                mobile,
                message
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
