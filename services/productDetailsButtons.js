const { sendWhatsAppButtons } = require("./whatsappButtons");

async function sendProductDetailsButtons(mobile, product) {

    await sendWhatsAppButtons(
        mobile,

`🛍 *${product.product_name}*

📦 Unit: ${product.unit}

💰 MRP: ₹${product.mrp}
🔥 Nia Price: ₹${product.nia_price}
🎁 You Save: ₹${product.nia_savings}`,

        [
            {
                type: "reply",
                reply: {
                    id: "add_to_cart",
                    title: "🛒 Add to Cart"
                }
            },
            {
                type: "reply",
                reply: {
                    id: "back_to_products",
                    title: "⬅️ Back"
                }
            },
            {
                type: "reply",
                reply: {
                    id: "go_home",
                    title: "🏠 Home"
                }
            }
        ]
    );

}

module.exports = {
    sendProductDetailsButtons
};