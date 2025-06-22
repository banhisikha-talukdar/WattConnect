const mongoose = require("mongoose");

const usageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  username: String,
  month: String,
  unitsUsed: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Usage", usageSchema);
