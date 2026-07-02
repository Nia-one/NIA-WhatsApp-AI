require("dotenv").config();

const { syncTable } = require("./services/googleSheets/syncEngine");

async function run() {

    try {

        console.log("================================");
        console.log("Starting Product Sync...");
        console.log("================================");

        await syncTable(
            "product_master",
            "Product_Master"
        );

        console.log("================================");
        console.log("✅ Product Sync Completed");
        console.log("================================");

    } catch (err) {

        console.log("================================");
        console.log("❌ Sync Failed");
        console.log(err);
        console.log("================================");

    }

}

run();