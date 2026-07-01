const { sendWhatsAppButtons } = require("./whatsappButtons");

async function sendEmptyCartButtons(mobile) {

    await sendWhatsAppButtons(
        mobile,

`🛒 *Your cart is empty.*

Browse products and add items to continue shopping.`,

        [
    {
        id: "browse_products",
        title: "Browse Products"
    },
    {
        id: "go_home",
        title: "Home"
    }
]
    );

}

module.exports = {
    sendEmptyCartButtons
};