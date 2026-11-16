/* qatra-medicine-entry-v1 */
(() => {
'use strict';
const el=(tag,text)=>{const node=document.createElement(tag);if(text)node.textContent=text;return node};
function start(){
 const root=document.getElementById('medicineSheet'),form=document.getElementById('qmForm');if(!root||!form||root.dataset.entryReady)return;root.dataset.entryReady='true';
 const panel=root.querySelector('.qm-dashboard'),header=root.querySelector('header');
 if(panel&&header){
  panel.id='qmProgressPanel';panel.hidden=true;
  const trigger=el('button');trigger.type='button';trigger.className='qm-progress-action';trigger.title='تقدم اليوم';trigger.setAttribute('aria-label','تقدم اليوم');trigger.setAttribute('aria-controls',panel.id);trigger.setAttribute('aria-expanded','false');
  trigger.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 20h16M6 16v-5m6 5V5m6 11V8"/><path d="m5 7 5-4 5 2 4-3"/></svg>';
  header.insertBefore(trigger,header.querySelector('[data-close]'));
  function toggle(show){panel.hidden=!show;trigger.setAttribute('aria-expanded',String(show));if(show){const heading=panel.querySelector('h3');heading.tabIndex=-1;heading.focus();panel.scrollIntoView({block:'nearest'});}else trigger.focus();}
  trigger.onclick=()=>toggle(panel.hidden);
  root.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){event.preventDefault();event.stopImmediatePropagation();toggle(false)}},true);
  new MutationObserver(()=>{if(root.hidden){panel.hidden=true;trigger.setAttribute('aria-expanded','false')}}).observe(root,{attributes:true,attributeFilter:['hidden']});
 }
 const name=form.elements.namedItem('medicineName'),strength=form.elements.namedItem('strength'),unit=form.elements.namedItem('unit');if(!name||!strength||!unit)return;
 for(const option of [...unit.options])if(['ml','other'].includes(option.value))option.remove();
 const unitTitle=[...unit.closest('label').childNodes].find(x=>x.nodeType===3);if(unitTitle)unitTitle.textContent='صنف الدواء';
 for(const p of form.querySelectorAll('p'))if(p.textContent.includes('خيارات الكسر لا تعني أن دواءك قابل للتقسيم.'))p.textContent=p.textContent.replace('خيارات الكسر لا تعني أن دواءك قابل للتقسيم.','').trim();
 const normalize=s=>s.trim().replace(/[٠-٩]/g,c=>String(c.charCodeAt(0)-1632)).replace(/[۰-۹]/g,c=>String(c.charCodeAt(0)-1776)).replace(/٫/g,'.');
 const numeric=s=>/^\d+(\.\d+)?$/.test(normalize(s));
 const group=el('fieldset');group.className='qm-strength-group';group.append(el('legend','التركيز كما على العبوة'));
 const strengthLabel=el('label','القيمة أو النص الموجود على العبوة'),display=el('input');display.type='text';display.maxLength=160;display.autocomplete='off';display.value=strength.value;display.placeholder='اكتب الرقم أو التركيز كاملًا';strengthLabel.append(display);
 const measureLabel=el('label','وحدة التركيز'),measure=el('select');measureLabel.append(measure);
 const volumeLabel=el('label','حجم العبوة بالمل — اختياري'),volume=el('input');volume.type='text';volume.inputMode='decimal';volume.maxLength=12;volume.placeholder='كما هو مكتوب على العبوة';volumeLabel.append(volume);
 const info=el('p','التركيز وحجم العبوة منفصلان عن كمية الجرعة والمخزون. لا يُحوَّل المل إلى قطرات تلقائيًا.');info.className='qm-muted';
 strength.closest('label').replaceWith(group);strength.type='hidden';group.append(strength,strengthLabel,measureLabel,volumeLabel,info);
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
  const previous=measure.value,liquid=unit.value==='drop',available=liquid?['ملغ/مل','ملغ/5 مل','غ/مل']:['ملغ','غ'];
  measure.replaceChildren(new Option('اختر الوحدة كما على العبوة',''));available.forEach(x=>measure.add(new Option(x,x)));if(available.includes(previous))measure.value=previous;
  volumeLabel.hidden=!liquid;sync();
 }
 display.addEventListener('input',sync);display.addEventListener('change',sync);measure.addEventListener('change',sync);volume.addEventListener('input',sync);unit.addEventListener('change',measures);measures();
 form.addEventListener('submit',event=>{sync();if(!display.checkValidity()||!measure.checkValidity()||!volume.checkValidity()){event.preventDefault();event.stopImmediatePropagation();form.reportValidity()}},true);
 name.removeAttribute('list');name.dir='auto';name.setAttribute('role','combobox');name.setAttribute('aria-autocomplete','both');name.setAttribute('aria-expanded','false');name.setAttribute('aria-controls','qmNameOptions');
 const wrap=el('div');wrap.className='qm-name-wrap';name.before(wrap);wrap.append(name);
 const ghost=el('div');ghost.className='qm-name-ghost';ghost.setAttribute('aria-hidden','true');ghost.hidden=true;wrap.append(ghost);
 const options=el('div');options.className='qm-name-options';options.id='qmNameOptions';options.setAttribute('role','listbox');options.setAttribute('aria-label','اقتراحات أسماء الدواء');options.hidden=true;wrap.append(options);
 const status=el('span');status.className='qm-visually-hidden';status.setAttribute('role','status');status.setAttribute('aria-live','polite');wrap.append(status);
 let timer,controller,sequence=0,rows=[],accepting=false;
 function cancel(){clearTimeout(timer);controller?.abort();controller=null;sequence++}
 function hide(){ghost.hidden=true;options.hidden=true;name.setAttribute('aria-expanded','false')}
 function reset(){rows=[];options.replaceChildren();hide()}
 function accept(row){
  cancel();accepting=true;name.value=row;name.dispatchEvent(new Event('input',{bubbles:true}));name.dispatchEvent(new Event('change',{bubbles:true}));accepting=false;reset();name.focus();name.setSelectionRange(name.value.length,name.value.length);
 }
 function paintGhost(){
  ghost.hidden=true;
  if(document.activeElement!==name||name.selectionStart!==name.value.length||name.selectionEnd!==name.value.length||name.scrollWidth>name.clientWidth+2)return;
  const row=rows.find(x=>x.length>name.value.length&&x.toLowerCase().startsWith(name.value.toLowerCase()));if(!row||!name.value)return;
  const css=getComputedStyle(name);ghost.style.left=name.offsetLeft+'px';ghost.style.top=name.offsetTop+'px';ghost.style.width=name.offsetWidth+'px';ghost.style.height=name.offsetHeight+'px';ghost.style.padding=css.padding;ghost.style.borderWidth=css.borderWidth;ghost.style.font=css.font;ghost.style.lineHeight=css.lineHeight;ghost.style.letterSpacing=css.letterSpacing;ghost.style.textAlign=css.textAlign;ghost.dir=/[\u0600-\u06ff]/.test(name.value)?'rtl':'ltr';
  const prefix=el('span',name.value),tail=el('span',row.slice(name.value.length));prefix.style.visibility='hidden';tail.className='qm-name-tail';tail.addEventListener('pointerdown',event=>{event.preventDefault();accept(row)});ghost.replaceChildren(prefix,tail);ghost.hidden=false;
 }
 function show(){
  options.replaceChildren();rows.forEach((row,index)=>{
   const item=el('button',row);item.type='button';item.setAttribute('role','option');item.setAttribute('aria-selected','false');item.id='qmNameOption'+index;item.dir='auto';item.addEventListener('pointerdown',event=>event.preventDefault());item.onclick=()=>accept(row);options.append(item);
  });
  if(rows.length){const source=el('small','NLM / RxTerms');source.setAttribute('role','presentation');options.append(source)}
  options.hidden=!rows.length;name.setAttribute('aria-expanded',String(!!rows.length));paintGhost();
 }
 async function search(){
  if(root.hidden||document.hidden||document.activeElement!==name)return;
  const term=name.value.trim();if(term.length<2)return;
  const version=++sequence;controller=new AbortController();const signal=controller.signal,timeout=setTimeout(()=>{if(controller?.signal===signal)controller.abort()},8000);
  try{
   const query=new URLSearchParams({terms:term,maxList:'8',df:'DISPLAY_NAME'});
   const response=await fetch('https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?'+query,{signal,credentials:'omit',referrerPolicy:'no-referrer'});if(!response.ok)throw Error('reference');const data=await response.json();
   if(version!==sequence||root.hidden||document.hidden||name.value.trim()!==term||document.activeElement!==name)return;
   if(!Array.isArray(data[3]))throw Error('format');
   rows=[...new Set(data[3].filter(Array.isArray).map(item=>String(item[0]||'')).filter(x=>x&&x.length<=160))].slice(0,8);show();status.textContent=rows.length?'توجد '+rows.length+' اقتراحات. اختر الاسم المطابق.':'لا توجد اقتراحات؛ يمكنك إكمال الاسم.';
  }catch(_){if(version===sequence){reset();status.textContent='الاقتراحات غير متاحة؛ يمكنك إكمال الاسم.'}}
  finally{clearTimeout(timeout);if(version===sequence)controller=null}
 }
 function queue(){if(accepting)return;cancel();reset();if(name.value.trim().length>=2)timer=setTimeout(search,400)}
 name.addEventListener('input',queue);name.addEventListener('focus',queue);name.addEventListener('click',paintGhost);name.addEventListener('keyup',paintGhost);name.addEventListener('scroll',()=>{ghost.hidden=true});
 name.addEventListener('keydown',event=>{if(event.key==='ArrowDown'&&!options.hidden){event.preventDefault();options.querySelector('button')?.focus()}else if(event.key==='Escape'&&!options.hidden){event.preventDefault();event.stopPropagation();cancel();reset()}});
 options.addEventListener('keydown',event=>{
  const buttons=[...options.querySelectorAll('button')],index=buttons.indexOf(document.activeElement);
  if(event.key==='ArrowDown'||event.key==='ArrowUp'){event.preventDefault();buttons[(index+(event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length]?.focus()}
  if(event.key==='Escape'){event.preventDefault();event.stopPropagation();reset();name.focus()}
 });
 wrap.addEventListener('focusout',()=>setTimeout(()=>{if(!wrap.contains(document.activeElement)){cancel();hide()}},0));
 form.addEventListener('reset',()=>{cancel();reset();setTimeout(()=>{display.value='';volume.value='';measures();status.textContent=''},0)});
 new MutationObserver(()=>{if(root.hidden){cancel();reset()}}).observe(root,{attributes:true,attributeFilter:['hidden']});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancel();hide()}});
}
function installChoices(){
 if(window.QatraChoiceSheets)return;window.QatraChoiceSheets=true;let active=null;
 function open(select){
  if(active||select.disabled||select.multiple||select.size>1||!select.getClientRects().length)return;
  const owner=select.closest('dialog,[role=dialog]')||document.body,dialog=el('dialog');dialog.className='qc-choice-dialog';dialog.dir='rtl';dialog.setAttribute('aria-modal','true');dialog.setAttribute('aria-labelledby','qcChoiceTitle');
  const card=el('section');card.className='qc-choice-card';const top=el('div');top.className='qc-choice-head';
  const label=select.labels?.[0],titleText=select.getAttribute('aria-label')||[...(label?.childNodes||[])].find(x=>x.nodeType===3&&x.textContent.trim())?.textContent.trim()||'اختر الخيار';
  const title=el('h3',titleText);title.id='qcChoiceTitle';const close=el('button','إلغاء');close.type='button';top.append(title,close);
  const search=el('input');search.type='search';search.placeholder='ابحث في الخيارات';search.setAttribute('aria-label','البحث في الخيارات');search.hidden=select.options.length<8;
  const list=el('div');list.className='qc-choice-list';const empty=el('p','لا توجد نتائج مطابقة.');empty.hidden=true;
  function finish(){if(active!==dialog)return;active=null;if(dialog.open&&typeof dialog.close==='function')dialog.close();dialog.remove();if(select.isConnected)select.focus()}
  function render(){
   list.replaceChildren();let found=0;const term=search.value.trim().toLocaleLowerCase();
   [...select.options].forEach((option,index)=>{
    if(option.hidden||!option.textContent.toLocaleLowerCase().includes(term))return;found++;
    const row=el('button');row.type='button';row.className='qc-choice-row';row.setAttribute('aria-pressed',String(index===select.selectedIndex));row.disabled=option.disabled||!!option.closest('optgroup[disabled]');
    const text=el('span',option.textContent),mark=el('span',index===select.selectedIndex?'✓':'');mark.className='qc-choice-mark';mark.setAttribute('aria-hidden','true');row.append(text,mark);
    row.onclick=()=>{const changed=select.selectedIndex!==index;select.selectedIndex=index;finish();if(changed){select.dispatchEvent(new Event('input',{bubbles:true}));select.dispatchEvent(new Event('change',{bubbles:true}))}};list.append(row);
   });empty.hidden=!!found;
  }
  card.append(top,search,list,empty);dialog.append(card);owner.append(dialog);active=dialog;render();
  close.onclick=finish;search.addEventListener('input',render);dialog.addEventListener('click',event=>{if(event.target===dialog)finish()});dialog.addEventListener('cancel',event=>{event.preventDefault();finish()});
  dialog.addEventListener('keydown',event=>{
   event.stopPropagation();
   if(event.key==='Escape'){event.preventDefault();finish();return}
   const buttons=[...list.querySelectorAll('button:not(:disabled)')],index=buttons.indexOf(document.activeElement);
   if((event.key==='ArrowDown'||event.key==='ArrowUp')&&document.activeElement!==search){event.preventDefault();buttons[(index+(event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length]?.focus()}
   if(event.key==='Tab'){const controls=[...card.querySelectorAll('button,input')].filter(x=>!x.disabled&&x.getClientRects().length),first=controls[0],last=controls.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus()}}
  });
  try{dialog.showModal()}catch(_){dialog.setAttribute('open','')}
  const initial=list.querySelector('[aria-pressed=true]:not(:disabled)')||close;initial.focus();initial.scrollIntoView({block:'nearest'});
  const watch=new MutationObserver(()=>{if(!select.isConnected||!select.getClientRects().length){watch.disconnect();finish()}});watch.observe(owner,{subtree:true,childList:true,attributes:true,attributeFilter:['hidden','style']});dialog.addEventListener('close',()=>watch.disconnect(),{once:true});
 }
 document.addEventListener('pointerdown',event=>{const target=event.target;if(!(target instanceof HTMLSelectElement)||target.multiple||target.size>1||target.disabled)return;event.preventDefault();open(target)},true);
 document.addEventListener('click',event=>{const target=event.target;if(!(target instanceof HTMLSelectElement)||target.multiple||target.size>1||target.disabled)return;event.preventDefault();open(target)},true);
 document.addEventListener('keydown',event=>{const target=event.target;if(!(target instanceof HTMLSelectElement)||target.multiple||target.size>1||target.disabled)return;if(['Enter',' ','ArrowDown','ArrowUp','F4'].includes(event.key)){event.preventDefault();event.stopPropagation();open(target)}},true);
}
const style=el('style');style.textContent=`
#medicineSheet .qm-progress-action{display:grid;place-items:center;width:48px;height:48px;min-width:48px;min-height:48px;padding:11px;border-radius:17px;border:1px solid var(--border);background:var(--surface);color:var(--primary);margin-inline-start:auto;box-shadow:0 4px 12px #00000010}
#medicineSheet .qm-progress-action svg{width:24px;height:24px}#medicineSheet .qm-progress-action[aria-expanded=true]{background:var(--primary);color:var(--surface)}#medicineSheet .qm-progress-action:focus-visible{outline:2px solid var(--primary);outline-offset:3px}
#medicineSheet .qm-dashboard[hidden],#medicineSheet .qm-strength-group [hidden],.qm-name-wrap [hidden],.qc-choice-dialog [hidden]{display:none!important}
#medicineSheet .qm-strength-group{min-width:0;padding:14px;border:1px solid var(--border);border-radius:16px;margin:14px 0}#medicineSheet .qm-strength-group legend{padding-inline:8px;font-size:14px}#medicineSheet .qm-strength-group label{display:block;margin-bottom:12px}#medicineSheet .qm-strength-group .qm-muted{font-size:12px;line-height:1.8;margin-bottom:0}
.qm-name-wrap{position:relative;isolation:isolate}.qm-name-ghost{position:absolute;box-sizing:border-box;white-space:pre;overflow:hidden;pointer-events:none;border-style:solid;border-color:transparent;color:var(--text)}.qm-name-tail{opacity:.45;pointer-events:auto;cursor:pointer}.qm-name-options{position:relative;z-index:2;max-height:280px;overflow:auto;margin-top:6px;padding:6px;border:1px solid var(--border);border-radius:18px;background:var(--surface);box-shadow:0 12px 32px #0003}.qm-name-options button{display:block;width:100%;min-height:48px;text-align:start;padding:12px!important;border:0!important;border-radius:12px!important;white-space:normal;overflow-wrap:anywhere;background:transparent!important;color:var(--text)!important}.qm-name-options button:focus-visible,.qm-name-options button:hover{outline:2px solid var(--primary);outline-offset:-2px}.qm-name-options small{display:block;padding:6px 10px;font-size:11px;color:var(--text-dim)}.qm-visually-hidden{position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip-path:inset(50%);white-space:nowrap}
.qc-choice-dialog{position:fixed!important;inset:0!important;margin:0!important;max-width:none!important;max-height:none!important;width:100%!important;height:100%!important;box-sizing:border-box!important;padding:16px!important;padding-bottom:max(16px,env(safe-area-inset-bottom))!important;border:0!important;background:#0007!important;color:var(--text,#eef7f2)!important;font:inherit;z-index:20000!important;backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}.qc-choice-dialog[open]{display:flex!important;align-items:flex-end;justify-content:center}.qc-choice-dialog::backdrop{background:transparent}.qc-choice-card{box-sizing:border-box;width:100%;max-width:520px;max-height:82dvh;overflow:auto;padding:20px;border-radius:28px;background:var(--surface,#15251f);border:1px solid var(--border,#ffffff22);box-shadow:0 24px 80px #0006}.qc-choice-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}.qc-choice-head h3{font:inherit;font-size:19px;font-weight:700;margin:0!important}.qc-choice-head button{background:transparent!important;color:var(--primary,#8bdab8)!important;border:1px solid var(--border,#ffffff22)!important;border-radius:14px!important;min-height:44px;padding:8px 14px!important;font:inherit}.qc-choice-card input{width:100%;box-sizing:border-box;min-height:48px;border:1px solid var(--border,#ffffff22);border-radius:14px;background:var(--bg,#0d1914);color:inherit;font:inherit;padding:12px;margin-bottom:12px}.qc-choice-list{display:grid;gap:8px}.qc-choice-row{display:flex!important;align-items:center;justify-content:space-between;gap:16px;width:100%;min-height:54px;padding:13px 14px!important;border-radius:16px!important;background:var(--bg,#0d1914)!important;color:var(--text,#eef7f2)!important;border:1px solid var(--border,#ffffff22)!important;font:inherit!important;text-align:start}.qc-choice-row[aria-pressed=true]{border-color:var(--primary,#8bdab8)!important}.qc-choice-mark{display:grid;place-items:center;width:24px;height:24px;flex-shrink:0;border-radius:50%;border:1px solid var(--border,#ffffff44);color:var(--primary,#8bdab8)}.qc-choice-row[aria-pressed=true] .qc-choice-mark{border-color:currentColor}.qc-choice-row:disabled{opacity:.45}.qc-choice-dialog :focus-visible{outline:2px solid var(--primary,#8bdab8)!important;outline-offset:2px}
@media(min-width:640px){.qc-choice-dialog[open]{align-items:center}}
`;document.head.append(style);
function ready(){start();installChoices()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});else ready();
})();
