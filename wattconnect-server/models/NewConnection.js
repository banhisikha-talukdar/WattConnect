const mongoose = require("mongoose");

const newApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  district: { type: String, required: true },
  subdivision: { type: String, required: true },
  appliedCategory: { type: String, required: true }, 
  appliedLoad: { type: Number, required: true },

  appId: { type: String, unique: true },
  consumerNo: { type: String, unique: true },

  assignedFME: { type: mongoose.Schema.Types.ObjectId, ref: "FME", default: null },
  fmeStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  fmeRemarks: String,

  meterType: {
    type: String,
    enum: ["single_phase", "three_phase", "lt_meter"]
  },
  meterNumber: String,
  consumerNumber: String,

  status: {
    type: String,
    enum: [
      "pending_admin_forward",
      "pending_fme_action",
      "fme_rejected",
      "fme_approved",
      "connection_approved"
    ],
    default: "pending_admin_forward"
  },

  consumerDetails: {
    name: String,
    fatherName: String,
  },

  addressDetails: {
    area: String,
    villageOrTown: String,
    postOffice: String,
    policeStation: String,
    district: String,
    pinCode: String,
    mobileNumber: String,
  },

  uploadedDocs: {
    passportPhoto: String,
    identityProof: String,
    addressProof: String,
    legalOccupationProof: String,
    affidavitOrNOC: String,
    testReport: String,
    agreementForm: String,
    htAdditionalDocs: String, 
  },

  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("NewConnection", newApplicationSchema, "newapplications");
