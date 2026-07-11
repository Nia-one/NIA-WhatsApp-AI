const express = require("express");

const router = express.Router();

const {
    getCustomers,
    getCustomerById,
    getCustomerOrders,
    getCustomerStats,
    assignStudio,
} = require("../controllers/customerController");
router.get("/", getCustomers);
router.get("/:id/orders", getCustomerOrders);
router.get("/:id/stats", getCustomerStats);
router.post("/:id/assign-studio", assignStudio);
router.get("/:id", getCustomerById);

module.exports = router;