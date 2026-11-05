const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: 'Authorization header missing' });
    const parts = header.split(' ');
    if (parts.length !== 2) return res.status(401).json({ message: 'Invalid authorization format' });
    const token = parts[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'change_me');
    const user = await User.findById(payload.id).select('-passwordHash');
    if (!user) return res.status(401).json({ message: 'User not found' });
    if (!user.active) return res.status(401).json({ message: 'User is inactive' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
