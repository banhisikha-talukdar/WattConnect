const mongoose = require("mongoose");

const meterSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["single_phase", "three_phase", "lt_meter"],
    required: true
  },
  company: { type: String, required: true },
  isAvailable: { type: Boolean, default: true }
});

module.exports = mongoose.model("Meter", meterSchema);