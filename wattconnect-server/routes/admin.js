const express = require("express");
const router = express.Router();
const { approveNewConnection } = require("../controllers/adminController");

router.put("/approve-new-connection/:connectionId", approveNewConnection);

module.exports = router;
