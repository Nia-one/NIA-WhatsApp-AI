const { updateConversation } = require("../../services/conversationService");
const { getProductsPage } = require("../../services/productBrowser");
const { getCart } = require("../../services/cartService");
const { cartFlow } = require("./cartFlow");
async function homeFlow({
    mobile,
    userMessage,
    sendHomeMenu,
    sendProductCatalogue,
    sendProductList,
    sendWhatsAppMessage,
    sendCartButtons,
    sendEmptyCartButtons,
    sendCheckoutButtons
}) {

    if (
    userMessage === "1" ||
    userMessage === "browse_products"
) {

        const page = await getProductsPage(1);

console.log("================================");
console.log("PRODUCT PAGE DEBUG");
console.log("Products on page:", page.products.length);
console.log("Total products:", page.totalProducts);
console.log("Current page:", page.page);
console.log("================================");

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

        await sendProductList(
            mobile,
            page
        );

        return true;
    }

    if (
    userMessage === "2" ||
    userMessage === "view_cart"
) {

    const items = await getCart(mobile);

    await updateConversation(mobile, {
        current_state: "CART"
    });

    await cartFlow({
        mobile,
        userMessage: "",
        sendWhatsAppMessage,
        sendHomeMenu,
        sendProductCatalogue,
        sendProductList,
        sendCartButtons,
        sendEmptyCartButtons,
        sendCheckoutButtons
    });

    return true;
}

    if (
    userMessage === "3" ||
    userMessage === "checkout"
) {

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