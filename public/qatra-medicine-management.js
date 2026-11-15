(() => {
'use strict';
if(window.QatraMedicineManagement)return;
window.QatraMedicineManagement=true;
let plugin,editing=null,locked=false,serial=0;
async function native(method,data={}){
 const cap=window.Capacitor;
 plugin=plugin||cap?.Plugins?.QatraMedicine||cap?.registerPlugin?.('QatraMedicine');
 if(!plugin)throw Error('bridge');
 return plugin[method](data);
}
function start(){
 const root=document.getElementById('medicineSheet'),form=document.getElementById('qmForm'),container=document.getElementById('qmMedicines');
 if(!root||!form||!container)return;
 const field=name=>form.elements.namedItem(name),save=form.querySelector('[type=submit]'),originalLabel=save.textContent;
 const say=text=>{root.querySelector('#qmStatus').textContent=text;};
 const button=(text,handler)=>{const b=document.createElement('button');b.type='button';b.textContent=text;b.addEventListener('click',handler);return b;};
 const controls=document.createElement('div');controls.className='qm-row';controls.hidden=true;
 const cancel=button('إلغاء التعديل',reset),clear=button('إعادة اختيار الأوقات',()=>{field('times').value='';});controls.append(cancel,clear);form.appendChild(controls);
 const note=document.createElement('p');note.className='qm-muted';note.hidden=true;note.textContent='الوحدة والمخزون ثابتان هنا لحماية السجل. التعديل يحدّث جرعات اليوم القادمة فقط؛ الجرعات السابقة والمتناولة تبقى كما هي.';form.appendChild(note);
 const archived=document.createElement('details');archived.className='qm-panel';
 const summary=document.createElement('summary'),archiveList=document.createElement('div');archived.append(summary,archiveList);container.insertAdjacentElement('afterend',archived);
 function reset(){
  if(locked)return;
  editing=null;form.reset();field('unit').disabled=false;field('stock').disabled=false;save.textContent=originalLabel;controls.hidden=true;note.hidden=true;
  field('unit').dispatchEvent(new Event('change'));
 }
 function edit(m){
  if(locked)return;
  if(editing&&editing.id!==m.id&&!window.confirm('تجاهل التعديل غير المحفوظ؟'))return;
  editing=JSON.parse(JSON.stringify(m));
  field('medicineName').value=m.name;field('strength').value=m.strength;
  field('unit').value=m.unit;field('unit').dispatchEvent(new Event('change'));field('unit').disabled=true;
  field('dose').value=String(m.doseMilli/1000);field('stock').value=String(m.stockMilli/1000);field('stock').disabled=true;
  field('times').value=m.dailyTimes.join(', ');save.textContent='حفظ تعديل الدواء';controls.hidden=false;note.hidden=false;
  form.scrollIntoView({block:'start',behavior:'auto'});field('medicineName').focus();
 }
 async function redraw(){
  await window.QatraMedicine.close();await window.QatraMedicine.open();await decorate();
 }
 async function toggle(m){
  if(locked)return;
  const target=!m.archived;
  if(!window.confirm(target?'أرشفة هذا الدواء وإيقاف تنبيهاته؟ سيبقى السجل محفوظًا.':'استعادة الدواء وتفعيل جرعات اليوم القادمة وفق أوقاته المحفوظة؟'))return;
  locked=true;
  let result;
  try{result=await native('setArchived',{id:m.id,archived:target,expected:m});}
  catch(_){say('تعذر إكمال العملية؛ قد تكون البيانات تغيّرت. أعد فتح القسم للتحقق قبل إعادة المحاولة.');return;}
  finally{locked=false;}
  if(editing?.id===m.id)reset();
  try{await redraw();say(result.reminderWarning?'حُفظ التغيير، لكن تعذر تحديث بعض التنبيهات. راجع أذونات التطبيق.':target?'تمت أرشفة الدواء مع الاحتفاظ بسجله.':'تمت استعادة الدواء.');}
  catch(_){say('حُفظ التغيير، لكن تعذر تحديث العرض. أعد فتح القسم ولا تكرر العملية قبل التحقق.');}
 }
 async function decorate(){
  const version=++serial;
  try{
   const result=await native('listMedicines');if(version!==serial)return;
   const medicines=result.medicines||[],byId=new Map(medicines.map(m=>[m.id,m]));
   for(const card of container.querySelectorAll('[data-medicine-id]')){
    const m=byId.get(card.dataset.medicineId);if(!m)continue;
    card.hidden=!!m.archived;
    card.querySelector('[data-management-actions]')?.remove();
    if(!m.archived){const row=document.createElement('div');row.className='qm-row';row.dataset.managementActions='true';row.append(button('تعديل',()=>edit(m)),button('أرشفة',()=>toggle(m)));card.appendChild(row);}
   }
   archiveList.replaceChildren();const items=medicines.filter(m=>m.archived);summary.textContent=`الأدوية المؤرشفة (${items.length})`;archived.hidden=!items.length;
   for(const m of items){const card=document.createElement('article');card.className='qm-panel';const title=document.createElement('h3');title.textContent=m.name;const text=document.createElement('p');text.textContent=m.strength||'التركيز غير مسجّل';card.append(title,text,button('استعادة',()=>toggle(m)));archiveList.appendChild(card);}
  }catch(_){say('تعذر تحميل أدوات التعديل والأرشفة. أعد فتح القسم للمحاولة.');}
 }
 form.addEventListener('submit',async event=>{
  if(!editing)return;event.preventDefault();event.stopImmediatePropagation();if(locked)return;
  const text=field('dose').value.trim();
  if(!/^\d+(\.\d{1,3})?$/.test(text)){say('تحقق من كمية الجرعة.');return;}
  const [whole,fraction='']=text.split('.'),doseMilli=Number(whole)*1000+Number(fraction.padEnd(3,'0'));
  const times=field('times').value.split(/[,،]/).map(t=>t.trim()).filter(Boolean).sort();
  if(!Number.isSafeInteger(doseMilli)||doseMilli<1||doseMilli>1000000000000||!times.length||times.length>24||new Set(times).size!==times.length||!times.every(t=>/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(t))){say('تحقق من الجرعة، واختر أوقاتًا صحيحة غير مكررة.');return;}
  const payload={id:editing.id,expected:editing,name:field('medicineName').value.trim(),strength:field('strength').value.trim(),unit:editing.unit,doseMilli,dailyTimes:times};
  locked=true;save.disabled=true;let result;
  try{result=await native('updateMedicine',payload);}
  catch(_){say('تعذر إكمال التعديل؛ قد تكون البيانات تغيّرت. أعد فتح القسم للتحقق قبل تكرار الحفظ.');return;}
  finally{locked=false;save.disabled=false;}
  reset();
  try{await redraw();say(result.reminderWarning?'تم حفظ التعديل، لكن تعذر تحديث بعض التنبيهات. راجع الأذونات.':'تم حفظ التعديل وتحديث جرعات اليوم القادمة.');}
  catch(_){say('تم حفظ التعديل، لكن تعذر تحديث العرض. أعد فتح القسم للتحقق.');}
 },true);
 new MutationObserver(()=>{decorate();}).observe(container,{childList:true});
 decorate();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
