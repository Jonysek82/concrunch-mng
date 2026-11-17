const IDENTITY_SERVICE_URL = process.env.IDENTITY_SERVICE_URL || 'http://127.0.0.1:5001';

class IdentityClientError extends Error {
  constructor(status, message, cause) {
    super(message);
    this.status = status;
    this.cause = cause;
  }
}

const verifyIdentity = async (authorization) => {
  if (!authorization) throw new IdentityClientError(401, 'Authorization header missing');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);
  try {
    let response;
    try {
      response = await fetch(`${IDENTITY_SERVICE_URL}/internal/auth/verify`, {
        method: 'POST',
        headers: {
          Authorization: authorization,
          'X-Service-Token': require('./serviceToken').getServiceToken()
        },
        signal: controller.signal
      });
    } catch (err) {
      throw new IdentityClientError(503, 'Identity service unavailable', err);
    }

    if (response.status === 401) {
      throw new IdentityClientError(401, 'Invalid or expired token');
    }
    if (!response.ok) {
      throw new IdentityClientError(503, 'Identity service unavailable');
    }

    let user;
    try {
      user = await response.json();
    } catch (err) {
      throw new IdentityClientError(502, 'Invalid identity service response', err);
    }
    if (!user || !user.id || !user.role) {
      throw new IdentityClientError(502, 'Invalid identity service response');
    }
    return user;
  } finally {
    clearTimeout(timeout);
  }
};

module.exports = { verifyIdentity, IdentityClientError };
