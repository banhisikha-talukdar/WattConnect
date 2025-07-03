const mongoose = require("mongoose");
const dotenv = require("dotenv");
const FME = require("../models/FME");
const fs = require("fs");
const path = require("path");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const seedFMEs = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    const fmeDataPath = path.join(__dirname, "fmes.json");
    const data = JSON.parse(fs.readFileSync(fmeDataPath, "utf-8"));

    await FME.deleteMany();
    await FME.insertMany(data);

    console.log("✅ FME data seeded successfully");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
};

seedFMEs();
