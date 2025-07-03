const FME = require("../models/FME");

exports.getAllFMEs = async (req, res) => {
  try {
    const fmes = await FME.find();
    res.status(200).json(fmes);
  } catch (err) {
    console.error("❌ Error fetching FMEs:", err);
    res.status(500).json({ error: "Failed to fetch FME list" });
  }
};
