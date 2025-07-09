const NewConnection = require("../models/NewConnection");

const submitApplication = async (req, res) => {
  try {
    const {
      district,
      subdivision,
      appliedCategory,
      appliedLoad,
      consumerDetails,
      addressDetails,
    } = req.body;

    const uploads = req.files || {};

    const newForm = new NewConnection({
      userId: req.user.userId,
      district,
      subdivision,
      appliedCategory,
      appliedLoad,
      consumerDetails,
      addressDetails,
      uploadedDocs: {
        passportPhoto: uploads.passportPhoto?.[0]?.path || "",
        identityProof: uploads.identityProof?.[0]?.path || "",
        addressProof: uploads.addressProof?.[0]?.path || "",
        legalOccupationProof: uploads.legalOccupationProof?.[0]?.path || "",
        affidavitOrNOC: uploads.affidavitOrNOC?.[0]?.path || "",
        testReport: uploads.testReport?.[0]?.path || "",
        agreementForm: uploads.agreementForm?.[0]?.path || "",
        htAdditionalDocs: uploads.htAdditionalDocs?.[0]?.path || "",
      },
    });

    await newForm.save();

    res.status(201).json({
      message: "Application submitted successfully",
      data: newForm,
    });
  } catch (error) {
    console.error("❌ Error submitting new connection:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getApplications = async (req, res) => {
  try {
    const applications = await NewConnection.find().populate(
      "userId",
      "name email"
    );
    res.json(applications);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ error: "Failed to fetch applications" });
  }
};

const updateApplicationStatus = async (req, res) => {
  const { applicationId } = req.params;
  const { status } = req.body;

  if (!["Pending", "Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  try {
    const updated = await NewConnection.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Application not found" });
    }

    res.json({ message: "Application status updated", application: updated });
  } catch (err) {
    console.error("❌ Error updating status:", err);
    res.status(500).json({ error: "Server error updating status" });
  }
};


module.exports = {
  submitApplication,
  getApplications,
  updateApplicationStatus,
};
