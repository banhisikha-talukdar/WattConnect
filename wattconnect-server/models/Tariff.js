const mongoose = require("mongoose");

const tariffSchema = new mongoose.Schema({
  category: { type: String, required: true },
  subCategory: String,
  type: { type: String, enum: ["LT", "HT", "Meta", "Both"], required: true },
  fixedCharge: Number,
  energyCharge: Number,
  fullCost: Number,
  subsidyTargeted: Number,
  subsidyTariff: Number,
  effectiveRate: Number,
  unitRange: [Number],
  timeSlots: [
    {
      slot: String,
      multiplier: Number
    }
  ],
  note: String
});

module.exports = mongoose.model("Tariff", tariffSchema);
