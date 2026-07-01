const axios = require("axios");

async function sendWhatsAppButtons(to, body, buttons) {

    try {

        const response = await axios.post(
            `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: {
                        text: body
                    },
                    action: {
                        buttons: buttons.map(button => ({
                            type: "reply",
                            reply: {
                                id: button.id,
                                title: button.title
                            }
                        }))
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

        console.log("✅ WhatsApp buttons sent");
        console.log(response.data);

    } catch (error) {

        console.error("❌ Failed to send WhatsApp buttons");

        if (error.response) {
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }

    }

}

module.exports = {
    sendWhatsAppButtons
};