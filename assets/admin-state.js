import {RAM,GPU} from './catalog-core.js';
export function questionGroups(catalog){return [...catalog.questions.map((q,i)=>({id:'q'+i,title:`Frage ${i+1} – ${q.title}`,options:q.options,kind:'points'})),{id:'ram',title:'Zusatzfrage – Arbeitsspeicher',options:RAM,kind:'points'},{id:'gpu',title:'Zusatzfrage – Grafikkarte bei Gaming',options:GPU.map(k=>[k,k]),kind:'gpu'}];}
export class AdminDraft{
 constructor(catalog){this.load(catalog);this.view='distributions';this.question='q0';}
 load(catalog){this.reference=structuredClone(catalog);this.catalog=structuredClone(catalog);this.deletedIds=new Set();this.selected=this.visible()[0]?.id;}
 visible(){return this.catalog.distributions.filter(d=>!this.deletedIds.has(d.id));}
 selectedDistribution(){return this.catalog.distributions.find(d=>d.id===this.selected);}
 publishable(){return {...this.catalog,distributions:this.visible()};}
 dirty(){return JSON.stringify(this.publishable())!==JSON.stringify(this.reference);}
 published(id){return this.reference.distributions.some(d=>d.id===id);}
 select(id){if(!this.visible().some(d=>d.id===id))throw Error('Distribution nicht vorhanden.');this.selected=id;}
 add(){let id='neue-distribution',n=1;while(this.catalog.distributions.some(d=>d.id===id))id='neue-distribution-'+n++;const codes=[...this.catalog.questions.flatMap(q=>q.options.map(o=>o[1])),...RAM.map(o=>o[1])];this.catalog.distributions.push({id,name:'Neue Distribution',active:false,url:'',icon:['\uf17c','#23bfdc'],descriptions:{de:{label:'',description:''},en:{label:'',description:''}},strengths:{de:['','',''],en:['','','']},points:Object.fromEntries(codes.map(c=>[c,['V','AB','AJ'].includes(c)?0:null])),gpu:Object.fromEntries(GPU.map(k=>[k,null]))});this.selected=id;this.view='distributions';return this.selectedDistribution();}
 remove(id){const remaining=this.visible().filter(d=>d.id!==id);if(!remaining.some(d=>d.active))throw Error('Mindestens eine aktive Distribution muss im Katalog bleiben.');if(this.published(id))this.deletedIds.add(id);else this.catalog.distributions=this.catalog.distributions.filter(d=>d.id!==id);if(this.selected===id)this.selected=remaining[0].id;}
 undoDeletions(){this.deletedIds.clear();}
 reset(){const selected=this.selected;this.load(this.reference);if(this.visible().some(d=>d.id===selected))this.selected=selected;}
 setScore(id,kind,key,value){const d=this.catalog.distributions.find(d=>d.id===id);if(!d||this.deletedIds.has(id))throw Error('Distribution nicht vorhanden.');if(kind==='points'&&['V','AB','AJ'].includes(key)&&value!==0)throw Error('Diese neutrale Antwort bleibt 0.');d[kind][key]=value;}
 firstMissingScore(){for(const d of this.visible())for(const group of questionGroups(this.catalog))for(const [,key]of group.options)if(!Number.isSafeInteger(d[group.kind][key]))return {id:d.id,name:d.name,group:group.id,key};}
}
