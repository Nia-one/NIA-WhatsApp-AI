const { sendWhatsAppButtons } = require("./whatsappButtons");

async function sendProductDetailsButtons(mobile, product) {

    await sendWhatsAppButtons(
        mobile,

`🛍 *${product.product_name}*

💰 MRP: ₹${product.mrp}
🔥 NIA Price: ₹${product.nia_price}
🎁 You Save: ₹${product.nia_savings}`,

        [
            {
                type: "reply",
                reply: {
                    id: "add_to_cart",
                    title: "Add to Cart"
                }
            },
            {
                type: "reply",
                reply: {
                    id: "back_products",
                    title: "Back"
                }
            },
            {
                type: "reply",
                reply: {
                    id: "home",
                    title: "Home"
                }
            }
        ]
    );

}

module.exports = {
    sendProductDetailsButtons
};