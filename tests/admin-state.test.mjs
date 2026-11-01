import {test} from 'node:test';
import assert from 'node:assert/strict';
import catalog from '../data/distributions.json' with {type:'json'};
import {AdminDraft,questionGroups} from '../assets/admin-state.js';
import {validateCatalog,generatedFiles} from '../assets/catalog-core.js';

test('opening each work area and question preserves all original points',()=>{
 const state=new AdminDraft(catalog);for(const group of questionGroups(state.catalog)){state.view='questions';state.question=group.id;assert.equal(state.visible().length,22);}state.view='distributions';
 assert.deepEqual(state.publishable(),catalog);assert.equal(state.dirty(),false);assert.equal(questionGroups(catalog).length,10);
 assert.equal(questionGroups(catalog)[0].options.length,6);assert.equal(questionGroups(catalog)[8].options.length,5);assert.equal(questionGroups(catalog)[9].options.length,5);
});
test('scores for several distributions and questions persist across all navigation',()=>{
 const state=new AdminDraft(catalog),[a,b]=state.visible();state.setScore(a.id,'points','D',13);state.question='q3';state.setScore(b.id,'points','R',9);state.view='distributions';state.select(b.id);state.selectedDistribution().descriptions.de.label='Geänderter Kurztext';state.view='questions';state.question='gpu';state.setScore(a.id,'gpu','AMD Radeon',4);state.question='q0';
 assert.equal(state.visible()[0].points.D,13);assert.equal(state.visible()[1].points.R,9);assert.equal(state.visible()[0].gpu['AMD Radeon'],4);assert.equal(state.visible()[1].descriptions.de.label,'Geänderter Kurztext');assert.equal(state.dirty(),true);
 const clean={...validateCatalog(state.publishable(),state.reference),version:catalog.version};const files=generatedFiles(clean);assert.equal(JSON.parse(files['assets/model.json']).distros[0].points.D,13);assert.equal(JSON.parse(files['assets/model.json']).distros[1].points.R,9);assert.equal(JSON.parse(files['assets/descriptions-de.json'])[b.name].label,'Geänderter Kurztext');
});
test('reset discards edits and deletions in both work areas',()=>{
 const state=new AdminDraft(catalog),[a,b]=state.visible();state.setScore(a.id,'points','Q',2);state.remove(b.id);assert.equal(state.visible().length,21);state.reset();assert.deepEqual(state.publishable(),catalog);assert.equal(state.dirty(),false);
});
test('deleting and undoing a row keeps matrix edits and original row order',()=>{
 const state=new AdminDraft(catalog),[a,b]=state.visible();state.setScore(a.id,'points','Q',2);state.remove(b.id);assert.ok(!state.visible().some(d=>d.id===b.id));state.undoDeletions();assert.equal(state.visible()[1].id,b.id);assert.equal(state.visible()[0].points.Q,2);
});
test('new distribution appears in every question table and missing fields identify the question',()=>{
 const state=new AdminDraft(catalog),newDistro=state.add();assert.equal(state.visible().length,23);assert.equal(state.firstMissingScore().id,newDistro.id);assert.equal(state.firstMissingScore().group,'q0');state.view='questions';state.setScore(newDistro.id,'points','B',10);state.view='distributions';state.select(catalog.distributions[0].id);assert.equal(state.visible().at(-1).points.B,10);state.remove(newDistro.id);assert.equal(state.visible().length,22);assert.equal(state.deletedIds.size,0);
});
test('neutral answer values remain locked and the last active distribution is protected',()=>{
 const state=new AdminDraft(catalog);assert.throws(()=>state.setScore(state.selected,'points','V',2));for(const d of state.visible().slice(1))state.remove(d.id);assert.throws(()=>state.remove(state.visible()[0].id));
});
