import {validateCatalog} from './catalog-core.js';
import {AdminDraft,questionGroups} from './admin-state.js?v=3.1.1';
import {publishVerified} from './admin-publication.js?v=3.1.1';
const ENDPOINT='https://sjuzeljqkxffscqrtqxn.supabase.co/functions/v1/catalog-admin';
const $=id=>document.getElementById(id);
let token='',draft,head,user='',busy=false;

function notice(message,error=false){const target=$('workspace').hidden?$('loginStatus'):$('status');target.textContent=message;target.classList.toggle('error',error);}
async function api(method='GET',body){const r=await fetch(ENDPOINT+'?admin=1',{method,cache:'no-store',headers:{Authorization:'Bearer '+token,...(body?{'Content-Type':'application/json'}:{})},...(body?{body:JSON.stringify(body)}:{}),credentials:'omit',referrerPolicy:'no-referrer'});const data=await r.json();if(!r.ok)throw Error((data.error||'Verbindung fehlgeschlagen.')+(data.stage?' · Schritt: '+data.stage:'')+(data.requestId?' · Vorgang: '+data.requestId.slice(0,8):''));return data;}
function captureMetadata(){if(draft?.view!=='distributions')return;const values=Object.fromEntries(new FormData($('metadataForm')));values.active=$('active').checked;draft.updateMetadata(values);}
function field(label,name,value,onInput,{type='text',maxLength}={}){
 const l=document.createElement('label');l.textContent=label;const input=document.createElement(type==='textarea'?'textarea':'input');if(type!=='textarea')input.type=type;input.name=name;input.value=value;input.required=true;if(maxLength)input.maxLength=maxLength;input.oninput=()=>{onInput(input.value);updateState();};l.append(input);return l;
}
function updateState(){
 $('changeState').textContent=draft.dirty()?'Ungespeicherte Änderungen':'Keine Änderungen';
 $('identity').textContent='Verbunden als '+user+' · '+draft.visible().filter(d=>d.active).length+' aktive Distributionen';
 $('deletions').hidden=draft.deletedIds.size===0;
 $('deletionText').textContent=[...draft.deletedIds].map(id=>draft.reference.distributions.find(d=>d.id===id)?.name||id).join(', ')+' – zum Löschen vorgemerkt. Erst beim Speichern wirksam; historische Versionen bleiben erhalten.';
 if(draft.selectedDistribution())$('state').textContent=draft.selectedDistribution().active?'AKTIV':'DEAKTIVIERT';
}
function list(){
 const filter=$('search').value.toLowerCase();$('distroList').replaceChildren();
 for(const d of draft.visible().filter(d=>d.name.toLowerCase().includes(filter))){const b=document.createElement('button');b.type='button';b.textContent=d.name||'Neue Distribution';b.setAttribute('aria-current',String(d.id===draft.selected));if(!d.active){const t=document.createElement('small');t.textContent='Nicht in Empfehlungen';b.append(t);}b.onclick=()=>{if(busy)return;try{captureMetadata();draft.select(d.id);renderMetadata();list();}catch(error){notice(error.message,true);}};$('distroList').append(b);}
}
function renderMetadata(){
 const d=draft.selectedDistribution(),form=$('metadataForm');$('selectedName').textContent=d.name||'Neue Distribution';
 for(const key of ['name','id','url']){const input=form.elements.namedItem(key);input.value=d[key];input.oninput=()=>{if(key==='id'&&draft.catalog.distributions.some(x=>x!==d&&x.id===input.value)){input.value=d.id;notice('Diese ID wird bereits von einer anderen Distribution verwendet.',true);return;}d[key]=input.value;if(key==='id')draft.selected=d.id;if(key==='name')$('selectedName').textContent=d.name||'Neue Distribution';list();updateState();};}
 form.elements.namedItem('id').readOnly=draft.published(d.id);$('active').checked=d.active;$('descriptions').replaceChildren();
 for(const lang of ['de','en']){const box=document.createElement('div'),h=document.createElement('h4');h.textContent=lang==='de'?'Deutsch':'English';box.append(h,field('Kurztext','label-'+lang,d.descriptions[lang].label,v=>d.descriptions[lang].label=v,{maxLength:150}),field('Beschreibung','description-'+lang,d.descriptions[lang].description,v=>d.descriptions[lang].description=v,{type:'textarea',maxLength:1500}));d.strengths[lang].forEach((v,i)=>box.append(field('Stärke '+(i+1),`strength-${lang}-${i}`,v,value=>d.strengths[lang][i]=value,{maxLength:300})));$('descriptions').append(box);}updateState();
}
function renderQuestions(){
 const groups=questionGroups(draft.catalog),select=$('questionSelect');
 if(!select.options.length)for(const g of groups){const option=document.createElement('option');option.value=g.id;option.textContent=g.title;select.append(option);}
 select.value=draft.question;const group=groups.find(g=>g.id===draft.question);
 $('matrixCount').textContent=draft.visible().length+' Distributionen';$('matrixCaption').textContent=group.title;
 $('matrixHint').textContent=group.id==='ram'?'Zusatzpunkte bei „8 Jahre oder älter“.':group.id==='gpu'?'Zusätzliche Punkte bei gewählter Gaming-Nutzung.':'Antwortmöglichkeiten als Spalten. Änderungen bleiben beim Wechsel der Frage erhalten.';
 const header=document.createElement('tr'),nameHead=document.createElement('th');nameHead.scope='col';nameHead.textContent='Distribution';header.append(nameHead);
 for(const [label,key]of group.options){const th=document.createElement('th');th.scope='col';th.textContent=label;const code=document.createElement('small');code.textContent=group.kind==='gpu'?'GPU':key;th.append(code);header.append(th);}
 $('matrixHead').replaceChildren(header);$('matrixBody').replaceChildren();
 for(const d of draft.visible()){
  const row=document.createElement('tr'),name=document.createElement('th');name.scope='row';name.textContent=d.name||'Neue Distribution';if(!d.active){const small=document.createElement('small');small.textContent='Deaktiviert';name.append(small);}row.append(name);
  for(const [label,key]of group.options){
   const td=document.createElement('td'),input=document.createElement('input');input.type='number';input.min='-100';input.max='100';input.step='1';input.value=d[group.kind][key]??'';input.required=true;input.setAttribute('aria-label',d.name+' – '+label);input.dataset.distro=d.id;input.dataset.code=key;input.readOnly=group.kind==='points'&&['V','AB','AJ'].includes(key);
   const previous=draft.reference.distributions.find(x=>x.id===d.id)?.[group.kind][key];input.classList.toggle('changed',previous!==d[group.kind][key]);
   input.oninput=()=>{draft.setScore(d.id,group.kind,key,input.value===''?null:Number(input.value));input.classList.toggle('changed',previous!==d[group.kind][key]);updateState();renderSpread(group);};td.append(input);row.append(td);
  }$('matrixBody').append(row);
 }renderSpread(group);
}
function renderSpread(group){
 const row=document.createElement('tr'),label=document.createElement('th');label.scope='row';label.textContent='Spannweite';row.append(label);
 for(const [,key]of group.options){const values=draft.visible().map(d=>d[group.kind][key]).filter(Number.isFinite),td=document.createElement('td');td.textContent=values.length?String(Math.max(...values)-Math.min(...values)):'—';td.title=values.length?'Minimum '+Math.min(...values)+' · Maximum '+Math.max(...values):'Noch keine Werte';row.append(td);}$('matrixFoot').replaceChildren(row);
}
function show(view){
 if(busy)return;draft.view=view;$('distributionView').hidden=view!=='distributions';$('distributionTools').hidden=view!=='distributions';$('questionView').hidden=view!=='questions';$('questionHelp').hidden=view!=='questions';
 $('navDistributions').setAttribute('aria-current',view==='distributions'?'page':'false');$('navQuestions').setAttribute('aria-current',view==='questions'?'page':'false');
 if(view==='questions')renderQuestions();else{renderMetadata();list();}updateState();
}
function lock(locked){busy=locked;for(const control of $('workspace').querySelectorAll('input,textarea,select,button'))control.disabled=locked;$('logout').disabled=locked;$('save').textContent=locked?'Wird gespeichert …':'Speichern & veröffentlichen →';}

