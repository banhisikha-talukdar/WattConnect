const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  consumerNumber: { type: String, required: true },
  formType: { type: String, enum: ['meter', 'engineer'], required: true },
  district: String,
  subdivision: String,
  applicantName: String,
  address: String,
  preferredDate: Date,
  usageType: { type: String, enum: ['domestic', 'commercial'] },
  reason: String,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Schedule', scheduleSchema);
