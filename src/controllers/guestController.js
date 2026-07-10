const guestService = require("../../services/guestService");
const guestExportService = require("../../services/guestExportService");
const guestImportService = require("../../services/guestImportService");


// Get Guests
const getGuests = async (req, res) => {

    try {

        const guests = await guestService.getGuests();

        res.json({
            success: true,
            data: guests,
        });


    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};




// Create Guest
const createGuest = async (req, res) => {

    try {

        const guest = await guestService.createGuest(req.body);


        res.status(201).json({

            success: true,

            message: "Guest created successfully",

            data: guest

        });


    } catch (error) {


        console.error(error);


        res.status(500).json({

            success: false,

            message: error.message

        });


    }

};

// Export Guests
const exportGuests = async (req, res) => {

    try {

        const guests =
            await guestExportService.exportGuests();


        res.json({

            success: true,

            data: guests

        });


    } catch (error) {

        console.error(error);


        res.status(500).json({

            success: false,

            message: error.message

        });

    }

};

// Import Guests
const importGuests = async (req, res) => {

    try {

        const result = await guestImportService.importGuests(req.body);

        res.json({
            success: true,
            ...result
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};



const path = require("path");

const downloadGuestTemplate = (req, res) => {

    const filePath = path.join(
        __dirname,
        "../../services/templates/Guest_Master_Template.xlsx"
    );

    res.download(filePath);

};

module.exports = {

    getGuests,

    createGuest,

    exportGuests,

    importGuests,

    downloadGuestTemplate,

};