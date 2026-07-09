const reportService = require("./reportService");
const { writeSheet } = require("./googleSheets/googleSheetsService");


// ======================================
// Dashboard Sync
// ======================================

const syncDashboard = async () => {

const dashboard = await reportService.getDashboardReport();

const rows = [
    ["Metric", "Value"],
    ["Today Sales", dashboard.today_sales],
    ["Week Sales", dashboard.week_sales],
    ["Month Sales", dashboard.month_sales],
    ["Total Revenue", dashboard.total_revenue],
    ["Total Orders", dashboard.total_orders],
    ["Total Customers", dashboard.total_customers],
    ["Total Products Sold", dashboard.total_products_sold],
    ["Total Cost", dashboard.total_cost],
    ["Gross Profit", dashboard.gross_profit],
    ["Gross Margin (%)", dashboard.gross_margin],
    ["Average Order Value", dashboard.average_order_value]
];

await writeSheet("Dashboard!A1", rows);
console.log("✅ Dashboard sheet updated successfully.");

};

module.exports = {
    syncDashboard
};