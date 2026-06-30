const {
    updateConversation
} = require("../../services/conversationService");

const {
    getProductsPage,
    getNextPage
} = require("../../services/productBrowser");

async function catalogueFlow({

    mobile,
    state,
    userMessage,

    sendHomeMenu,
    sendProductCatalogue,
    sendWhatsAppMessage

}) {

    // ===============================
    // Product Selection
    // ===============================

    if (["1", "2", "3", "4", "5"].includes(userMessage)) {

        await sendWhatsAppMessage(
            mobile,
            "🛠 Product Details screen will be implemented in the next step."
        );

        return true;

    }

    // ===============================
    // Previous Page
    // ===============================

    if (userMessage === "6") {

        await sendWhatsAppMessage(
            mobile,
            "⬅️ Previous Page will be implemented next."
        );

        return true;

    }

    // ===============================
    // Next Page
    // ===============================

    if (userMessage === "7") {

        const nextPage = await getNextPage(
            state.current_page || 1
        );

        if (!nextPage.products.length) {

            await sendWhatsAppMessage(
                mobile,
                "✅ You have reached the last page of products."
            );

            return true;

        }

        await updateConversation(
            mobile,
            {
                current_page: (state.current_page || 1) + 1
            }
        );

        await sendProductCatalogue(
            mobile,
            nextPage
        );

        return true;

    }

    // ===============================
    // View Cart
    // ===============================

    if (userMessage === "8") {

        await sendWhatsAppMessage(
            mobile,
            "🛒 Your cart is currently empty."
        );

        return true;

    }

    // ===============================
    // Checkout
    // ===============================

    if (userMessage === "9") {

        await sendWhatsAppMessage(
            mobile,
            "✅ Checkout feature is coming soon."
        );

        return true;

    }

    // ===============================
    // Main Menu
    // ===============================

    if (userMessage === "0") {

        await updateConversation(
            mobile,
            {
                current_state: "HOME",
                current_product_index: 0
            }
        );

        await sendHomeMenu(mobile);

        return true;

    }

    // ===============================
    // Invalid Input
    // ===============================

    const page = await getProductsPage(1);

    await sendProductCatalogue(
        mobile,
        page
    );

    return true;

}

module.exports = {
    catalogueFlow
};