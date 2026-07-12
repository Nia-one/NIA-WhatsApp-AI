const studioService = require("../../services/studioService");

// ==========================================
// Get Studios
// ==========================================

const getStudios = async (req, res) => {
    try {
        const studios = await studioService.getStudios();

        res.json({
            success: true,
            data: studios,
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

// ==========================================
// Create Studio
// ==========================================

const createStudio = async (req, res) => {

    try {

        const studio = await studioService.createStudio(req.body);

        res.status(201).json({

            success: true,

            message: "Studio created successfully",

            data: studio,

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

// ==========================================
// Update Studio
// ==========================================

const updateStudio = async (req, res) => {

    try {

        const studio = await studioService.updateStudio(
            req.params.id,
            req.body
        );

        res.json({

            success: true,

            message: "Studio updated successfully",

            data: studio,

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: error.message,

        });

    }

};

module.exports = {
    getStudios,
    createStudio,
    updateStudio,
};