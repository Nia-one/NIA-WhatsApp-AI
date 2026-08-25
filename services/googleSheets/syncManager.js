require("dotenv").config();

const syncConfig = require("./syncConfig");
const { syncTable } = require("./syncEngine");
const { syncProducts } = require("./inbound/productSync");
const { startScheduler } = require("../core/scheduler");
const {
    syncDashboard
} = require("../dashboardSyncService");

const {
    syncInventory
} = require("./inbound/inventorySync");
const { syncStudios } = require("./inbound/studioSync");
const { syncGuests } = require("./inbound/guestSync");
const { syncRetailers } = require("./inbound/retailerSync");

let syncRunning = false;

async function syncAll() {

    if (syncRunning) {
        console.log("⏳ Previous sync is still running. Skipping...");
        return;
    }

    syncRunning = true;

    const startTime = Date.now();

    try {

        console.log("======================================");
        console.log("Nia Sync Engine Started");
        console.log("======================================");

        // Google Sheets → Supabase
        try {

            const inboundJobs = [
                ["Product_Master", syncProducts],
                ["Inventory_Master", syncInventory],
                ["Studio_Master", syncStudios],
                ["Guest_Master", syncGuests],
                ["Retailer_Master", syncRetailers]
            ];

            for (const [sheetName, job] of inboundJobs) {
                try {
                    await job();
                } catch (err) {
                    console.error(`Inbound sync failed: ${sheetName}`);
                    console.error(err.message);
                }
            }

        } catch (err) {

            console.error("❌ Product Sync Failed");
            console.error(err.message);

        }

        console.log("======================================");
        console.log("Google Sheets → Supabase Completed");
        console.log("======================================");

        // Supabase → Google Sheets
        for (const config of syncConfig) {

            try {

                console.log(`\nSyncing ${config.table} → ${config.sheet}`);

                await syncTable(
                    config.table,
                    config.sheet
                );

            } catch (err) {

                console.log(`❌ Failed : ${config.table}`);
                console.log(err.message);

            }

        }

        console.log("\nSyncing Dashboard → Dashboard");

await syncDashboard();

        const duration = ((Date.now() - startTime) / 1000).toFixed(2);

        console.log("\n======================================");
        console.log("Nia Sync Engine Completed");
        console.log(`Duration : ${duration} sec`);
        console.log("======================================");

    } finally {

        syncRunning = false;

    }

}

startScheduler(syncAll, 2);
