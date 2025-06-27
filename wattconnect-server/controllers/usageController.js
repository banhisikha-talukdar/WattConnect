const Usage = require("../models/Usage");

exports.logUsage = async (req, res) => {
  const { month, year, unitsUsed, usageType } = req.body;

  if (!month || !year || !unitsUsed || !usageType) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (!['domestic', 'commercial'].includes(usageType)) {
    return res.status(400).json({ error: "Invalid usage type" });
  }

  try {
    const usage = new Usage({
      userId: req.user.userId,
      username: req.user.username,
      month,
      year,
      unitsUsed,
      usageType
    });

    await usage.save();
    res.status(201).json({ message: "Usage logged successfully" });
  } catch (err) {
    console.error("❌ Usage logging error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUsage = async (req, res) => {
  try {
    const usageData = await Usage.find({ userId: req.user.userId }).sort({ createdAt: 1 });
    res.json(usageData);
  } catch (err) {
    console.error("❌ Fetch usage error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
