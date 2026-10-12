import { createHmac } from 'node:crypto';

export const PRIVACY_VERSION = '2026-10-12-v1'; // Exact notice approved by the owner in this chat.
const SERVICES = ['Staffing Solutions', 'Consultation Services', 'Certification Support'];
const EMAIL = /^[^\s@<>\r\n]+@[^\s@<>\r\n]+\.[^\s@<>\r\n]+$/;
const MAX_BYTES = 16384;

export function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}

export function validateInput(body, now = Date.now()) {
  const fields = {};
  const clean = key => typeof body?.[key] === 'string' ? body[key].trim() : '';
  const data = { name: clean('name'), email: clean('email'), phone: clean('phone'), service: clean('service'), message: clean('message') };
  if (data.name.length < 2 || data.name.length > 100 || /[\x00-\x1f]/.test(data.name)) fields.name = 'Enter your full name (2–100 characters).';
  if (data.email.length > 254 || !EMAIL.test(data.email)) fields.email = 'Enter a valid email address.';
  if (data.phone && !/^[+0-9().\s-]{7,25}$/.test(data.phone)) fields.phone = 'Enter a valid phone number or leave this field blank.';
  if (!SERVICES.includes(data.service)) fields.service = 'Choose one of our services.';
  if (data.message.length < 10 || data.message.length > 3000 || /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(data.message)) fields.message = 'Enter a message between 10 and 3,000 characters.';
  if (body?.consent !== true || body?.privacyVersion !== PRIVACY_VERSION) fields.consent = 'Please agree to the current privacy notice.';
  const elapsed = now - Number(body?.startedAt);
  const spam = Boolean(clean('website')) || !Number.isFinite(elapsed) || elapsed < 2000 || elapsed > 86400000;
  return { fields, data, spam };
}

function configuration(env) {
  const key = env.RESEND_API_KEY || '';
  const sender = env.CONTACT_SENDER_EMAIL || '';
  const recipient = env.CONTACT_RECIPIENT_EMAIL || '';
  const redisURL = env.CONTACT_REDIS_REST_URL || '';
  const redisToken = env.CONTACT_REDIS_REST_TOKEN || '';
  const configured = key.startsWith('re_') && EMAIL.test(sender) && EMAIL.test(recipient)
    && !/@(gmail|googlemail)\.com$/i.test(sender) && /^https:\/\//.test(redisURL) && Boolean(redisToken);
  return { key, sender, recipient, redisURL, redisToken, configured };
}

async function readBody(req) {
  if (Number(req.headers['content-length']) > MAX_BYTES) throw new Error('SIZE');
  if (req.body !== undefined) {
    const value = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    if (Buffer.byteLength(value) > MAX_BYTES) throw new Error('SIZE');
    return JSON.parse(value);
  }
  const chunks = []; let size = 0;
  for await (const chunk of req) {
    size += Buffer.byteLength(chunk);
    if (size > MAX_BYTES) throw new Error('SIZE');
    chunks.push(Buffer.from(chunk));
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

export function createHandler({ env = process.env, fetchImpl = fetch, now = Date.now } = {}) {
  return async function handler(req, res) {
    const reply = (status, body) => {
      res.statusCode = status;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.end(JSON.stringify(body));
    };
    const config = configuration(env);
    if (req.method === 'GET') return reply(200, { configured: config.configured, privacyVersion: PRIVACY_VERSION });
    if (req.method !== 'POST') { res.setHeader('Allow', 'GET, POST'); return reply(405, { error: 'Method not allowed.' }); }
    const host = String(req.headers.host || '');
    const origin = String(req.headers.origin || '');
    const expected = env.CONTACT_ALLOWED_ORIGIN || `https://${host}`;
    const local = env.NODE_ENV !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin) && new URL(origin).host === host;
    if ((!local && origin !== expected) || req.headers['sec-fetch-site'] === 'cross-site') return reply(403, { error: 'Please submit from our website.' });
    if (!/^application\/json(?:\s*;|$)/i.test(String(req.headers['content-type'] || ''))) return reply(415, { error: 'Use a JSON request.' });
    let body;
    try { body = await readBody(req); }
    catch (error) { return reply(error.message === 'SIZE' ? 413 : 400, { error: 'Invalid or oversized enquiry.' }); }
    const validation = validateInput(body, now());
    if (validation.spam) return reply(400, { error: 'Please review your enquiry and try again.' });
    if (Object.keys(validation.fields).length) return reply(422, { error: 'Please correct the highlighted fields.', fields: validation.fields });
    if (!config.configured) return reply(503, { code: 'NOT_CONFIGURED', error: 'Online enquiries are not configured. Please contact us by email or WhatsApp.' });

    // Atomic shared limit across Vercel instances. Only an HMAC of the IP is stored, for 15 minutes.
    const ip = String(env.VERCEL ? req.headers['x-forwarded-for'] || '' : req.socket?.remoteAddress || '').split(',')[0].trim();
    if (!ip) return reply(503, { error: 'Enquiries are temporarily unavailable. Please contact us directly.' });
    const identity = createHmac('sha256', config.key).update(ip).digest('hex');
    try {
      const rateResponse = await fetchImpl(config.redisURL.replace(/\/$/, ''), {
        method: 'POST', headers: { Authorization: `Bearer ${config.redisToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(['EVAL', "local n=redis.call('INCR',KEYS[1]); if n==1 then redis.call('EXPIRE',KEYS[1],900) end; return {n,redis.call('TTL',KEYS[1])}", '1', `zetx:contact:${identity}`]),
        signal: AbortSignal.timeout(3000),
      });
      const rate = await rateResponse.json();
      if (!rateResponse.ok || !Array.isArray(rate.result) || !Number.isFinite(Number(rate.result[0])) || Number(rate.result[0]) < 1) throw new Error('RATE');
      if (Number(rate.result[0]) > 5) {
        res.setHeader('Retry-After', String(Math.max(1, Number(rate.result[1]) || 900)));
        return reply(429, { error: 'Too many enquiries. Please wait 15 minutes before trying again.' });
      }
    } catch { return reply(503, { error: 'Enquiries are temporarily unavailable. Please contact us directly.' }); }

    const data = validation.data;
    const text = `New ZET X SOLUTIONS enquiry\n\nName: ${data.name}\nEmail: ${data.email}\nPhone: ${data.phone || 'Not provided'}\nService: ${data.service}\n\n${data.message}\n\nPrivacy consent: ${PRIVACY_VERSION}`;
    const html = `<h2>New website enquiry</h2><dl>${Object.entries(data).map(([key,value]) => `<dt>${escapeHTML(key)}</dt><dd style="white-space:pre-wrap">${escapeHTML(value || 'Not provided')}</dd>`).join('')}</dl><p>Privacy consent: ${PRIVACY_VERSION}</p>`;
    try {
      const response = await fetchImpl('https://api.resend.com/emails', {
        method: 'POST', headers: { Authorization: `Bearer ${config.key}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: config.sender, to: [config.recipient], reply_to: data.email, subject: `Website enquiry: ${data.service}`, text, html }),
        signal: AbortSignal.timeout(8000),
      });
      const result = await response.json();
      if (!response.ok || typeof result.id !== 'string' || !result.id) throw new Error('PROVIDER');
      return reply(200, { accepted: true, id: result.id });
    } catch { return reply(502, { error: 'Email acceptance could not be confirmed. Please try later or contact us directly.' }); }
  };
}

export default createHandler();
