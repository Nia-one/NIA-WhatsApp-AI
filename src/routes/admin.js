const express = require("express");
const router = express.Router();

const {
  getDashboardSummary,
  getRecentOrders,
  getLowStockProducts,
  getOrderDetails,
  updateOrderStatus,
} = require("../controllers/adminController");

const {
  authenticate,
  authorizeRoles,
} = require("../../middleware/authMiddleware");

const {
  validateOrderStatus,
} = require("../validators/orderValidator");

// Dashboard APIs
router.get("/dashboard", getDashboardSummary);
router.get("/recent-orders", getRecentOrders);
router.get("/low-stock", getLowStockProducts);

// Order APIs
router.get("/orders/:id", getOrderDetails);

router.patch(
  "/orders/:id/status",
  authenticate,
  authorizeRoles("super_admin", "admin"),
  validateOrderStatus,
  updateOrderStatus
);

module.exports = router;