/* qatra-medicine-polish-v1 */
(() => {
'use strict';
function start(){
 const root=document.getElementById('medicineSheet'),list=document.getElementById('qmMedicines'),status=document.getElementById('qmStatus');if(!root||!list||!status)return;
 let toast,timer,frame;
 function hide(){clearTimeout(timer);toast?.remove();toast=null}
 function notice(text){hide();toast=document.createElement('div');toast.className='qm-success-toast';toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');
 const copy=document.createElement('span');copy.textContent=text;
 const close=document.createElement('button');close.type='button';close.textContent='إغلاق';close.setAttribute('aria-label','إغلاق رسالة النجاح');close.onclick=hide;
 toast.append(copy,close);root.append(toast);
 const schedule=()=>{clearTimeout(timer);timer=setTimeout(hide,4500)};
 toast.addEventListener('pointerenter',()=>clearTimeout(timer));toast.addEventListener('pointerleave',schedule);toast.addEventListener('focusin',()=>clearTimeout(timer));toast.addEventListener('focusout',schedule);schedule();
 }
 function readStatus(){const text=status.textContent.trim();if(/^(تم حفظ الدواء وإنشاء|تم حذف الأدوية المحددة مع حفظ سجل الجرعات المتناولة)/.test(text)){status.textContent='';notice(text)}}
 new MutationObserver(readStatus).observe(status,{childList:true,subtree:true,characterData:true});readStatus();
 function sync(){frame=null;root.classList.toggle('qm-selection-mode',!!list.querySelector('.qm-selected'));}
 new MutationObserver(()=>{if(!frame)frame=requestAnimationFrame(sync)}).observe(list,{subtree:true,childList:true,attributes:true,attributeFilter:['class']});sync();
 new MutationObserver(()=>{if(root.hidden)hide()}).observe(root,{attributes:true,attributeFilter:['hidden']});
}
const style=document.createElement('style');style.textContent=`
#medicineSheet .qm-bulk{display:none!important}
#medicineSheet.qm-selection-mode .qm-bulk{display:flex!important;align-items:center;gap:8px;padding:12px;border-radius:18px;border:1px solid var(--border);background:var(--surface)}
#medicineSheet #qmMedicines .qm-select-label{position:absolute!important;width:1px!important;height:1px!important;padding:0!important;margin:-1px!important;overflow:hidden!important;clip-path:inset(50%);white-space:nowrap;border:0}
#medicineSheet #qmMedicines .qm-delete{display:none!important}
#medicineSheet #qmMedicines>.qm-panel{cursor:pointer;transition:transform .16s ease,box-shadow .2s ease,background .2s ease;position:relative}
#medicineSheet #qmMedicines>.qm-panel:active{transform:scale(.985)}
#medicineSheet #qmMedicines>.qm-selected{outline:2px solid var(--primary);outline-offset:-2px;box-shadow:inset 4px 0 var(--primary),var(--shadow);background:var(--surface);background:color-mix(in srgb,var(--primary) 12%,var(--surface))}
#medicineSheet #qmMedicines>.qm-panel:focus-within{outline:2px solid var(--primary);outline-offset:2px}
#medicineSheet #qmStatus:empty{display:none}
#medicineSheet .qm-success-toast{position:fixed;z-index:7400;bottom:calc(20px + env(safe-area-inset-bottom,0px));inset-inline:16px;margin-inline:auto;max-width:480px;box-sizing:border-box;display:flex;align-items:center;gap:14px;padding:14px 16px;background:var(--surface);color:var(--text);border:1px solid var(--primary);border-radius:20px;box-shadow:0 12px 40px #0004;line-height:1.8;font-size:14px}
#medicineSheet .qm-success-toast span{flex:1}#medicineSheet .qm-success-toast button{flex-shrink:0;min-height:44px;color:var(--primary);background:transparent}
#medicineSheet header.qm-section-head,#notebookSheet .qm-section-head{position:sticky;top:0;z-index:5;isolation:isolate;overflow:hidden;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:calc(14px + env(safe-area-inset-top,0px)) 20px 16px!important;border-bottom:1px solid var(--border);background:var(--surface);background:linear-gradient(120deg,color-mix(in srgb,var(--primary) 13%,var(--surface)),var(--surface) 70%);box-shadow:0 5px 22px #00000012}
#medicineSheet header.qm-section-head::after,#notebookSheet .qm-section-head::after{content:'';position:absolute;bottom:0;inset-inline:20px;height:2px;border-radius:2px;background:linear-gradient(90deg,transparent,var(--primary),transparent);opacity:.6;pointer-events:none}
#medicineSheet .qm-section-head h2,#notebookSheet .qm-section-head h2{font-size:22px!important;font-weight:800;margin:0!important;line-height:1.5;letter-spacing:-.3px;color:var(--text)}
#medicineSheet .qm-curved-back,#notebookSheet .qm-curved-back{width:48px!important;height:48px!important;min-height:48px!important;flex-shrink:0;padding:11px!important;border-radius:17px!important;border:1px solid var(--border)!important;background:var(--surface)!important;color:var(--primary)!important;box-shadow:inset 0 1px 0 #ffffff22,0 4px 12px #00000010;display:grid!important;place-items:center;cursor:pointer}
#medicineSheet .qm-curved-back:focus-visible,#notebookSheet .qm-curved-back:focus-visible{outline:2px solid var(--primary);outline-offset:3px}
@media(prefers-reduced-motion:reduce){#medicineSheet #qmMedicines>.qm-panel{transition:none}#medicineSheet #qmMedicines>.qm-panel:active{transform:none}}
`;document.head.append(style);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
