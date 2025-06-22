const mongoose = require("mongoose");
const Tariff = require("../models/Tariff");
require("dotenv").config();

const tariffs = require("./lt_tariff_data.json");

async function seedTariff() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Tariff.deleteMany({ type: { $in: ["LT", "Both"] } });
    await Tariff.insertMany(tariffs);
    console.log("✅ LT + Green tariffs seeded!");
  } catch (err) {
    console.error("❌ Error seeding LT tariffs:", err);
  } finally {
    await mongoose.disconnect();
  }
}

seedTariff();
