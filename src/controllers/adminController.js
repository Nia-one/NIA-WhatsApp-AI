const adminService = require("../../services/adminService");
const {
  successResponse,
  errorResponse,
} = require("../helpers/responseHelper");
// ======================================
// Dashboard Summary
// ======================================
const getDashboardSummary = async (req, res) => {
  try {
    const summary = await adminService.getDashboardSummary();

    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Recent Orders
// ======================================
const getRecentOrders = async (req, res) => {
  try {
    const orders = await adminService.getRecentOrders();

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching recent orders:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Low Stock Products
// ======================================
const getLowStockProducts = async (req, res) => {
  try {
    const products = await adminService.getLowStockProducts();

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching low stock products:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Order Details
// ======================================
const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await adminService.getOrderDetails(id);

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Error fetching order details:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Update Order Status
// ======================================
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, remarks, updated_by } = req.body;

    const result = await adminService.updateOrderStatus(
      id,
      status,
      remarks,
      updated_by
    );

    return successResponse(
      res,
      result,
      "Order status updated successfully"
    );

  } catch (error) {
    console.error("Error updating order status:", error);

    return errorResponse(
      res,
      error.message
    );
  }
};
module.exports = {
    getDashboardSummary,
    getRecentOrders,
    getLowStockProducts,
    getOrderDetails,
    updateOrderStatus
};