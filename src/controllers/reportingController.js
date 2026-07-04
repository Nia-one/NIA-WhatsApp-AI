const reportingService = require("../../services/reportingService");

exports.getSummary = async (req, res) => {

    try {

        const data = await reportingService.getSummary();

        res.json({
            success: true,
            data
        });

    } catch (error) {

        console.error("Reporting Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};