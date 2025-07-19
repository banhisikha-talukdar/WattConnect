const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const FME = require("../models/FME");

const fmes = [
  { name: "Ranjit Das", fmeId: "FME001", phone: "9876543210", district: "Kamrup-M" },
  { name: "Manoj Kalita", fmeId: "FME002", phone: "9876543211", district: "Kamrup-M" },
  { name: "Pankaj Boro", fmeId: "FME003", phone: "9876543212", district: "Dibrugarh" },
  { name: "Bhaskar Deka", fmeId: "FME004", phone: "9876543213", district: "Dibrugarh" },
  { name: "Kamal Choudhury", fmeId: "FME005", phone: "9876543214", district: "Jorhat" },
  { name: "Ankit Sharma", fmeId: "FME006", phone: "9876543215", district: "Jorhat" }
];

async function seedFME() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    await FME.deleteMany({});
    console.log("🗑️  Cleared old FME data");

    await FME.insertMany(fmes);
    console.log("✅ Seeded new FME data");

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding FMEs:", err);
    process.exit(1);
  }
}

seedFME();