
require("dotenv").config();

const express = require("express");
const axios = require("axios");
const supabase = require("./config/supabase");

// NEW IMPORT
const { 
    homeFlow 
} = require("./src/flows/homeFlow");
const { 
    catalogueFlow 
} = require("./src/flows/catalogueFlow");
const { 
    productDetailsFlow 
} = require("./src/flows/productDetailsFlow");
const { 
    cartFlow 
} = require("./src/flows/cartFlow");
const { 
    checkoutFlow 
} = require("./src/flows/checkoutFlow");
const {
    sendWhatsAppButtons
} = require("./services/whatsappButtons");
const {
    sendWhatsAppList
} = require("./services/whatsappList");
const {
    sendProductDetailsButtons
} = require("./services/productDetailsButtons");
const {
    sendCartButtons
} = require("./services/cartButtons");
const {
    sendCheckoutButtons
} = require("./services/checkoutButtons");

const {
    sendEmptyCartButtons
} = require("./services/emptyCartButtons");

const {
    sendOrderSuccessButtons
} = require("./services/orderSuccessButtons");
const { 
    getProducts 
} = require("./services/productService");

const {
    getConversationState,
    saveConversationState,
    updateConversation,
    resetConversation
} = require("./services/conversationService");

const {
    getProductsPage,
    getNextPage,
    getPreviousPage
} = require("./services/productBrowser");


const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Nia WhatsApp AI Bot is Running");
});

app.get("/test-db", async (req, res) => {

    const products = await getProducts();

    res.json(products[0]);

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
const userMessage = (
    message.text?.body ||
    message.interactive?.button_reply?.id ||
    message.interactive?.list_reply?.id ||
    ""
).trim();

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
console.log("Raw Message:", JSON.stringify(message, null, 2));
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
/*
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
        current_page: 1,
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
    

        console.log("❌ No option matched");

    await sendHomeMenu(mobile);
return res.sendStatus(200);
}   // End HOME block
*/
// =======================================
// HOME
// =======================================


if (state.current_state === "HOME") {

await homeFlow({
    mobile,
    userMessage: String(userMessage).trim(),
    sendHomeMenu,
    sendProductCatalogue,
    sendProductList,
    sendWhatsAppMessage
});
    return res.sendStatus(200);

}

// =======================================
// PRODUCT CATALOGUE
// =======================================

// =======================================
// PRODUCT CATALOGUE
// =======================================

/*
if (state.current_state === "PRODUCT_CATALOGUE") {

    // ===============================
    // Product Selection (1-5)
    // ===============================
    if (["1", "2", "3", "4", "5"].includes(userMessage)) {

        await sendWhatsAppMessage(
            mobile,
            "🛠 Product Details screen will be implemented in the next step."
        );

        return res.sendStatus(200);

    }

    // ===============================
    // Previous Page
    // ===============================
    if (userMessage === "6") {

        await sendWhatsAppMessage(
            mobile,
            "⬅️ Previous Page will be implemented next."
        );

        return res.sendStatus(200);

    }

    // ===============================
    // Next Page
    // ===============================
    if (userMessage === "7") {

    const nextPage = await getNextPage(
        state.current_page || 1
    );

    if (!nextPage.products.length) {

        await sendWhatsAppMessage(
            mobile,
            "✅ You have reached the last page of products."
        );

        return res.sendStatus(200);

    }

    await updateConversation(
        mobile,
        {
            current_page: (state.current_page || 1) + 1
        }
    );

    await sendProductCatalogue(
        mobile,
        nextPage
    );

    return res.sendStatus(200);

}

    // ===============================
    // View Cart
    // ===============================
    if (userMessage === "8") {

        await sendWhatsAppMessage(
            mobile,
            "🛒 Your cart is currently empty."
        );

        return res.sendStatus(200);

    }

    // ===============================
    // Checkout
    // ===============================
    if (userMessage === "9") {

        await sendWhatsAppMessage(
            mobile,
            "✅ Checkout feature is coming soon."
        );

        return res.sendStatus(200);

    }

    // ===============================
    // Main Menu
    // ===============================
    if (userMessage === "0") {

        await updateConversation(
            mobile,
            {
                current_state: "HOME",
                current_product_index: 0
            }
        );

        await sendHomeMenu(mobile);

        return res.sendStatus(200);

    }

    // ===============================
    // Invalid Input
    // ===============================
    const page = await getProductsPage(1);

    await sendProductCatalogue(
        mobile,
        page
    );

    return res.sendStatus(200);

}
*/

// =======================================
// PRODUCT CATALOGUE
// =======================================

if (state.current_state === "PRODUCT_CATALOGUE") {

    await catalogueFlow({
        mobile,
        state,
        userMessage: String(userMessage).trim(),
        sendHomeMenu,
        sendProductCatalogue,
        sendWhatsAppMessage
    });

    return res.sendStatus(200);

}

// =======================================
// PRODUCT DETAILS
// =======================================

if (state.current_state === "PRODUCT_DETAILS") {

    await productDetailsFlow({
    mobile,
    state,
    userMessage,
    sendWhatsAppMessage,
    sendHomeMenu,
    sendProductCatalogue,
    sendProductList,
    sendCartButtons,
    sendProductDetailsButtons
});

    return res.sendStatus(200);

}

// =======================================
// CART
// =======================================

if (state.current_state === "CART") {

    await cartFlow({
    mobile,
    state,
    userMessage,
    sendWhatsAppMessage,
    sendHomeMenu,
    sendProductCatalogue,
    sendProductList,
    sendCartButtons,
    sendEmptyCartButtons,
    sendCheckoutButtons
});

    return res.sendStatus(200);

}

// =======================================
// CHECKOUT
// =======================================

if (state.current_state === "CHECKOUT") {

    await checkoutFlow({
    mobile,
    userMessage,
    sendWhatsAppMessage,
    sendHomeMenu,
    sendCheckoutButtons,
    sendEmptyCartButtons,
    sendOrderSuccessButtons
});

    return res.sendStatus(200);

}



    } catch (err) {

        console.error(err);

        res.sendStatus(500);

    }

});

async function sendHomeMenu(mobile) {

    await sendWhatsAppButtons(
        mobile,

`👋 *Welcome to Nia Essentials!*

We're delighted to have you here. 😊

🛍️ Get genuine daily essentials at exclusive member prices, delivered right to your doorstep.

*How may I assist you today?*`,

        [
    {
        id: "browse_products",
        title: "Shop Now"
    },
    {
        id: "view_cart",
        title: "View Cart"
    },
    {
        id: "checkout",
        title: "Checkout"
    }
]
    );

}


async function sendInvalidMenu(mobile) {

    await sendWhatsAppMessage(
        mobile,
`🤔 *I didn't quite understand that.*

👋 *Welcome to Nia Essentials!*

Please choose one of the following options:

1️⃣ Browse Products

2️⃣ View Cart

3️⃣ Checkout

💬 Reply with *1*, *2* or *3* to continue.`
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

async function sendProductList(mobile, page) {

   const rows = page.products.map(product => ({

   id: `PRODUCT_${product.id}`,

    title: `${product.product_name} (${product.unit})`,
description: `${product.unit} • Nia ₹${product.nia_price} • Save ₹${product.nia_savings}`
}));
await sendWhatsAppList(
    mobile,
    "🛍 *Choose a product from the list below:*",
    "View Products",
    [
        {
            title: "NIA Essentials",
            rows: rows
        }
    ]
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