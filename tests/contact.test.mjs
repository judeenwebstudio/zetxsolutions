import test from 'node:test';
import assert from 'node:assert/strict';
import { createHandler, validateInput, escapeHTML, PRIVACY_VERSION } from '../api/contact.js';

const now = 1800000000000;
const valid = { name: 'Test Enquirer', email: 'enquirer@example.com', phone: '', service: 'Staffing Solutions', message: 'Please advise on staffing services.', consent: true, privacyVersion: PRIVACY_VERSION, startedAt: now - 5000, website: '' };
const env = { NODE_ENV: 'production', VERCEL: '1', RESEND_API_KEY: 're_test_only', CONTACT_SENDER_EMAIL: 'enquiries@example.com', CONTACT_RECIPIENT_EMAIL: 'Zetxsolutionsofficial@gmail.com', CONTACT_REDIS_REST_URL: 'https://redis.example.com', CONTACT_REDIS_REST_TOKEN: 'test-only' };
function request(body = valid, overrides = {}) { return { method: 'POST', headers: { host: 'zetxsolutions.vercel.app', origin: 'https://zetxsolutions.vercel.app', 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.10' }, body, ...overrides }; }
async function run(req, options = {}) {
  const headers = {}; let result;
  const res = { statusCode: 200, setHeader: (key, value) => { headers[key] = value; }, end: value => { result = { status: res.statusCode, body: JSON.parse(value), headers }; } };
  await createHandler({ env, now: () => now, ...options })(req, res);
  return result;
}
const provider = (emailResult = { id: 'mock-provider-id' }, emailOK = true, count = 1) => async url => url.includes('redis') ? { ok: true, json: async () => ({ result: [count, 900] }) } : { ok: emailOK, json: async () => emailResult };

test('valid enquiry accepts optional phone', () => { assert.deepEqual(validateInput(valid, now).fields, {}); assert.equal(validateInput(valid, now).spam, false); });
test('required fields and malformed types are rejected', () => { const { fields } = validateInput({ ...valid, name: [], email: 'bad', phone: 'letters', service: 'invented', message: 'short', consent: false }, now); assert.deepEqual(Object.keys(fields).sort(), ['consent','email','message','name','phone','service']); });
test('stale consent, long fields and email header injection fail', () => { const { fields } = validateInput({ ...valid, name: 'x'.repeat(101), message: 'x'.repeat(3001), email: 'a@example.com\r\nBcc: other@example.com', privacyVersion: 'old' }, now); assert.ok(fields.name && fields.message && fields.email && fields.consent); });
test('honeypot and too-fast or missing completion time are flagged', () => { for (const override of [{ website: 'bot' }, { startedAt: now }, { startedAt: undefined }]) assert.equal(validateInput({ ...valid, ...override }, now).spam, true); });
test('HTML escaping covers tags, quotes and ampersands', () => assert.equal(escapeHTML('<b>"&\'</b>'), '&lt;b&gt;&quot;&amp;&#39;&lt;/b&gt;'));
test('GET reports unavailable without revealing environment secrets', async () => { const result = await run(request(undefined, { method: 'GET' }), { env: {} }); assert.deepEqual(result.body, { configured: false, privacyVersion: PRIVACY_VERSION }); });
test('POST rejects missing configuration without attempting delivery', async () => { const result = await run(request(), { env: {}, fetchImpl: () => { throw new Error('must not call'); } }); assert.equal(result.status, 503); assert.equal(result.body.code, 'NOT_CONFIGURED'); });
test('Gmail is not accepted as an authorized sender', async () => { const result = await run(request(undefined, { method: 'GET' }), { env: { ...env, CONTACT_SENDER_EMAIL: 'Zetxsolutionsofficial@gmail.com' } }); assert.equal(result.body.configured, false); });
test('shared rate-limit credentials are required', async () => { const result = await run(request(undefined, { method: 'GET' }), { env: { ...env, CONTACT_REDIS_REST_TOKEN: '' } }); assert.equal(result.body.configured, false); });
test('cross-origin and missing-origin POST are rejected', async () => { for (const origin of ['https://evil.example','']) { const req = request(); req.headers.origin = origin; assert.equal((await run(req)).status, 403); } });
test('method, JSON content type, malformed JSON and body size are checked', async () => { assert.equal((await run(request(undefined, { method: 'DELETE' }))).status, 405); const req = request(); req.headers['content-type'] = 'text/plain'; assert.equal((await run(req)).status, 415); assert.equal((await run(request('{'))).status, 400); assert.equal((await run(request('x'.repeat(17000)))).status, 413); });
test('server validation returns accessible field errors', async () => { const result = await run(request({ ...valid, email: 'invalid' })); assert.equal(result.status, 422); assert.ok(result.body.fields.email); });
test('provider acceptance is required for success and email contents are escaped', async () => {
  const calls = [];
  const fetchImpl = async (url, init) => { calls.push({ url, body: JSON.parse(init.body) }); return provider()(url); };
  const result = await run(request({ ...valid, message: '<script>alert("test")</script> Please advise.' }), { fetchImpl });
  assert.equal(result.status, 200); assert.equal(result.body.accepted, true); assert.equal(result.body.id, 'mock-provider-id');
  const email = calls[1].body; assert.equal(email.from, env.CONTACT_SENDER_EMAIL); assert.deepEqual(email.to, [env.CONTACT_RECIPIENT_EMAIL]); assert.equal(email.reply_to, valid.email); assert.ok(!email.html.includes('<script>')); assert.ok(email.html.includes('&lt;script&gt;'));
  assert.ok(!calls[0].body.at(-1).includes('203.0.113.10'));
});
test('provider failure or absent acceptance ID never returns success', async () => { for (const [body,ok] of [[{error:'blocked'},false],[{},true]]) { const result = await run(request(), { fetchImpl: provider(body,ok) }); assert.equal(result.status, 502); assert.notEqual(result.body.accepted, true); } });
test('provider network failure returns safe error', async () => { const result = await run(request(), { fetchImpl: async url => { if(url.includes('redis')) return {ok:true,json:async()=>({result:[1,900]})}; throw new Error('secret internal detail'); } }); assert.equal(result.status, 502); assert.ok(!JSON.stringify(result).includes('secret internal detail')); });
test('rate-limit exceeds five attempts and prevents provider calls', async () => { let calls=0; const result = await run(request(), { fetchImpl: async url => { calls++; return provider({},true,6)(url); } }); assert.equal(result.status,429); assert.equal(result.headers['Retry-After'],'900'); assert.equal(calls,1); });
test('Redis outage fails closed without contacting provider', async () => { const result = await run(request(), { fetchImpl: async()=>{throw new Error('offline');} }); assert.equal(result.status,503); });
test('WhatsApp URL is fixed and excludes form data', async () => {
  const { readFile } = await import('node:fs/promises'); const source = await readFile(new URL('../src/config/contact.ts', import.meta.url),'utf8');
  assert.ok(source.includes('917829422815')); assert.ok(source.includes('encodeURIComponent(contact.whatsappText)')); assert.ok(source.includes('Hello ZET X SOLUTIONS, I would like to enquire about your services.'));
});
