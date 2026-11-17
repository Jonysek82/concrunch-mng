const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const serviceAuthMiddleware = require('../middleware/serviceAuthMiddleware');
const { toPublicUser } = require('../services/authService');

const router = express.Router();

router.post('/verify', serviceAuthMiddleware, authMiddleware, (req, res) => {
  res.json(toPublicUser(req.user));
});

module.exports = router;
