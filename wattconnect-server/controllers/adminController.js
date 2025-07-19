const NewConnection = require("../models/NewConnection");
const subdivisionIdMap = require("../utils/subdivisionIdMap");

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

    subName = subName?.toUpperCase(); // Match CSV format
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

    app.consumerNo = consumerNo;
    app.status = "approved";

    await app.save();
    console.log("✅ Application approved. Consumer No:", consumerNo);
    return res.status(200).json({ message: "Application approved", consumerNo });

  } catch (err) {
    console.error("❌ Error approving application:", err.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { approveNewConnection };
