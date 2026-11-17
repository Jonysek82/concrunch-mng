const express = require('express');
const { login, googleLogin, me } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { handleValidation, googleLoginRules } = require('../utils/validators');
const audit = require('../../../../shared/auditMiddleware');
const router = express.Router();

router.post('/login', audit('identity.password_login', 'user'), login);
router.post('/google', googleLoginRules, handleValidation, audit('identity.google_login', 'user'), googleLogin);
router.get('/me', authMiddleware, me);

module.exports = router;
