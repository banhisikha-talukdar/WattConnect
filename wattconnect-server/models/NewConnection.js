const mongoose = require("mongoose");

const newApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  district: { type: String, required: true },
  subdivision: { type: String, required: true },
  appliedCategory: { type: String, required: true }, 
  appliedLoad: { type: Number, required: true },

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
  status: { type: String, default: "Pending" },
});

module.exports = mongoose.model("NewApplication", newApplicationSchema);
