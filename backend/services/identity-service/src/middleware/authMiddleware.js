const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { getJwtSecret } = require('../../../../shared/jwtSecret');

module.exports = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: 'Authorization header missing' });
  const parts = header.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Invalid authorization format' });
  }

  let payload;
  try {
    payload = jwt.verify(parts[1], getJwtSecret());
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError' || err.name === 'NotBeforeError') {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    return next(err);
  }

  try {
    const user = await User.findById(payload.id).select('-passwordHash');
    if (!user) return res.status(401).json({ message: 'User not found' });
    if (!user.active) return res.status(401).json({ message: 'User is inactive' });
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
