const sheets = require("./config/google");

async function testGoogleConnection() {

    try {

        const spreadsheetId = "1C8y3uVxp5toMwLBPGVWbltOoNX_hVuKtvyfiqIUC0oY";

        const response = await sheets.spreadsheets.get({
            spreadsheetId
        });

        console.log("================================");
        console.log("✅ Google Sheets Connected");
        console.log("Spreadsheet :", response.data.properties.title);
        console.log("================================");

    } catch (err) {

        console.log("================================");
        console.log("❌ Google Connection Failed");
        console.log(err.message);
        console.log("================================");

    }

}

testGoogleConnection();