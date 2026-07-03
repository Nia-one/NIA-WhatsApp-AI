const express = require("express");

const router = express.Router();

const {
    getDashboardReport,
    getSalesTrend,
    getTopProducts,
    getOrderStatusAnalytics,
    getCustomerAnalytics,
    getInventoryAnalytics
} = require("../controllers/reportController");

router.get("/dashboard", getDashboardReport);
router.get("/sales-trend", getSalesTrend);
router.get("/top-products", getTopProducts);
router.get("/order-status", getOrderStatusAnalytics);
router.get("/customer-analytics", getCustomerAnalytics);
router.get("/inventory-analytics", getInventoryAnalytics);


module.exports = router;