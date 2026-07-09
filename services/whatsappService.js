const axios = require("axios");

async function sendWhatsAppMessage(to, message) {
    try {

     

console.log("======================================");
console.log("WHATSAPP REQUEST");
console.log("Phone Number ID:", process.env.PHONE_NUMBER_ID);
console.log("Recipient:", to);
console.log("Message:");
console.log(message);
console.log("======================================");

   const response = await axios.post(

            `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",

                to,

                type: "text",

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
        console.log("Status:", response.status);
console.log("Headers:", response.headers);

        return true;

    } catch (error) {

        console.error("❌ Failed to send WhatsApp message");

        if (error.response) {
            console.error(error.response.data);
        } else {
            console.error(error.message);
        }

        return false;
    }
}

module.exports = {
    sendWhatsAppMessage
};