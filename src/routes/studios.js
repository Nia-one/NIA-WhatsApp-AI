const express = require("express");
const router = express.Router();

const {
    getStudios,
    createStudio,
} = require("../controllers/studioController");

router.get("/", getStudios);
router.post("/", createStudio);

module.exports = router;