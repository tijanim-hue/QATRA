(() => {
'use strict';
if(window.QatraMedicineDeletionUI)return;window.QatraMedicineDeletionUI=true;
const bridge=name=>window.Capacitor?.Plugins?.[name]||window.Capacitor?.registerPlugin?.(name);
const selected=new Set();let locked=false;
function ask(root,count){return new Promise(resolve=>{
 const d=document.createElement('dialog');d.className='qm-confirm';d.dir='rtl';d.setAttribute('aria-labelledby','qmDeleteHeading');
 const h=document.createElement('h2');h.id='qmDeleteHeading';h.textContent='حذف '+count+' من الأدوية؟';
 const p=document.createElement('p');p.textContent='ستُحذف الأدوية وجرعاتها غير المتناولة وصورها. يبقى سجل الجرعات المتناولة. لا يمكن التراجع.';
 const no=document.createElement('button');no.type='button';no.textContent='إلغاء';
 const yes=document.createElement('button');yes.type='button';yes.textContent='تأكيد الحذف';
 let done=false;const finish=value=>{if(done)return;done=true;if(d.open)d.close();d.remove();resolve(value)};
 no.onclick=()=>finish(false);yes.onclick=()=>finish(true);d.oncancel=e=>{e.preventDefault();finish(false)};d.onclose=()=>finish(false);d.onkeydown=e=>e.stopPropagation();
 d.append(h,p,no,yes);root.append(d);try{d.showModal();no.focus()}catch(_){finish(false)}
})}
async function encode(file){
 if(!file.type.startsWith('image/')||file.size>15000000)throw Error('image');
 const url=URL.createObjectURL(file);
 try{const im=new Image();await new Promise((ok,no)=>{im.onload=ok;im.onerror=no;im.src=url});if(!im.naturalWidth||im.naturalWidth*im.naturalHeight>50000000)throw Error('dimensions');
 const scale=Math.min(1,1024/Math.max(im.naturalWidth,im.naturalHeight)),c=document.createElement('canvas');c.width=Math.max(1,Math.round(im.naturalWidth*scale));c.height=Math.max(1,Math.round(im.naturalHeight*scale));const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);const data=c.toDataURL('image/jpeg',.85).split(',')[1];if(!data||data.length>2000000)throw Error('size');return data;
 }finally{URL.revokeObjectURL(url)}
}
function start(){
 const root=document.getElementById('medicineSheet'),list=document.getElementById('qmMedicines'),form=document.getElementById('qmForm');if(!root||!list||!form)return;
 const say=t=>{root.querySelector('#qmStatus').textContent=t};
 const bar=document.createElement('div');bar.className='qm-bulk';bar.setAttribute('role','group');bar.setAttribute('aria-label','تحديد الأدوية');
 const count=document.createElement('span');count.setAttribute('aria-live','polite');
 function button(text,fn){const b=document.createElement('button');b.type='button';b.textContent=text;b.onclick=fn;return b}
 const cards=()=>[...list.querySelectorAll('[data-medicine-id]')].filter(c=>!c.hidden);
 function paint(){const ids=new Set(cards().map(c=>c.dataset.medicineId));for(const id of selected)if(!ids.has(id))selected.delete(id);for(const c of cards()){const on=selected.has(c.dataset.medicineId);c.classList.toggle('qm-selected',on);const cb=c.querySelector('.qm-select');if(cb)cb.checked=on}count.textContent='المحدد: '+selected.size;del.disabled=locked||!selected.size;all.disabled=clear.disabled=locked}
 async function remove(ids){if(locked||!ids.length)return;locked=true;paint();try{
  if(!await ask(root,ids.length))return;
  const plugin=bridge('QatraMedicineDeletion');if(!plugin)throw Error('bridge');const result=await plugin.deleteMedicines({ids});
  if(result.deleted!==true||!Array.isArray(result.ids)||result.ids.length!==ids.length||!ids.every(id=>result.ids.includes(id)))throw Error('unconfirmed');
  for(const c of list.querySelectorAll('[data-medicine-id]'))if(ids.includes(c.dataset.medicineId))c.remove();
  ids.forEach(id=>selected.delete(id));
  const doses=await bridge('QatraMedicine').listTodayDoses();
  const remaining=new Set((doses.doses||[]).map(d=>d.id));
  for(const b of root.querySelectorAll('[data-take]'))if(!remaining.has(b.dataset.take))b.closest('article')?.remove();
  say(result.cleanupWarning?'حُذفت الأدوية وحُفظ السجل، لكن تنظيف بعض التنبيهات أو الصور لم يكتمل.':'تم حذف الأدوية المحددة مع حفظ سجل الجرعات المتناولة.');
 }catch(_){say('تعذر إكمال الحذف أو التحقق من العرض. أعد فتح القسم للتحقق قبل المحاولة مجددًا.')}finally{locked=false;paint()}}
 const all=button('تحديد الكل',()=>{cards().forEach(c=>selected.add(c.dataset.medicineId));paint()}),clear=button('إلغاء التحديد',()=>{selected.clear();paint()}),del=button('حذف المحدد',()=>remove([...selected]));bar.append(count,all,clear,del);list.before(bar);
 function scan(){for(const c of cards()){
  if(c.dataset.bulkReady)continue;c.dataset.bulkReady='true';
  const label=document.createElement('label');label.className='qm-select-label';const cb=document.createElement('input');cb.type='checkbox';cb.className='qm-select';cb.setAttribute('aria-label','تحديد '+(c.querySelector('h3')?.textContent||'الدواء'));label.append(cb,document.createTextNode('تحديد'));c.prepend(label);
  const toggle=()=>{if(locked)return;const id=c.dataset.medicineId;selected.has(id)?selected.delete(id):selected.add(id);paint()};cb.onchange=toggle;
  c.addEventListener('click',e=>{if(e.target.closest('button,input,label,a,select,textarea'))return;toggle()});
  const b=button('حذف الدواء',()=>remove([c.dataset.medicineId]));b.className='qm-delete';c.append(b);
 }paint()}
 new MutationObserver(scan).observe(list,{childList:true});scan();
 const photo=document.createElement('label');photo.textContent='صورة الدواء — اختيارية';const input=document.createElement('input');input.type='file';input.accept='image/*';
 const preview=document.createElement('img');preview.alt='معاينة صورة الدواء';preview.className='qm-draft-photo';preview.hidden=true;
 let draft=null,encoding=null,version=0;const erase=button('إزالة الصورة',()=>{version++;draft=null;input.value='';preview.hidden=true;preview.removeAttribute('src')});
 photo.append(input,preview,erase);form.querySelector('[type=submit]').before(photo);
 input.onchange=()=>{const file=input.files?.[0],v=++version;draft=null;if(!file)return;encoding=(async()=>{try{const data=await encode(file);if(v!==version)return;draft=data;preview.src='data:image/jpeg;base64,'+data;preview.hidden=false}catch(_){if(v===version){preview.hidden=true;say('تعذر تجهيز الصورة. اختر صورة أصغر.')}}})();};
 form.addEventListener('reset',()=>{version++;draft=null;preview.hidden=true;preview.removeAttribute('src')});
 window.QatraMedicineCreationPhoto=Object.freeze({save:async id=>{if(encoding)await encoding;if(!draft)return;try{const r=await bridge('QatraMedicineImages').saveImage({id,data:draft});if(r.saved!==true)throw Error('save')}catch(_){root.dataset.photoWarning='true';setTimeout(()=>say('حُفظ الدواء، لكن لم تُحفظ الصورة. أضف الصورة من بطاقته دون إضافة الدواء مرة أخرى.'),0)}}});
 const arrow='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5 4 10l5 5M4 10h9a6 6 0 0 1 0 12"/></svg>';
 for(const [section,back] of [[root,root.querySelector('[data-close]')],[document.getElementById('notebookSheet'),document.getElementById('closeNotebookSheet')]]){
  if(!section||!back)continue;let head=back.closest('header');if(!head){const h=section.querySelector('h2');if(!h)continue;head=document.createElement('header');h.before(head);head.append(h,back)}head.classList.add('qm-section-head');back.innerHTML=arrow;back.classList.add('qm-curved-back');back.setAttribute('aria-label','رجوع');
 }
}
const s=document.createElement('style');s.textContent=`
#medicineSheet .qm-selected{outline:2px solid var(--primary);outline-offset:-2px}#medicineSheet .qm-select-label{display:flex;gap:8px;align-items:center;margin:0 0 8px}#medicineSheet input.qm-select{width:22px;height:22px;margin:0;accent-color:var(--primary)}.qm-bulk{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:12px}.qm-draft-photo{display:block;width:96px;height:96px;object-fit:cover;border-radius:14px}.qm-draft-photo[hidden]{display:none}.qm-confirm{width:min(420px,calc(100% - 32px));box-sizing:border-box;border:1px solid var(--border);border-radius:24px;background:var(--surface);color:var(--text);font:inherit;padding:24px}.qm-confirm p{line-height:1.9}.qm-confirm::backdrop{background:#0008}.qm-confirm button{margin:6px;min-height:48px}.qm-section-head{display:flex;align-items:center;justify-content:space-between;gap:16px;background:var(--surface);color:var(--text);padding:calc(14px + env(safe-area-inset-top,0px)) 20px 14px;border-bottom:1px solid var(--border)}.qm-section-head h2{margin:0;font-size:21px}.qm-curved-back{width:48px;height:48px;border-radius:16px;background:var(--bg);color:var(--primary);border:1px solid var(--border);display:grid;place-items:center}.qm-curved-back svg{width:25px;height:25px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
`;document.head.append(s);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
