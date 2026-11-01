import {runtimeFromCatalog} from './catalog-core.js';
export const CATALOG_ENDPOINT='https://sjuzeljqkxffscqrtqxn.supabase.co/functions/v1/catalog-admin';
export async function loadPublishedCatalog(fetcher=fetch) {
  try {
    const r=await fetcher(CATALOG_ENDPOINT,{cache:'no-store',credentials:'omit',referrerPolicy:'no-referrer',signal:AbortSignal.timeout(8000)});
    if(!r.ok)throw Error('Catalog unavailable');const {catalog}=await r.json();if(!catalog?.version||!catalog.distributions?.some(d=>d.active))throw Error('Invalid catalog');
    return {...runtimeFromCatalog(catalog),catalog};
  }catch {
    const r=await fetcher(new URL('../data/distributions.json',import.meta.url));if(!r.ok)throw Error('Bewertungen können nicht geladen werden.');const catalog=await r.json();return {...runtimeFromCatalog(catalog),catalog};
  }
}
