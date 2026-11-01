import {validateCatalog} from './catalog-core.js';

export function sameCatalog(expected,actual){
 if(!actual?.version)return false;
 const a=validateCatalog(expected,expected),b=validateCatalog(actual,expected);
 return JSON.stringify(a)===JSON.stringify(b);
}
export async function publishVerified(api,{catalog,reference,head,deletedIds}){
 const expected=validateCatalog(catalog,reference);
 const saved=await api('POST',{catalog:expected,expectedVersion:reference.version,expectedHead:head,deletedIds});
 if(!sameCatalog(expected,saved.catalog))throw Error('Die Speicherantwort entspricht nicht deinen Änderungen. Es wird kein Erfolg bestätigt.');
 const checked=await api('GET');
 if(checked.catalog?.version!==saved.catalog.version||!sameCatalog(expected,checked.catalog))throw Error('Die Veröffentlichung konnte beim erneuten Laden nicht bestätigt werden. Deine Änderungen bleiben im Entwurf.');
 return {...checked,unchanged:!!saved.unchanged};
}
