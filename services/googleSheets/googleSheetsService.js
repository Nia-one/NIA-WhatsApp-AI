const sheets = require("../../config/google");
require("dotenv").config();
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
// Read data from a sheet
async function readSheet(sheetName) {

    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: sheetName
    });

    return response.data.values || [];
}

// Write data to a sheet
async function writeSheet(sheetName, values) {

    await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: sheetName,
        valueInputOption: "RAW",
        requestBody: {
            values
        }
    });

}

// Clear a sheet
async function clearSheet(sheetName) {

    await sheets.spreadsheets.values.clear({
        spreadsheetId: SPREADSHEET_ID,
        range: sheetName
    });

}

async function getSpreadsheet() {

    return await sheets.spreadsheets.get({
        spreadsheetId: SPREADSHEET_ID
    });

}

async function sheetExists(sheetName) {

    const spreadsheet = await getSpreadsheet();

    return spreadsheet.data.sheets.some(
        sheet =>
            sheet.properties.title === sheetName
    );

}

async function createSheet(sheetName) {

    await sheets.spreadsheets.batchUpdate({

    spreadsheetId: SPREADSHEET_ID,
        requestBody: {

            requests: [

                {

                    addSheet: {

                        properties: {

                            title: sheetName

                        }

                    }

                }

            ]

        }

    });

    console.log(`✅ Created Google Sheet: ${sheetName}`);

}

module.exports = {
    readSheet,
    writeSheet,
    clearSheet,
    getSpreadsheet,
    sheetExists,
    createSheet
};