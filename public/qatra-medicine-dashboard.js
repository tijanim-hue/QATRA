/* qatra-medicine-dashboard-v1 */
(() => {
'use strict';
function start(){
 const root=document.getElementById('medicineSheet'),form=document.getElementById('qmForm'),meds=document.getElementById('qmMedicines'),doses=document.getElementById('qmDoses');if(!root||!form||!meds||!doses)return;
 const file=form.querySelector('input[type=file]');
 if(file){
  file.hidden=true;file.style.setProperty('display','none','important');
  const choose=document.createElement('button');choose.type='button';choose.className='qm-photo-choose';choose.textContent='اختيار صورة الدواء';choose.onclick=()=>file.click();
  const text=document.createElement('span');text.className='qm-photo-filename';text.setAttribute('aria-live','polite');text.textContent='لم تُحدَّد صورة بعد';file.before(choose,text);
  const update=()=>{text.textContent=file.files?.[0]?'الصورة المختارة: '+file.files[0].name:'لم تُحدَّد صورة بعد'};
  file.addEventListener('change',update);form.addEventListener('reset',()=>setTimeout(update,0));
  const erase=file.parentElement.querySelector('button:not(.qm-photo-choose)');erase?.addEventListener('click',()=>setTimeout(update,0));
 }
 const panel=document.createElement('section');panel.className='qm-dashboard';panel.setAttribute('aria-labelledby','qmProgressTitle');
 const heading=document.createElement('h3');heading.id='qmProgressTitle';heading.textContent='تقدم اليوم';
 const subtitle=document.createElement('p');subtitle.className='qm-dashboard-sub';subtitle.textContent='ملخص الأدوية الحالية وجرعات اليوم';
 const metrics=document.createElement('div');metrics.className='qm-metrics';
 const values={};for(const [key,label] of [['medicines','الأدوية الحالية'],['taken','مسجّلة كمتناولة'],['pending','بانتظار التسجيل'],['skipped','مسجّلة كمتجاوزة']]){
  const item=document.createElement('div'),value=document.createElement('strong'),caption=document.createElement('span');value.textContent='—';caption.textContent=label;values[key]=value;item.append(value,caption);metrics.append(item);
 }
 const progress=document.createElement('progress');progress.max=100;progress.value=0;progress.setAttribute('aria-label','نسبة الجرعات المسجلة كمتناولة من جرعات اليوم للأدوية الحالية');progress.hidden=true;
 const summary=document.createElement('p');summary.className='qm-progress-copy';summary.textContent='جارٍ قراءة التقدم…';
 const next=document.createElement('p');next.className='qm-next-dose';
 const help=document.createElement('small');help.textContent='النسبة = الجرعات المسجّلة كمتناولة ÷ جميع جرعات اليوم المعروضة للأدوية الحالية، بما فيها القادمة والمتجاوزة. لا تعني تقييمًا طبيًا.';
 const retry=document.createElement('button');retry.type='button';retry.textContent='تحديث الملخص';
 panel.append(heading,subtitle,metrics,progress,summary,next,help,retry);root.querySelector('main').prepend(panel);
 let timer,generation=0;
 const n=value=>new Intl.NumberFormat('ar').format(value);
 async function load(){
  if(root.hidden||document.hidden)return;
  const version=++generation;
  try{
   const cap=window.Capacitor,api=cap?.Plugins?.QatraMedicine||cap?.registerPlugin?.('QatraMedicine');if(!api)throw Error('bridge');
   const [m,d]=await Promise.all([api.listMedicines(),api.listTodayDoses()]);if(version!==generation||root.hidden)return;
   if(!Array.isArray(m.medicines)||!Array.isArray(d.doses))throw Error('invalid');
   const rows=d.doses,active=m.medicines.filter(x=>!x.archived),taken=rows.filter(x=>x.status==='taken').length,pending=rows.filter(x=>x.status==='pending').length,skipped=rows.filter(x=>x.status==='skipped').length;
   values.medicines.textContent=n(active.length);values.taken.textContent=n(taken);values.pending.textContent=n(pending);values.skipped.textContent=n(skipped);
   progress.hidden=!rows.length;progress.value=rows.length?Math.round(taken*100/rows.length):0;
   summary.textContent=rows.length?n(taken)+' من '+n(rows.length)+' جرعة مسجّلة كمتناولة — '+n(progress.value)+'٪':'لا توجد جرعات لليوم للأدوية الحالية. ستظهر النسبة عند توفر جرعات.';
   const upcoming=rows.filter(x=>x.status==='pending'&&x.scheduledAt>Date.now()).sort((a,b)=>a.scheduledAt-b.scheduledAt)[0];
   const waiting=rows.filter(x=>x.status==='pending'&&x.scheduledAt<=Date.now()).length;
   next.textContent=upcoming?'القادمة: '+upcoming.name+' · '+new Date(upcoming.scheduledAt).toLocaleTimeString('ar',{hour:'2-digit',minute:'2-digit'}):'لا توجد جرعة قادمة مسجّلة لليوم.';
   if(waiting)next.textContent+=' توجد '+n(waiting)+' جرعة حلّ موعدها ولم يُسجّل تناولها.';
   const ids=new Set(rows.map(x=>x.id));for(const card of doses.querySelectorAll('[data-dose-id]'))if(!ids.has(card.dataset.doseId))card.remove();
  }catch(_){if(version===generation){summary.textContent='تعذر تحديث الملخص؛ قد تكون الأرقام المعروضة سابقة. اضغط تحديث الملخص.';}}
 }
 function schedule(){clearTimeout(timer);timer=setTimeout(load,180)}
 retry.onclick=load;
 new MutationObserver(schedule).observe(meds,{childList:true});new MutationObserver(schedule).observe(doses,{childList:true});
 new MutationObserver(()=>{generation++;schedule()}).observe(root,{attributes:true,attributeFilter:['hidden']});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)schedule()});
 setInterval(()=>{if(!root.hidden&&!document.hidden)schedule()},60000);schedule();
}
const style=document.createElement('style');style.textContent=`
#medicineSheet .qm-photo-choose{display:flex;align-items:center;justify-content:center;min-height:48px;width:100%;border:1px dashed var(--primary);border-radius:16px;color:var(--primary);background:var(--surface);margin-top:10px}
#medicineSheet .qm-photo-filename{display:block;font-size:13px;line-height:1.8;color:var(--text-dim);margin:8px 0;overflow-wrap:anywhere}
#medicineSheet .qm-dashboard{padding:18px;border:1px solid var(--border);border-radius:22px;background:var(--surface);box-shadow:var(--shadow);margin-bottom:18px}
#medicineSheet .qm-dashboard h3{margin:0;font-size:20px}#medicineSheet .qm-dashboard-sub{margin:5px 0 16px;color:var(--text-dim);font-size:13px}
#medicineSheet .qm-metrics{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}#medicineSheet .qm-metrics>div{padding:14px;border:1px solid var(--border);border-radius:16px;background:var(--bg);display:grid;gap:6px;min-width:0}#medicineSheet .qm-metrics strong{font-size:26px;color:var(--primary);font-variant-numeric:tabular-nums}#medicineSheet .qm-metrics span{font-size:12px;line-height:1.7}
#medicineSheet .qm-dashboard progress{display:block;width:100%;height:10px;margin-top:18px;accent-color:var(--primary);border-radius:10px;overflow:hidden;border:0}#medicineSheet .qm-dashboard progress[hidden]{display:none}#medicineSheet .qm-dashboard progress::-webkit-progress-bar{background:var(--border)}#medicineSheet .qm-dashboard progress::-webkit-progress-value{background:var(--primary);border-radius:10px}
#medicineSheet .qm-progress-copy,#medicineSheet .qm-next-dose{font-size:13px;line-height:1.9;margin:10px 0}#medicineSheet .qm-dashboard small{display:block;color:var(--text-dim);font-size:11px;line-height:1.8}#medicineSheet .qm-dashboard>button{margin-top:12px;font-size:13px}
@media(max-width:300px){#medicineSheet .qm-metrics{grid-template-columns:1fr}}
`;document.head.append(style);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
