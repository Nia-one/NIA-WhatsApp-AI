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
        id: "add_to_cart",
        title: "Add to Cart"
    },
    {
        id: "back_to_products",
        title: "Back"
    },
    {
        id: "go_home",
        title: "Home"
    }
]
    );

}

module.exports = {
    sendProductDetailsButtons
};