const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const { verifyToken } = require("../middleware/auth");

const {
  submitApplication,
  getApplications,
  updateApplicationStatus,
} = require("../controllers/newConnectionController");

const uploadPath = path.join(__dirname, "..", "uploads", "applications");
fs.mkdirSync(uploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/applications/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, 
});

router.post(
  "/",
  verifyToken,
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
  submitApplication
);

router.get("/all", verifyToken, getApplications);

router.put("/:applicationId/status", verifyToken, updateApplicationStatus);

module.exports = router;
