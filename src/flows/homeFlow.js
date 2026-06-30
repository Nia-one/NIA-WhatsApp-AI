const { updateConversation } = require("../../services/conversationService");
const { getProductsPage } = require("../../services/productBrowser");
async function homeFlow({
    mobile,
    userMessage,
    sendHomeMenu,
    sendProductCatalogue,
    sendWhatsAppMessage
}) {

    if (userMessage === "1") {

        const page = await getProductsPage(1);

        if (!page.products.length) {

            await sendWhatsAppMessage(
                mobile,
                "❌ No products are available right now."
            );

            return true;
        }

        await updateConversation(mobile, {
            current_state: "PRODUCT_CATALOGUE",
            current_page: 1,
            current_product_index: 0
        });

        await sendProductCatalogue(
            mobile,
            page
        );

        return true;
    }

    if (userMessage === "2") {

        await sendWhatsAppMessage(
            mobile,
            "🛒 Your cart is currently empty."
        );

        return true;
    }

    if (userMessage === "3") {

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
    await sendHomeMenu(mobile);

    return true;
}

module.exports = {
    homeFlow
};