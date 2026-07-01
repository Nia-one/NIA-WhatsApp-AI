const { cartFlow } = require("./cartFlow");
const {
    updateConversation
} = require("../../services/conversationService");

const {
    getProductById
} = require("../../services/productService");

const {
    addToCart
} = require("../../services/cartService");

async function productDetailsFlow({
    mobile,
    state,
    userMessage,
    sendWhatsAppMessage,
    sendHomeMenu,
    sendProductCatalogue,
    sendProductDetailsButtons
}) {

    const product = await getProductById(
    state.last_product_id
);

    if (!product) {
        await sendWhatsAppMessage(
            mobile,
            "❌ Product not found. Please go back and try again."
        );
        return true;
    }
// =========================
// Add to Cart
// =========================

if (
    userMessage === "1" ||
    userMessage === "add_to_cart"
) {

    const added = await addToCart(
        mobile,
        product
    );

    if (!added) {

        await sendWhatsAppMessage(
            mobile,
            "❌ Unable to add product to cart."
        );

        return true;

    }

    await updateConversation(
        mobile,
        {
            current_state: "CART"
        }
    );

    await cartFlow({
    mobile,
    userMessage: "",
    sendWhatsAppMessage,
    sendHomeMenu,
    sendProductCatalogue
});

return true;
}

    // =========================
    // Back to Catalogue
    // =========================
    if (
    userMessage === "2" ||
    userMessage === "back_products"
) {

        await updateConversation(mobile, {
            current_state: "PRODUCT_CATALOGUE"
        });

        await sendProductCatalogue(
            mobile,
            await require("../../services/productBrowser").getProductsPage(
                state.current_page || 1
            )
        );

        return true;
    }

    // =========================
    // Main Menu
    // =========================
    if (
    userMessage === "3" ||
    userMessage === "home"
) {

        await updateConversation(mobile, {
            current_state: "HOME"
        });

        await sendHomeMenu(mobile);

        return true;
    }

    // =========================
    // Default - Show Product Again
    // =========================

    await sendProductDetailsButtons(
    mobile,
    product
);

return true;

    return true;
}

module.exports = {
    productDetailsFlow
};