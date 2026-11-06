// Shared by the admin, publication service and tests. No credentials or dependencies.
export const RAM = [['4 GB oder weniger','AG'],['8 GB','AH'],['16 GB','AI'],['Weiß ich nicht','AJ'],['32 GB oder mehr','AK']];
export const GPU = ['Nvidia GeForce','AMD Radeon','Intel Grafik','Hybrid / mehrere','Weiß ich nicht'];
// JSONB may reorder object keys. Array order and actual values remain significant.
export function canonicalJson(value){
  const sorted=v=>Array.isArray(v)?v.map(sorted):v!==null&&typeof v==='object'?Object.fromEntries(Object.keys(v).sort().map(key=>[key,sorted(v[key])])):v;
  return JSON.stringify(sorted(value));
}
export function validateCatalog(input, reference) {
  if (!input || input.schemaVersion !== 1 || !Array.isArray(input.distributions) || input.distributions.length > 150) throw Error('Ungültiger Katalog.');
  if (canonicalJson(input.questions) !== canonicalJson(reference.questions)) throw Error('Die Fragenstruktur darf hier nicht geändert werden.');
  const codes = [...input.questions.flatMap(q=>q.options.map(o=>o[1])), ...RAM.map(o=>o[1])];
  const ids=new Set(), names=new Set(); let active=0;
  const distributions=input.distributions.map(d=>{
    if (!/^[a-z0-9][a-z0-9-]{1,79}$/.test(d.id) || ids.has(d.id)) throw Error('Eindeutige ID mit Kleinbuchstaben, Ziffern und Bindestrichen erforderlich.');
    ids.add(d.id);
    if(typeof d.active!=='boolean') throw Error('Aktiv-Status fehlt.');
    const str=(v,max,label)=>{if(typeof v!=='string'||v.length>max||(!v.trim()&&d.active))throw Error(label+' fehlt oder ist zu lang.');return v.trim();};
    const name=str(d.name,100,'Name');if(names.has(name.toLowerCase()))throw Error('Distributionsnamen müssen eindeutig sein.');names.add(name.toLowerCase());
    const number=(n,label)=>{if(!Number.isSafeInteger(n)||n < -100 || n > 100)throw Error(label+': ganze Zahl zwischen −100 und +100 erforderlich.');return n;};
    const points=Object.fromEntries(codes.map(c=>[c,number(d.points?.[c],c)]));
    for(const c of ['V','AB','AJ'])if(points[c]!==0)throw Error(c+' (egal/unbekannt) muss 0 bleiben.');
    const gpu=Object.fromEntries(GPU.map(k=>[k,number(d.gpu?.[k],k)]));
    const descriptions={},strengths={};
    for(const lang of ['de','en']){
      descriptions[lang]={label:str(d.descriptions?.[lang]?.label,150,'Kurztext '+lang),description:str(d.descriptions?.[lang]?.description,1500,'Beschreibung '+lang)};
      if(!Array.isArray(d.strengths?.[lang])||d.strengths[lang].length!==3)throw Error('Drei Stärken je Sprache erforderlich.');
      strengths[lang]=d.strengths[lang].map(v=>str(v,300,'Stärke '+lang));
    }
    const url=typeof d.url==='string'?d.url.trim():'';
    if(url){const u=new URL(url);if(u.protocol!=='https:'||u.username||u.password)throw Error('Nur öffentliche HTTPS-Links erlaubt.');}
    const icon=Array.isArray(d.icon)&&typeof d.icon[0]==='string'&&d.icon[0].length<=4&&/^#[0-9a-f]{6}$/i.test(d.icon[1])?d.icon:['\uf17c','#23bfdc'];
    if(d.active)active++;
    return {id:d.id,name,active:d.active,url,icon,descriptions,strengths,points,gpu};
  });
  if(!active)throw Error('Mindestens eine aktive Distribution erforderlich.');
  return {schemaVersion:1,questions:reference.questions,distributions};
}
export function runtimeFromCatalog(catalog) {
  const ds=catalog.distributions.filter(d=>d.active), model={version:catalog.version,questions:catalog.questions,distros:ds.map(d=>({id:d.id,name:d.name,points:d.points}))};
  return {model,bonuses:Object.fromEntries(ds.map(d=>[d.name,d.gpu])),descriptionsDe:Object.fromEntries(ds.map(d=>[d.name,d.descriptions.de])),descriptionsEn:Object.fromEntries(ds.map(d=>[d.name,d.descriptions.en])),strengths:Object.fromEntries(ds.map(d=>[d.name,d.strengths])),icons:Object.fromEntries(ds.map(d=>[d.name,d.icon])),urls:Object.fromEntries(ds.map(d=>[d.name,d.url]))};
}
export function simulate(catalog, answers, ram='',gpu='') {
  const {model,bonuses}=runtimeFromCatalog(catalog);
  const codes=[...answers.flat(),...(answers[2]?.includes('O')&&ram?[ram]:[])];
  const rows=model.distros.map((d,i)=>({...d,index:i,score:codes.reduce((n,c)=>n+(d.points[c]||0),0)+(answers[0]?.includes('D')?(bonuses[d.name]?.[gpu]||0):0)})).sort((a,b)=>b.score-a.score||a.index-b.index);
  let rank=0,last;return rows.map(d=>{if(rank===0||d.score!==last)rank++;last=d.score;return {...d,rank};}).filter(d=>d.rank<=3);
}
export function generatedFiles(catalog) {
  const r=runtimeFromCatalog(catalog),json=v=>JSON.stringify(v,null,2)+'\n';
  const files={'data/distributions.json':json(catalog),'assets/model.json':json(r.model),'supabase/functions/submit-statistics/model.json':json(r.model),'assets/gpu-bonus.json':json(r.bonuses),'supabase/functions/submit-statistics/gpu-bonus.json':json(r.bonuses),'assets/descriptions-de.json':json(r.descriptionsDe),'assets/descriptions-en.json':json(r.descriptionsEn),'assets/icons.js':'export const DISTRO_ICONS = '+json(r.icons)+';\n'};
  return files;
}
