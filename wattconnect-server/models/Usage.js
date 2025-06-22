const mongoose = require("mongoose");

const usageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: String,
  month: { type: String, required: true },
  year: { type: Number, required: true },
  unitsUsed: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Usage", usageSchema);
