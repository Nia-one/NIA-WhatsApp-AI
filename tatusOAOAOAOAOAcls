const axios = require("axios");

async function sendWhatsAppList(to, body, buttonText, sections) {

    throw new Error("WHATSAPP LIST FUNCTION EXECUTED");

    const payload = {
        messaging_product: "whatsapp",
        to,
        type: "interactive",
        interactive: {
            type: "list",
            body: {
                text: body
            },
            action: {
                button: buttonText,
                sections
            }
        }
    };

    console.log("================================");
    console.log("WHATSAPP LIST PAYLOAD");
    console.log(JSON.stringify(payload, null, 2));
    console.log("================================");

    try {

        const response = await axios.post(
            `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/messages`,
            payload,
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );

        console.log("✅ WhatsApp List sent");

    } catch (error) {

        console.error("❌ List Error");

        console.error(
            JSON.stringify(error.response?.data, null, 2)
        );

    }

}

module.exports = {
    sendWhatsAppList
};