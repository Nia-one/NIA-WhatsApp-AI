const sheets = require("../../config/google");
require("dotenv").config();

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;

console.log("================================");
console.log("GOOGLE_SPREADSHEET_ID =", SPREADSHEET_ID);
console.log("================================");


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

    let range = sheetName;


    // Add A1 only when caller provides only sheet name
    if (!sheetName.includes("!")) {

        range = `${sheetName}!A1`;

    }


    await sheets.spreadsheets.values.update({

        spreadsheetId: SPREADSHEET_ID,

        range,

        valueInputOption: "RAW",

        requestBody: {

            values

        }

    });


    console.log(`✅ Written data to ${range}`);

}


// Clear a sheet
async function clearSheet(sheetName) {

    await sheets.spreadsheets.values.clear({

        spreadsheetId: SPREADSHEET_ID,

        range: sheetName

    });

}


// Get spreadsheet details
async function getSpreadsheet() {

    return await sheets.spreadsheets.get({

        spreadsheetId: SPREADSHEET_ID

    });

}


// Check if sheet exists
async function sheetExists(sheetName) {

    const spreadsheet = await getSpreadsheet();

    return spreadsheet.data.sheets.some(

        sheet =>
            sheet.properties.title === sheetName

    );

}


// Create new sheet
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

// ======================================
// Sync Studio Master to Google Sheets
// ======================================

const supabase = require("../../config/supabase");

async function syncStudioMaster() {

    const { data, error } = await supabase
        .from("studio_master")
        .select("*")
        .order("theatre_name", { ascending: true })
        .order("studio_name", { ascending: true });

    if (error) {
        throw error;
    }

    const values = [

        [
            "id",
            "studio_code",
            "studio_name",
            "theatre_code",
            "theatre_name",
            "city",
            "state",
            "address",
            "contact_person",
            "contact_number",
            "is_active",
            "created_at",
            "updated_at"
        ],

        ...data.map(studio => [

            studio.id,
            studio.studio_code,
            studio.studio_name,
            studio.theatre_code,
            studio.theatre_name,
            studio.city,
            studio.state,
            studio.address,
            studio.contact_person,
            studio.contact_number,
            studio.is_active,
            studio.created_at,
            studio.updated_at

        ])

    ];

    await writeSheet("Studio_Master", values);

    console.log("✅ Studio Master synced to Google Sheet");

}

module.exports = {

    readSheet,

    writeSheet,

    clearSheet,

    getSpreadsheet,

    sheetExists,

    createSheet,

    syncStudioMaster

};