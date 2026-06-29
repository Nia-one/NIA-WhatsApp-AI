require("dotenv").config();

const express = require("express");
const axios = require("axios");
const supabase = require("./config/supabase");

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Nia WhatsApp AI Bot is Running");
});

app.get("/test-db", async (req, res) => {

    const url =
        process.env.SUPABASE_URL +
        "/rest/v1/product_master?select=*";

    try {

        const response = await fetch(url, {
            headers: {
                apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
                Authorization:
                    `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
            }
        });

        const data = await response.text();

        console.log(data);

        res.send(data);

    } catch (err) {

        console.error(err);

        res.status(500).send(err.message);

    }

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

        console.log("================================");
        console.log("From :", message.from);
        console.log("Type :", message.type);
        console.log("Text :", message.text?.body);
        console.log("================================");

        await sendWhatsAppMessage(
            message.from,
            "Hello 👋 Welcome to NIA Essentials!"
        );

        res.sendStatus(200);

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