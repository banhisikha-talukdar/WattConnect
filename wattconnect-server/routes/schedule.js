const express = require('express');
const router = express.Router();
const {
  scheduleMeterVisit,
  scheduleEngineerVisit,
  getSchedules,
  acceptSchedule,
  rejectSchedule,
  assignFME,
} = require('../controllers/scheduleController');

const { verifyToken } = require('../middleware/auth');

router.post('/meter', verifyToken, scheduleMeterVisit);
router.post('/engineer', verifyToken, scheduleEngineerVisit);
router.get('/', verifyToken, getSchedules);

router.post('/:id/accept', verifyToken, acceptSchedule);
router.post('/:id/reject', verifyToken, rejectSchedule);
router.post('/:id/assign-fme', verifyToken, assignFME);

module.exports = router;
