const express = require("express");
const router = express.Router();

const {
    getGuests,
    createGuest,
    exportGuests,
    importGuests,
    downloadGuestTemplate
} = require("../controllers/guestController");

// Download Template
router.get("/template", downloadGuestTemplate);

// Export Guest Master
router.get("/export", exportGuests);

// Import Guest Master
router.post("/import", importGuests);

// Get all guests
router.get("/", getGuests);

// Create new guest
router.post("/", createGuest);

module.exports = router;