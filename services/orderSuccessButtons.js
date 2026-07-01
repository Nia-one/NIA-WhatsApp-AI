const { sendWhatsAppButtons } = require("./whatsappButtons");

async function sendOrderSuccessButtons(
    mobile,
    orderId,
    total
) {

    await sendWhatsAppButtons(
        mobile,

`🎉 *Order Placed Successfully!*

🧾 Order ID: ${orderId}

💰 Total Paid: ₹${total}

🚚 Your order has been received and is being processed.

Thank you for shopping with *Nia Essentials*! ❤️`,

        [
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
    sendOrderSuccessButtons
};