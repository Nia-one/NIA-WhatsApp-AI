require("dotenv").config();

const express = require("express");
const axios = require("axios");
const supabase = require("./config/supabase");

const app = express();

app.use(express.json());

// Home Page
app.get("/", (req, res) => {
    res.send("NIA WhatsApp AI Bot is Running");
});

// WhatsApp Verification
app.get("/webhook", (req, res) => {

    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (
        mode === "subscribe" &&
        token === process.env.VERIFY_TOKEN
    ) {
        console.log("Webhook Verified");
        return res.status(200).send(challenge);
    }

    return res.sendStatus(403);

});
// 👇 ADD THIS HERE
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
// Send automatic reply
await sendWhatsAppMessage(
    message.from,
    "Hello 👋 Welcome to Nia Essentials!"
);
        res.sendStatus(200);

    } catch (err) {

        console.error(err);
        res.sendStatus(500);

    }

});

// Paste the new function here

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

    console.log("✅ Message Sent");
    console.log(response.data);

  } catch (error) {

    console.error("❌ Failed to send");

    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
}


// =======================================
// RECEIVE WHATSAPP MESSAGES
// =======================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


app.post("/webhook", (req, res) => {

    console.log("################################");
    console.log("REAL WEBHOOK HIT");
    console.log("Headers:", req.headers);
    console.log("Body:", JSON.stringify(req.body));
    console.log("################################");

    res.sendStatus(200);
});
