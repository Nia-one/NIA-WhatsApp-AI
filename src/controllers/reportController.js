const reportService = require("../../services/reportService");

// ======================================
// Dashboard Report
// ======================================
const getDashboardReport = async (req, res) => {
  try {

    const result = await reportService.getDashboardReport();

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {

    console.error("Error fetching dashboard report:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// ======================================
// Sales Trend Report
// ======================================
const getSalesTrend = async (req, res) => {
  try {

    const result = await reportService.getSalesTrend();

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {

    console.error("Error fetching sales trend:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// ======================================
// Top Products Report
// ======================================
const getTopProducts = async (req, res) => {
  try {

    const result = await reportService.getTopProducts();

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {

    console.error("Error fetching top products:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// ======================================
// Order Status Analytics
// ======================================
const getOrderStatusAnalytics = async (req, res) => {
  try {

    const result = await reportService.getOrderStatusAnalytics();

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {

    console.error("Error fetching order status analytics:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// ======================================
// Customer Analytics
// ======================================
const getCustomerAnalytics = async (req, res) => {
  try {

    const result = await reportService.getCustomerAnalytics();

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {

    console.error("Error fetching customer analytics:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// ======================================
// Inventory Analytics
// ======================================
const getInventoryAnalytics = async (req, res) => {
  try {

    const result = await reportService.getInventoryAnalytics();

    res.status(200).json({
      success: true,
      data: result
    });

  } catch (error) {

    console.error("Error fetching inventory analytics:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

// ======================================
// Studio Analytics
// ======================================

const getStudioAnalytics = async (req, res) => {

  try {

    const result =
      await reportService.getStudioAnalytics();


    res.status(200).json({
      success: true,
      data: result
    });


  } catch (error) {

    console.error(
      "Error fetching studio analytics:",
      error
    );


    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

module.exports = {
  getDashboardReport,
  getSalesTrend,
  getTopProducts,
  getOrderStatusAnalytics,
  getCustomerAnalytics,
  getInventoryAnalytics,
  getStudioAnalytics
};