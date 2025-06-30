const NewConnection = require("../models/NewConnection");

exports.submitApplication = async (req, res) => {
  try {
    const {
      district,
      subdivision,
      appliedCategory,
      appliedLoad,
      consumerDetails,
      premisesAddress,
    } = req.body;

    const uploads = req.files || {};

    const newForm = new NewConnection({
      district,
      subdivision,
      appliedCategory,
      appliedLoad,
      consumerDetails,
      premisesAddress,
      uploads: {
        identityProof: uploads.identityProof?.[0]?.path || "",
        addressProof: uploads.addressProof?.[0]?.path || "",
        legalOccupationProof: uploads.legalOccupationProof?.[0]?.path || "",
        testReport: uploads.testReport?.[0]?.path || "",
        photo: uploads.photo?.[0]?.path || "",
        affidavit: uploads.affidavit?.[0]?.path || "",
      },
      submittedBy: req.user.id,
    });

    await newForm.save();
    res.status(201).json({ message: "Application submitted successfully", data: newForm });
  } catch (error) {
    console.error("❌ Error submitting new connection:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getApplications = async (req, res) => {
  try {
    const applications = await NewApplication.find().populate("userId", "name email");
    res.json(applications);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};
