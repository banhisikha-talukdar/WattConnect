const mongoose = require("mongoose");

const fmeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fmeId: { type: String, required: true, unique: true },
  phone: String,
  district: String
});

module.exports = mongoose.model("FME", fmeSchema);