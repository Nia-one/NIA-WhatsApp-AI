const { sendWhatsAppButtons } = require("./whatsappButtons");

async function sendProductDetailsButtons(
    mobile,
    product,
    quantity
) {

    await sendWhatsAppButtons(
        mobile,

`🛍 *${product.product_name}*

📦 Unit: ${product.unit}

📦 Selected Qty: ${quantity}

💰 MRP: ₹${product.mrp}
🔥 Nia Price: ₹${product.nia_price}

💵 Total Amount: ₹${product.nia_price * quantity}

🎁 You Save: ₹${product.nia_savings * quantity}`        [
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