$('loginForm').onsubmit=async e=>{e.preventDefault();token=$('token').value.trim();$('token').value='';$('connect').disabled=true;notice('Zugriff wird geprüft …');try{const data=await api();draft=new AdminDraft(data.catalog);head=data.head;user=data.user;$('login').hidden=true;$('workspace').hidden=false;$('logout').hidden=false;$('loginStatus').textContent='';$('questionSelect').replaceChildren();show('distributions');notice('');}catch(error){token='';notice(error.message,true);}finally{$('connect').disabled=false;}};
$('logout').onclick=()=>{if(busy)return;if(draft.dirty()&&!confirm('Alle ungespeicherten Änderungen verwerfen und abmelden?'))return;token='';draft=null;head=null;$('workspace').hidden=true;$('login').hidden=false;$('logout').hidden=true;notice('Abgemeldet.');};
$('navDistributions').onclick=()=>show('distributions');const openQuestions=()=>{try{captureMetadata();show('questions');}catch(error){notice(error.message,true);}};$('navQuestions').onclick=openQuestions;$('openQuestions').onclick=openQuestions;
$('search').oninput=list;$('questionSelect').onchange=()=>{draft.question=$('questionSelect').value;renderQuestions();};
$('active').onchange=()=>{draft.selectedDistribution().active=$('active').checked;list();updateState();};$('metadataForm').onsubmit=e=>e.preventDefault();
$('add').onclick=()=>{if(busy)return;draft.add();show('distributions');$('metadataForm').elements.namedItem('name').focus();notice('Neue Distribution angelegt. Stammdaten ausfüllen und anschließend unter „Fragen & Punkte“ die Bewertungen ergänzen.');};
$('delete').onclick=()=>{if(busy)return;const d=draft.selectedDistribution(),published=draft.published(d.id);if(published&&!confirm('„'+d.name+'“ aus dem aktuellen Katalog löschen? Wirksam erst mit „Speichern & veröffentlichen“. Historische Versionen und Statistiken bleiben erhalten.'))return;try{draft.remove(d.id);renderMetadata();list();notice(published?'Löschung vorgemerkt.':'Unveröffentlichten Entwurf verworfen.');}catch(error){notice(error.message,true);}};
$('undoDelete').onclick=()=>{if(busy)return;draft.undoDeletions();show(draft.view);notice('Vorgemerkte Löschungen zurückgenommen.');};
$('reset').onclick=()=>{if(busy||!confirm('Alle ungespeicherten Änderungen aus beiden Bereichen verwerfen?'))return;draft.reset();show(draft.view);notice('Änderungen verworfen.');};
$('save').onclick=async()=>{
 if(busy)return;
 try{
  captureMetadata();
  const missing=draft.firstMissingScore();if(missing){draft.question=missing.group;show('questions');notice(missing.name+': Bitte alle Punktfelder ausfüllen (Antwort '+missing.key+').',true);$('matrixBody').querySelector('input[data-distro="'+CSS.escape(missing.id)+'"][data-code="'+CSS.escape(missing.key)+'"]')?.focus();return;}
  const clean=validateCatalog(draft.publishable(),draft.reference),selected=draft.selected,view=draft.view,question=draft.question;lock(true);notice('Wird gespeichert und veröffentlicht …');
  const data=await publishVerified(api,{catalog:clean,reference:draft.reference,head,deletedIds:[...draft.deletedIds]});draft.load(data.catalog);if(draft.visible().some(d=>d.id===selected))draft.selected=selected;draft.question=question;head=data.head;user=data.user||user;lock(false);show(view);notice(data.unchanged?'Keine Änderungen vorhanden.':'Gespeichert, erneut geladen und bestätigt. Website, Statistik, Excel und Dokumentation verwenden denselben Stand.');
 }catch(error){notice(error.message,true);}finally{if(busy)lock(false);}
};
window.addEventListener('beforeunload',e=>{if(busy||draft?.dirty()){e.preventDefault();e.returnValue='';}});
