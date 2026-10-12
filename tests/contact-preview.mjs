// Local-only preview; never deploy or configure this mock as a production API.
import { createServer, request } from 'node:http';
import { createHandler } from '../api/contact.js';
if (process.env.VERCEL) throw new Error('Local preview cannot run on Vercel.');
const mock = process.env.CONTACT_PREVIEW_MOCK;
const handler = createHandler(mock ? {
  env: { NODE_ENV: 'development', RESEND_API_KEY: 're_local_mock', CONTACT_SENDER_EMAIL: 'test@example.com', CONTACT_RECIPIENT_EMAIL: 'test@example.com', CONTACT_REDIS_REST_URL: 'https://redis.example.com', CONTACT_REDIS_REST_TOKEN: 'mock' },
  fetchImpl: async url => url.includes('redis') ? { ok:true, json:async()=>({result:[1,900]}) } : { ok:mock==='accepted', json:async()=>mock==='accepted'?{id:'local-test-only'}:{error:'local-test-rejection'} },
} : {});
createServer((req,res) => {
  if (req.url?.split('?')[0] === '/api/contact') { handler(req,res).catch(()=>{res.statusCode=500;res.end('{}');}); return; }
  const proxy = request({ hostname:'127.0.0.1', port:5173, path:req.url, method:req.method, headers:req.headers }, upstream => { res.writeHead(upstream.statusCode || 502,upstream.headers); upstream.pipe(res); });
  proxy.on('error',()=>{res.statusCode=502;res.end('Start npm run dev first.');}); req.pipe(proxy);
}).listen(8787,'127.0.0.1',()=>console.log(`Contact preview: http://127.0.0.1:8787 (email ${mock ? 'MOCK '+mock+'; no email is sent' : 'not configured'})`));
