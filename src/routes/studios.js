const express = require("express");
const router = express.Router();

const {
    getStudios,
} = require("../controllers/studioController");

router.get("/", getStudios);

module.exports = router;