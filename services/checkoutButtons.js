const { sendWhatsAppButtons } = require("./whatsappButtons");

async function sendCheckoutButtons(mobile) {

    await sendWhatsAppButtons(
        mobile,

`💳 *Checkout*

Please confirm your order.`,

        [
            {
                type: "reply",
                reply: {
                    id: "confirm_order",
                    title: "Confirm Order"
                }
            },
            {
                type: "reply",
                reply: {
                    id: "cancel_order",
                    title: "Cancel"
                }
            }
        ]
    );

}

module.exports = {
    sendCheckoutButtons
};