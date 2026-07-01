const { sendWhatsAppButtons } = require("./whatsappButtons");

async function sendCheckoutButtons(mobile) {

    await sendWhatsAppButtons(
        mobile,

`💳 *Checkout*

Please confirm your order.`,

        [
    {
        id: "confirm_order",
        title: "Confirm Order"
    },
    {
        id: "cancel_order",
        title: "Cancel"
    }
]
    );

}

module.exports = {
    sendCheckoutButtons
};