const express = require("express");
const router = express.Router();
const { getAllFMEs } = require("../controllers/fmeController");
const { verifyToken } = require("../middleware/auth");

router.get("/", verifyToken, getAllFMEs);

module.exports = router;
