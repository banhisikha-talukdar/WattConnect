const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

router.post('/register', register);

router.post('/login', login);

router.get('/me', verifyToken, getMe);

router.put('/:username', verifyToken, updateProfile);


module.exports = router;
