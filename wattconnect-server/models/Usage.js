const mongoose = require("mongoose");

const usageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  usageType: {
    type: String,
    enum: ['domestic', 'commercial'],
    required: true,
  },

  unitsUsed: { type: Number, required: true },

  date: { type: Date, required: true }, 

  createdAt: { type: Date, default: Date.now }
});

usageSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model("Usage", usageSchema);
