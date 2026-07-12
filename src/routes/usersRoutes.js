const express = require("express");

const router = express.Router();

const {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    updateUserStatus,
    resetPassword,
    deleteUser
} = require("../controllers/usersController");

const {
    authenticate,
    authorizeRoles
} = require("../../middleware/authMiddleware");

const {
    validateCreateUser,
    validateUpdateUser,
    validateStatus,
    validatePassword
} = require("../validators/userValidator");

// ======================================
// All routes require Admin access
// ======================================

router.use(authenticate);
router.use(authorizeRoles("admin"));

// ======================================
// Users
// ======================================

router.get("/", getUsers);

router.get("/:id", getUserById);

router.post(
    "/",
    validateCreateUser,
    createUser
);

router.put(
    "/:id",
    validateUpdateUser,
    updateUser
);

router.patch(
    "/:id/status",
    validateStatus,
    updateUserStatus
);  

router.patch(
    "/:id/password",
    validatePassword,
    resetPassword
);

router.delete("/:id", deleteUser);

module.exports = router;