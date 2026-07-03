const express = require("express");

const router = express.Router();

const {
    getInventory,
    updateInventory,
    getInventoryHistory,
    getInventorySummary,
    getLowStockProducts,
    getOutOfStockProducts
} = require("../controllers/inventoryController");
router.get("/", getInventory);
router.get("/history", getInventoryHistory);
router.get("/summary", getInventorySummary);
router.get("/low-stock", getLowStockProducts);
router.get("/out-of-stock", getOutOfStockProducts);
router.patch("/:productId", updateInventory);

module.exports = router;