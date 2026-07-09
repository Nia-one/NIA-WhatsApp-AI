const supabase = require("../../config/supabase");

const {
    clearSheet,
    writeSheet,
    sheetExists,
    createSheet
} = require("./googleSheetsService");


async function syncTable(tableName, sheetName) {

    console.log("================================");
    console.log(`Sync Started : ${tableName}`);
    console.log("================================");


    // ===============================
    // Fetch complete data with pagination
    // ===============================

    let allData = [];

    let from = 0;
    const batchSize = 1000;


    while (true) {

        const {
            data,
            error
        } = await supabase
            .from(tableName)
            .select("*")
            .range(
                from,
                from + batchSize - 1
            );


        if (error) {
            throw error;
        }


        if (!data || data.length === 0) {
            break;
        }


        allData.push(...data);


        if (data.length < batchSize) {
            break;
        }


        from += batchSize;

    }


    const data = allData;


    console.log(
        "TOTAL ROWS FETCHED:",
        data.length
    );


    // Temporary verification
    const testGuest = data.find(
        row => row.guest_code === "GST005279"
    );


    console.log(
        "TEST GUEST FOUND:",
        testGuest
    );



    if (!data || data.length === 0) {

        console.log(
            `No data found in ${tableName}`
        );

        return;

    }



    // ===============================
    // Prepare Google Sheet Data
    // ===============================

    const headers = Object.keys(data[0]);


    const rows = data.map(row =>
        headers.map(
            col => row[col]
        )
    );


    const values = [
        headers,
        ...rows
    ];



    // ===============================
    // Ensure Sheet Exists
    // ===============================

    const exists = await sheetExists(sheetName);


    if (!exists) {

        console.log(
            `📄 ${sheetName} not found. Creating...`
        );


        await createSheet(sheetName);

    }



    // ===============================
    // Master Sheets
    // Google Sheet → Supabase
    // Do not overwrite
    // ===============================

    const masterSheets = [
        "Product_Master",
        "Inventory_Master",
        "Studio_Master"
    ];



    if (masterSheets.includes(sheetName)) {

        console.log(
            `⏩ Skipping Google Sheet overwrite for ${sheetName}`
        );

        return;

    }



    // ===============================
    // Transaction Sheets
    // Supabase → Google Sheet
    // ===============================


    console.log(
        "📤 Preparing Google Sheet Write:",
        sheetName,
        "Rows:",
        values.length
    );



    await clearSheet(sheetName);



    console.log(
        "🧹 Sheet Cleared:",
        sheetName
    );



    await writeSheet(
        sheetName,
        values
    );



    console.log(
        "✅ Google Sheet Write Completed:",
        sheetName
    );



    console.log(
        `✅ ${tableName} synced successfully.`
    );


}



module.exports = {
    syncTable
};