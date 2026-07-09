const express = require("express");

const router = express.Router();

const {
    getDashboardReport,
    getSalesTrend,
    getTopProducts,
    getOrderStatusAnalytics,
    getCustomerAnalytics,
    getInventoryAnalytics,
    getStudioAnalytics
} = require("../controllers/reportController");


// ======================================
// Dashboard Analytics
// ======================================

router.get(
    "/dashboard",
    getDashboardReport
);


// ======================================
// Sales Trend
// ======================================

router.get(
    "/sales-trend",
    getSalesTrend
);


// ======================================
// Product Analytics
// ======================================

router.get(
    "/top-products",
    getTopProducts
);


// ======================================
// Order Status Analytics
// ======================================

router.get(
    "/order-status",
    getOrderStatusAnalytics
);


// ======================================
// Customer Analytics
// ======================================

router.get(
    "/customer-analytics",
    getCustomerAnalytics
);


// ======================================
// Inventory Analytics
// ======================================

router.get(
    "/inventory-analytics",
    getInventoryAnalytics
);


// ======================================
// Studio Analytics
// ======================================

router.get(
    "/studio-analytics",
    getStudioAnalytics
);


module.exports = router;