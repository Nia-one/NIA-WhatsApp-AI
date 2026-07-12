const usersService = require("../../services/usersService");
const { logAudit } = require("../../services/auditService");

// ======================================
// Get Users
// ======================================

async function getUsers(req, res, next) {
    try {
        const result = await usersService.getUsers({
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
            search: req.query.search || "",
            role: req.query.role,
            status: req.query.status
        });

        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            ...result
        });

    } catch (error) {
        next(error);
    }
}

// ======================================
// Get User By ID
// ======================================

async function getUserById(req, res, next) {
    try {
        const user = await usersService.getUserById(req.params.id);

        return res.status(200).json({
            success: true,
            data: user
        });

    } catch (error) {
        next(error);
    }
}

// ======================================
// Create User
// ======================================

async function createUser(req, res, next) {
    try {

        const user = await usersService.createUser({
            ...req.body,
            createdBy: req.user.id
        });

        await logAudit({
            user: req.user,
            action: "CREATE_USER",
            module: "USERS",
            targetId: user.id,
            targetName: user.name,
            description: `Created user ${user.email}`,
            req
        });

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user
        });

    } catch (error) {
        next(error);
    }
}

// ======================================
// Update User
// ======================================

async function updateUser(req, res, next) {
    try {

        const user = await usersService.updateUser(
            req.params.id,
            {
                ...req.body,
                updatedBy: req.user.id
            }
        );

        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user
        });

    } catch (error) {
        next(error);
    }
}

// ======================================
// Update Status
// ======================================

async function updateUserStatus(req, res, next) {
    try {

        const user = await usersService.updateUserStatus(
            req.params.id,
            req.body.status,
            req.user.id
        );

        return res.status(200).json({
            success: true,
            message: "User status updated successfully",
            data: user
        });

    } catch (error) {
        next(error);
    }
}

// ======================================
// Reset Password
// ======================================

async function resetPassword(req, res, next) {
    try {

        await usersService.resetPassword(
            req.params.id,
            req.body.password
        );

        return res.status(200).json({
            success: true,
            message: "Password reset successfully"
        });

    } catch (error) {
        next(error);
    }
}

// ======================================
// Delete User
// ======================================

async function deleteUser(req, res, next) {
    try {

        await usersService.deleteUser(
    req.params.id,
    req.user.id
);

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    updateUserStatus,
    resetPassword,
    deleteUser
};