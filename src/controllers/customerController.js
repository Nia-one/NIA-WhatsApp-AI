const customerService = require("../../services/customerService");

const getCustomers = async (req, res) => {

    try {

        const result = await customerService.getCustomers();

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

const getCustomerById = async (req, res) => {

    try {

        const result = await customerService.getCustomerById(
            req.params.id
        );

        res.status(200).json({
            success: true,
            data: result
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};

// ======================================
// Get Customer Orders
// ======================================
const getCustomerOrders = async (req, res) => {

     console.log("===== CUSTOMER ORDERS API HIT =====");
  console.log("Customer ID:", req.params.id);

  try {
    const { id } = req.params;

    const orders = await customerService.getCustomerOrders(id);

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching customer orders:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Get Customer Statistics
// ======================================
const getCustomerStats = async (req, res) => {
  try {
    const { id } = req.params;

    const stats = await customerService.getCustomerStats(id);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching customer stats:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================
// Assign Studio to Customer
// ======================================
const assignStudio = async (req, res) => {
    try {
        const { id } = req.params;
        const { studio_code } = req.body;

        if (!studio_code) {
            return res.status(400).json({
                success: false,
                message: "Studio Code is required."
            });
        }

        const result = await customerService.assignStudio(
            id,
            studio_code
        );

        res.status(200).json({
            success: true,
            message: "Studio assigned successfully.",
            data: result
        });

    } catch (error) {

        console.error("Assign Studio Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }
};
module.exports = {
    getCustomers,
    getCustomerById,
    getCustomerOrders,
    getCustomerStats,
    assignStudio
};