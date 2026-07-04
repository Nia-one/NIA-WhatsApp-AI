const express = require("express");
const router = express.Router();

const reportingController = require("../controllers/reportingController");

router.get("/summary", reportingController.getSummary);

module.exports = router;