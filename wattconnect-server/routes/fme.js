const express = require("express");
const router = express.Router();
const { getAssignedApplications, approveApplicationByFME, rejectApplicationByFME } = require("../controllers/fmeController");
const { verifyToken } = require("../middleware/auth");

router.get("/assigned-applications", verifyToken, getAssignedApplications);

router.put("/approve-application/:appId", verifyToken, approveApplicationByFME);

router.put("/reject-application/:appId", verifyToken, rejectApplicationByFME);

module.exports = router;
