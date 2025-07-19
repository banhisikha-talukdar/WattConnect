const express = require("express");
const router = express.Router();
const { approveNewConnection } = require("../controllers/adminController");

router.put("/approve-new-connection/:appId", approveNewConnection);

module.exports = router;
