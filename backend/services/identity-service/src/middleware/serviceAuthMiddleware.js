const { isValidServiceToken } = require('../../../../shared/serviceToken');

module.exports = (req, res, next) => {
  if (!isValidServiceToken(req.get('X-Service-Token'))) {
    return res.status(401).json({ message: 'Invalid service credentials' });
  }
  next();
};
