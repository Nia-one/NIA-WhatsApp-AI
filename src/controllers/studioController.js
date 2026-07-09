const studioService = require("../../services/studioService");

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

module.exports = {
    getStudios,
};