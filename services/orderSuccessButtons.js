const { sendWhatsAppButtons } = require("./whatsappButtons");

async function sendOrderSuccessButtons(
    mobile,
    orderId,
    total
) {

    await sendWhatsAppButtons(
        mobile,

`🎉 *Thank You for Shopping!*

Your order has been successfully placed.

🧾 Order ID: ${orderId}

💰 Order Total: ₹${total}

Thank you for choosing *Nia Essentials*.

💚 We hope to serve you again soon.

Have a wonderful day! 😊`,

        [
            {
                id: "browse_products",
                title: "Shop Again"
            },
            {
                id: "go_home",
                title: "Home"
            }
        ]
    );

}

module.exports = {
    sendOrderSuccessButtons
};