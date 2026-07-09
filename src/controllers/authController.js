const {
    loginAdmin
} = require("../../services/authService");


// ======================================
// Admin Login
// ======================================

exports.login = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        const result = await loginAdmin(
    email,
    password
);

return res.json({

    success: true,

    token: result.token,

    user: result.user

});


    } catch (error) {


        console.error(
            "Login Error:",
            error.message
        );


        return res.status(401).json({

            success: false,

            message: error.message

        });

    }

};