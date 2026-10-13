import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
const tokens=await readFile(new URL('../src/tokens.css',import.meta.url),'utf8');
const colors=Object.fromEntries([...tokens.matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map(m=>[m[1],m[2]]));
function luminance(hex){const rgb=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;}
function contrast(a,b){const l=[luminance(colors[a]),luminance(colors[b])].sort((a,b)=>b-a);return (l[0]+.05)/(l[1]+.05);}
test('approved primary palette is centralized',()=>{assert.equal(colors.carbon.toUpperCase(),'#0B0D12');assert.equal(colors.accent.toUpperCase(),'#3979F6');assert.equal(colors.ice.toUpperCase(),'#E9EFFF');assert.equal(colors.white.toUpperCase(),'#FFFFFF');});
test('body, links, buttons and dark-surface accent text meet AA',()=>{for(const [foreground,background] of [['text','ice'],['muted','ice'],['accent-text','white'],['accent-text','ice'],['carbon','accent'],['carbon','accent-hover'],['accent-soft','carbon'],['on-dark-muted','surface-dark'],['error','surface-dark']])assert.ok(contrast(foreground,background)>=4.5,`${foreground} on ${background}: ${contrast(foreground,background)}`);});
test('input boundaries remain visible on dark surfaces',()=>{assert.ok(contrast('input-border','carbon')>=3);assert.ok(contrast('input-border','surface-dark')>=3);});
test('component CSS uses tokens and has no old gold theme references',async()=>{async function files(url){const entries=await readdir(url,{withFileTypes:true});return (await Promise.all(entries.map(e=>e.isDirectory()?files(new URL(e.name+'/',url)):[new URL(e.name,url)]))).flat();}for(const url of await files(new URL('../src/',import.meta.url))){if(!url.pathname.endsWith('.css')||url.pathname.endsWith('/tokens.css'))continue;const css=await readFile(url,'utf8');assert.equal(/#[0-9a-f]{3,8}\b/i.test(css),false,url.pathname);assert.equal(/--gold|--ivory|--black|champagne|obsidian/i.test(css),false,url.pathname);}});
