const Usage = require("../models/Usage");
const moment = require("moment");

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

exports.calculateMonthlyBillFromUsage = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      month,  
      year, 
      connected_load_kw = 3,
      fpppa_rate = 0.75,
      duty_rate = 0.05
    } = req.body;

    if (typeof month === 'undefined' || typeof year === 'undefined') {
      return res.status(400).json({ error: "Month and year are required." });
    }

    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59);

    const usageLogs = await Usage.find({
      userId,
      date: { $gte: startOfMonth, $lte: endOfMonth }
    });

    const total_units = usageLogs.reduce((sum, log) => sum + log.unitsUsed, 0);

    let energy_charge = 0;
    if (total_units <= 120) {
      energy_charge = total_units * 5.3;
    } else if (total_units <= 240) {
      energy_charge = 120 * 5.3 + (total_units - 120) * 6.6;
    } else {
      energy_charge = 120 * 5.3 + 120 * 6.6 + (total_units - 240) * 7.6;
    }

    const fpppa = total_units * fpppa_rate;
    const fixed_charge = connected_load_kw * 60;
    const subtotal = energy_charge + fpppa + fixed_charge;
    const duty = subtotal * duty_rate;
    const total_bill = subtotal + duty;

    res.json({
      month: month + 1,
      year,
      total_units,
      energy_charge: +energy_charge.toFixed(2),
      fpppa: +fpppa.toFixed(2),
      fixed_charge: +fixed_charge.toFixed(2),
      duty: +duty.toFixed(2),
      total_bill: +total_bill.toFixed(2),
    });

  } catch (err) {
    console.error("Bill calc error:", err);
    res.status(500).json({ error: "Error calculating bill" });
  }
};
