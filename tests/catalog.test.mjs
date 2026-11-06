import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import catalog from '../data/distributions.json' with {type:'json'};
import model from '../assets/model.json' with {type:'json'};
import bonuses from '../assets/gpu-bonus.json' with {type:'json'};
import {validateCatalog,runtimeFromCatalog,generatedFiles,simulate,GPU,RAM,canonicalJson} from '../assets/catalog-core.js';
import {validateSubmission} from '../supabase/functions/submit-statistics/validate.js';
import {loadPublishedCatalog} from '../assets/catalog-client.js';
test('catalog preserves all distributions, all scores, GPU bonuses and three strengths per language',()=>{
 const r=runtimeFromCatalog(catalog);assert.deepEqual(r.model.distros.map(({id,...d})=>d),model.distros.map(({id,...d})=>d));assert.deepEqual(r.bonuses,bonuses);
 for(const d of catalog.distributions)for(const lang of ['de','en'])assert.equal(d.strengths[lang].length,3);
 assert.equal(validateCatalog(catalog,catalog).distributions.length,catalog.distributions.length);
});
test('adding and deactivating a distribution updates every generated runtime asset',()=>{
 const c=structuredClone(catalog);const added={...structuredClone(c.distributions[0]),id:'test-distro',name:'Test distro'};c.distributions.push(added);c.distributions[0].active=false;
 const clean={...validateCatalog(c,catalog),version:'catalog-'+'a'.repeat(64)},files=generatedFiles(clean),r=runtimeFromCatalog(clean);
 assert.equal(r.model.distros.length,catalog.distributions.filter(d=>d.active).length);assert.ok(!r.model.distros.some(d=>d.name===catalog.distributions[0].name));assert.ok(r.model.distros.some(d=>d.name==='Test distro'));
 assert.deepEqual(JSON.parse(files['assets/model.json']),JSON.parse(files['supabase/functions/submit-statistics/model.json']));
 assert.ok(JSON.parse(files['assets/descriptions-de.json'])['Test distro']);assert.ok(files['docs/scores-de.md'].includes('Test distro'));assert.ok(clean.distributions.some(d=>!d.active));
});
test('rejects duplicates, missing scores, invalid values, question edits and script URLs',()=>{
 const changes=[c=>c.distributions.push(c.distributions[0]),c=>delete c.distributions[0].points.Q,c=>c.distributions[0].points.Q=1.5,c=>c.distributions[0].points.V=2,c=>c.distributions[0].url='javascript:alert(1)',c=>c.questions[0].title='changed',c=>c.distributions.forEach(d=>d.active=false)];
 for(const change of changes){const c=structuredClone(catalog);change(c);assert.throws(()=>validateCatalog(c,catalog));}
});
test('version-specific server validation and admin simulator have identical ranks',()=>{
 const c=structuredClone(catalog);c.version='catalog-'+'b'.repeat(64);c.distributions[0].active=false;const r=runtimeFromCatalog(c);
 for(const handle of ['Q','R','S'])for(const experience of ['AC','AD','AE']){
  const answers=[['B','D'],['H'],['M'],[handle],['U'],['X'],['AA'],[experience]];
  const input={modelVersion:c.version,consentVersion:'1',submissionId:crypto.randomUUID(),language:'de',answers,ram:null,gpu:'AMD Radeon'};
  const row=validateSubmission(input,r.model,r.bonuses,c.version);assert.deepEqual(row.top3,simulate(c,answers,'','AMD Radeon').map(d=>d.name));
  assert.throws(()=>validateSubmission(input,r.model,r.bonuses,'other-version'));
 }
});
test('fallback preserves a pinned catalog, rather than combining separately cached files',async()=>{
 let calls=0;const loaded=await loadPublishedCatalog(async()=>{calls++;return calls===1?{ok:false}:{ok:true,json:async()=>catalog};});assert.equal(calls,2);assert.equal(loaded.model.version,catalog.version);
});
test('admin validation matches the browser and statistics runtime stays compatible',async()=>{
 const source=await fs.readFile(new URL('../assets/catalog-core.js',import.meta.url),'utf8');
 assert.equal(await fs.readFile(new URL('../supabase/functions/catalog-admin/catalog.js',import.meta.url),'utf8'),source);
 const {runtimeFromCatalog:statisticsRuntime}=await import('../supabase/functions/submit-statistics/catalog.js');
 assert.deepEqual(statisticsRuntime(catalog),runtimeFromCatalog(catalog));
 const changed=structuredClone(catalog);changed.distributions[0].active=false;changed.distributions[1].name='Renamed distribution';
 assert.deepEqual(statisticsRuntime(changed),runtimeFromCatalog(changed));
});
test('question equality ignores JSONB object-key order but protects values, codes and array order',()=>{
 const reordered=JSON.parse(canonicalJson(catalog));assert.notEqual(JSON.stringify(reordered.questions),JSON.stringify(catalog.questions));assert.doesNotThrow(()=>validateCatalog(reordered,catalog));
 for(const mutate of [c=>c.questions[0].title+='x',c=>c.questions[0].options.reverse(),c=>c.questions[0].options[0][1]='WRONG',c=>c.questions.reverse(),c=>c.questions[0].extra=true]){const changed=structuredClone(reordered);mutate(changed);assert.throws(()=>validateCatalog(changed,catalog),/Fragenstruktur/);}
});
