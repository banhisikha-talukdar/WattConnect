const NewConnection = require("../models/NewConnection");
const subdivisionIdMap = require("../utils/subdivisionIdMap");

const approveNewConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    const app = await NewConnection.findById(connectionId);

    if (!app) {
      console.log("❌ Application not found");
      return res.status(404).json({ message: "Not found" });
    }

    if (app.consumerNo) {
      console.log("⚠️ Already has consumerNo");
      return res.status(400).json({ message: "Already approved" });
    }

    const rawSubdivision = app.subdivision?.trim();
    const subName = rawSubdivision?.split("-")[1]?.trim()?.toLowerCase(); 

    const subId = subdivisionIdMap[subName];
    if (!subId) {
      console.log("❌ Invalid subdivision name:", subName);
      return res.status(400).json({ message: "Subdivision ID not found" });
    }

    let consumerNo, unique = false;

    while (!unique) {
      const random9 = Math.floor(Math.random() * 1e9).toString().padStart(9, "0");
      consumerNo = `${subId}${random9}`; 
      const exists = await NewConnection.findOne({ consumerNo });
      if (!exists) unique = true;
    }

    app.consumerNo = consumerNo;

    try {
      const saved = await app.save();
      console.log("✅ Saved consumerNo:", saved.consumerNo);
      res.status(200).json({ message: "Approved", consumerNo });
    } catch (err) {
      console.error("❌ Save failed:", err.message);
      res.status(500).json({ message: "DB save error" });
    }

  } catch (err) {
    console.error("❌ Server error:", err.message);
    res.status(500).json({ message: "Internal error" });
  }
};


module.exports = { approveNewConnection };
