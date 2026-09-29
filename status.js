const { getStore } = require('@netlify/blobs');

const defaults = {
  status: 'offline',
  message: 'the bot is currently offline.',
  updated: 'not updated yet',
  details: 'the bot is down right now. i\'ll update this page when it\'s back.'
};

const headers = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store, no-cache, must-revalidate, max-age=0',
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers': 'content-type, x-admin-password'
};

function json(statusCode, body) {
  return { statusCode, headers, body: JSON.stringify(body) };
}

exports.handler = async (event) => {
  const store = getStore('platai-status');

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers };

  if (event.httpMethod === 'GET') {
    const saved = await store.get('status', { type: 'json' });
    return json(200, saved || defaults);
  }

  if (event.httpMethod !== 'POST') return json(405, { error: 'method not allowed' });

  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedPassword) return json(500, { error: 'ADMIN_PASSWORD is not configured in Netlify.' });
  if (event.headers['x-admin-password'] !== expectedPassword) return json(401, { error: 'incorrect password' });

  let input;
  try { input = JSON.parse(event.body || '{}'); } catch { return json(400, { error: 'invalid json' }); }

  const allowed = ['online', 'offline', 'degraded', 'maintenance'];
  if (!allowed.includes(input.status)) return json(400, { error: 'invalid status' });

  const now = new Date();
  const updated = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'long', timeStyle: 'short', timeZone: 'America/New_York'
  }).format(now);

  const status = {
    status: input.status,
    message: String(input.message || '').slice(0, 240),
    updated,
    details: String(input.details || '').slice(0, 500)
  };

  await store.setJSON('status', status);
  return json(200, status);
};
