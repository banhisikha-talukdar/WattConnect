const express = require('express');
const router = express.Router();
const { scheduleMeterVisit, scheduleEngineerVisit } = require('../controllers/scheduleController');
const { verifyToken } = require('../middleware/auth');

router.post('/meter', verifyToken, scheduleMeterVisit);
router.post('/engineer', verifyToken, scheduleEngineerVisit);

module.exports = router;

