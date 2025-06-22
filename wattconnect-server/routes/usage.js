const express = require("express");
const router = express.Router();
const Usage = require("../models/Usage");
const { verifyToken } = require("../middleware/auth");

router.post("/", verifyToken, async (req, res) => {
  const { month, unitsUsed } = req.body;

  try {
    const usage = new Usage({
      userId: req.userId,
      username: req.username,
      month,
      year,
      unitsUsed
    });

    await usage.save();
    res.status(201).json({ message: "Usage logged successfully" });
  } catch (err) {
    console.error("❌ Usage logging error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
