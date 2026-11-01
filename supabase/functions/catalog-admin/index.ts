import {validateCatalog,runtimeFromCatalog,generatedFiles,excelExport} from './catalog.js';
import reference from './seed.json' with {type:'json'};
const REPO='ff4f-git/distrochooser';
const ORIGIN='https://ff4f-git.github.io';
const db=async(path:string,init:RequestInit={})=>{
 const url=Deno.env.get('SUPABASE_URL'),key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
 if(!url||!key)throw Error('Datenverwaltung ist nicht erreichbar.');
 const res=await fetch(url+'/rest/v1/'+path,{...init,headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json',...init.headers},signal:AbortSignal.timeout(12000)});
 if(!res.ok)throw Error('Speichern des Versionsstands fehlgeschlagen.');return res.status===204?null:res.json();
};
const current=async()=>{const rows=await db('distribution_release_current?select=version&singleton=eq.true');if(!rows.length)throw Error('Keine Veröffentlichung vorhanden.');const [row]=await db('distribution_releases?select=catalog,github_commit&version=eq.'+encodeURIComponent(rows[0].version));return row;};
const base64=(bytes:Uint8Array)=>{let s='';for(let i=0;i<bytes.length;i+=8192)s+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(s);};
export async function handler(request:Request){
 const headers={'Access-Control-Allow-Origin':ORIGIN,'Vary':'Origin','Access-Control-Allow-Headers':'content-type,authorization','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Cache-Control':'no-store'};
 const reply=(status:number,body:object)=>Response.json(body,{status,headers});
 if(request.headers.get('origin')&&request.headers.get('origin')!==ORIGIN)return reply(403,{error:'Zugriff nicht erlaubt.'});
 if(request.method==='OPTIONS')return new Response(null,{status:204,headers});
 try{
  const admin=new URL(request.url).searchParams.get('admin')==='1';
  if(request.method==='GET'&&!admin){const row=await current();return reply(200,{catalog:row.catalog});}
  if(!['GET','POST'].includes(request.method))return reply(405,{error:'Methode nicht erlaubt.'});
  const token=request.headers.get('authorization')?.replace(/^Bearer /,'');
  if(!token||token.length>500)return reply(401,{error:'Bitte mit GitHub verbinden.'});
  const gh=async(path:string,init:RequestInit={})=>{
   const res=await fetch('https://api.github.com/'+path,{...init,headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','Content-Type':'application/json',...init.headers},signal:AbortSignal.timeout(15000)});
   if(!res.ok){if([401,403].includes(res.status))throw Error('GitHub-Zugriff verweigert. Token und Schreibrechte prüfen.');if(res.status===422)throw Error('Zwischenzeitliche Änderung auf main. Neu laden und erneut speichern.');throw Error('GitHub-Veröffentlichung fehlgeschlagen ('+res.status+').');}return res.json();
  };
  const [user,repo]=await Promise.all([gh('user'),gh('repos/'+REPO)]);
  if(!repo.permissions?.push)return reply(403,{error:'Schreibrecht für '+REPO+' erforderlich.'});
  const [row,ref]=await Promise.all([current(),gh('repos/'+REPO+'/git/ref/heads/main')]);
  if(request.method==='GET')return reply(200,{catalog:row.catalog,head:ref.object.sha,user:user.login});
  if(!request.headers.get('content-type')?.startsWith('application/json'))return reply(415,{error:'JSON erforderlich.'});
  const reader=request.body?.getReader();if(!reader)return reply(400,{error:'Formulardaten fehlen.'});
  const chunks=[];let size=0;while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>1500000){await reader.cancel();return reply(413,{error:'Katalog zu groß.'});}chunks.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
  const input=JSON.parse(new TextDecoder().decode(bytes));
  if(input.expectedVersion!==row.catalog.version)return reply(409,{error:'Der Datenstand wurde inzwischen geändert. Bitte neu laden.'});
  const clean=validateCatalog(input.catalog,reference);
  const existing=new Set(clean.distributions.map(d=>d.id));
  if(row.catalog.distributions.some((d:{id:string})=>!existing.has(d.id)))return reply(400,{error:'Distributionen bitte deaktivieren statt löschen.'});
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(JSON.stringify(clean)));
  const version='catalog-'+Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
  if(version===row.catalog.version)return reply(200,{catalog:row.catalog,head:ref.object.sha,unchanged:true});
  const catalog={...clean,version};let commit=ref.object.sha;
  // Retry after a transient database failure: reactivate the exact committed catalog.
  const committed=await gh('repos/'+REPO+'/contents/data/distributions.json?ref='+commit);
  const committedVersion=JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(committed.content.replace(/\s/g,'')),c=>c.charCodeAt(0)))).version;
  if(committedVersion!==version){
   if(input.expectedHead!==commit)return reply(409,{error:'main wurde zwischenzeitlich geändert. Bitte neu laden.'});
   const sourceCommit=await gh('repos/'+REPO+'/git/commits/'+commit);
   const binary=await gh('repos/'+REPO+'/git/blobs',{method:'POST',body:JSON.stringify({encoding:'base64',content:base64(excelExport(catalog))})});
   const tree=await gh('repos/'+REPO+'/git/trees',{method:'POST',body:JSON.stringify({base_tree:sourceCommit.tree.sha,tree:[...Object.entries(generatedFiles(catalog)).map(([path,content])=>({path,mode:'100644',type:'blob',content})),{path:'data/punktematrix.xlsx',mode:'100644',type:'blob',sha:binary.sha}]})});
   const created=await gh('repos/'+REPO+'/git/commits',{method:'POST',body:JSON.stringify({message:'Publish distribution catalog '+version.slice(8,20)+' by '+user.login,tree:tree.sha,parents:[commit]})});
   await gh('repos/'+REPO+'/git/refs/heads/main',{method:'PATCH',body:JSON.stringify({sha:created.sha,force:false})});commit=created.sha;
  }
  await db('rpc/activate_distribution_release',{method:'POST',body:JSON.stringify({expected_version:row.catalog.version,new_catalog:catalog,commit_sha:commit,actor:user.login})});
  return reply(200,{catalog,head:commit,user:user.login});
 }catch(error){return reply(400,{error:error instanceof Error?error.message:'Speichern fehlgeschlagen.'});}
}
Deno.serve(handler);
