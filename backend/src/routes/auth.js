const express = require('express');
const { login, googleLogin, me } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { handleValidation, googleLoginRules } = require('../utils/validators');
const router = express.Router();

router.post('/login', login);
router.post('/google', googleLoginRules, handleValidation, googleLogin);
router.get('/me', authMiddleware, me);

module.exports = router;
