const jwt = require("jsonwebtoken");

// ======================================
// Authenticate User
// ======================================

const authenticate = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {

            return res.status(401).json({

                success: false,

                message: "Authorization header missing"

            });

        }

        if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
    });
}

const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({

            success: false,

            message: "Invalid or expired token"

        });

    }

};

// ======================================
// Authorize Roles
// ======================================

const authorizeRoles = (...allowedRoles) => {

    return (req, res, next) => {

        if (!req.user) {

            return res.status(401).json({

                success: false,

                message: "Unauthorized"

            });

        }

        if (!allowedRoles.includes(req.user.role)) {

            return res.status(403).json({

                success: false,

                message: "Access Denied"

            });

        }

        next();

    };

};
module.exports = {

    authenticate,

    authorizeRoles

};