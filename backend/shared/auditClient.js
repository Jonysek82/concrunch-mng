const { getServiceToken } = require('./serviceToken');

const recordAuditEvent = async (event) => {
  const baseUrl = process.env.AUDIT_SERVICE_URL || 'http://127.0.0.1:5003';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(`${baseUrl}/internal/audit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Service-Token': getServiceToken()
      },
      body: JSON.stringify(event),
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Audit service returned HTTP ${response.status}`);
    }
  } finally {
    clearTimeout(timeout);
  }
};

module.exports = { recordAuditEvent };
