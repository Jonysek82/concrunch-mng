const assert = require('node:assert/strict');
const http = require('node:http');
const { test } = require('node:test');
const { createApp } = require('../gateway/src/app');
const { isValidServiceToken } = require('../shared/serviceToken');

const listen = (server) => new Promise((resolve) => {
  server.listen(0, '127.0.0.1', () => resolve(server.address().port));
});

const close = (server) => new Promise((resolve) => {
  server.close(() => resolve());
  if (server.closeAllConnections) server.closeAllConnections();
});

test('gateway preserves API requests while routing to their owning service', async (t) => {
  const previousUrls = {
    IDENTITY_SERVICE_URL: process.env.IDENTITY_SERVICE_URL,
    FESTIVAL_SERVICE_URL: process.env.FESTIVAL_SERVICE_URL,
    AUDIT_SERVICE_URL: process.env.AUDIT_SERVICE_URL
  };
  const createUpstream = (name) => http.createServer((req, res) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        service: name,
        url: req.url,
        method: req.method,
        authorization: req.headers.authorization,
        requestId: req.headers['x-request-id'],
        body: chunks.length ? JSON.parse(Buffer.concat(chunks).toString()) : null
      }));
    });
  });

  const identity = createUpstream('identity');
  const festival = createUpstream('festival');
  const audit = createUpstream('audit');
  const identityPort = await listen(identity);
  const festivalPort = await listen(festival);
  const auditPort = await listen(audit);
  process.env.IDENTITY_SERVICE_URL = `http://127.0.0.1:${identityPort}`;
  process.env.FESTIVAL_SERVICE_URL = `http://127.0.0.1:${festivalPort}`;
  process.env.AUDIT_SERVICE_URL = `http://127.0.0.1:${auditPort}`;

  const gateway = http.createServer(createApp());
  const gatewayPort = await listen(gateway);
  t.after(async () => {
    for (const [name, value] of Object.entries(previousUrls)) {
      if (value === undefined) delete process.env[name];
      else process.env[name] = value;
    }
    await Promise.all([close(gateway), close(identity), close(festival), close(audit)]);
  });

  const identityResponse = await fetch(`http://127.0.0.1:${gatewayPort}/api/auth/google?next=%2F`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer test-token',
      'X-Request-Id': 'request-1'
    },
    body: JSON.stringify({ credential: 'google-credential' })
  });
  assert.equal(identityResponse.status, 200);
  assert.deepEqual(await identityResponse.json(), {
    service: 'identity',
    url: '/api/auth/google?next=%2F',
    method: 'POST',
    authorization: 'Bearer test-token',
    requestId: 'request-1',
    body: { credential: 'google-credential' }
  });

  const festivalResponse = await fetch(`http://127.0.0.1:${gatewayPort}/api/admin/events`);
  assert.equal((await festivalResponse.json()).service, 'festival');

  const auditResponse = await fetch(`http://127.0.0.1:${gatewayPort}/api/audit?limit=2`);
  assert.equal((await auditResponse.json()).service, 'audit');

  const unknownResponse = await fetch(`http://127.0.0.1:${gatewayPort}/api/not-a-route`);
  assert.equal(unknownResponse.status, 404);
});

test('internal service token comparison rejects missing or incorrect credentials', () => {
  const previousToken = process.env.INTERNAL_SERVICE_TOKEN;
  process.env.INTERNAL_SERVICE_TOKEN = 'a-test-internal-token';
  try {
    assert.equal(isValidServiceToken('a-test-internal-token'), true);
    assert.equal(isValidServiceToken('wrong-token'), false);
    assert.equal(isValidServiceToken(undefined), false);
  } finally {
    if (previousToken === undefined) delete process.env.INTERNAL_SERVICE_TOKEN;
    else process.env.INTERNAL_SERVICE_TOKEN = previousToken;
  }
});
