const crypto = require('crypto');
const { recordAuditEvent } = require('./auditClient');

const SENSITIVE_FIELDS = new Set(['password', 'passwordHash', 'credential', 'token', 'secret']);

const createAuditMiddleware = (action, entityType) => (req, res, next) => {
  const sendJson = res.json.bind(res);
  let auditStarted = false;

  res.json = (body) => {
    if (res.statusCode < 200 || res.statusCode >= 300 || auditStarted) {
      return sendJson(body);
    }

    auditStarted = true;
    const responseUser = body && body.user;
    const actorId = req.user && (req.user._id || req.user.id)
      ? String(req.user._id || req.user.id)
      : responseUser && responseUser.id
        ? String(responseUser.id)
        : '';
    const event = {
      actorId,
      actorRole: (req.user && req.user.role) || (responseUser && responseUser.role) || 'visitor',
      action,
      entityType,
      entityId: String(
        (body && (body._id || body.id)) ||
        (responseUser && responseUser.id) ||
        req.params.id ||
        ''
      ),
      changedFields: Object.keys(req.body || {}).filter((field) => !SENSITIVE_FIELDS.has(field)),
      requestId: req.get('X-Request-Id') || crypto.randomUUID()
    };

    recordAuditEvent(event)
      .then(() => sendJson(body))
      .catch((err) => {
        console.error('Audit service write failed', err);
        if (!res.headersSent) {
          res.status(503);
          sendJson({ message: 'The operation was saved, but its audit record could not be stored.' });
        }
      });

    return res;
  };

  next();
};

module.exports = createAuditMiddleware;
