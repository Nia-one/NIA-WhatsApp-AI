const { sendWhatsAppButtons } = require("./whatsappButtons");

async function sendCartButtons(mobile, cartText) {

    await sendWhatsAppButtons(
        mobile,
        cartText,
        [
    {
        id: "checkout",
        title: "Checkout"
    },
    {
        id: "browse_products",
        title: "Browse Products"
    },
    {
        id: "clear_cart",
        title: "Clear Cart"
    }
]
    );

}

module.exports = {
    sendCartButtons
};