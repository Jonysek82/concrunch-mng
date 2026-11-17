const { verifyIdentity, IdentityClientError } = require('../../../../shared/identityClient');

module.exports = (req, res, next) => {
  verifyIdentity(req.get('Authorization')).then((user) => {
    req.user = { ...user, _id: user.id };
    next();
  }).catch((err) => {
    if (!(err instanceof IdentityClientError) || err.status >= 500) {
      console.error('Identity verification failed', err);
    }
    if (!res.headersSent) {
      const status = err instanceof IdentityClientError ? err.status : 503;
      const message = err instanceof IdentityClientError ? err.message : 'Identity service unavailable';
      res.status(status).json({ message });
    }
  });
};
