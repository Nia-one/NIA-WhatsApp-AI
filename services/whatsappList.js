const axios = require("axios");

function truncate(value, maxLength) {
    const text = String(value ?? "")
        .replace(/[\u0000-\u001F\u007F-\u009F]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    if (
        text.length <= maxLength &&
        Buffer.byteLength(text, "utf8") <= maxLength
    ) {
        return text;
    }

    // Meta's validation can count Unicode titles more strictly than plain JS
    // string length. Keep both UTF-16 units and UTF-8 bytes within the limit.
    let result = "";

    for (const character of text) {
        const candidate = result + character;

        if (
            candidate.length > maxLength ||
            Buffer.byteLength(candidate, "utf8") > maxLength
        ) {
            break;
        }

        result = candidate;
    }

    return result.trimEnd();
}

async function sendWhatsAppList(to, body, buttonText, sections) {
    // WhatsApp Cloud API rejects the complete list when even one field is
    // longer than its allowed limit. Normalize dynamic catalogue data here so
    // all list callers are protected.
    const safeSections = sections.map(section => ({
        ...section,
        title: truncate(section.title, 24),
        rows: section.rows.map(row => ({
            ...row,
            id: truncate(row.id, 200),
            title: truncate(row.title, 24),
            ...(row.description
                ? { description: truncate(row.description, 72) }
                : {})
        }))
    }));

    console.log("WhatsApp list row title lengths:", safeSections.flatMap(
        section => section.rows.map(row => ({
            title: row.title,
            utf16Length: row.title.length,
            utf8Bytes: Buffer.byteLength(row.title, "utf8")
        }))
    ));

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
                button: truncate(buttonText, 20),
                sections: safeSections
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

        return true;

    } catch (error) {

        console.error("❌ List Error");

        console.error(
            JSON.stringify(error.response?.data, null, 2)
        );

        return false;

    }

}

module.exports = {
    sendWhatsAppList
};
