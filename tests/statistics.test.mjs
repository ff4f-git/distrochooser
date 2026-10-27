import {test} from 'node:test';
import assert from 'node:assert/strict';
import model from '../assets/model.json' with {type:'json'};
import bonuses from '../assets/gpu-bonus.json' with {type:'json'};
import {validateSubmission} from '../supabase/functions/submit-statistics/validate.js';
import {createStatisticsClient} from '../assets/statistics.js';
const payload = () => ({submissionId:crypto.randomUUID(), consentVersion:'1',modelVersion:'2.1.1', language:'de',answers:model.questions.map(q=>[q.options[0][1]]),ram:null,gpu:null});
test('no network without opt-in; disabled configuration cannot send', async()=>{
  let calls=0;
  const c=createStatisticsClient('',async()=>{calls++;});
  assert.equal(calls,0);
  await assert.rejects(c.submit('key',{})); assert.equal(calls,0);
});
test('double click and language rerender cannot duplicate a contribution',async()=>{
  let calls=0, finish;
  const c=createStatisticsClient('https://example.test',async()=>{calls++;await new Promise(resolve=>finish=resolve);return {ok:true,json:async()=>({ok:true})};});
  const first=c.submit('same',payload()); await c.submit('same',payload());
  assert.equal(calls,1); finish(); await first; await c.submit('same',payload()); assert.equal(calls,1);
});
test('failed requests remain retryable with the same submission UUID',async()=>{
  const ids=[];
  const c=createStatisticsClient('https://example.test',async(_url,options)=>{
    ids.push(JSON.parse(options.body).submissionId);
    assert.equal(options.credentials,'omit'); assert.equal(options.referrerPolicy,'no-referrer');
    return {ok:ids.length>1,json:async()=>({ok:true})};
  });
  await assert.rejects(c.submit('key',payload())); assert.equal(c.state('key'),'error');
  await c.submit('key',payload()); assert.equal(ids[0],ids[1]); assert.equal(c.state('key'),'sent');
});
test('server ignores forged results and strips stale conditional answers',()=>{
  const p=payload();p.top3=['fake'];p.ram='AK';p.gpu='Nvidia GeForce';
  const row=validateSubmission(p,model,bonuses);
  assert.equal(row.ram,null);assert.equal(row.gpu,null);assert.equal(row.top3.length,3);assert.ok(!row.top3.includes('fake'));
});
test('invalid, incomplete, duplicate and wrong-question codes are rejected',()=>{
  for(const change of [p=>p.answers.pop(),p=>p.answers[0]=[],p=>p.answers[0]=['B','B'],p=>p.answers[1]=['B'],p=>p.answers[1]=['H','I'],p=>p.modelVersion='fake',p=>p.consentVersion='0']){
    const p=payload();change(p);assert.throws(()=>validateSubmission(p,model,bonuses));
  }
});
test('old hardware requires valid RAM; gaming accepts optional known GPU only',()=>{
  const p=payload();p.answers[2]=['O'];assert.throws(()=>validateSubmission(p,model,bonuses));
  p.ram='AI';p.answers[0]=['D'];p.gpu='';assert.doesNotThrow(()=>validateSubmission(p,model,bonuses));
  p.gpu='fake';assert.throws(()=>validateSubmission(p,model,bonuses));
});
