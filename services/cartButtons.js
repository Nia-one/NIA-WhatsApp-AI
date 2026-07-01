const { sendWhatsAppButtons } = require("./whatsappButtons");

async function sendCartButtons(mobile, cartText) {

    await sendWhatsAppButtons(
        mobile,
        cartText,
        [
            {
                type: "reply",
                reply: {
                    id: "checkout",
                    title: "Checkout"
                }
            },
            {
                type: "reply",
                reply: {
                    id: "browse_products",
                    title: "Browse Products"
                }
            },
            {
                type: "reply",
                reply: {
                    id: "clear_cart",
                    title: "Clear Cart"
                }
            }
        ]
    );

}

module.exports = {
    sendCartButtons
};