const express = require('express');
const AuditEntry = require('./model');
const { isValidServiceToken } = require('../../../shared/serviceToken');
const { verifyIdentity, IdentityClientError } = require('../../../shared/identityClient');

const authorizeAdmin = (req, res, next) => {
  verifyIdentity(req.get('Authorization')).then((user) => {
    if (user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    req.auditActor = user;
    next();
  }).catch((err) => {
    if (!(err instanceof IdentityClientError) || err.status >= 500) {
      console.error('Audit access authorization failed', err);
    }
    if (!res.headersSent) {
      const status = err instanceof IdentityClientError ? err.status : 503;
      const message = err instanceof IdentityClientError ? err.message : 'Identity service unavailable';
      res.status(status).json({ message });
    }
  });
};

const createApp = () => {
  const app = express();
  app.use(express.json());

  app.get('/health', (req, res) => res.json({ ok: true, service: 'audit' }));

  app.get('/api/audit', authorizeAdmin, async (req, res, next) => {
    const requestedLimit = Number.parseInt(req.query.limit, 10);
    const limit = Number.isInteger(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 200) : 100;
    try {
      const entries = await AuditEntry.find({})
        .sort({ occurredAt: -1 })
        .limit(limit)
        .lean();
      res.json(entries);
    } catch (err) {
      next(err);
    }
  });

  app.post('/internal/audit', async (req, res, next) => {
    if (!isValidServiceToken(req.get('X-Service-Token'))) {
      return res.status(401).json({ message: 'Invalid service credentials' });
    }

    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      return res.status(400).json({ message: 'Invalid audit event' });
    }
    const { actorId, actorRole, action, entityType, entityId = '', changedFields = [], requestId } = req.body;
    if (
      typeof actorId !== 'string' || !actorId ||
      typeof actorRole !== 'string' || !actorRole ||
      typeof action !== 'string' || !action ||
      typeof entityType !== 'string' || !entityType ||
      typeof entityId !== 'string' ||
      !Array.isArray(changedFields) || changedFields.some((field) => typeof field !== 'string') ||
      typeof requestId !== 'string' || !requestId
    ) {
      return res.status(400).json({ message: 'Invalid audit event' });
    }

    try {
      const entry = await AuditEntry.create({
        actorId,
        actorRole,
        action,
        entityType,
        entityId,
        changedFields,
        requestId
      });
      res.status(201).json({ id: entry._id });
    } catch (err) {
      next(err);
    }
  });

  app.use((err, req, res, next) => {
    console.error(err);
    if (res.headersSent) return next(err);
    res.status(500).json({ message: 'Audit service failed to store the event' });
  });

  return app;
};

module.exports = createApp;
