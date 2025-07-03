const express = require("express");
const router = express.Router();
const { verifyToken } = require("../middleware/auth");
const { logUsage, getUsage, calculateMonthlyBillFromUsage } = require("../controllers/usageController");

router.post("/", verifyToken, logUsage);
router.get("/", verifyToken, getUsage);
router.post("/calculate-bill", verifyToken, calculateMonthlyBillFromUsage);

module.exports = router;
