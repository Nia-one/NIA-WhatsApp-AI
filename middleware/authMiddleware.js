const jwt = require("jsonwebtoken");

// ======================================
// Authenticate User
// ======================================

const authenticate = (req, res, next) => {
  try {

    console.log("========== AUTH ==========");
    console.log("Authorization:", req.headers.authorization);
    console.log("JWT_SECRET Exists:", !!process.env.JWT_SECRET);

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
      });
    }

    const token = authHeader.split(" ")[1];

    console.log("Token:", token.substring(0, 25) + "...");

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("Decoded User:", decoded);

    req.user = decoded;

    next();

  } catch (error) {

    console.error("JWT ERROR:", error.message);

    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// Authorize Roles
// ======================================

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {

    console.log("User Role:", req.user?.role);
    console.log("Allowed Roles:", allowedRoles);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorizeRoles,
};