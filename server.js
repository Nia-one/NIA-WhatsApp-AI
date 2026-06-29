require("dotenv").config();

const express = require("express");
const axios = require("axios");
const supabase = require("./config/supabase");
const { getProducts } = require("./services/productService");
const {
    getConversationState,
    saveConversationState
} = require("./services/conversationService");

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

const state = await getConversationState(mobile);

console.log("================================");
console.log("From :", mobile);
console.log("Current State :", state?.current_state || "NEW");
console.log("Text :", message.text?.body);
console.log("================================");

if (!state) {

    await saveConversationState(
        mobile,
        "HOME"
    );

}

await sendWhatsAppMessage(
    mobile,
    "Hello 👋 Welcome to Nia Essentials!\n\n" +
    "1️⃣ Browse Products\n" +
    "2️⃣ View Cart\n" +
    "3️⃣ Checkout"
);

return res.sendStatus(200);

        

    } catch (err) {

        console.error(err);

        res.sendStatus(500);

    }

});

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