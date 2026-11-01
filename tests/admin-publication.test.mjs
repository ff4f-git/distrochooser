import {test} from 'node:test';
import assert from 'node:assert/strict';
import liveCatalog from '../data/distributions.json' with {type:'json'};
const catalog=structuredClone(liveCatalog);catalog.distributions.find(d=>d.id==='arch-linux-eigenbau').name='Arch Linux (Eigenbau)';
import {AdminDraft} from '../assets/admin-state.js';
import {publishVerified,sameCatalog} from '../assets/admin-publication.js';
const renamed=()=>{const c=structuredClone(catalog);c.distributions.find(d=>d.id==='arch-linux-eigenbau').name='Arch Linux';return c;};
test('captures the visible name before saving, even without an input event',()=>{
 const draft=new AdminDraft(catalog);draft.select('arch-linux-eigenbau');const old=structuredClone(draft.selectedDistribution());
 const values={id:old.id,name:'Arch Linux',url:old.url,active:old.active};for(const lang of ['de','en']){values['label-'+lang]=old.descriptions[lang].label;values['description-'+lang]=old.descriptions[lang].description;old.strengths[lang].forEach((v,i)=>values[`strength-${lang}-${i}`]=v);}
 draft.updateMetadata(values);assert.equal(draft.selectedDistribution().name,'Arch Linux');assert.deepEqual(draft.selectedDistribution().points,old.points);assert.equal(draft.selectedDistribution().id,old.id);
});
test('success requires the renamed catalog in both save response and independent reload',async()=>{
 const c=renamed();c.version='catalog-'+'c'.repeat(64);const calls=[];
 const result=await publishVerified(async(method,body)=>{calls.push({method,body});return {catalog:c,head:'committed'};},{catalog:c,reference:catalog,head:'old-head',deletedIds:[]});
 assert.deepEqual(calls.map(c=>c.method),['POST','GET']);assert.equal(result.catalog.distributions.find(d=>d.id==='arch-linux-eigenbau').name,'Arch Linux');assert.equal(sameCatalog(c,result.catalog),true);
});
test('HTTP 200 with stale content must never produce a success result',async()=>{
 await assert.rejects(publishVerified(async()=>({catalog}),{catalog:renamed(),reference:catalog,head:'head',deletedIds:[]}),/Speicherantwort/);
 let calls=0;const c=renamed();c.version='catalog-'+'c'.repeat(64);
 await assert.rejects(publishVerified(async()=>({catalog:++calls===1?c:catalog}),{catalog:c,reference:catalog,head:'head',deletedIds:[]}),/erneuten Laden/);
});
test('transport errors cannot be turned into success messages',async()=>{
 await assert.rejects(publishVerified(async()=>{throw Error('HTTP 400');},{catalog:renamed(),reference:catalog,head:'head',deletedIds:[]}),/HTTP 400/);
});
