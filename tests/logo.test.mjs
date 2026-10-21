import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
test('shared logo uses approved local asset, exact alt and responsive compact crop',async()=>{const component=await readFile(new URL('../src/components/Logo.tsx',import.meta.url),'utf8');assert.ok(component.includes('alt="Zet X Solutions"'));assert.ok(component.includes('/assets/zetx-official-dark.webp'));assert.ok(component.includes('/assets/zetx-official-dark-compact.webp'));assert.equal(component.includes('zetx-final-logo.webp'),false);});
test('logo presentation preserves colors and proportions',async()=>{const css=await readFile(new URL('../src/components/Logo.css',import.meta.url),'utf8');assert.ok(css.includes('object-fit:contain'));assert.ok(css.includes('background:transparent'));assert.equal(css.includes('background:var(--white)'),false);assert.equal(/mix-blend-mode|filter:/.test(css),false);});
test('new favicon references are local and original approved logos remain backed up',async()=>{const html=await readFile(new URL('../index.html',import.meta.url),'utf8');for(const name of ['zetx-official-blue-favicon.ico','zetx-official-blue-icon-32.png','zetx-official-blue-icon-192.png']){assert.ok(html.includes(name));assert.ok((await readFile(new URL(`../public/assets/${name}`,import.meta.url))).length>0);}for(const name of ['zetx-final-logo.webp','zetx-final-metallic.png','zetx-official-blue-original.png'])assert.ok((await readFile(new URL(`../public/assets/${name}`,import.meta.url))).length>0);});

test('dark-theme logo assets carry a real alpha channel with original dimensions',async()=>{
 for(const [name,height] of [['zetx-official-dark.webp',208],['zetx-official-dark-compact.webp',157]]){
  const asset=await readFile(new URL(`../public/assets/${name}`,import.meta.url));
  assert.equal(asset.toString('ascii',12,16),'VP8L');
  const bits=asset.readUInt32LE(21);
  assert.equal((bits&0x3fff)+1,423);assert.equal(((bits>>>14)&0x3fff)+1,height);assert.equal((bits>>>28)&1,1);
 }
});
