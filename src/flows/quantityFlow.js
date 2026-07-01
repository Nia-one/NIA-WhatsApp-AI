const { updateConversation } = require("../services/conversationService");
const { getProductById } = require("../services/productService");

async function quantityFlow({
    mobile,
    userMessage,
    sendQuantityList,
    sendProductDetailsButtons
}) {

    console.log(`FLOW: PRODUCT_QUANTITY --> ${userMessage}`);

    // -----------------------------
    // Quantity Selected
    // -----------------------------

    if (userMessage.startsWith("QTY_")) {

        const qty = parseInt(
            userMessage.replace("QTY_", "")
        );

        const state = await require("../services/conversationService")
            .getConversation(mobile);

        const product = await getProductById(
            state.last_product_id
        );

        await updateConversation(
            mobile,
            {
                current_state: "PRODUCT_DETAILS",
                selected_quantity: qty
            }
        );

        await sendProductDetailsButtons(
            mobile,
            product,
            qty
        );

        return;
    }

    await sendQuantityList(mobile);

}

module.exports = {
    quantityFlow
};