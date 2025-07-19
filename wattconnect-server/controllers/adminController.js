const NewConnection = require("../models/NewConnection");
const subdivisionIdMap = require("../utils/subdivisionIdMap");
const FME = require("../models/FME");
const Meter = require("../models/Meter");

const approveNewConnection = async (req, res) => {
  try {
    const { appId } = req.params;

    const app = await NewConnection.findOne({ appId });
    if (!app) {
      console.log("❌ Application not found");
      return res.status(404).json({ message: "Application not found" });
    }

    if (app.consumerNo) {
      console.log("⚠️ Already approved:", app.consumerNo);
      return res.status(400).json({ message: "Already approved" });
    }

    const rawSubdivision = app.subdivision?.trim();
    let subName = rawSubdivision;

    if (rawSubdivision?.includes("-")) {
      subName = rawSubdivision.split("-")[1]?.trim();
    }

    subName = subName?.toUpperCase();
    console.log("🔍 Looking up subdivision ID for:", subName);

    const subId = subdivisionIdMap[subName];
    if (!subId) {
      console.log("❌ Subdivision ID not found for:", subName);
      return res.status(400).json({ message: "Subdivision ID not found" });
    }

    let consumerNo;
    let isUnique = false;

    while (!isUnique) {
      const random9 = Math.floor(Math.random() * 1e9).toString().padStart(9, "0");
      consumerNo = `${subId}${random9}`;
      const exists = await NewConnection.findOne({ consumerNo });
      if (!exists) isUnique = true;
    }

    const companyName = app?.consumerDetails?.meterCompany || "GENU";
    const prefix = companyName.toUpperCase().replace(/[^A-Z]/g, "").slice(0, 4).padEnd(4, "X");
    const random6 = Math.floor(100000 + Math.random() * 900000);
    const meterNumber = `${prefix}${random6}`;

    app.consumerNo = consumerNo;
    app.meterNumber = meterNumber;
    app.status = "connection_approved";

    await app.save();
    console.log("✅ Application approved. Consumer No:", consumerNo);
    return res.status(200).json({ message: "Application approved", consumerNo });

  } catch (err) {
    console.error("❌ Error approving application:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getAllFMEs = async (req, res) => {
  try {
    const fmes = await FME.find();
    res.json(fmes);
  } catch (error) {
    console.error("Error fetching FMEs:", error);
    res.status(500).json({ error: "Server error fetching FMEs" });
  }
};

const getMetersByType = async (req, res) => {
  try {
    const { type } = req.query;
    const query = type ? { type } : {};
    const meters = await Meter.find(query);
    res.json(meters);
  } catch (error) {
    console.error("Error fetching meters:", error);
    res.status(500).json({ error: "Server error fetching meters" });
  }
};


module.exports = { 
  approveNewConnection,
  getAllFMEs,
  getMetersByType
};
