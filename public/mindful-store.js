/* Internal repository; not loaded by the current UI until complete integration. */
(function(root){
'use strict';
const kinds=new Set(['feeling','thought','session','gratitude','intention','note','achievement','consent']);
let queue=Promise.resolve();
const kind=k=>{if(!kinds.has(k))throw Error('نوع سجل غير صالح.');};
const id=(k,v)=>{kind(k);if(typeof v!=='string'||!v.trim()||v.length>160)throw Error('معرّف غير صالح.');};
const revision=v=>{if(!Number.isSafeInteger(v)||v<0)throw Error('إصدار غير صالح.');};
function request(action,values={}){
 const task=queue.catch(()=>{}).then(()=>{
  const native=root.Capacitor?.Plugins?.QatraAwareness;
  if(typeof native?.execute!=='function')throw Error('جسر الوعي غير متاح؛ لا نحفظ في مصدر بديل بصمت.');
  return native.execute({action,...values});
 });queue=task;return task;
}
root.QatraMindfulStore=Object.freeze({
 status(){return request('status');},
 get(k,v){id(k,v);return request('get',{kind:k,id:v}).then(r=>r.entry);},
 list(k,{offset=0,limit=100}={}){kind(k);if(!Number.isSafeInteger(offset)||offset<0||!Number.isSafeInteger(limit)||limit<1||limit>100)throw Error('نطاق الصفحة غير صالح.');return request('list',{kind:k,offset,limit});},
 put(k,v,payload,expectedRevision){id(k,v);revision(expectedRevision);if(!payload||typeof payload!=='object'||Array.isArray(payload))throw Error('صيغة غير صالحة.');return request('put',{kind:k,id:v,payload:JSON.stringify(payload),expectedRevision}).then(r=>r.entry);},
 remove(k,v,expectedRevision){id(k,v);revision(expectedRevision);return request('delete',{kind:k,id:v,expectedRevision}).then(r=>r.deleted);},
 link(fromKind,fromId,toKind,toId){id(fromKind,fromId);id(toKind,toId);return request('link',{fromKind,fromId,toKind,toId}).then(r=>r.id);},
 async importLegacy(storage,confirmed=false){
  if(confirmed!==true)throw Error('يجب اعتماد الترحيل أولًا.');
  if(!root.QatraLegacyAdapter)throw Error('محوّل السجلات غير متاح.');
  const plan=await root.QatraLegacyAdapter.plan(root.QatraLegacyAdapter.capture(storage));
  const result=await request('importLegacy',{batchId:plan.batchId,originalJson:plan.originalJson,entries:plan.entries});
  return {count:result.count,counts:plan.counts};
 },
 exportData(){return request('export').then(r=>r.data);},
 restoreData(data,confirmed=false){if(confirmed!==true)throw Error('يلزم تأكيد الاسترجاع.');return request('restore',{backup:JSON.stringify(data),confirmed:true});},
 eraseData(confirmed=false){if(confirmed!==true)throw Error('يلزم تأكيد الحذف.');return request('erase',{confirmed:true});}
});
})(globalThis);
