/* qatra-medicine-insights-v1 */
(() => {
'use strict';
const el=(tag,text)=>{const node=document.createElement(tag);if(text)node.textContent=text;return node};
const n=x=>new Intl.NumberFormat('ar',{maximumFractionDigits:3}).format(x);
const units={tablet:'حبة',capsule:'كبسولة',drop:'قطرة',ml:'مل',other:'وحدة'};
const bridge=name=>window.Capacitor?.Plugins?.[name]||window.Capacitor?.registerPlugin?.(name);
function start(){
 const root=document.getElementById('medicineSheet'),list=document.getElementById('qmMedicines');if(!root||!list)return;
 let dialog=null,origin=null,press=null,suppressUntil=0;
 function close(){if(!dialog)return;const d=dialog;dialog=null;if(d.open)d.close();d.remove();if(origin?.isConnected)origin.focus()}
 async function details(card){
  close();origin=card;const id=card.dataset.medicineId,d=el('dialog');dialog=d;d.className='qi-dialog';d.dir='rtl';d.setAttribute('aria-labelledby','qiTitle');
  const content=el('section');content.className='qi-content';const head=el('header'),title=el('h2',card.querySelector('h3')?.textContent||'تفاصيل الدواء');title.id='qiTitle';const back=el('button','رجوع');back.type='button';back.onclick=close;head.append(title,back);
  const meta=el('p'),periods=el('div');periods.className='qi-periods';periods.setAttribute('role','group');periods.setAttribute('aria-label','فترة الإحصائيات');
  let period='day',version=0,settingsReady=false;const stats=el('section'),stock=el('section'),settings=el('section'),actions=el('div'),message=el('p');message.setAttribute('role','status');message.setAttribute('aria-live','polite');
  const periodButtons=[];for(const [key,label] of [['day','يومي'],['week','أسبوعي'],['month','شهري']]){const b=el('button',label);b.type='button';b.onclick=()=>{period=key;load()};periods.append(b);periodButtons.push([key,b])}
  for(const source of card.querySelectorAll('[data-management-actions] button,.qm-photo-tools button')){if(source.hidden)continue;const b=el('button',source.textContent);b.type='button';b.onclick=()=>{close();source.click()};actions.append(b)}
  const select=el('button','تحديد للحذف');select.type='button';select.onclick=()=>{close();card.querySelector('.qm-select')?.click()};actions.append(select);
  content.append(head,meta,periods,stats,stock,settings,actions,message);d.append(content);root.append(d);
  d.addEventListener('click',event=>{if(event.target===d)close()});d.addEventListener('cancel',event=>{event.preventDefault();close()});d.addEventListener('keydown',event=>{event.stopPropagation();if(event.key==='Escape'){event.preventDefault();close()}});
  try{d.showModal()}catch(_){d.setAttribute('open','')}back.focus();
  async function load(){
   const serial=++version;message.textContent='جارٍ قراءة السجل…';periodButtons.forEach(([key,b])=>b.setAttribute('aria-pressed',String(period===key)));
   try{
    const data=await bridge('QatraMedicineInsights').getDetails({id,period});if(dialog!==d||serial!==version)return;
    const m=data.medicine,c=data.counts;meta.textContent=(m.strength||'التركيز غير مسجّل')+' · الجرعة الواحدة: '+n(m.doseMilli/1000)+' '+(units[m.unit]||m.unit)+' · '+n(m.dailyTimes.length)+' جرعة يوميًا · '+m.dailyTimes.join(' / ');
    const total=c.taken+c.upcoming+c.unrecorded+c.skipped;stats.replaceChildren();const caption=el('p',period==='day'?'سجل اليوم':period==='week'?'سجل آخر ٧ أيام، بما فيها اليوم':'سجل آخر ٣٠ يومًا، بما فيها اليوم');stats.append(caption);const rings=el('div');rings.className='qi-rings';
    for(const [key,label,color] of [['taken','متناولة','#48c996'],['upcoming','قادمة','#55aef5'],['unrecorded','مرّ موعدها دون تسجيل','#e7ac52'],['skipped','متجاوزة','#ec7985']]){
     const item=el('div'),ring=el('div'),value=el('span',n(c[key]));ring.className='qi-ring';ring.style.setProperty('--ring',color);ring.style.setProperty('--part',(total?c[key]*100/total:0)+'%');ring.setAttribute('role','img');ring.setAttribute('aria-label',label+': '+n(c[key])+' من '+n(total));ring.append(value);item.append(ring,el('small',label));rings.append(item);
    }
    stats.append(rings,el('small',total?'النسب من الجرعات الموجودة فعليًا في سجل الفترة، بما فيها القادمة. عدم التسجيل لا يثبت نسيان التناول.':'لا توجد جرعات مسجّلة لهذه الفترة. لا تُنشأ بيانات تاريخية افتراضية.'));
    stock.replaceChildren(el('h3','المخزون'));const opening=data.openingStockMilli,remaining=m.stockMilli;const capsule=el('div');capsule.className='qi-stock-capsule';const fill=el('span');fill.className='qi-stock-fill';fill.style.width=(opening>0?Math.max(0,Math.min(100,remaining*100/opening)):0)+'%';const text=el('strong',remaining<0?'يحتاج مراجعة':opening>0?n(Math.round(remaining*100/opening))+'٪':'—');capsule.append(fill,text);stock.append(capsule,el('p','المتبقي المسجّل: '+n(remaining/1000)+' '+(units[m.unit]||m.unit)),el('small',opening>0?'النسبة إلى كمية المخزون الأولية: '+n(opening/1000)+' '+(units[m.unit]||m.unit):'لم تُسجّل كمية أولية موجبة لحساب النسبة.'));
    if(!settingsReady){
     settingsReady=true;let enabled=data.thresholdMilli>=0;const heading=el('h3','تنبيه قرب النفاد'),toggle=el('button');toggle.type='button';toggle.setAttribute('role','switch');const label=el('label','نبّهني عندما يصبح المتبقي بهذا العدد أو أقل ('+(units[m.unit]||m.unit)+')'),threshold=el('input');threshold.type='number';threshold.min='0';threshold.max='1000000000';threshold.step='0.001';threshold.inputMode='decimal';if(enabled)threshold.value=String(data.thresholdMilli/1000);label.append(threshold);const save=el('button','حفظ تنبيه المخزون');save.type='button';
     function paint(){toggle.textContent=enabled?'تنبيه المخزون مفعّل':'تنبيه المخزون متوقف';toggle.setAttribute('aria-checked',String(enabled));threshold.disabled=!enabled}toggle.onclick=()=>{enabled=!enabled;paint()};paint();settings.append(heading,toggle,label,save);
     if(!data.notificationsEnabled)settings.append(el('small','يلزم السماح بإشعارات التطبيق وتفعيل قناة مخزون الأدوية في إعدادات Android لوصول التنبيه.'));
     save.onclick=async()=>{
      const raw=threshold.value.trim();if(enabled&&!/^\d+(\.\d{1,3})?$/.test(raw)){message.textContent='اكتب حد التنبيه بصيغة عدد موجب أو صفر، حتى 3 منازل عشرية.';threshold.focus();return}
      const [whole,fraction='']=(raw||'0').split('.'),value=enabled?Number(whole)*1000+Number(fraction.padEnd(3,'0')):0;if(!Number.isSafeInteger(value)||value<0||value>1000000000000){message.textContent='تحقق من حد التنبيه.';return}
      save.disabled=true;try{const result=await bridge('QatraMedicineInsights').setStockAlert({id,enabled,thresholdMilli:value});if(dialog!==d)return;if(result.saved!==true)throw Error('save');message.textContent=result.notificationsEnabled?'حُفظ إعداد تنبيه المخزون.':'حُفظ الإعداد؛ وصول التنبيه يتطلب السماح بالإشعارات.'}catch(_){if(dialog===d)message.textContent='تعذر تأكيد حفظ تنبيه المخزون.'}finally{save.disabled=false}
     };
    }
    message.textContent='';
   }catch(_){if(dialog===d&&serial===version)message.textContent='تعذر قراءة التفاصيل. أعد فتح البطاقة للمحاولة؛ لم تُستبدل البيانات بأصفار.'}
  }
  load();
 }
 function scan(){for(const card of list.querySelectorAll('[data-medicine-id]')){
  card.classList.add('qi-compact');card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-haspopup','dialog');card.setAttribute('aria-label','تفاصيل '+(card.querySelector('h3')?.textContent||'الدواء'));
  const photo=card.querySelector('.qm-photo'),src=photo?.getAttribute('src');if(src&&src.startsWith('data:image/jpeg;base64,')){card.style.backgroundImage='linear-gradient(90deg,#071522bb,#07152288),url("'+src+'")';card.classList.add('qi-has-photo')}else{card.style.removeProperty('background-image');card.classList.remove('qi-has-photo')}
 }}
 let frame=0;new MutationObserver(()=>{if(!frame)frame=requestAnimationFrame(()=>{frame=0;scan()})}).observe(list,{subtree:true,childList:true,attributes:true,attributeFilter:['src']});scan();
 list.addEventListener('click',event=>{
  const target=event.target instanceof Element?event.target:null,card=target?.closest('[data-medicine-id]');if(!card||target.closest('button,input,label,a,select,textarea'))return;
  if(Date.now()<suppressUntil){event.preventDefault();event.stopImmediatePropagation();return}
  if(root.classList.contains('qm-selection-mode')||list.querySelector('.qm-selected'))return;
  event.preventDefault();event.stopImmediatePropagation();details(card);
 },true);
 list.addEventListener('pointerdown',event=>{
  const card=event.target instanceof Element?event.target.closest('[data-medicine-id]'):null;if(!card||event.button!==0)return;
  press={x:event.clientX,y:event.clientY,timer:setTimeout(()=>{suppressUntil=Date.now()+900;card.querySelector('.qm-select')?.click();press=null},550)};
 });
 function cancelPress(){if(press)clearTimeout(press.timer);press=null}
 list.addEventListener('pointermove',event=>{if(press&&Math.hypot(event.clientX-press.x,event.clientY-press.y)>10)cancelPress()});list.addEventListener('pointerup',cancelPress);list.addEventListener('pointercancel',cancelPress);list.addEventListener('contextmenu',event=>{if(event.target.closest('[data-medicine-id]'))event.preventDefault()});
 list.addEventListener('keydown',event=>{if(event.target.matches('[data-medicine-id]')&&['Enter',' '].includes(event.key)){event.preventDefault();event.stopImmediatePropagation();if(root.classList.contains('qm-selection-mode'))event.target.querySelector('.qm-select')?.click();else details(event.target)}},true);
 new MutationObserver(()=>{if(root.hidden){cancelPress();close()}}).observe(root,{attributes:true,attributeFilter:['hidden']});
}
const style=el('style');style.textContent=`
.qc-native-select{display:none!important}.qc-select-trigger{display:block;width:100%;box-sizing:border-box;min-height:48px;padding:12px 16px!important;border:1px solid var(--border)!important;border-radius:15px!important;background:var(--surface)!important;color:var(--text)!important;text-align:start;font:inherit;touch-action:manipulation}.qc-select-trigger::after{content:'⌄';float:left;margin-inline-start:12px;color:var(--primary)}.qc-select-trigger:disabled{opacity:.55}
#medicineSheet #qmForm .qm-dose-stepper{justify-content:center}
#medicineSheet #qmMedicines>.qi-compact{min-height:128px!important;padding:24px!important;border-radius:22px!important;display:flex!important;flex-direction:column;justify-content:center;background-size:cover!important;background-position:center!important;overflow:hidden}
#medicineSheet #qmMedicines>.qi-compact>*{display:none!important}#medicineSheet #qmMedicines>.qi-compact>h3,#medicineSheet #qmMedicines>.qi-compact>p:first-of-type{display:block!important;margin:4px 0!important}#medicineSheet #qmMedicines>.qi-has-photo>h3,#medicineSheet #qmMedicines>.qi-has-photo>p:first-of-type{color:#fff!important;text-shadow:0 1px 6px #0008}
.qi-dialog{position:fixed!important;inset:0!important;margin:0!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;box-sizing:border-box;background:#0008!important;border:0!important;padding:16px!important;color:var(--text)!important;font:inherit;backdrop-filter:blur(8px)}.qi-dialog[open]{display:flex!important;align-items:center;justify-content:center}.qi-dialog::backdrop{background:transparent}.qi-content{width:100%;max-width:560px;max-height:90dvh;overflow:auto;box-sizing:border-box;border:1px solid var(--border);border-radius:28px;padding:20px;background:var(--surface);box-shadow:0 24px 80px #0005}.qi-content header{position:static!important;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0!important;background:transparent!important}.qi-content h2{font-size:21px;margin:0}.qi-content h3{font-size:17px}.qi-content p,.qi-content small{line-height:1.9}.qi-content small{display:block;color:var(--text-dim);font-size:12px}.qi-content section{margin:18px 0;padding-top:12px;border-top:1px solid var(--border)}.qi-content button{min-height:46px;border-radius:14px;padding:10px 14px;margin:4px;border:1px solid var(--border);background:var(--bg);color:var(--text);font:inherit}.qi-periods{display:flex;gap:6px;margin-top:16px}.qi-periods button{flex:1;margin:0}.qi-periods [aria-pressed=true]{background:var(--primary);color:var(--q3-on-accent,#071522)}.qi-rings{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;text-align:center}.qi-ring{width:100px;height:100px;border-radius:50%;margin:0 auto 8px;background:conic-gradient(var(--ring) var(--part),var(--border) 0);position:relative;display:grid;place-items:center}.qi-ring::before{content:'';position:absolute;inset:8px;border-radius:50%;background:var(--surface)}.qi-ring span{position:relative;font-size:24px;font-variant-numeric:tabular-nums}.qi-stock-capsule{position:relative;height:58px;overflow:hidden;border:2px solid var(--primary);border-radius:40px;background:var(--bg);display:grid;place-items:center}.qi-stock-capsule::after{content:'';position:absolute;left:50%;top:0;bottom:0;border-left:1px solid var(--border)}.qi-stock-fill{position:absolute;right:0;top:0;bottom:0;background:var(--primary);opacity:.45}.qi-stock-capsule strong{position:relative;z-index:1;font-variant-numeric:tabular-nums}.qi-content input{display:block;width:100%;box-sizing:border-box;min-height:48px;border-radius:14px;border:1px solid var(--border);background:var(--bg);color:var(--text);padding:12px;font:inherit;margin-top:8px}.qi-content label{display:block;margin:12px 0}.qi-content :focus-visible{outline:2px solid var(--primary);outline-offset:3px}
`;document.head.append(style);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
