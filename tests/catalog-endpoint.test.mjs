import {test} from 'node:test';
import assert from 'node:assert/strict';
import seed from '../data/distributions.json' with {type:'json'};
import {canonicalJson} from '../assets/catalog-core.js';
globalThis.Deno={env:{get:key=>key==='SUPABASE_URL'?'https://database.test':'test-server-key'},serve:()=>{}};
const {handler}=await import('../supabase/functions/catalog-admin/index.ts');
const original=globalThis.fetch;
function mock({head='head-a',push=true,failGit=false}={}){
 let active=seed,branch=head;const writes=[];globalThis.fetch=async(url,init={})=>{
  const u=new URL(url),path=u.pathname;
  if(init.method&&init.method!=='GET')writes.push({path,body:JSON.parse(init.body)});
  let result;
  if(u.hostname==='database.test'){
   if(path.endsWith('distribution_release_current'))result=[{version:active.version}];
   else if(path.endsWith('distribution_releases'))result=[{catalog:active,github_commit:'head-a'}];
   else if(path.endsWith('activate_distribution_release')){active=JSON.parse(init.body).new_catalog;result='activated';}
  }else{
   if(failGit)return Response.json({message:'Bad credentials'},{status:401});
   if(path==='/user')result={login:'test-editor'};
   else if(path.endsWith('/distrochooser'))result={permissions:{push}};
   else if(path.endsWith('/git/ref/heads/main'))result={object:{sha:branch}};
   else if(path.includes('/contents/data/distributions.json'))result={content:Buffer.from(JSON.stringify(seed)).toString('base64')};
   else if(path.includes('/git/commits/')&&!init.method)result={tree:{sha:'base-tree'}};
   else if(path.endsWith('/git/blobs'))result={sha:'excel-blob'};
   else if(path.endsWith('/git/trees'))result={sha:'new-tree'};
   else if(path.endsWith('/git/commits'))result={sha:'new-commit'};
   else if(path.endsWith('/git/refs/heads/main')){branch='new-commit';result={object:{sha:branch}};}
  }
  assert.notEqual(result,undefined,'unexpected fetch '+url);return Response.json(u.hostname==='database.test'?JSON.parse(canonicalJson(result)):result);
 };return writes;
}
const req=(body,token=true)=>new Request('https://edge.test/catalog-admin?admin=1',{method:body?'POST':'GET',headers:{Origin:'https://ff4f-git.github.io',...(token?{Authorization:'Bearer test-token'}:{}),...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{})});
test('admin endpoints enforce credentials and repository write permission',async()=>{
 try{mock();assert.equal((await handler(req(null,false))).status,401);mock({push:false});assert.equal((await handler(req())).status,403);mock({failGit:true});const res=await handler(req());assert.equal(res.status,400);assert.ok((await res.json()).error.includes('GitHub'));}finally{globalThis.fetch=original;}
});
test('public catalog is read-only and contains exactly one complete release',async()=>{
 try{const writes=mock();const res=await handler(new Request('https://edge.test/catalog-admin'));assert.equal(res.status,200);assert.deepEqual((await res.json()).catalog,seed);assert.equal(writes.length,0);}finally{globalThis.fetch=original;}
});
test('saving publishes all generated assets before activating the exact release',async()=>{
 try{const writes=mock(),catalog=structuredClone(seed);catalog.distributions[0].points.Q=19;const res=await handler(req({catalog,expectedVersion:seed.version,expectedHead:'head-a'}));assert.equal(res.status,200);const out=await res.json();assert.match(out.catalog.version,/^catalog-[a-f0-9]{64}$/);assert.equal(out.catalog.distributions[0].points.Q,19);
  const tree=writes.find(w=>w.path.endsWith('/git/trees')).body.tree;for(const path of ['data/distributions.json','assets/model.json','supabase/functions/submit-statistics/model.json','data/punktematrix.xlsx','docs/scores-de.md','docs/scores-en.md'])assert.ok(tree.some(e=>e.path===path));
  assert.ok(writes.findIndex(w=>w.path.endsWith('/git/refs/heads/main'))<writes.findIndex(w=>w.path.endsWith('activate_distribution_release')));
  const activation=writes.at(-1).body;assert.equal(activation.new_catalog.version,out.catalog.version);assert.equal(activation.actor,'test-editor');
 }finally{globalThis.fetch=original;}
});
test('stale edits and permanent deletions cannot overwrite the live catalog',async()=>{
 try{let writes=mock(),catalog=structuredClone(seed);catalog.distributions[0].points.Q=19;assert.equal((await handler(req({catalog,expectedVersion:'stale',expectedHead:'head-a'}))).status,409);assert.equal(writes.length,0);
 writes=mock({head:'head-b'});assert.equal((await handler(req({catalog,expectedVersion:seed.version,expectedHead:'head-a'}))).status,409);assert.equal(writes.length,0);
 writes=mock();catalog.distributions.pop();assert.equal((await handler(req({catalog,expectedVersion:seed.version,expectedHead:'head-a'}))).status,400);assert.equal(writes.length,0);
 }finally{globalThis.fetch=original;}
});
test('explicit draft deletion publishes a new catalog and retains the previous snapshot',async()=>{
 try{const writes=mock(),catalog=structuredClone(seed),removed=catalog.distributions.shift();
 const res=await handler(req({catalog,expectedVersion:seed.version,expectedHead:'head-a',deletedIds:[removed.id]}));
 assert.equal(res.status,200);const result=await res.json();assert.equal(result.catalog.distributions.length,seed.distributions.length-1);assert.ok(!result.catalog.distributions.some(d=>d.id===removed.id));
 assert.ok(seed.distributions.some(d=>d.id===removed.id));assert.ok(!writes.some(w=>w.path.includes('DELETE')));
 const tree=writes.find(w=>w.path.endsWith('/git/trees')).body.tree;
 for(const path of ['assets/model.json','supabase/functions/submit-statistics/model.json','assets/gpu-bonus.json','assets/descriptions-de.json'])assert.ok(!tree.find(e=>e.path===path).content.includes(removed.name));
 const activation=writes.find(w=>w.path.endsWith('activate_distribution_release'));assert.equal(activation.body.expected_version,seed.version);assert.equal(activation.body.new_catalog.distributions.length,seed.distributions.length-1);
 }finally{globalThis.fetch=original;}
});
test('deletion declarations must exactly match missing IDs and cannot remove the last active distribution',async()=>{
 try{for(const bad of [['unknown'],[seed.distributions[0].id,seed.distributions[0].id]]){
 const writes=mock(),catalog=structuredClone(seed);catalog.distributions.shift();const res=await handler(req({catalog,expectedVersion:seed.version,expectedHead:'head-a',deletedIds:bad}));assert.equal(res.status,400);assert.equal(writes.length,0);}
 const writes=mock(),catalog=structuredClone(seed);catalog.distributions=[];assert.equal((await handler(req({catalog,expectedVersion:seed.version,expectedHead:'head-a',deletedIds:seed.distributions.map(d=>d.id)}))).status,400);assert.equal(writes.length,0);
 }finally{globalThis.fetch=original;}
});
test('publishing accepts questions returned through PostgreSQL JSONB key ordering',async()=>{
 try{mock();const catalog=JSON.parse(canonicalJson(seed));assert.notEqual(JSON.stringify(catalog.questions),JSON.stringify(seed.questions));catalog.distributions[0].name+=' Test';
 const res=await handler(req({catalog,expectedVersion:seed.version,expectedHead:'head-a',deletedIds:[]}));assert.equal(res.status,200,await res.clone().text());assert.equal((await res.json()).catalog.distributions[0].name,catalog.distributions[0].name);
 }finally{globalThis.fetch=original;}
});
