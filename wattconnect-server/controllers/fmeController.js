const NewConnection = require("../models/NewConnection");
const FME = require("../models/FME");

const getAssignedApplications = async (req, res) => {
  try {
    const fmeId = req.user.fmeId;
    if (!fmeId) return res.status(403).json({ message: "Access denied" });

    const applications = await NewConnection.find({ assignedFME: fmeId });
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

    const application = await NewConnection.findOne({ appId });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.assignedFME !== fmeId) {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    application.status = "approved_by_fme";
    await application.save();

    res.status(200).json({ message: "Application approved by FME" });
  } catch (err) {
    console.error("❌ Error approving application:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const rejectApplicationByFME = async (req, res) => {
  try {
    const fmeId = req.user.fmeId;
    const { appId } = req.params;
    const { reason } = req.body;

    const application = await NewConnection.findOne({ appId });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (application.assignedFME !== fmeId) {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    application.status = "rejected_by_fme";
    application.rejectionReason = reason || "No reason provided";

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
