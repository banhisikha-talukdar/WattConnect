const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { logUsage, getUsage } = require("../controllers/usageController");

router.post("/", verifyToken, logUsage);
router.get("/", verifyToken, getUsage);

module.exports = router;
