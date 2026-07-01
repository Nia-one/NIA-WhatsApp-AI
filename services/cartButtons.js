const { sendWhatsAppButtons } = require("./whatsappButtons");

async function sendCartButtons(mobile, cartText) {
console.log("===== SENDING CART BUTTONS =====");
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