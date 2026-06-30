require("dotenv").config();

const express = require("express");
const axios = require("axios");
const supabase = require("./config/supabase");
const { getProducts } = require("./services/productService");
const {
    getConversationState,
    saveConversationState,
    updateConversation,
    resetConversation
} = require("./services/conversationService");
const {
    getProductByIndex,
    getNextProduct,
    getProductsPage
} = require("./services/productBrowser");
const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Nia WhatsApp AI Bot is Running");
});

app.get("/test-db", async (req, res) => {

    const products = await getProducts();

    res.json(products);

});
// =======================================
// WEBHOOK VERIFICATION
// =======================================

app.get("/webhook", (req, res) => {

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (
        mode === "subscribe" &&
        token === process.env.VERIFY_TOKEN
    ) {
        console.log("✅ Webhook Verified");
        return res.status(200).send(challenge);
    }

    return res.sendStatus(403);

});

app.post("/webhook", async (req, res) => {

    try {

        const message =
            req.body.entry?.[0]
                ?.changes?.[0]
                ?.value?.messages?.[0];

        if (!message) {
            return res.sendStatus(200);
        }

const mobile = message.from;
const userMessage = (message.text?.body || "").trim();

let state = await getConversationState(mobile);
const command = userMessage.toLowerCase().trim();

if (
    [
        "hi",
        "hello",
        "hey",
        "start",
        "menu",
        "home"
    ].includes(command)
) {

    await updateConversation(
        mobile,
        {
            current_state: "HOME",
            current_product_index: 0,
            last_product_id: null
        }
    );

    await sendHomeMenu(mobile);

    return res.sendStatus(200);

}

console.log("========== DEBUG ==========");
console.log("Raw:", message.text?.body);
console.log("Processed:", JSON.stringify(userMessage));
console.log("State:", state?.current_state || "NEW");
console.log("===========================");

console.log("================================");
console.log("From :", mobile);
console.log("State :", state?.current_state || "NEW");
console.log("Message :", userMessage);
console.log("================================");
// First Time User
if (!state) {

    await saveConversationState(
        mobile,
        "HOME"
    );

    await sendHomeMenu(mobile);

    return res.sendStatus(200);

}
    
console.log("Current State =", state.current_state);
console.log("User Message =", JSON.stringify(userMessage));
// HOME MENU
if (state.current_state === "HOME") {

    console.log(">>> Entered HOME block");
    console.log(">>> Comparing userMessage:", JSON.stringify(userMessage));

    // Option 1
    if (String(userMessage).trim() === "1") {

    const page = await getProductsPage(1);

    if (!page.products.length) {

        await sendWhatsAppMessage(
            mobile,
            "❌ No products are available right now."
        );

        return res.sendStatus(200);

    }

    await updateConversation(
        mobile,
        {
            current_state: "PRODUCT_CATALOGUE",
            current_product_index: 0
        }
    );

    await sendProductCatalogue(
        mobile,
        page
    );

    return res.sendStatus(200);

}

    // Option 2
    if (String(userMessage).trim() === "2") {

        console.log("✅ Matched option 2");

        await sendWhatsAppMessage(
            mobile,
            "🛒 Your cart is currently empty."
        );

        return res.sendStatus(200);

    }

    // Option 3
    if (String(userMessage).trim() === "3") {

        console.log("✅ Matched option 3");

        await sendWhatsAppMessage(
            mobile,
            "✅ Checkout feature is coming next."
        );

        return res.sendStatus(200);

    }

        console.log("❌ No option matched");

    await sendHomeMenu(mobile);
return res.sendStatus(200);

}   // End HOME block

// =======================================
// PRODUCT BROWSING
// =======================================

if (state.current_state === "PRODUCT_BROWSING") {

    // Next Product
    if (String(userMessage).trim() === "2") {

        const item = await getNextProduct(
            state.current_product_index
        );

        if (!item) {

            await sendWhatsAppMessage(
                mobile,
                "✅ You've reached the last product.\n\nReply:\n1️⃣ Start Again\n2️⃣ View Cart\n3️⃣ Main Menu"
            );

            return res.sendStatus(200);

        }

        await updateConversation(
            mobile,
            {
                current_product_index: item.index,
                last_product_id: item.product.id
            }
        );

        await sendProductCard(
            mobile,
            item.product,
            item.index + 1,
            item.total
        );

        return res.sendStatus(200);

    }
    // 👇 ADD THIS BLOCK
    await sendWhatsAppMessage(
        mobile,
`🤔 *I didn't quite understand that.*

Please choose one of the options below:

1️⃣ Add to Cart

2️⃣ Next Product

3️⃣ Main Menu`
    );

    return res.sendStatus(200);

}



    } catch (err) {

        console.error(err);

        res.sendStatus(500);

    }

});

async function sendHomeMenu(mobile) {

    await sendWhatsAppMessage(
        mobile,
`👋 *Welcome to NIA Essentials!*

We're delighted to have you here. 😊

🛍️ Get genuine daily essentials at exclusive member prices, delivered right to your doorstep.

*How may I assist you today?*

━━━━━━━━━━━━━━━━━━
1️⃣ Browse Products

2️⃣ View Cart

3️⃣ Checkout
━━━━━━━━━━━━━━━━━━

💬 Reply with *1*, *2* or *3* to continue.`
    );

}

async function sendInvalidMenu(mobile) {

    await sendWhatsAppMessage(
        mobile,
`🤔 *I didn't quite understand that.*

👋 *Welcome to NIA Essentials!*

Please choose one of the following options:

1️⃣ Browse Products

2️⃣ View Cart

3️⃣ Checkout

💬 Reply with *1*, *2* or *3* to continue.`
    );

}

async function sendProductCard(
    mobile,
    product,
    current,
    total
) {

    await sendWhatsAppMessage(
        mobile,
`🛒 *NIA Essentials*

━━━━━━━━━━━━━━━━━━

🛍️ *Product ${current} of ${total}*

📦 *${product.product_name}*

💰 MRP : ₹${product.mrp}

🔥 NIA Price : ₹${product.nia_price}

🎁 You Save : ₹${product.nia_savings}

━━━━━━━━━━━━━━━━━━

What would you like to do?

1️⃣ Add to Cart

2️⃣ Next Product

3️⃣ Main Menu`
    );

}

async function sendProductCatalogue(
    mobile,
    data
) {

    let msg =
`🛒 *NIA Essentials*

📄 Products ${((data.page - 1) * 5) + 1}-${Math.min(data.page * 5, data.totalProducts)} of ${data.totalProducts}

━━━━━━━━━━━━━━━━━━

`;

    data.products.forEach((p, index) => {

        msg +=
`${index + 1}️⃣ *${p.product_name}*
🏷️ MRP ₹${p.mrp} | 💚 ₹${p.nia_price} | 🎁 Save ₹${p.nia_savings}

`;

    });

    msg +=
`━━━━━━━━━━━━━━━━━━

6️⃣ ⬅️ Previous Page

7️⃣ ➡️ Next Page

8️⃣ 🛒 View Cart

9️⃣ ✅ Checkout

0️⃣ 🏠 Main Menu

💬 Reply with the product number (1-5).`;

    await sendWhatsAppMessage(
        mobile,
        msg
    );

}

async function sendWhatsAppMessage(to, message) {

    try {

        const response = await axios.post(
            `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: to,
                text: {
                    body: message
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("✅ WhatsApp message sent");
        console.log(response.data);

    } catch (error) {

        console.error("❌ Failed to send WhatsApp message");

        if (error.response) {
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }

    }

}

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});