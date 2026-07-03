const VALID_STATUSES = [
  "Pending",
  "Confirmed",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const validateOrderStatus = (req, res, next) => {
  const { status } = req.body;

  // Check if status is provided
  if (!status) {
    return res.status(400).json({
      success: false,
      message: "Status is required",
    });
  }

  // Check if status is valid
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid order status",
    });
  }

  // Continue to controller
  next();
};

module.exports = {
  validateOrderStatus,
};