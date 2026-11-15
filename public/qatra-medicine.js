(() => {
'use strict';
if(window.QatraMedicine)return;
let root,timePicker,focusBefore,busy=false,plugin,alerts;
let settingsBusy=false,settingsReady=false,savedMode=null,settingsVersion=0;
const inertBefore=new Map();
const units={tablet:'حبة',capsule:'كبسولة',ml:'مل',drop:'قطرة',other:'وحدة'};
const q=s=>root.querySelector(s);
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const amount=(milli,unit)=>`${Number(milli/1000).toLocaleString('ar',{maximumFractionDigits:3})} ${units[unit]||'وحدة'}`;
const pad=n=>String(n).padStart(2,'0');
function status(text){q('#qmStatus').textContent=text;}
function bridge(name){const cap=window.Capacitor;return cap?.Plugins?.[name]||(cap?.registerPlugin?cap.registerPlugin(name):null);}
async function native(method,data={}){
 plugin=plugin||bridge('QatraMedicine');
 if(!plugin)throw Error('MEDICINE_BRIDGE_UNAVAILABLE');
 return plugin[method](data);
}
async function alertNative(method,data={}){
 alerts=alerts||bridge('QatraMedicineAlerts');
 if(!alerts)throw Error('MEDICINE_ALERT_BRIDGE_UNAVAILABLE');
 return alerts[method](data);
}
function validMode(mode){return ['notification','overlay','both'].includes(mode);}
function paintAlertSettings(result){
 if(!validMode(result?.mode)||typeof result.overlayAvailable!=='boolean')throw Error('INVALID_SETTINGS');
 savedMode=result.mode;settingsReady=true;q('#qmAlertMode').value=savedMode;
 q('#qmAlertStatus').textContent=savedMode!=='notification'&&!result.overlayAvailable
  ?'إذن الظهور فوق التطبيقات غير متاح. حُفظ اختيارك دون تغييره. العرض العائم لم يُربط بعد.'
  :'هذا إعداد عام لجميع الأدوية. حُفظ الاختيار؛ تطبيقه على التنبيه العائم لم يكتمل بعد.';
}
async function loadAlertSettings(){
 if(settingsBusy)return;
 const version=++settingsVersion;settingsBusy=true;settingsReady=false;
 q('#qmAlertMode').disabled=true;q('#qmAlertRetry').disabled=true;
 q('#qmAlertStatus').textContent='جارٍ قراءة نمط التنبيه…';
 try{const result=await alertNative('getSettings');if(version===settingsVersion)paintAlertSettings(result);}
 catch(_){if(version===settingsVersion){q('#qmAlertMode').selectedIndex=-1;q('#qmAlertStatus').textContent='تعذر قراءة الإعداد؛ لم يُستبدل اختيارك المحفوظ.';}}
 finally{if(version===settingsVersion){settingsBusy=false;q('#qmAlertMode').disabled=!settingsReady;q('#qmAlertRetry').disabled=false;}}
}
async function saveAlertSettings(){
 if(settingsBusy||!settingsReady)return;
 const requested=q('#qmAlertMode').value;if(!validMode(requested))return;
 settingsBusy=true;q('#qmAlertMode').disabled=true;q('#qmAlertRetry').disabled=true;
 q('#qmAlertStatus').textContent='جارٍ حفظ نمط التنبيه…';
 try{
  const result=await alertNative('setSettings',{mode:requested});
  if(result?.saved!==true||result.mode!==requested)throw Error('SAVE_UNCONFIRMED');
  paintAlertSettings(result);
 }catch(_){
  try{paintAlertSettings(await alertNative('getSettings'));q('#qmAlertStatus').textContent+=' لم يتأكد الحفظ المطلوب؛ المعروض هو الإعداد المقروء من الجهاز.';}
  catch(_){settingsReady=false;q('#qmAlertMode').selectedIndex=-1;q('#qmAlertStatus').textContent='تعذر التحقق من الحفظ. أعد قراءة الإعداد قبل تغييره مجددًا.';}
 }finally{settingsBusy=false;q('#qmAlertMode').disabled=!settingsReady;q('#qmAlertRetry').disabled=false;}
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
 q('#qmDoses').innerHTML=(doses.doses||[]).map(d=>`<article class="qm-panel"><h3>${escape(d.name)}</h3><p>${escape(amount(d.quantityMilli,d.unit))} · ${escape(new Date(d.scheduledAt).toLocaleTimeString('ar',{hour:'2-digit',minute:'2-digit'}))}</p>${d.status==='taken'?`<p>مسجّلة كمتناولة${d.takenAt?' · '+escape(new Date(d.takenAt).toLocaleTimeString('ar',{hour:'2-digit',minute:'2-digit'})):''}</p>`:d.status==='pending'?`<button type="button" data-take="${escape(d.id)}">تسجيل تناول هذه الجرعة الآن</button>`:'<p>مسجّلة كمتجاوزة</p>'}</article>`).join('')||'<p class="qm-muted">لا توجد جرعات لليوم بعد.</p>';
}
async function open(){
 if(!root||!root.hidden)return;
 focusBefore=document.activeElement;
 for(const element of document.body.children){if(element!==root&&element!==timePicker&&element instanceof HTMLElement){inertBefore.set(element,element.inert);element.inert=true;}}
 root.hidden=false;q('[data-close]').focus();status('جارٍ قراءة البيانات…');
 void loadAlertSettings();
 try{await refresh();status('');}catch(_){status('تعذر قراءة البيانات. لم تُستبدل بياناتك بقائمة فارغة.');}
}
function close(){
 if(!root)return;closeTimePicker();root.hidden=true;
 for(const [element,value] of inertBefore)element.inert=value;
 inertBefore.clear();if(focusBefore?.isConnected)focusBefore.focus();
}
async function take(button){
 if(busy)return;busy=true;button.disabled=true;
 try{const result=await native('confirmDoseTaken',{doseId:button.dataset.take});status(result.recorded?'تم تسجيل التناول وتحديث المخزون.':'هذه الجرعة مسجّلة بالفعل؛ لم يُخصم المخزون مجددًا.');await refresh();}
 catch(_){status('تعذر إكمال العملية أو تحديث العرض. أعد فتح القسم للتحقق من السجل قبل إعادة المحاولة.');}
 finally{busy=false;if(button.isConnected)button.disabled=false;}
}
function createWheel(label,count,initial){
 const wheel=document.createElement('div');wheel.className='qm-wheel';wheel.tabIndex=0;wheel.setAttribute('role','spinbutton');wheel.setAttribute('aria-label',label);wheel.setAttribute('aria-valuemin','0');wheel.setAttribute('aria-valuemax',String(count-1));wheel.setAttribute('aria-valuenow',String(initial));
 const list=document.createElement('div');list.className='qm-wheel-list';
 for(let i=0;i<count;i++){const item=document.createElement('div');item.className='qm-wheel-item';item.textContent=pad(i);list.appendChild(item);}
 wheel.appendChild(list);
 const caption=document.createElement('span');caption.className='qm-wheel-label';caption.textContent=label;wheel.appendChild(caption);
 let value=initial,offset=0,drag=null;
 const paint=()=>{list.style.transform=`translateY(${44*2-offset}px)`;list.querySelectorAll('.qm-wheel-item').forEach((item,index)=>item.classList.toggle('is-selected',index===value));wheel.setAttribute('aria-valuenow',String(value));};
 const clamp=v=>((v%count)+count)%count;
 const set=(next,animate=true)=>{value=clamp(next);offset=value*44;if(!animate)list.style.transition='none';paint();if(!animate)requestAnimationFrame(()=>list.style.transition='transform .18s ease-out');};
 wheel.addEventListener('pointerdown',event=>{if(!event.isPrimary)return;drag={y:event.clientY,start:value};wheel.setPointerCapture(event.pointerId);list.style.transition='none';});
 wheel.addEventListener('pointermove',event=>{if(!drag)return;offset=clamp(drag.start-Math.round((event.clientY-drag.y)/44))*44-(event.clientY-drag.y);list.style.transform=`translateY(${44*2-offset}px)`;});
 const finish=event=>{if(!drag)return;drag=null;set(Math.round(offset/44));};
 wheel.addEventListener('pointerup',finish);wheel.addEventListener('pointercancel',finish);
 wheel.addEventListener('wheel',event=>{event.preventDefault();set(value+(event.deltaY>0?1:-1));},{passive:false});
 wheel.addEventListener('keydown',event=>{
  if(event.key==='ArrowUp'){event.preventDefault();set(value-1);}
  if(event.key==='ArrowDown'){event.preventDefault();set(value+1);}
  if(event.key==='Home'){event.preventDefault();set(0);}
  if(event.key==='End'){event.preventDefault();set(count-1);}
 });
 set(initial,false);return {element:wheel,get:()=>value,set};
}
function openTimePicker(){
 if(!timePicker)return;
 const now=new Date();
 timePicker.dataset.hour=String(now.getHours());timePicker.dataset.minute=String(now.getMinutes());
 timePicker.hidden=false;
 timePicker.querySelector('[data-time-cancel]').focus();
}
function closeTimePicker(){if(timePicker)timePicker.hidden=true;}
function installTimePicker(){
 timePicker=document.createElement('div');timePicker.id='qmTimePicker';timePicker.hidden=true;
 timePicker.setAttribute('role','dialog');timePicker.setAttribute('aria-modal','true');timePicker.setAttribute('aria-labelledby','qmTimeTitle');
 timePicker.innerHTML=`<div class="qm-time-card"><h3 id="qmTimeTitle">اختر وقت الجرعة</h3><div class="qm-preview" id="qmTimePreview">08:00</div><div class="qm-wheel-row"><div id="qmHourWheel"></div><div id="qmMinuteWheel"></div></div><div class="qm-time-actions"><button type="button" data-time-cancel>إلغاء</button><button type="button" class="qm-primary" data-time-confirm>إضافة الوقت</button></div></div>`;
 document.body.appendChild(timePicker);
 const now=new Date();
 const hourWheel=createWheel('الساعة',24,now.getHours());
 const minuteWheel=createWheel('الدقائق',60,now.getMinutes());
 timePicker.querySelector('#qmHourWheel').appendChild(hourWheel.element);
 timePicker.querySelector('#qmMinuteWheel').appendChild(minuteWheel.element);
 const preview=timePicker.querySelector('#qmTimePreview');
 const update=()=>{preview.textContent=`${pad(hourWheel.get())}:${pad(minuteWheel.get())}`;};
 hourWheel.element.addEventListener('pointerup',update);minuteWheel.element.addEventListener('pointerup',update);
 hourWheel.element.addEventListener('wheel',update);minuteWheel.element.addEventListener('wheel',update);
 hourWheel.element.addEventListener('keydown',update);minuteWheel.element.addEventListener('keydown',update);
 update();
 timePicker.addEventListener('click',event=>{
  const target=event.target instanceof Element?event.target:null;if(!target)return;
  if(target.closest('[data-time-cancel]'))closeTimePicker();
  if(target.closest('[data-time-confirm]')){
   const value=`${pad(hourWheel.get())}:${pad(minuteWheel.get())}`,field=root.querySelector('[name=times]');
   const current=field.value.split(/[,،]/).map(t=>t.trim()).filter(Boolean);
   if(current.includes(value)){status('هذا الوقت مضاف بالفعل.');return;}
   if(current.length>=24){status('لا يمكن إضافة أكثر من 24 وقتًا للدواء.');return;}
   current.push(value);field.value=current.sort().join(', ');closeTimePicker();status('تمت إضافة الوقت.');
  }
 });
 timePicker.addEventListener('keydown',event=>{
  if(event.key==='Escape'){event.preventDefault();closeTimePicker();return;}
  if(event.key!=='Tab')return;
  const controls=[...timePicker.querySelectorAll('button,.qm-wheel')].filter(e=>!e.disabled&&e.getClientRects().length);
  const first=controls[0],last=controls.at(-1);
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
 });
}
function install(){
 const entry=document.getElementById('openQatraMedicine');
 if(!entry)return;
 root=document.createElement('section');root.id='medicineSheet';root.hidden=true;
 root.setAttribute('role','dialog');root.setAttribute('aria-modal','true');root.setAttribute('aria-labelledby','qmTitle');
 root.innerHTML=`<header><div><h2 id="qmTitle">قطرة دواء</h2><span class="qm-muted">إدارة الأدوية والمخزون</span></div><button type="button" data-close>رجوع</button></header><p id="qmStatus" role="status" aria-live="polite"></p><main><p class="qm-warning">تُنشأ هنا الجرعات القادمة لليوم فقط. اختيار نمط التنبيه محفوظ، لكن ربط العرض العائم لم يكتمل بعد. الصور غير مفعّلة.</p><section class="qm-panel" aria-labelledby="qmAlertTitle"><h3 id="qmAlertTitle">تنبيهات الأدوية</h3><label for="qmAlertMode">نمط التنبيه لجميع الأدوية</label><select id="qmAlertMode" disabled aria-describedby="qmAlertStatus"><option value="notification">إشعار</option><option value="overlay">قطرة عائمة</option><option value="both">كلاهما</option></select><p id="qmAlertStatus" role="status" aria-live="polite"></p><button type="button" id="qmAlertRetry">إعادة قراءة الإعداد</button></section><section class="qm-panel"><h3>إضافة دواء</h3><form id="qmForm"><label>اسم الدواء<input name="medicineName" required maxlength="160" autocomplete="off"></label><label>التركيز كما على العبوة<input name="strength" maxlength="160" autocomplete="off"></label><label>الوحدة<select name="unit"><option value="tablet">حبة</option><option value="capsule">كبسولة</option><option value="ml">مل</option><option value="drop">قطرة</option><option value="other">وحدة</option></select></label><label>كمية الجرعة المسجّلة<input name="dose" type="number" min="0.001" max="1000000000" step="0.001" required inputmode="decimal"></label><div class="qm-row"><button type="button" data-quantity="0.25">ربع حبة</button><button type="button" data-quantity="0.5">نصف حبة</button><button type="button" data-quantity="1">حبة كاملة</button></div><p class="qm-muted">سجّل الجرعة وفق الوصفة. خيارات الكسر لا تعني أن دواءك قابل للتقسيم.</p><label>الكمية المتوفرة<input name="stock" type="number" min="0" max="1000000000" step="0.001" required inputmode="decimal"></label><label>أوقات الجرعات<button type="button" id="qmOpenTimePicker">اختر وقتًا</button><input name="times" placeholder="لم يتم اختيار وقت بعد" readonly required dir="ltr" autocomplete="off"></label><button type="submit" class="qm-primary">حفظ الدواء وإنشاء جرعات اليوم</button></form></section><h3>أدويتي ومخزوني</h3><div id="qmMedicines"></div><h3>جرعات اليوم</h3><div id="qmDoses"></div></main>`;
 document.body.appendChild(root);entry.addEventListener('click',open);
 installTimePicker();
 q('#qmAlertMode').selectedIndex=-1;
 q('#qmAlertMode').addEventListener('change',saveAlertSettings);
 q('#qmAlertRetry').addEventListener('click',loadAlertSettings);
 const form=q('#qmForm'),field=name=>form.elements.namedItem(name);
 function fractions(){root.querySelectorAll('[data-quantity]').forEach(b=>b.hidden=field('unit').value!=='tablet');}
 field('unit').addEventListener('change',()=>{field('dose').value='';fractions();});fractions();
 q('#qmOpenTimePicker').addEventListener('click',openTimePicker);
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
   const times=field('times').value.split(/[,،]/).map(t=>t.trim()).filter(Boolean);
   if(!times.length||times.length>24||new Set(times).size!==times.length||!times.every(t=>/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(t)))throw Error('times');
   const name=field('medicineName').value.trim();if(!name)throw Error('name');
   payload={name,strength:field('strength').value.trim(),unit:field('unit').value,doseMilli:quantity(field('dose').value,true),openingStockMilli:quantity(field('stock').value,false),dailyTimes:times.sort()};
  }catch(_){status('تحقق من الاسم والكميات والأوقات. اختر وقتًا واحدًا على الأقل.');return;}
  busy=true;const save=form.querySelector('[type=submit]');save.disabled=true;
  try{const result=await native('addMedicine',payload);form.reset();fractions();field('times').value='';status(`تم حفظ الدواء وإنشاء ${result.createdDoses} جرعة لليوم. العرض العائم لم يُربط بعد.`);try{await refresh();}catch(_){status('تم الحفظ، لكن تعذر تحديث العرض. أعد فتح القسم ولا تضف الدواء مرة ثانية.');}}
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
