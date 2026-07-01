const { sendWhatsAppButtons } = require("./whatsappButtons");

async function sendEmptyCartButtons(mobile) {

    await sendWhatsAppButtons(
        mobile,

`🛒 *Your cart is empty.*

Browse products and add items to continue shopping.`,

        [
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
                    id: "go_home",
                    title: "Home"
                }
            }
        ]
    );

}

module.exports = {
    sendEmptyCartButtons
};