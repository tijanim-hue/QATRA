from pathlib import Path

root=Path(__file__).resolve().parents[1]
activity=root/'android/app/src/main/java/com/qatra/app/MainActivity.java'
html=root/'public/index.html'
a=activity.read_text(encoding='utf-8')
registration='registerPlugin(QatraMedicineDeletionPlugin.class);'
if registration not in a:
    anchor='registerPlugin(QatraMedicineImagesPlugin.class);'
    if a.count(anchor)!=1:
        raise SystemExit('Medicine image registration is ambiguous')
    a=a.replace(anchor,anchor+'\n        '+registration,1)
h=html.read_text(encoding='utf-8')
script='<script defer src="qatra-medicine-deletion.js"></script>'
if script not in h:
    if h.count('</head>')!=1:
        raise SystemExit('Invalid HTML head')
    h=h.replace('</head>',script+'\n</head>',1)
ui=r'''
(() => {
'use strict';
if(window.QatraMedicineDeletionUI)return;
window.QatraMedicineDeletionUI=true;
const icon='<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 5 4 10l5 5M4 10h9a6 6 0 0 1 0 12"/></svg>';
function header(section,back,title){
 if(!section||!back||back.dataset.qatraBack)return;
 let bar=back.closest('header');
 if(!bar||!section.contains(bar)){
  bar=document.createElement('header');
  const heading=section.querySelector('h2');
  if(!heading)return;
  const parent=heading.parentNode;
  parent.insertBefore(bar,heading);bar.append(heading,back);
 }
 bar.classList.add('qatra-section-bar');
 back.dataset.qatraBack='true';back.classList.add('qatra-curved-back');
 back.setAttribute('aria-label','رجوع');back.title='رجوع';back.innerHTML=icon;
}
function confirmDelete(root,name){
 return new Promise(resolve=>{
  const dialog=document.createElement('dialog');dialog.className='qatra-delete-dialog';dialog.dir='rtl';
  dialog.setAttribute('aria-labelledby','qatraDeleteTitle');
  const title=document.createElement('h2');title.id='qatraDeleteTitle';title.textContent='حذف الدواء؟';
  const copy=document.createElement('p');copy.textContent='هل تريد حذف '+name+'؟ لا يتم الحذف إلا بعد التأكيد.';
  const row=document.createElement('div');row.className='qatra-delete-actions';
  const cancel=document.createElement('button');cancel.type='button';cancel.textContent='إلغاء';
  const accept=document.createElement('button');accept.type='button';accept.textContent='حذف الدواء';accept.className='qatra-confirm-delete';
  row.append(cancel,accept);dialog.append(title,copy,row);root.append(dialog);
  let finished=false;
  function finish(value){if(finished)return;finished=true;if(dialog.open)dialog.close();dialog.remove();resolve(value);}
  cancel.onclick=()=>finish(false);accept.onclick=()=>finish(true);
  dialog.addEventListener('cancel',event=>{event.preventDefault();finish(false);});
  dialog.addEventListener('close',()=>finish(false));
  dialog.addEventListener('keydown',event=>event.stopPropagation());
  try{dialog.showModal();cancel.focus();}catch(_){finish(false);}
 });
}
function start(){
 const root=document.getElementById('medicineSheet'),container=document.getElementById('qmMedicines');
 if(!root||!container)return;
 header(root,root.querySelector('[data-close]'),'قطرة دواء');
 header(document.getElementById('notebookSheet'),document.getElementById('closeNotebookSheet'),'دفتر قطرة');
 let plugin,confirming=false;
 const say=text=>{root.querySelector('#qmStatus').textContent=text;};
 function scan(){for(const card of container.querySelectorAll('[data-medicine-id]')){
  if(card.dataset.deleteReady)continue;card.dataset.deleteReady='true';
  const id=card.dataset.medicineId;
  const name=card.querySelector('h3,.card-title')?.textContent?.trim()||'هذا الدواء';
  const button=document.createElement('button');button.type='button';button.className='qm-delete';button.textContent='حذف الدواء';
  button.addEventListener('click',async()=>{
   if(button.disabled||confirming)return;
   confirming=true;
   try{
    const accepted=await confirmDelete(root,name);
    if(!accepted)return;
    button.disabled=true;button.textContent='جارٍ الحذف…';
    const cap=window.Capacitor;plugin=plugin||cap?.Plugins?.QatraMedicineDeletion||cap?.registerPlugin?.('QatraMedicineDeletion');
    if(!plugin)throw Error('bridge');
    const result=await plugin.deleteMedicine({id});if(result.deleted!==true)throw Error('delete');
    card.remove();say('تم حذف '+name+'.');
   }catch(_){say('تعذر حذف الدواء. لم يُحذف من القائمة؛ حاول مجددًا بعد التحقق.');}
   finally{confirming=false;if(button.isConnected){button.disabled=false;button.textContent='حذف الدواء';button.focus();}}
  });card.append(button);
 }}
 new MutationObserver(scan).observe(container,{childList:true});scan();
}
const style=document.createElement('style');style.textContent=`
#medicineSheet .qm-delete{margin-top:10px;width:100%;border:1px solid #f8717166;background:#f871711a;color:var(--text);border-radius:12px;padding:10px 14px;font:inherit;min-height:48px}
#medicineSheet .qm-delete:disabled{opacity:.55}
.qatra-section-bar,#medicineSheet header.qatra-section-bar{display:flex;flex-direction:row;align-items:center;justify-content:space-between;gap:16px;padding:calc(14px + env(safe-area-inset-top,0px)) 20px 14px;border-bottom:1px solid var(--border);background:var(--surface);color:var(--text);flex-shrink:0;box-shadow:0 4px 18px #0000000a}
.qatra-section-bar h2{margin:0;font-size:21px;line-height:1.5;font-weight:800}
.qatra-section-bar .qatra-curved-back,#medicineSheet .qatra-curved-back{display:grid;place-items:center;flex-shrink:0;width:48px;height:48px;min-height:48px;padding:11px;border-radius:16px;border:1px solid var(--border);background:var(--bg);color:var(--primary);cursor:pointer}
.qatra-curved-back svg{display:block;width:25px;height:25px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.qatra-curved-back:active{transform:scale(.96)}
.qatra-delete-dialog{box-sizing:border-box;width:min(420px,calc(100% - 32px));max-height:80dvh;overflow:auto;border:1px solid var(--border);border-radius:24px;padding:24px;background:var(--surface);color:var(--text);font-family:inherit;box-shadow:0 24px 70px #0006}
.qatra-delete-dialog::backdrop{background:#0008;backdrop-filter:blur(6px)}
.qatra-delete-dialog h2{margin:0 0 12px;font-size:21px}.qatra-delete-dialog p{line-height:1.9;margin:0 0 20px}
.qatra-delete-actions{display:flex;gap:12px}.qatra-delete-actions button{flex:1;min-height:48px;font:inherit;border:1px solid var(--border);border-radius:14px;background:var(--bg);color:var(--text);cursor:pointer}
.qatra-delete-actions .qatra-confirm-delete{background:#b91c1c;color:white;border-color:#b91c1c}
.qatra-curved-back:focus-visible,.qatra-delete-actions button:focus-visible{outline:2px solid var(--primary);outline-offset:3px}
@media(prefers-reduced-motion:reduce){.qatra-curved-back:active{transform:none}}
`;document.head.append(style);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
'''
(root/'public/qatra-medicine-deletion.js').write_text(ui,encoding='utf-8')
activity.write_text(a,encoding='utf-8')
html.write_text(h,encoding='utf-8')
