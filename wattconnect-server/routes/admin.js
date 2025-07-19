const express = require("express");
const router = express.Router();
const { approveNewConnection, getAllFMEs, getMetersByType } = require("../controllers/adminController");

router.put("/approve-new-connection/:appId", approveNewConnection);
router.get("/fmes", getAllFMEs);
router.get("/meters", getMetersByType);

module.exports = router;
