const express = require("express");
const router = express.Router();

const {
    getGuests,
    createGuest,
    exportGuests,
} = require("../controllers/guestController");


// Export Guest Master
router.get("/export", exportGuests);

// Export Guest Master
router.get("/export", exportGuests);

// Get all guests

router.get("/", getGuests);


// Create new guest
router.post("/", createGuest);


module.exports = router;