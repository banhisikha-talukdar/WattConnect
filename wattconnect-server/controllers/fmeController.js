const NewConnection = require("../models/NewConnection");
const FME = require("../models/FME");
const User = require("../models/User");

const getAssignedApplications = async (req, res) => {
  try {
    
    console.log("✅ Decoded user from token:", req.user);
    const user = await User.findById(req.user.userId);  
    const fmeId = user.fmeId;

    if (!fmeId) {
      return res.status(403).json({ message: "Access denied: FME ID missing" });
    }

    const fme = await FME.findOne({ fmeId });

    if (!fme) {
      return res.status(404).json({ message: "FME not found" });
    }

    const applications = await NewConnection.find({ assignedFME: fme._id });

    res.status(200).json(applications);
  } catch (err) {
    console.error("❌ Error fetching assigned applications:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const approveApplicationByFME = async (req, res) => {
  try {
    const fmeId = req.user.fmeId;
    const { appId } = req.params;
    console.log(req.user);

    const fme = await FME.findOne({ fmeId });
    if (!fme) return res.status(403).json({ message: "Invalid FME user" });

    const application = await NewConnection.findOne({ appId });
    if (!application) return res.status(404).json({ message: "Application not found" });

    if (!application.assignedFME.equals(fme._id)) {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    application.status = "fme_approved";
    await application.save();

    res.status(200).json({ message: "Application approved by FME" });
  } catch (err) {
    console.error("❌ Error approving application:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const rejectApplicationByFME = async (req, res) => {
  try {
    console.log("Decoded user:", req.user);
    const fmeId = req.user.fmeId;
    const { appId } = req.params;

    const fme = await FME.findOne({ fmeId });
    if (!fme) return res.status(403).json({ message: "Invalid FME user" });

    const application = await NewConnection.findOne({ appId });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (!application.assignedFME.equals(fme._id)) {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    application.status = "fme_rejected";

    await application.save();

    res.status(200).json({ message: "Application rejected by FME" });
  } catch (err) {
    console.error("❌ Error rejecting application:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = { 
  getAssignedApplications,
  approveApplicationByFME,
  rejectApplicationByFME,
};
