/* qatra-medicine-entry-v1 */
(() => {
'use strict';
function start(){
 const root=document.getElementById('medicineSheet'),form=document.getElementById('qmForm');if(!root||!form||root.dataset.entryReady)return;root.dataset.entryReady='true';
 const panel=root.querySelector('.qm-dashboard'),header=root.querySelector('header');
 if(panel&&header){
  panel.id='qmProgressPanel';panel.hidden=true;
  const trigger=document.createElement('button');trigger.type='button';trigger.className='qm-progress-action';trigger.title='تقدم اليوم';trigger.setAttribute('aria-label','تقدم اليوم');trigger.setAttribute('aria-controls',panel.id);trigger.setAttribute('aria-expanded','false');
  trigger.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h16M6 16v-5m6 5V5m6 11V8"/><path d="m5 7 5-4 5 2 4-3"/></svg>';
  header.insertBefore(trigger,header.querySelector('[data-close]'));
  function toggle(show){panel.hidden=!show;trigger.setAttribute('aria-expanded',String(show));if(show){const heading=panel.querySelector('h3');heading.tabIndex=-1;heading.focus();panel.scrollIntoView({block:'nearest'});}else trigger.focus();}
  trigger.onclick=()=>toggle(panel.hidden);
  root.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){event.preventDefault();event.stopImmediatePropagation();toggle(false)}},true);
  new MutationObserver(()=>{if(root.hidden){panel.hidden=true;trigger.setAttribute('aria-expanded','false')}}).observe(root,{attributes:true,attributeFilter:['hidden']});
 }
 const name=form.elements.namedItem('medicineName'),strength=form.elements.namedItem('strength'),unit=form.elements.namedItem('unit');if(!name||!strength||!unit)return;
 const el=(tag,text)=>{const node=document.createElement(tag);if(text)node.textContent=text;return node};
 const normalize=s=>s.trim().replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-1632)).replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-1776)).replace(/٫/g,'.');
 const numeric=s=>/^\d+(\.\d+)?$/.test(normalize(s));
 const group=el('fieldset');group.className='qm-strength-group';group.append(el('legend','التركيز كما على العبوة'));
 const strengthLabel=el('label','القيمة أو النص الموجود على العبوة'),display=el('input');display.type='text';display.maxLength=160;display.autocomplete='off';display.inputMode='text';display.value=strength.value;display.placeholder='اكتب الرقم أو التركيز كاملًا';display.setAttribute('list','qmReferenceStrengths');strengthLabel.append(display);
 const measureLabel=el('label','وحدة التركيز'),measure=el('select');measureLabel.append(measure);
 const volumeLabel=el('label','حجم العبوة بالمل — اختياري'),volume=el('input');volume.type='text';volume.inputMode='decimal';volume.maxLength=12;volume.placeholder='كما هو مكتوب على العبوة';volumeLabel.append(volume);
 const info=el('p','التركيز وحجم العبوة منفصلان عن كمية الجرعة والمخزون. لا يُحوَّل المل إلى قطرات تلقائيًا.');info.className='qm-muted';
 const oldLabel=strength.closest('label');oldLabel.replaceWith(group);strength.type='hidden';group.append(strength,strengthLabel,measureLabel,volumeLabel,info);
 const strengthList=el('datalist');strengthList.id='qmReferenceStrengths';group.append(strengthList);
 function sync(){
  const text=display.value.trim(),v=normalize(volume.value);display.setCustomValidity('');volume.setCustomValidity('');measure.setCustomValidity('');
  if(numeric(text)&&!measure.value)measure.setCustomValidity('اختر وحدة التركيز كما على العبوة.');
  if(!volumeLabel.hidden&&v&&(!numeric(v)||Number(v)<=0))volume.setCustomValidity('اكتب حجم العبوة الموجب كما هو مكتوب عليها.');
  let saved=numeric(text)&&measure.value?normalize(text)+' '+measure.value:text;
  if(!volumeLabel.hidden&&v)saved+=(saved?' · ':'')+'حجم العبوة: '+v+' مل';
  if(saved.length>160)display.setCustomValidity('اختصر النص إلى 160 حرفًا مع حجم العبوة.');
  strength.value=saved;measureLabel.hidden=!!text&&!numeric(text);
 }
 function measures(){
  const previous=measure.value,liquid=['ml','drop'].includes(unit.value);
  const available=liquid?['ملغ/مل','ملغ/5 مل','ميكروغرام/مل','غ/مل','وحدة دولية/مل','٪']:['ملغ','ميكروغرام','غ','وحدة دولية','٪'];
  measure.replaceChildren(new Option('اختر الوحدة كما على العبوة',''));available.forEach(x=>measure.add(new Option(x,x)));if(available.includes(previous))measure.value=previous;
  volumeLabel.hidden=!liquid;sync();
 }
 display.addEventListener('input',sync);display.addEventListener('change',sync);measure.addEventListener('change',sync);volume.addEventListener('input',sync);unit.addEventListener('change',measures);measures();
 form.addEventListener('submit',event=>{sync();if(!display.checkValidity()||!measure.checkValidity()||!volume.checkValidity()){event.preventDefault();event.stopImmediatePropagation();form.reportValidity()}},true);
 const names=el('datalist');names.id='qmReferenceNames';name.setAttribute('list',names.id);name.after(names);
 const consent=el('label');consent.className='qm-reference-consent';const opt=el('input');opt.type='checkbox';opt.autocomplete='off';consent.append(opt,el('span','تفعيل اقتراحات الأسماء من مرجع NLM'));
 const privacy=el('small','عند التفعيل يُرسل نص البحث فقط إلى NLM عبر الإنترنت. المرجع لا يشمل كل الأسماء التجارية أو العربية. يمكنك كتابة اسمك يدويًا دائمًا.');
 const status=el('p','يمكنك إدخال اسم الدواء يدويًا.');status.className='qm-reference-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 name.closest('label').after(consent,privacy,status);
 let timer,controller,sequence=0,rows=[];
 function cancel(){clearTimeout(timer);controller?.abort();controller=null;sequence++}
 function resetSuggestions(){rows=[];names.replaceChildren();strengthList.replaceChildren()}
 function selectName(){
  const row=rows.find(x=>x.name===name.value);strengthList.replaceChildren();
  if(row)row.strengths.forEach(value=>strengthList.append(new Option(value,value)));
 }
 async function search(){
  if(!opt.checked||root.hidden||document.hidden)return;
  const term=name.value.trim();if(term.length<2){status.textContent='اكتب حرفين على الأقل لعرض الاقتراحات، أو أكمل الاسم يدويًا.';return}
  const version=++sequence;controller=new AbortController();const signal=controller.signal,timeout=setTimeout(()=>controller?.signal===signal&&controller.abort(),8000);
  status.textContent='جارٍ البحث في مرجع NLM…';
  try{
   const query=new URLSearchParams({terms:term,maxList:'8',df:'DISPLAY_NAME',ef:'STRENGTHS_AND_FORMS'});
   const response=await fetch('https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?'+query,{signal,credentials:'omit',referrerPolicy:'no-referrer'});if(!response.ok)throw Error('reference');const data=await response.json();
   if(version!==sequence||!opt.checked||root.hidden||name.value.trim()!==term)return;
   if(!Array.isArray(data)||!Array.isArray(data[3]))throw Error('format');
   rows=data[3].slice(0,8).map((item,index)=>({name:String(item[0]||'').slice(0,160),strengths:(Array.isArray(data[2]?.STRENGTHS_AND_FORMS?.[index])?data[2].STRENGTHS_AND_FORMS[index]:[]).filter(x=>typeof x==='string').map(x=>x.trim()).slice(0,80)})).filter(x=>x.name);
   names.replaceChildren();rows.forEach(row=>names.append(new Option(row.name,row.name)));selectName();
   status.textContent=rows.length?'اقتراحات من NLM؛ اختر الاسم المطابق لعبوتك أو احتفظ بما كتبته.':'لم يظهر تطابق في هذا المرجع. يمكنك حفظ الاسم الذي كتبته.';
  }catch(_){if(version===sequence)status.textContent='تعذر الوصول إلى مرجع الأسماء. يمكنك متابعة الإدخال اليدوي.'}
  finally{clearTimeout(timeout);if(version===sequence)controller=null}
 }
 name.addEventListener('input',()=>{cancel();selectName();if(rows.some(x=>x.name===name.value))return;resetSuggestions();if(opt.checked)timer=setTimeout(search,400)});
 name.addEventListener('change',selectName);name.addEventListener('focus',()=>{if(opt.checked&&name.value.trim().length>=2){cancel();timer=setTimeout(search,400)}});
 opt.addEventListener('change',()=>{cancel();resetSuggestions();if(opt.checked){status.textContent='اكتب اسم الدواء لعرض اقتراحات NLM.';timer=setTimeout(search,400)}else status.textContent='اقتراحات الإنترنت متوقفة؛ الإدخال اليدوي متاح.'});
 form.addEventListener('reset',()=>{cancel();resetSuggestions();setTimeout(()=>{display.value='';volume.value='';measures();status.textContent='يمكنك إدخال اسم الدواء يدويًا.'},0)});
 new MutationObserver(()=>{if(root.hidden){cancel();resetSuggestions();opt.checked=false}}).observe(root,{attributes:true,attributeFilter:['hidden']});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel()});
}
const style=document.createElement('style');style.textContent=`
#medicineSheet .qm-progress-action{display:grid;place-items:center;width:48px;height:48px;min-width:48px;min-height:48px;padding:11px;border-radius:17px;border:1px solid var(--border);background:var(--surface);color:var(--primary);margin-inline-start:auto;box-shadow:0 4px 12px #00000010}
#medicineSheet .qm-progress-action svg{width:24px;height:24px}#medicineSheet .qm-progress-action[aria-expanded=true]{background:var(--primary);color:var(--surface)}#medicineSheet .qm-progress-action:focus-visible{outline:2px solid var(--primary);outline-offset:3px}
#medicineSheet .qm-dashboard[hidden],#medicineSheet .qm-strength-group [hidden]{display:none!important}
#medicineSheet .qm-strength-group{min-width:0;padding:14px;border:1px solid var(--border);border-radius:16px;margin:14px 0}#medicineSheet .qm-strength-group legend{padding-inline:8px;font-size:14px}#medicineSheet .qm-strength-group label{display:block;margin-bottom:12px}#medicineSheet .qm-strength-group .qm-muted{font-size:12px;line-height:1.8;margin-bottom:0}
#medicineSheet .qm-reference-consent{display:flex;align-items:center;gap:10px;line-height:1.8;margin:12px 0 6px;font-size:13px}#medicineSheet .qm-reference-consent input{width:20px;height:20px;min-width:20px;min-height:20px;margin:0;accent-color:var(--primary)}#medicineSheet .qm-reference-consent+small{display:block;font-size:11px;line-height:1.8;color:var(--text-dim)}#medicineSheet .qm-reference-status{font-size:12px;line-height:1.8;color:var(--text-dim)}
`;document.head.append(style);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
