const mongoose = require("mongoose");
const Tariff = require("../models/Tariff");
require("dotenv").config();

const htTariffs = require("./ht_tariff_data.json");

async function seedHTTariff() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Tariff.deleteMany({ type: { $in: ["HT", "Meta"] } });
    await Tariff.insertMany(htTariffs);
    console.log("✅ HT + ToD tariffs seeded!");
  } catch (err) {
    console.error("❌ Error seeding HT tariffs:", err);
  } finally {
    await mongoose.disconnect();
  }
}

seedHTTariff();
