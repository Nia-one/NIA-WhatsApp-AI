const express = require("express");
const router = express.Router();

const {
    getStudios,
    createStudio,
    updateStudio,
    updateStudioStatus,
} = require("../controllers/studioController");

router.get("/", getStudios);
router.post("/", createStudio);
router.put("/:id", updateStudio);
router.put("/:id/status", updateStudioStatus);

module.exports = router;