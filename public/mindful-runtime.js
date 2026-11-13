/* QATRA phase 1 integration: Android native source of truth; browser keeps existing local behavior. */
(function(root){
'use strict';
const nativeMode=!!root.Capacitor?.isNativePlatform?.();
const keys={qatra_feelings_log:'feeling',qatra_moments_log:'session',qatra_gratitude_log:'gratitude',qatra_intentions_log:'intention',qatra_notebook:'note'};
let initialization=null,maintenance=false;
const store=()=>{if(!root.QatraMindfulStore)throw Error('وحدة البيانات غير متاحة.');return root.QatraMindfulStore;};
async function ready(){
 if(!nativeMode)return;
 if(!initialization)initialization=(async()=>{const status=await store().status();if(!status.legacyImported&&!status.legacyImportDisabled)await store().importLegacy(root.localStorage,true);})().catch(e=>{initialization=null;throw e;});
 return initialization;
}
function writable(){if(maintenance)throw Error('انتظر اكتمال عملية إدارة البيانات.');}
const uid=()=>root.crypto?.randomUUID?.()||Date.now().toString(36)+'-'+Math.random().toString(36).slice(2);
async function add(key,payload){
 writable();await ready();writable();const type=keys[key];if(!type)throw Error('مصدر سجل غير مدعوم.');
 const kind=key==='qatra_notebook'&&payload.activity==='thought'?'thought':type;
 const id=typeof payload.id==='string'&&payload.id?payload.id:uid();
 // Stable ids make a retried completion idempotent; differing data must not overwrite it.
 const existing=await store().get(kind,id);writable();
 if(existing){if(JSON.stringify(existing.payload)!==JSON.stringify(payload))throw Error('يوجد سجل مختلف بهذا المعرّف.');return existing;}
 return store().put(kind,id,payload,0);
}
async function notebook(){
 await ready();const results=[];
 for(const kind of ['note','thought']){
  let offset=0;
  while(true){const page=await store().list(kind,{offset,limit:100});results.push(...page.entries);offset+=page.entries.length;if(offset>=page.total||!page.entries.length)break;}
 }
 return results.sort((a,b)=>(a.createdAt??a.updatedAt??0)-(b.createdAt??b.updatedAt??0)||a.id.localeCompare(b.id)).map(e=>({...e.payload,_awareness:{kind:e.kind,id:e.id,revision:e.revision}}));
}
async function removeNote(note){writable();await ready();writable();if(!note?._awareness)throw Error('معرّف التدوينة غير متاح.');const e=note._awareness;return store().remove(e.kind,e.id,e.revision);}
function cleanNote(note){const copy={...note};delete copy._awareness;return copy;}
function refresh(erased=false){root.dispatchEvent(new CustomEvent('qatra-awareness-data-changed',{detail:{erased}}));}
async function exclusive(task){if(maintenance)throw Error('هناك عملية بيانات جارية.');await ready();if(maintenance)throw Error('هناك عملية بيانات جارية.');maintenance=true;try{return await task();}finally{maintenance=false;}}
function initPanel(){
 if(!nativeMode)return;const host=document.querySelector('#settingsSheet .sheet-content');if(!host||document.getElementById('mindfulDataPanel'))return;
 const panel=document.createElement('details');panel.id='mindfulDataPanel';panel.className='mindful-data-panel';panel.dir='rtl';
 const summary=document.createElement('summary');summary.textContent='بيانات دقيقة وعي والدفتر';panel.appendChild(summary);
 const info=document.createElement('p');info.textContent='تصدير محلي أو استرجاع نسخة JSON أو حذف السجلات. ملف التصدير غير مشفر؛ احتفظ به في مكان خاص. لا تشمل هذه العمليات إعجابات العبارات أو تقدم الحديقة.';panel.appendChild(info);
 const status=document.createElement('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 const row=document.createElement('div');row.className='mindful-data-actions';const buttons=[];
 function action(label,task){const button=document.createElement('button');button.type='button';button.textContent=label;buttons.push(button);button.addEventListener('click',async()=>{
  buttons.forEach(b=>b.disabled=true);status.textContent='جارٍ التنفيذ…';
  try{status.textContent=await task();}catch(error){status.textContent='تعذر إكمال العملية: '+error.message;}finally{buttons.forEach(b=>b.disabled=false);}
 });row.appendChild(button);}
 const bridge=()=>{const value=root.Capacitor?.Plugins?.QatraAwareness;if(!value)throw Error('جسر البيانات غير متاح.');return value;};
 action('تصدير البيانات',()=>exclusive(async()=>{const result=await bridge().exportDocument();return result.cancelled?'أُلغي التصدير.':'تم حفظ نسخة البيانات في المكان الذي اخترته.';}));
 action('استرجاع نسخة',()=>exclusive(async()=>{
  const file=await bridge().importDocument();if(file.cancelled)return 'أُلغي اختيار الملف.';
  if(!root.confirm('استرجاع هذه النسخة؟ ستُضاف السجلات الناقصة فقط، وستُرفض العملية عند تعارضها مع سجل مختلف. الموافقات المسترجعة تحتاج إلى تجديد.'))return 'أُلغي الاسترجاع.';
  const result=await store().restoreData(file.data,true);refresh();
  return 'أضيف '+result.inserted+' سجل، واحتُفظ بـ '+result.unchanged+' سجل موجود.';
 }));
 action('حذف السجلات',()=>exclusive(async()=>{
  if(!root.confirm('حذف جميع سجلات دقيقة وعي ومحتويات دفتر قطرة وروابطها نهائيًا من هذا التطبيق؟ لا تُحذف نسخة سبق أن صدّرتها، ولا يتغير تقدم الحديقة.'))return 'أُلغي الحذف.';
  await store().eraseData(true);
  let remaining=false;for(const key of Object.keys(keys))try{root.localStorage.removeItem(key);}catch(error){remaining=true;}
  refresh(true);
  return remaining?'حُذفت قاعدة الوعي، لكن تعذر مسح بعض نسخ التخزين القديمة. مُنع استيرادها مجددًا؛ لا تعتبر الحذف المحلي كاملًا.':'حُذفت سجلات الوعي والدفتر ونسخها القديمة داخل التطبيق.';
 }));
 panel.append(row,status);host.appendChild(panel);
}
root.QatraMindfulData=Object.freeze({enabled:nativeMode,ready,add,notebook,removeNote,cleanNote});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initPanel);else initPanel();
})(globalThis);

/* Optional bundled client: this loader does not contact an external service. */
(function(root){
 function load(){
  if(!root.QatraMindfulData?.enabled||document.getElementById('qatraMindfulAIScript'))return;
  const script=document.createElement('script');script.id='qatraMindfulAIScript';script.src='./mindful-ai.js';
  script.onerror=()=>{const host=document.getElementById('mindfulDataPanel');if(host){const p=document.createElement('p');p.textContent='تعذر تحميل المساعد الاختياري؛ الأنشطة المحلية متاحة.';host.appendChild(p);}};
  document.head.appendChild(script);
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load);else load();
})(globalThis);
