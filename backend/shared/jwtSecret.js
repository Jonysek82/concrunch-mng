const DEVELOPMENT_SECRET = 'local-development-jwt-secret-change-before-deploy';

const getJwtSecret = () => {
  if (process.env.JWT_SECRET) return process.env.JWT_SECRET;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be configured in production');
  }
  return DEVELOPMENT_SECRET;
};

module.exports = { getJwtSecret };
