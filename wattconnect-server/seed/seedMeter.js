const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const Meter = require("../models/Meter");

const meters = [
  { type: "single_phase", company: "Secure" },
  { type: "single_phase", company: "Intelli" },
  { type: "single_phase", company: "ACIP" },

  { type: "three_phase", company: "Secure" },
  { type: "three_phase", company: "Intelli" },
  { type: "three_phase", company: "ACIP" },

  { type: "lt_meter", company: "Secure" },
  { type: "lt_meter", company: "Intelli" },
  { type: "lt_meter", company: "ACIP" }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Meter.deleteMany({});
    await Meter.insertMany(meters);
    console.log("✅ Meters seeded");
    process.exit();
  });
