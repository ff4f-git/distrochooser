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
const xml=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const column=n=>{let s='';for(n++;n;n=Math.floor((n-1)/26))s=String.fromCharCode(65+(n-1)%26)+s;return s;};
// Small standards-compliant ZIP writer (stored entries + CRC32); no remote scripts.
export function zipStored(entries) {
  const encoder=new TextEncoder(), locals=[],centrals=[];let offset=0;
  const crc=bytes=>{let c=0xffffffff;for(const b of bytes){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;};
  const pack=(size,fields)=>{const a=new Uint8Array(size),v=new DataView(a.buffer);for(const [o,n,w]of fields)w===2?v.setUint16(o,n,true):v.setUint32(o,n,true);return a;};
  const concat=arr=>{const out=new Uint8Array(arr.reduce((n,a)=>n+a.length,0));let p=0;for(const a of arr){out.set(a,p);p+=a.length;}return out;};
  for(const [path,content]of Object.entries(entries)){
    const name=encoder.encode(path),data=encoder.encode(content),sum=crc(data);
    const local=concat([pack(30,[[0,0x04034b50,4],[4,20,2],[14,sum,4],[18,data.length,4],[22,data.length,4],[26,name.length,2]]),name,data]);
    locals.push(local);centrals.push(concat([pack(46,[[0,0x02014b50,4],[4,20,2],[6,20,2],[16,sum,4],[20,data.length,4],[24,data.length,4],[28,name.length,2],[42,offset,4]]),name]));offset+=local.length;
  }
  const central=concat(centrals);return concat([...locals,central,pack(22,[[0,0x06054b50,4],[8,centrals.length,2],[10,centrals.length,2],[12,central.length,4],[16,offset,4]])]);
}
export function excelExport(catalog) {
  const codes=[...catalog.questions.flatMap(q=>q.options.map(o=>o[1])),...RAM.map(o=>o[1])];
  const labels=Object.fromEntries([...catalog.questions.flatMap((q,i)=>q.options.map(([label,c])=>[c,`Frage ${i+1}: ${label}`])),...RAM.map(([label,c])=>[c,'RAM: '+label])]);
  const sheets=[['Bewertungen',[['ID','Distribution','Aktiv',...codes.map(c=>c+': '+labels[c]),...GPU.map(k=>'GPU: '+k)],...catalog.distributions.map(d=>[d.id,d.name,d.active?'Ja':'Nein',...codes.map(c=>d.points[c]),...GPU.map(k=>d.gpu[k])])]],['Beschreibungen',[['ID','Download','Kurztext DE','Beschreibung DE','Kurztext EN','Beschreibung EN','Stärken DE','Stärken EN'],...catalog.distributions.map(d=>[d.id,d.url,d.descriptions.de.label,d.descriptions.de.description,d.descriptions.en.label,d.descriptions.en.description,d.strengths.de.join(' / '),d.strengths.en.join(' / ')])]],['Hinweise',[['Version',catalog.version],['Bearbeitung','Automatisch erzeugter Export. Werte im Administrationstool bearbeiten.'],['Inaktive Distributionen','Bleiben für Historie erhalten, erscheinen nicht in neuen Empfehlungen.']]]];
  const entries={'[Content_Types].xml':'<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'+sheets.map((_,i)=>`<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')+'</Types>', '_rels/.rels':'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>', 'xl/workbook.xml':'<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>'+sheets.map(([name],i)=>`<sheet name="${name}" sheetId="${i+1}" r:id="rId${i+1}"/>`).join('')+'</sheets></workbook>', 'xl/_rels/workbook.xml.rels':'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+sheets.map((_,i)=>`<Relationship Id="rId${i+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join('')+'</Relationships>'};
  sheets.forEach(([,rows],i)=>{entries[`xl/worksheets/sheet${i+1}.xml`]='<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane xSplit="2" ySplit="1" topLeftCell="C2" state="frozen"/></sheetView></sheetViews><cols><col min="1" max="2" width="28" customWidth="1"/><col min="3" max="60" width="18" customWidth="1"/></cols><sheetData>'+rows.map((row,r)=>`<row r="${r+1}">`+row.map((v,c)=>typeof v==='number'?`<c r="${column(c)}${r+1}"><v>${v}</v></c>`:`<c r="${column(c)}${r+1}" t="inlineStr"><is><t xml:space="preserve">${xml(v)}</t></is></c>`).join('')+'</row>').join('')+'</sheetData></worksheet>';});return zipStored(entries);
}
export function generatedFiles(catalog) {
  const r=runtimeFromCatalog(catalog),json=v=>JSON.stringify(v,null,2)+'\n';
  const files={'data/distributions.json':json(catalog),'assets/model.json':json(r.model),'supabase/functions/submit-statistics/model.json':json(r.model),'assets/gpu-bonus.json':json(r.bonuses),'supabase/functions/submit-statistics/gpu-bonus.json':json(r.bonuses),'assets/descriptions-de.json':json(r.descriptionsDe),'assets/descriptions-en.json':json(r.descriptionsEn),'assets/icons.js':'export const DISTRO_ICONS = '+json(r.icons)+';\n'};
  for(const lang of ['de','en']){
    let doc=`# ${lang==='de'?'Veröffentlichte Bewertungen':'Published scores'}\n\nVersion: \`${catalog.version}\`\n\n${lang==='de'?'Automatisch aus der Distributionsverwaltung erzeugt. Nur aktive Distributionen.':'Generated from distribution administration. Active distributions only.'}\n\n`;
    for(const q of catalog.questions){doc+='## '+q.title+'\n\n| Distribution | '+q.options.map(o=>o[1]+': '+o[0]).join(' | ')+' |\n|---|'+q.options.map(()=>'---:').join('|')+'|\n';for(const d of r.model.distros)doc+='| '+d.name.replace(/\|/g,'/')+' | '+q.options.map(o=>d.points[o[1]]).join(' | ')+' |\n';doc+='\n';}
    doc+='## RAM / GPU\n\n| Distribution | '+[...RAM.map(o=>o[1]),...GPU].join(' | ')+' |\n|---|'+Array(10).fill('---:').join('|')+'|\n';for(const d of r.model.distros)doc+='| '+d.name.replace(/\|/g,'/')+' | '+[...RAM.map(o=>d.points[o[1]]),...GPU.map(k=>r.bonuses[d.name][k])].join(' | ')+' |\n';files[`docs/scores-${lang}.md`]=doc;
  }
  files['docs/bewertungslogik.md']='# Bewertungslogik\n\nDie jeweils veröffentlichten Werte werden automatisch aus der Distributionsverwaltung erzeugt. Alle gewählten Nutzungsarten werden addiert, ebenso die Antworten der weiteren Fragen und zutreffende Hardware-Boni. Die ersten drei unterschiedlichen Punktwerte bilden die Empfehlungsränge; Gleichstände bleiben erhalten.\n\n[Redaktionelle Begründungen und historische Beispiele](scoring-rationale-de.md) · [Administration](administration.md)\n\n'+files['docs/scores-de.md'];
  files['docs/scoring-logic.md']='# Scoring logic\n\nPublished scores are generated automatically from distribution administration. Selected uses, subsequent answers and applicable hardware bonuses are added. The first three distinct totals define recommendation ranks; ties are preserved.\n\n[Editorial rationale and historical examples](scoring-rationale-en.md) · [Administration](administration.md)\n\n'+files['docs/scores-en.md'];
  return files;
}
