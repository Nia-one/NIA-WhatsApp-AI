function buildProductDetails(product) {

    return `🛍️ *${product.product_name}*

🏷 SKU : ${product.sku}

🏢 Brand : ${product.brand}

📂 Category : ${product.category}

📦 Unit : ${product.unit}

━━━━━━━━━━━━━━━━━━

💰 MRP : ₹${product.mrp}

💚 NIA Price : ₹${product.nia_price}

🎁 You Save : ₹${product.nia_savings}

━━━━━━━━━━━━━━━━━━

📝 Description

${product.description || "No description available."}

━━━━━━━━━━━━━━━━━━

1️⃣ Add to Cart

2️⃣ Back to Catalogue

3️⃣ Main Menu`;

}

module.exports = {
    buildProductDetails
};