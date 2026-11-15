(() => {
'use strict';
if(window.QatraMedicine)return;
let root,focusBefore,busy=false,plugin;
const inertBefore=new Map();
const units={tablet:'حبة',capsule:'كبسولة',ml:'مل',drop:'قطرة',other:'وحدة'};
const q=s=>root.querySelector(s);
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const amount=(milli,unit)=>`${Number(milli/1000).toLocaleString('ar',{maximumFractionDigits:3})} ${units[unit]||'وحدة'}`;
function status(text){q('#qmStatus').textContent=text;}
async function native(method,data={}){
 const cap=window.Capacitor;
 plugin=plugin||cap?.Plugins?.QatraMedicine||(cap?.registerPlugin?cap.registerPlugin('QatraMedicine'):null);
 if(!plugin)throw Error('MEDICINE_BRIDGE_UNAVAILABLE');
 return plugin[method](data);
}
function quantity(value,positive){
 const text=String(value).trim();
 if(!/^\d+(\.\d{1,3})?$/.test(text))throw Error('quantity');
 const [whole,fraction='']=text.split('.');
 const milli=Number(whole)*1000+Number(fraction.padEnd(3,'0'));
 if(!Number.isSafeInteger(milli)||milli>1000000000000||milli<(positive?1:0))throw Error('quantity');
 return milli;
}
async function refresh(){
 const [meds,doses]=await Promise.all([native('listMedicines'),native('listTodayDoses')]);
 q('#qmMedicines').innerHTML=(meds.medicines||[]).map(m=>`<article class="qm-panel"><h3>${escape(m.name)}</h3><p>${escape(m.strength||'التركيز غير مسجّل')}</p><p>الجرعة المسجّلة: ${escape(amount(m.doseMilli,m.unit))}</p><p>المتبقي: ${m.inventoryNeedsReview?'المخزون يحتاج مراجعة':escape(amount(m.stockMilli,m.unit))}</p><p class="qm-muted">${(m.dailyTimes||[]).map(escape).join(' · ')}</p></article>`).join('')||'<p class="qm-muted">لم تُضف أدوية بعد.</p>';
 q('#qmDoses').innerHTML=(doses.doses||[]).map(d=>`<article class="qm-panel"><h3>${escape(d.name)}</h3><p>${escape(amount(d.quantityMilli,d.unit))} · ${escape(new Date(d.scheduledAt).toLocaleTimeString('ar',{hour:'2-digit',minute:'2-digit'}))}</p>${d.status==='taken'?`<p>مسجّلة كمتناولة${d.takenAt?' · '+escape(new Date(d.takenAt).toLocaleTimeString('ar',{hour:'2-digit',minute:'2-digit'})):''}</p>`:d.status==='pending'?`<button type="button" data-take="${escape(d.id)}">تسجيل تناول هذه الجرعة الآن</button>`:'<p>مسجّلة كمتجاوزة</p>'}</article>`).join('')||'<p class="qm-muted">لا توجد جرعات منشأة لليوم. إدخال أوقات الدواء هنا لا يفعّل تذكيرات؛ الجدولة لم تُضف بعد.</p>';
}
async function open(){
 if(!root||!root.hidden)return;
 focusBefore=document.activeElement;
 for(const element of document.body.children){if(element!==root&&element instanceof HTMLElement){inertBefore.set(element,element.inert);element.inert=true;}}
 root.hidden=false;q('[data-close]').focus();status('جارٍ قراءة البيانات…');
 try{await refresh();status('');}catch(_){status('تعذر قراءة البيانات. لم تُستبدل بياناتك بقائمة فارغة.');}
}
function close(){
 if(!root)return;root.hidden=true;
 for(const [element,value] of inertBefore)element.inert=value;
 inertBefore.clear();if(focusBefore?.isConnected)focusBefore.focus();
}
async function take(button){
 if(busy)return;busy=true;button.disabled=true;
 try{const result=await native('confirmDoseTaken',{doseId:button.dataset.take});status(result.recorded?'تم تسجيل التناول وتحديث المخزون.':'هذه الجرعة مسجّلة بالفعل؛ لم يُخصم المخزون مجددًا.');await refresh();}
 catch(_){status('تعذر إكمال العملية أو تحديث العرض. أعد فتح القسم للتحقق من السجل قبل إعادة المحاولة.');}
 finally{busy=false;if(button.isConnected)button.disabled=false;}
}
function install(){
 const entry=document.getElementById('openQatraMedicine');
 if(!entry)return;
 root=document.createElement('section');root.id='medicineSheet';root.hidden=true;
 root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-labelledby','qmTitle');
 root.innerHTML=`<header><div><h2 id="qmTitle">قطرة دواء</h2><span class="qm-muted">إدارة الأدوية والمخزون</span></div><button type="button" data-close>رجوع</button></header><p id="qmStatus" role="status" aria-live="polite"></p><main><p class="qm-warning">هذه الحزمة لحفظ الأدوية فقط. التذكيرات التلقائية والصور لم تُفعّل بعد.</p><section class="qm-panel"><h3>إضافة دواء</h3><form id="qmForm"><label>اسم الدواء<input name="medicineName" required maxlength="160" autocomplete="off"></label><label>التركيز كما على العبوة<input name="strength" maxlength="160" autocomplete="off"></label><label>الوحدة<select name="unit"><option value="tablet">حبة</option><option value="capsule">كبسولة</option><option value="ml">مل</option><option value="drop">قطرة</option><option value="other">وحدة</option></select></label><label>كمية الجرعة المسجّلة<input name="dose" type="number" min="0.001" max="1000000000" step="0.001" required inputmode="decimal"></label><div class="qm-row"><button type="button" data-quantity="0.25">ربع حبة</button><button type="button" data-quantity="0.5">نصف حبة</button><button type="button" data-quantity="1">حبة كاملة</button></div><p class="qm-muted">سجّل الجرعة وفق الوصفة. خيارات الكسر لا تعني أن دواءك قابل للتقسيم.</p><label>الكمية المتوفرة<input name="stock" type="number" min="0" max="1000000000" step="0.001" required inputmode="decimal"></label><label>الأوقات اليومية بصيغة 24 ساعة، مفصولة بفاصلة<input name="times" placeholder="08:00, 20:00" required dir="ltr" autocomplete="off"></label><button type="submit" class="qm-primary">حفظ الدواء</button></form></section><h3>أدويتي ومخزوني</h3><div id="qmMedicines"></div><h3>جرعات اليوم المحفوظة</h3><div id="qmDoses"></div></main>`;
 document.body.appendChild(root);entry.addEventListener('click',open);
 const form=q('#qmForm'),field=name=>form.elements.namedItem(name);
 function fractions(){root.querySelectorAll('[data-quantity]').forEach(b=>b.hidden=field('unit').value!=='tablet');}
 field('unit').addEventListener('change',()=>{field('dose').value='';fractions();});fractions();
 root.addEventListener('click',event=>{
  const target=event.target instanceof Element?event.target:null;if(!target)return;
  if(target.closest('[data-close]'))close();
  const fraction=target.closest('[data-quantity]');if(fraction&&field('unit').value==='tablet')field('dose').value=fraction.dataset.quantity;
  const button=target.closest('[data-take]');if(button)take(button);
 });
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(busy)return;
  let payload;
  try{
   const times=field('times').value.split(/[,،]/).map(t=>t.trim());
   if(!times.length||times.length>24||new Set(times).size!==times.length||!times.every(t=>/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(t)))throw Error('times');
   const name=field('medicineName').value.trim();if(!name)throw Error('name');
   payload={name,strength:field('strength').value.trim(),unit:field('unit').value,doseMilli:quantity(field('dose').value,true),openingStockMilli:quantity(field('stock').value,false),dailyTimes:times.sort()};
  }catch(_){status('تحقق من الاسم والكميات والأوقات. استخدم مثلًا 08:00, 20:00 دون تكرار.');return;}
  busy=true;const save=form.querySelector('[type=submit]');save.disabled=true;
  try{await native('addMedicine',payload);form.reset();fractions();status('تم حفظ الدواء؛ لم تُفعّل له تذكيرات.');try{await refresh();}catch(_){status('تم الحفظ، لكن تعذر تحديث العرض. أعد فتح القسم ولا تضف الدواء مرة ثانية.');}}
  catch(_){status('تعذر تأكيد الحفظ. أعد فتح القسم للتحقق قبل تكرار الإضافة.');}
  finally{busy=false;save.disabled=false;}
 });
 root.addEventListener('keydown',event=>{
  if(event.key==='Escape'){event.preventDefault();close();return;}
  if(event.key!=='Tab')return;
  const controls=[...root.querySelectorAll('button,input,select')].filter(e=>!e.disabled&&e.getClientRects().length);
  const first=controls[0],last=controls.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
 });
}
window.QatraMedicine=Object.freeze({open,close});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
