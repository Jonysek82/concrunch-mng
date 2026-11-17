const { isValidRole } = require('../utils/roles');

module.exports = (allowedRoles = []) => {
  const unknown = allowedRoles.filter((role) => !isValidRole(role));
  if (allowedRoles.length === 0 || unknown.length > 0) {
    throw new Error(`roleMiddleware: invalid roles ${JSON.stringify(unknown.length ? unknown : allowedRoles)}`);
  }

  return (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    if (!allowedRoles.includes(user.role)) return res.status(403).json({ message: 'Forbidden' });
    next();
  };
};
