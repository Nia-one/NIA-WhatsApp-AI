require("dotenv").config();

const express = require("express");

const app = express();

app.use(express.json());

// Home Page
app.get("/", (req, res) => {
    res.send("NIA WhatsApp AI Bot is Running");
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
        console.log("Webhook Verified");
        return res.status(200).send(challenge);
    }

    return res.sendStatus(403);

});

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
