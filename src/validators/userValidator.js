const { body, validationResult } = require("express-validator");

// ======================================
// Validation Result Handler
// ======================================

const handleValidation = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array()
        });

    }

    next();

};


// ======================================
// Create User Validation
// ======================================

const validateCreateUser = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),


    body("email")
        .trim()
        .isEmail()
        .withMessage("Valid email is required")
        .normalizeEmail(),


    body("password")
        .isLength({ min: 8 })
        .withMessage(
            "Password must be at least 8 characters"
        ),


    body("role")
        .isIn([
            "admin",
            "founder",
            "operations",
            "analytics"
        ])
        .withMessage("Invalid role"),


    body("mobile")
        .optional()
        .isNumeric()
        .withMessage(
            "Mobile number must contain only digits"
        )
        .isLength({
            min: 10,
            max: 15
        })
        .withMessage(
            "Mobile number must be between 10 and 15 digits"
        ),


    handleValidation

];


// ======================================
// Update User Validation
// ======================================

const validateUpdateUser = [

    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Name cannot be empty"),


    body("email")
        .optional()
        .isEmail()
        .withMessage("Valid email is required")
        .normalizeEmail(),


    body("role")
        .optional()
        .isIn([
            "admin",
            "founder",
            "operations",
            "analytics"
        ])
        .withMessage("Invalid role"),


    body("mobile")
        .optional()
        .isNumeric()
        .withMessage(
            "Mobile number must contain only digits"
        )
        .isLength({
            min: 10,
            max: 15
        })
        .withMessage(
            "Mobile number must be between 10 and 15 digits"
        ),


    handleValidation

];


// ======================================
// Status Validation
// ======================================

const validateStatus = [

    body("status")
        .isIn([
            "Active",
            "Inactive"
        ])
        .withMessage("Invalid status"),


    handleValidation

];


// ======================================
// Password Validation
// ======================================

const validatePassword = [

    body("password")
        .isLength({ min: 8 })
        .withMessage(
            "Password must be at least 8 characters"
        ),


    handleValidation

];


module.exports = {

    validateCreateUser,

    validateUpdateUser,

    validateStatus,

    validatePassword

};