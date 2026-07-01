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
    sendProductList,
    sendWhatsAppMessage,
    sendProductDetailsButtons,
    sendQuantityList

}) {
    // ===============================
    // Product Selection
    // ===============================

    // ===============================
// Product Selected from WhatsApp List
// ===============================

if (userMessage.startsWith("PRODUCT_")) {

    console.log("=================================");
console.log("PRODUCT_ selected");
console.log("Product ID:", userMessage);
console.trace();
console.log("=================================");

    const productId = userMessage.replace("PRODUCT_", "");

    const { getProductById } = require("../../services/productService");

    const selectedProduct = await getProductById(productId);

    if (!selectedProduct) {

        await sendWhatsAppMessage(
            mobile,
            "❌ Product not found."
        );

        return true;

    }

    await updateConversation(mobile, {
    current_state: "PRODUCT_QUANTITY",
    last_product_id: selectedProduct.id
});

await sendQuantityList(
    mobile
);

return true;
}

    if (["1", "2", "3", "4", "5"].includes(userMessage)) {

    const pageSize = 5;
    const page = state.current_page || 1;

    const { getProducts } = require("../../services/productService");
    const products = await getProducts();

    const startIndex = (page - 1) * pageSize;

    const selectedIndex = startIndex + (parseInt(userMessage) - 1);
    const selectedProduct = products[selectedIndex];

    if (!selectedProduct) {
        await sendWhatsAppMessage(
            mobile,
            "❌ Product not found. Please try again."
        );
        return true;
    }

    await updateConversation(mobile, {
        current_state: "PRODUCT_DETAILS",
        current_product_index: selectedIndex,
        last_product_id: selectedProduct.id
    });

    await sendProductDetailsButtons(
    mobile,
    selectedProduct
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

        await sendProductList(
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

    if (
    userMessage === "0" ||
    userMessage === "go_home"
) {

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

await sendProductList(
    mobile,
    page
);

return true;
}

module.exports = {
    catalogueFlow
};