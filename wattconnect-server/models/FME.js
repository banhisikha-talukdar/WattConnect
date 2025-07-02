const mongoose = require('mongoose');

const fmeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  contactNumber: { type: String },
  email: { type: String },
  assignedSchedules: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' }],
});

module.exports = mongoose.model('FME', fmeSchema);
