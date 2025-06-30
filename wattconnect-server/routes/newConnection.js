const express = require("express");
const router = express.Router();
const { submitApplication, getApplications } = require("../controllers/newConnectionController");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/applications/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "passportPhoto" },
    { name: "identityProof" },
    { name: "addressProof" },
    { name: "legalOccupationProof" },
    { name: "affidavitOrNOC" },
    { name: "testReport" },
    { name: "agreementForm" },
    { name: "htAdditionalDocs" },
  ]),
  async (req, res) => {
    try {
      const files = req.files;

      const newApp = new NewApplication({
        userId: req.user.id,
        district: req.body.district,
        subdivision: req.body.subdivision,
        appliedCategory: req.body.appliedCategory,
        appliedLoad: req.body.appliedLoad,
        consumerDetails: {
          name: req.body.name,
          fatherName: req.body.fatherName,
        },
        addressDetails: {
          area: req.body.area,
          villageOrTown: req.body.villageOrTown,
          postOffice: req.body.postOffice,
          policeStation: req.body.policeStation,
          district: req.body.addressDistrict,
          pinCode: req.body.pinCode,
          mobileNumber: req.body.mobileNumber,
        },
        uploadedDocs: {
          passportPhoto: files.passportPhoto?.[0]?.path,
          identityProof: files.identityProof?.[0]?.path,
          addressProof: files.addressProof?.[0]?.path,
          legalOccupationProof: files.legalOccupationProof?.[0]?.path,
          affidavitOrNOC: files.affidavitOrNOC?.[0]?.path,
          testReport: files.testReport?.[0]?.path,
          agreementForm: files.agreementForm?.[0]?.path,
          htAdditionalDocs: files.htAdditionalDocs?.[0]?.path || null,
        },
      });

      await newApp.save();
      res.status(201).json({ message: "New application submitted successfully." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Submission failed." });
    }
  }
);


router.get("/all", auth, getApplications); 
module.exports = router;
