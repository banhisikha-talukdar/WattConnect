const express = require("express");
const router = express.Router();
const { approveNewConnection, getAllFMEs, getMetersByType, assignFMEToApplication } = require("../controllers/adminController");

router.put("/approve-new-connection/:appId", approveNewConnection);
router.get("/fmes", getAllFMEs);
router.get("/meters", getMetersByType);
router.post("/assign-fme/:appId", assignFMEToApplication);

module.exports = router;
