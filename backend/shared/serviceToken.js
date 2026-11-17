const crypto = require('crypto');

const DEVELOPMENT_TOKEN = 'local-development-internal-token';

const getServiceToken = () => {
  if (process.env.INTERNAL_SERVICE_TOKEN) return process.env.INTERNAL_SERVICE_TOKEN;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('INTERNAL_SERVICE_TOKEN must be configured in production');
  }
  return DEVELOPMENT_TOKEN;
};

const isValidServiceToken = (providedToken) => {
  if (typeof providedToken !== 'string') return false;
  const expected = Buffer.from(getServiceToken());
  const provided = Buffer.from(providedToken);
  return expected.length === provided.length && crypto.timingSafeEqual(expected, provided);
};

module.exports = { getServiceToken, isValidServiceToken };
