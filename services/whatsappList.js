const axios = require("axios");

async function sendWhatsAppList(to, body, buttonText, sections) {

    try {

        const response = await axios.post(
            `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
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
                        sections: sections
                    }
                }
            },
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

        if (error.response) {
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }

    }

}

module.exports = {
    sendWhatsAppList
};