import model from './model.json' with { type: 'json' };
import bonuses from './gpu-bonus.json' with { type: 'json' };
import { validateSubmission } from './validate.js';

Deno.serve(async request => {
  const origin = Deno.env.get('STATISTICS_ORIGIN') || 'https://ff4f-git.github.io';
  const headers = { 'Access-Control-Allow-Origin': origin, 'Vary': 'Origin',
    'Access-Control-Allow-Headers': 'content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Cache-Control': 'no-store' };
  const reply = (status: number, body: object) => Response.json(body, {status, headers});
  if (request.headers.get('origin') !== origin) return reply(403, {ok:false});
  if (request.method === 'OPTIONS') return new Response(null, {status:204, headers});
  if (request.method !== 'POST') return reply(405, {ok:false});
  if (!request.headers.get('content-type')?.startsWith('application/json')) return reply(415, {ok:false});
  // Bound the stream as well as Content-Length, which callers can omit.
  const reader = request.body?.getReader();
  if (!reader) return reply(400, {ok:false});
  const chunks: Uint8Array[] = []; let size = 0;
  while (true) {
    const {value, done} = await reader.read(); if (done) break;
    size += value.length;
    if (size > 4096) { await reader.cancel(); return reply(413, {ok:false}); }
    chunks.push(value);
  }
  let row;
  try {
    const bytes = new Uint8Array(size); let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    row = validateSubmission(JSON.parse(new TextDecoder().decode(bytes)), model, bonuses);
  } catch { return reply(400, {ok:false}); }
  const url = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) return reply(503, {ok:false});
  try {
    const result = await fetch(`${url}/rest/v1/rpc/record_statistics`, {
      method:'POST', headers: {apikey:key, Authorization:`Bearer ${key}`, 'Content-Type':'application/json'},
      body: JSON.stringify({entry:row}), signal:AbortSignal.timeout(8000)
    });
    if (!result.ok) return reply(503, {ok:false});
    return reply(200, {ok:true});
  } catch { return reply(503, {ok:false}); }
});
