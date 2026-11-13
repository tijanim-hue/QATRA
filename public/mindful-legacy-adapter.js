/* Pure import planner: no automatic execution, storage writes, uploads or analytics. */
(function(root){
'use strict';
const keys={qatra_feelings_log:'feeling',qatra_moments_log:'session',qatra_gratitude_log:'gratitude',qatra_intentions_log:'intention',qatra_notebook:'note'};
const bytes=s=>new TextEncoder().encode(s).length;
function fail(source){throw Error('تعذر قراءة سجل قديم دون إسقاط بيانات: '+source);}
function timestamp(v){
 if(Number.isSafeInteger(v)&&v>=0&&v<=8640000000000000)return v;
 if(typeof v!=='string'||!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(v))return null;
 const n=Date.parse(v);return Number.isFinite(n)&&n>=0&&new Date(n).toISOString()===v?n:null;
}
function canonical(v,depth=0){
 if(depth>32)fail('تعشيق غير مدعوم');
 if(!v||typeof v!=='object')return v;
 return Array.isArray(v)?v.map(x=>canonical(x,depth+1)):Object.fromEntries(Object.keys(v).sort().map(k=>[k,canonical(v[k],depth+1)]));
}
async function hash(s){
 if(!root.crypto?.subtle)fail('خدمة المعرّفات غير متاحة');
 const value=await root.crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));
 return [...new Uint8Array(value)].map(n=>n.toString(16).padStart(2,'0')).join('');
}
function capture(storage){
 const sources=Object.create(null);
 for(const key of Object.keys(keys)){
  let value;try{value=storage.getItem(key);}catch(e){fail(key);}
  if(value!==null&&typeof value!=='string')fail(key);sources[key]=value;
 }
 return {format:'qatra-legacy-snapshot',version:1,sources};
}
async function plan(snapshot){
 if(snapshot?.format!=='qatra-legacy-snapshot'||snapshot.version!==1||!snapshot.sources)fail('صيغة اللقطة');
 const sources=Object.create(null),entries=[],counts=Object.create(null);let total=0;
 for(const key of Object.keys(keys)){
  if(!Object.prototype.hasOwnProperty.call(snapshot.sources,key))fail(key);
  const raw=snapshot.sources[key];if(raw!==null&&typeof raw!=='string')fail(key);sources[key]=raw;
 }
 const originalJson=JSON.stringify({format:'qatra-legacy-snapshot',version:1,sources});
 if(bytes(originalJson)>10*1024*1024)fail('حجم اللقطة');
 for(const [key,defaultKind] of Object.entries(keys)){
  counts[key]=0;if(sources[key]===null)continue;
  let parsed;try{parsed=JSON.parse(sources[key]);}catch(e){fail(key);}
  const rows=Array.isArray(parsed)?parsed:parsed?.schemaVersion===1&&Array.isArray(parsed.entries)?parsed.entries:null;
  if(!rows)fail(key);const seen=new Set();
  for(let i=0;i<rows.length;i++){
   const row=rows[i];if(!row||typeof row!=='object'||Array.isArray(row))fail(key);
   let identity='index:'+i;
   if(row.id!==undefined&&row.id!==null){if(typeof row.id!=='string'||!row.id.trim())fail(key);identity='id:'+row.id;}
   if(seen.has(identity))fail(key+' (معرّف مكرر)');seen.add(identity);
   const sourceKey=key+':'+identity,payload=JSON.stringify(canonical(row)),size=bytes(payload);total+=size;
   if(size>65536||total>10*1024*1024||entries.length>=2000)fail('حدود الاستيراد');
   entries.push({kind:key==='qatra_notebook'&&row.activity==='thought'?'thought':defaultKind,id:'legacy-'+await hash(sourceKey),payload,createdAt:timestamp(row.createdAt),updatedAt:timestamp(row.updatedAt),revision:1,sourceKey});counts[key]++;
  }
 }
 return {batchId:'mindful-legacy-web-v1',originalJson,entries,counts};
}
root.QatraLegacyAdapter=Object.freeze({capture,plan});
})(globalThis);
