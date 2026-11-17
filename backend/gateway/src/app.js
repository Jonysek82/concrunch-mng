const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

const serviceTargetForPath = (pathname) => {
  if (/^\/api\/(auth|users)(\/|$)/.test(pathname)) {
    return process.env.IDENTITY_SERVICE_URL || 'http://127.0.0.1:5001';
  }
  if (/^\/api\/(events|performers|merchants|news|tags|admin)(\/|$)/.test(pathname)) {
    return process.env.FESTIVAL_SERVICE_URL || 'http://127.0.0.1:5002';
  }
  if (/^\/api\/audit(\/|$)/.test(pathname)) {
    return process.env.AUDIT_SERVICE_URL || 'http://127.0.0.1:5003';
  }
  return null;
};

const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/health', (req, res) => res.json({ ok: true, service: 'gateway' }));

  app.use('/api', async (req, res) => {
    const target = serviceTargetForPath(req.originalUrl.split('?')[0]);
    if (!target) return res.status(404).json({ message: 'Resource not found' });

    const headers = {};
    for (const name of ['accept', 'authorization', 'content-type', 'x-request-id']) {
      if (req.headers[name]) headers[name] = req.headers[name];
    }
    if (!headers['x-request-id']) headers['x-request-id'] = crypto.randomUUID();

    const options = { method: req.method, headers };
    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body !== undefined) {
      options.body = JSON.stringify(req.body);
      if (!headers['content-type']) headers['content-type'] = 'application/json';
    }

    try {
      const upstream = await fetch(new URL(req.originalUrl, target), options);
      for (const name of ['content-type', 'cache-control', 'etag', 'last-modified', 'retry-after']) {
        const value = upstream.headers.get(name);
        if (value) res.set(name, value);
      }
      res.status(upstream.status);
      res.send(Buffer.from(await upstream.arrayBuffer()));
    } catch (err) {
      console.error(`Gateway could not reach ${target}`, err);
      res.status(502).json({ message: 'Backend service is unavailable' });
    }
  });

  app.use((err, req, res, next) => {
    console.error('Gateway request failed', err);
    if (res.headersSent) return next(err);
    const status = err.status || 500;
    res.status(status).json({
      message: err.type === 'entity.parse.failed' ? 'Invalid JSON request' : 'Gateway request failed'
    });
  });

  return app;
};

module.exports = { createApp, serviceTargetForPath };
