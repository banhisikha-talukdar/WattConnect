const Usage = require("../models/Usage");

exports.logUsage = async (req, res) => {
  const { unitsUsed, usageType, date } = req.body;

  if (!unitsUsed || !usageType || !date) {
    return res.status(400).json({ error: "All fields (unitsUsed, usageType, date) are required." });
  }

  if (!['domestic', 'commercial'].includes(usageType)) {
    return res.status(400).json({ error: "Invalid usage type." });
  }

  try {
    const usage = new Usage({
      userId: req.user.userId,
      username: req.user.username,
      unitsUsed,
      usageType,
      date: new Date(date),
    });

    await usage.save();
    res.status(201).json({ message: "Usage logged successfully." });
  } catch (err) {
    console.error("❌ Usage logging error:", err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUsage = async (req, res) => {
  try {
    const usageData = await Usage.find({ userId: req.user.userId }).sort({ date: 1 });
    res.json(usageData);
  } catch (err) {
    console.error("❌ Fetch usage error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
