const express = require("express");
const router = express.Router();

const {
    getStudios,
    createStudio,
    updateStudio,
} = require("../controllers/studioController");

router.get("/", getStudios);
router.post("/", createStudio);
router.put("/:id", updateStudio);

module.exports = router;