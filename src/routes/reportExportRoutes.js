const express = require("express");

const router = express.Router();

const {
    exportTestReport,
    exportDashboardReport,
     exportOrdersReport,
     exportInventoryReport,
        exportCustomerReport,
        exportProductReport,
        exportSalesReport,
          exportStudioReport
} = require("../controllers/reportExportController");


// Test Export
router.get(
    "/test",
    exportTestReport
);


// Dashboard Export

router.get(
    "/dashboard",
    exportDashboardReport
);

// Orders Export

router.get(
    "/orders",
    exportOrdersReport
);

// Inventory Export

router.get(
    "/inventory",
    exportInventoryReport
);

// Customer Export

router.get(
    "/customers",
    exportCustomerReport
);

// Product Export

router.get(
    "/products",
    exportProductReport
);

// Sales Export

router.get(
    "/sales",
    exportSalesReport
);

// Studio Export

router.get(
    "/studios",
    exportStudioReport
);

module.exports = router;