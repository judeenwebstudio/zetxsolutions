import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const source=await readFile(new URL('../src/lib/navigation.ts',import.meta.url),'utf8');
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {pageLink}=await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
test('homepage retains same-page service and benefit anchors',()=>{assert.equal(pageLink('#services','/'),'#services');assert.equal(pageLink('#why-us','/'),'#why-us');});
test('about links return to real homepage anchors',()=>{for(const path of ['/about','/about/']){assert.equal(pageLink('#services',path),'/#services');assert.equal(pageLink('#why-us',path),'/#why-us');}});
test('contact remains a shared modal trigger on both pages',()=>{assert.equal(pageLink('#contact','/'),'#contact');assert.equal(pageLink('#contact','/about'),'#contact');assert.equal(pageLink('/','/about'),'/');assert.equal(pageLink('/about','/'),'/about');});
test('Vercel rewrite is limited to about paths and preserves API routing',async()=>{const config=JSON.parse(await readFile(new URL('../vercel.json',import.meta.url),'utf8'));assert.deepEqual(config.rewrites,[{source:'/about',destination:'/index.html'},{source:'/about/',destination:'/index.html'}]);});

test('approved leadership names retain exact titles, public emails and approved portraits',async()=>{
  const source=await readFile(new URL('../src/config/about.ts',import.meta.url),'utf8');
  const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
  const {about}=await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
  assert.deepEqual(about.leadership,[
    {name:'Jagan Sadashivam',title:'CEO',email:'jagansadashivam@gmail.com',portrait:'jagan-sadashivam',alt:'Jagan Sadashivam, CEO of ZET X SOLUTIONS, seated in his office'},
    {name:'Hemalatha Manickam',title:'HR Manager',email:'hemamanickam66@gmail.com',portrait:'hemalatha-manickam',alt:'Hemalatha Manickam, HR Manager at ZET X SOLUTIONS, in a professional office portrait'},
  ]);
});

test('both approved portraits have locally hosted responsive WebP sizes',async()=>{
  for(const name of ['jagan-sadashivam','hemalatha-manickam']) for(const size of [480,960]) {
    const asset=await readFile(new URL(`../public/images/leadership/${name}-${size}.webp`,import.meta.url));
    assert.equal(asset.toString('ascii',0,4),'RIFF');assert.equal(asset.toString('ascii',8,12),'WEBP');
  }
});
