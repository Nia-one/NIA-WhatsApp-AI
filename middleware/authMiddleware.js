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

        const token = authHeader.replace(
            "Bearer ",
            ""
        );

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