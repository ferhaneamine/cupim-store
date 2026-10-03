const express = require('express');
const router = express.Router();

const { register, login, getMe } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const rateLimiter = require('../middleware/rateLimiter');

router.post('/register', rateLimiter, register);
router.post('/login',    rateLimiter, login);
router.get('/me',        protect,     getMe);

module.exports = router;
