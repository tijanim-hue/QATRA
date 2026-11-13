/* Draft repository: no automatic initialization, migration, storage writes or network requests. */
(function(root){
  'use strict';
  const kinds=new Set(['feeling','thought','session','gratitude','intention','note','achievement','consent']);
  let queue=Promise.resolve();
  const validKind=kind=>{if(!kinds.has(kind))throw new Error('نوع سجل غير صالح.');};
  function request(action,values={}){
    const task=queue.catch(()=>{}).then(()=>{
      const native=root.Capacitor?.Plugins?.QatraAwareness;
      if(typeof native?.execute!=='function')throw new Error('جسر الوعي غير متاح؛ لا تكتب بيانات في مصدر بديل بصمت.');
      return native.execute({action,...values});
    });queue=task;return task;
  }
  function identity(kind,id){validKind(kind);if(typeof id!=='string'||!id.trim()||id.length>160)throw new Error('معرّف سجل غير صالح.');}
  function revision(value){if(!Number.isSafeInteger(value)||value<0)throw new Error('إصدار السجل غير صالح.');}
  const api={
    get(kind,id){identity(kind,id);return request('get',{kind,id}).then(r=>r.entry);},
    list(kind,{offset=0,limit=100}={}){validKind(kind);if(!Number.isSafeInteger(offset)||offset<0||!Number.isSafeInteger(limit)||limit<1||limit>100)throw new Error('نطاق الصفحة غير صالح.');return request('list',{kind,offset,limit});},
    put(kind,id,payload,expectedRevision){identity(kind,id);revision(expectedRevision);if(!payload||typeof payload!=='object'||Array.isArray(payload))throw new Error('صيغة السجل غير صالحة.');const encoded=JSON.stringify(payload);return request('put',{kind,id,payload:encoded,expectedRevision}).then(r=>r.entry);},
    remove(kind,id,expectedRevision){identity(kind,id);revision(expectedRevision);return request('delete',{kind,id,expectedRevision}).then(r=>r.deleted);},
    link(fromKind,fromId,toKind,toId){identity(fromKind,fromId);identity(toKind,toId);return request('link',{fromKind,fromId,toKind,toId}).then(r=>r.id);},
    async importLegacy(storage,explicitPermission=false){
      if(explicitPermission!==true)throw new Error('يجب اعتماد ترحيل السجلات قبل تنفيذه.');
      if(!root.QatraLegacyAdapter)throw new Error('محوّل السجلات غير متاح.');
      const plan=await root.QatraLegacyAdapter.plan(root.QatraLegacyAdapter.capture(storage));
      const response=await request('importLegacy',{batchId:plan.batchId,originalJson:plan.originalJson,entries:plan.entries});
      // The source remains intact. Switching all readers/writers is a separate integration step.
      return {count:response.count,counts:plan.counts,digest:plan.digest};
    },
    exportData(){return request('export').then(r=>r.data);}
  };
  root.QatraMindfulStore=Object.freeze(api);
})(globalThis);
