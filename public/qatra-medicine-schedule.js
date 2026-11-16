/* qatra-medicine-schedule-v1 */
(() => {
'use strict';
function install(){
 const root=document.getElementById('medicineSheet'),form=document.getElementById('qmForm'),picker=document.getElementById('qmTimePicker');
 if(!root||!form||!picker||form.dataset.scheduleReady)return;
 const times=form.elements.namedItem('times'),dose=form.elements.namedItem('dose'),unit=form.elements.namedItem('unit'),opener=document.getElementById('qmOpenTimePicker');
 if(!times||!dose||!unit||!opener)return;form.dataset.scheduleReady='true';
 const el=(tag,text)=>{const node=document.createElement(tag);if(text)node.textContent=text;return node};
 const n=value=>new Intl.NumberFormat('ar',{maximumFractionDigits:3}).format(value);
 const validTime=value=>/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(value);
 let selectedCount=1,slots=Array(24).fill(''),activeSlot=null,lastTrigger=null;
 const doseLabel=dose.closest('label');if(doseLabel){const text=[...doseLabel.childNodes].find(x=>x.nodeType===3);if(text)text.textContent='كمية الجرعة الواحدة';}
 const schedule=el('fieldset');schedule.className='qm-dose-schedule';schedule.append(el('legend','الجرعات اليومية'));
 const countLabel=el('label','عدد الجرعات في اليوم');countLabel.htmlFor='qmDailyDoseCount';
 const stepper=el('div');stepper.className='qm-dose-stepper';
 const decrease=el('button','−'),increase=el('button','+'),count=el('input');
 for(const button of [decrease,increase])button.type='button';
 decrease.setAttribute('aria-label','تقليل عدد الجرعات');increase.setAttribute('aria-label','زيادة عدد الجرعات');
 count.id='qmDailyDoseCount';count.type='number';count.min='1';count.max='24';count.step='1';count.value='1';count.defaultValue='1';count.required=true;count.inputMode='numeric';
 stepper.append(decrease,count,increase);
 const list=el('div');list.className='qm-dose-slots';
 const message=el('p');message.className='qm-schedule-message';message.setAttribute('role','status');message.setAttribute('aria-live','polite');
 const summary=el('p');summary.className='qm-dose-total';summary.setAttribute('aria-live','polite');
 const description=el('small','اختر موعدًا لكل جرعة. جميع المواعيد تستخدم كمية الجرعة الواحدة التي أدخلتها.');
 const old=times.closest('label');old.replaceWith(schedule);times.type='hidden';times.required=false;opener.hidden=true;opener.style.display='none';
 schedule.append(countLabel,stepper,list,message,summary,description,times,opener);
 function updateSummary(){
  const quantity=Number(dose.value),names={tablet:'حبة',capsule:'كبسولة',drop:'قطرة',ml:'مل',other:'وحدة'};
  summary.textContent=dose.value&&Number.isFinite(quantity)&&quantity>0?'إجمالي اليوم: '+n(quantity)+' × '+n(selectedCount)+' = '+n(quantity*selectedCount)+' '+(names[unit.value]||''):'أدخل كمية الجرعة الواحدة لعرض إجمالي اليوم.';
 }
 function serialize(){times.value=slots.slice(0,selectedCount).filter(Boolean).sort().join(', ')}
 function render(){
  list.replaceChildren();
  for(let i=0;i<selectedCount;i++){
   const button=el('button');button.type='button';button.className='qm-dose-slot';button.dataset.slot=String(i);button.setAttribute('aria-haspopup','dialog');
   const label=el('span','موعد الجرعة '+n(i+1)),value=el('span',slots[i]?new Date('2000-01-01T'+slots[i]+':00').toLocaleTimeString('ar',{hour:'2-digit',minute:'2-digit'}):'اختر الموعد');
   value.className='qm-dose-slot-time';button.append(label,value);button.classList.toggle('is-set',!!slots[i]);
   button.onclick=()=>{activeSlot=i;lastTrigger=button;opener.click();picker.querySelector('#qmTimeTitle').textContent='موعد الجرعة '+n(i+1);picker.querySelector('[data-time-confirm]').textContent='تأكيد الموعد'};
   list.append(button);
  }
  decrease.disabled=selectedCount<=1;increase.disabled=selectedCount>=24;serialize();updateSummary();
 }
 function applyCount(value){
  if(!Number.isInteger(value)||value<1||value>24){message.textContent='اختر عددًا صحيحًا من 1 إلى 24 جرعة.';return}
  selectedCount=value;count.value=String(value);message.textContent='';render();
 }
 decrease.onclick=()=>applyCount(Math.max(1,selectedCount-1));increase.onclick=()=>applyCount(Math.min(24,selectedCount+1));count.addEventListener('input',()=>applyCount(Number(count.value)));
 dose.addEventListener('input',updateSummary);unit.addEventListener('change',()=>setTimeout(updateSummary,0));
 root.addEventListener('click',event=>{if(event.target instanceof Element&&event.target.closest('[data-quantity]'))queueMicrotask(updateSummary)});
 picker.addEventListener('click',event=>{
  const target=event.target instanceof Element?event.target:null;
  if(!target||activeSlot===null)return;
  if(target.closest('[data-time-cancel]')){activeSlot=null;queueMicrotask(()=>lastTrigger?.isConnected&&lastTrigger.focus());return}
  if(!target.closest('[data-time-confirm]'))return;
  event.preventDefault();event.stopImmediatePropagation();
  const hour=Number(picker.querySelector('.qm-wheel[aria-label="الساعة"]')?.getAttribute('aria-valuenow')),minute=Number(picker.querySelector('.qm-wheel[aria-label="الدقائق"]')?.getAttribute('aria-valuenow'));
  if(!Number.isInteger(hour)||hour<0||hour>23||!Number.isInteger(minute)||minute<0||minute>59)return;
  const value=String(hour).padStart(2,'0')+':'+String(minute).padStart(2,'0');
  if(slots.slice(0,selectedCount).some((time,index)=>index!==activeSlot&&time===value)){
   picker.querySelector('#qmTimeTitle').textContent='هذا الموعد مستخدم؛ اختر موعدًا مختلفًا.';return;
  }
  const index=activeSlot;if(index>=selectedCount)return;slots[index]=value;activeSlot=null;picker.hidden=true;message.textContent='';render();list.querySelector('[data-slot="'+index+'"]')?.focus();
 },true);
 form.addEventListener('submit',event=>{
  const values=slots.slice(0,selectedCount),raw=Number(count.value);
  const invalid=raw!==selectedCount||!Number.isInteger(raw)||raw<1||raw>24||values.some(x=>!validTime(x))||new Set(values).size!==selectedCount;
  if(invalid){event.preventDefault();event.stopImmediatePropagation();message.textContent='حدد موعدًا مختلفًا لكل جرعة من الجرعات '+n(selectedCount)+' قبل الحفظ.';const missing=values.findIndex(x=>!validTime(x));list.querySelector('[data-slot="'+Math.max(0,missing)+'"]')?.focus();return}
  serialize();
 },true);
 form.addEventListener('reset',()=>{setTimeout(()=>{selectedCount=1;count.value='1';slots=Array(24).fill('');activeSlot=null;message.textContent='';render()},0)});
 new MutationObserver(()=>{if(root.hidden){activeSlot=null;picker.hidden=true}}).observe(root,{attributes:true,attributeFilter:['hidden']});
 render();
}
const style=document.createElement('style');style.textContent=`
#medicineSheet .qm-dose-schedule{min-width:0;margin:16px 0;padding:16px;border:1px solid var(--border);border-radius:20px;background:var(--surface)}
#medicineSheet .qm-dose-schedule legend{padding-inline:8px}#medicineSheet .qm-dose-stepper{display:flex;align-items:center;gap:10px;margin:10px 0 16px;direction:ltr}#medicineSheet .qm-dose-stepper input{width:72px;min-width:0;margin:0;text-align:center;appearance:textfield;-moz-appearance:textfield;font-variant-numeric:tabular-nums}#medicineSheet .qm-dose-stepper input::-webkit-inner-spin-button{appearance:none}
#medicineSheet .qm-dose-stepper button{min-width:48px;min-height:48px;border-radius:15px;font-size:22px;background:var(--bg);color:var(--primary);border:1px solid var(--border)}
#medicineSheet .qm-dose-slots{display:grid;gap:9px}#medicineSheet .qm-dose-slot{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:54px;padding:12px;border:1px solid var(--border);border-radius:15px;background:var(--bg);color:var(--text);text-align:start}#medicineSheet .qm-dose-slot.is-set{border-color:var(--primary)}#medicineSheet .qm-dose-slot-time{color:var(--primary);font-variant-numeric:tabular-nums}
#medicineSheet .qm-schedule-message,#medicineSheet .qm-dose-total{font-size:13px;line-height:1.9;margin:10px 0}#medicineSheet .qm-schedule-message:empty{display:none}#medicineSheet .qm-dose-schedule small{display:block;font-size:12px;line-height:1.8;color:var(--text-dim)}#medicineSheet .qm-dose-schedule :focus-visible{outline:2px solid var(--primary);outline-offset:3px}
`;document.head.append(style);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
