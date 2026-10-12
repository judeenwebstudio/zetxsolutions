import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const source = await readFile(new URL('../src/lib/sendEnquiry.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
const { templateParameters, sendEnquiry, emailJSDiagnostic } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const config = {serviceId:'test_service',templateId:'test_template',publicKey:'test_public'};
function fields() { const data = new FormData(); for (const [key,value] of Object.entries({name:' Test Customer ',email:'test@example.com',phone:'',service:'Staffing Solutions',message:'Clearly labelled test enquiry',consent:'on',website:''})) data.set(key,value); return data; }
test('maps exactly the five saved template parameters without consent or honeypot',()=>{assert.deepEqual(templateParameters(fields()),{from_name:'Test Customer',from_email:'test@example.com',phone:'',service:'Staffing Solutions',message:'Clearly labelled test enquiry'});});
test('sends configured IDs and public key and waits for acceptance',async()=>{let call; const result=await sendEnquiry(fields(),config,async(...args)=>{call=args;return {status:200,text:'OK'};}); assert.equal(result.status,200);assert.equal(call[0],config.serviceId);assert.equal(call[1],config.templateId);assert.equal(call[3].publicKey,config.publicKey);assert.equal(call[3].limitRate.throttle,10000);assert.equal('privateKey' in call[3],false);});
test('missing configuration does not call provider',async()=>{await assert.rejects(sendEnquiry(fields(),{...config,publicKey:''},()=>{assert.fail();}));});
test('missing consent does not call provider',async()=>{const data=fields();data.delete('consent');await assert.rejects(sendEnquiry(data,config,()=>{assert.fail();}));});
test('resolved non-success response is not accepted',async()=>{await assert.rejects(sendEnquiry(fields(),config,async()=>({status:500,text:'Failed'})));});
test('provider rejection propagates without fake success',async()=>{await assert.rejects(sendEnquiry(fields(),config,async()=>{throw {status:429};}),error=>error.status===429);});
test('frontend no longer invokes retired API and keeps duplicate lock',async()=>{const modal=await readFile(new URL('../src/components/ContactModal.tsx',import.meta.url),'utf8');assert.equal(modal.includes('/api/contact'),false);assert.ok(modal.includes('sending.current = true'));assert.ok(modal.includes('finally { sending.current = false; }'));});
test('local environment files remain ignored',async()=>{const ignore=await readFile(new URL('../.gitignore',import.meta.url),'utf8');assert.ok(ignore.includes('.env.*'));assert.ok(ignore.includes('!.env.example'));});

test('404 Account not found identifies public-key account lookup failure',()=>{const result=emailJSDiagnostic({status:404,text:'Account not found'});assert.equal(result.code,'ACCOUNT_NOT_FOUND');assert.ok(result.message.includes('account configuration'));});
test('distinguishes service/template/origin and unknown endpoint errors',()=>{assert.equal(emailJSDiagnostic({status:404,text:'Service not found'}).code,'SERVICE_NOT_FOUND');assert.equal(emailJSDiagnostic({status:404,text:'Template not found'}).code,'TEMPLATE_NOT_FOUND');assert.equal(emailJSDiagnostic({status:403,text:'Forbidden'}).code,'ACCESS_REJECTED');assert.equal(emailJSDiagnostic({status:404,text:'Not Found'}).code,'NOT_FOUND');});
test('diagnostics never contain raw body or private form contents',()=>{const raw='customer@example.com SECRET_KEY customer message';const diagnostic=emailJSDiagnostic({status:400,text:raw,template_params:{message:raw}});assert.equal(JSON.stringify(diagnostic).includes(raw),false);assert.deepEqual(Object.keys(diagnostic),['status','code','message']);assert.equal(emailJSDiagnostic(null).code,'NETWORK_OR_CLIENT_ERROR');});

test('installed official SDK uses documented endpoint and wire parameter names',async()=>{
  const originalFetch=globalThis.fetch;const originalLocation=globalThis.location;let captured;
  globalThis.location={pathname:'/contact-test'};
  globalThis.fetch=async(url,options)=>{captured={url,body:JSON.parse(options.body)};return new Response('OK',{status:200});};
  try {const {default:emailjs}=await import('@emailjs/browser');await emailjs.send(config.serviceId,config.templateId,templateParameters(fields()),{publicKey:config.publicKey});
    assert.equal(captured.url,'https://api.emailjs.com/api/v1.0/email/send');assert.equal(captured.body.service_id,config.serviceId);assert.equal(captured.body.template_id,config.templateId);assert.equal(captured.body.user_id,config.publicKey);assert.deepEqual(captured.body.template_params,templateParameters(fields()));assert.equal('accessToken' in captured.body,false);
  } finally {globalThis.fetch=originalFetch;if(originalLocation===undefined)delete globalThis.location;else globalThis.location=originalLocation;}
});
