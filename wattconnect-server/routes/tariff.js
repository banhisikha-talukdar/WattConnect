const express = require("express");
const router = express.Router();
const Tariff = require("../models/Tariff");

// GET all tariffs
router.get("/", async (req, res) => {
  try {
    const data = await Tariff.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET HT tariffs
router.get("/ht", async (req, res) => {
  try {
    const data = await Tariff.find({ type: "HT" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET Green Energy tariff
router.get("/green", async (req, res) => {
  try {
    const data = await Tariff.findOne({ category: "Green Energy Tariff" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// GET ToD multipliers
router.get("/tod", async (req, res) => {
  try {
    const data = await Tariff.findOne({ category: "ToD Tariff" });
    res.json(data?.timeSlots || []);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
