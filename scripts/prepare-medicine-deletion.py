from pathlib import Path

root=Path(__file__).resolve().parents[1]
java=root/'android/app/src/main/java/com/qatra/app'
activity=java/'MainActivity.java'
html=root/'public/index.html'
a=activity.read_text(encoding='utf-8')
h=html.read_text(encoding='utf-8')
def once(text,before,after):
    if text.count(before)!=1:
        raise SystemExit('Ambiguous medicine deletion anchor: '+before[:80])
    return text.replace(before,after,1)
a=once(a,'registerPlugin(QatraMedicineImagesPlugin.class);','registerPlugin(QatraMedicineImagesPlugin.class);\n        registerPlugin(QatraMedicineDeletionPlugin.class);')
if 'src="qatra-medicine-deletion.js"' in h:
    raise SystemExit('Duplicate medicine deletion script.')
h=once(h,'</head>','<script defer src="qatra-medicine-deletion.js"></script>\n</head>')
ui=r'''
(() => {
'use strict';
if(window.QatraMedicineDeletionUI)return;
window.QatraMedicineDeletionUI=true;
let plugin;
async function native(method,data){
 const cap=window.Capacitor;plugin=plugin||cap?.Plugins?.QatraMedicineDeletion||cap?.registerPlugin?.('QatraMedicineDeletion');
 if(!plugin)throw Error('bridge');return plugin[method](data);
}
function start(){
 const root=document.getElementById('medicineSheet'),container=document.getElementById('qmMedicines');if(!root||!container)return;
 const say=text=>{root.querySelector('#qmStatus').textContent=text;};
 const style=document.createElement('style');style.textContent='#medicineSheet .qm-delete{margin-top:10px;width:100%;border:1px solid rgba(248,113,113,.45);background:rgba(248,113,113,.10);color:#fecaca;border-radius:16px;padding:10px 14px;font:inherit;cursor:pointer}#medicineSheet .qm-delete:disabled{opacity:.55;cursor:default}';document.head.appendChild(style);
 function scan(){for(const card of container.querySelectorAll('[data-medicine-id]')){
  if(card.dataset.deleteReady)continue;card.dataset.deleteReady='true';
  const id=card.dataset.medicineId;
  const name=card.querySelector('.card-title')?.textContent?.trim()||'هذا الدواء';
  const button=document.createElement('button');button.type='button';button.className='qm-delete';button.textContent='حذف الدواء';
  button.addEventListener('click',async()=>{
   if(button.disabled)return;
   if(!window.confirm('حذف '+name+'؟ سيتم إيقاف تنبيهاته القادمة وحذف جرعاته غير المتخذة وصورته. ستبقى الجرعات التي تم تأكيد تناولها في السجل.'))return;
   button.disabled=true;button.textContent='جارٍ الحذف…';
   try{const result=await native('deleteMedicine',{id});if(result.deleted!==true)throw Error('delete');
    card.remove();say('تم حذف '+name+' وإيقاف تنبيهاته القادمة. بقي سجل الجرعات المتخذة.');
   }catch(_){button.disabled=false;button.textContent='حذف الدواء';say('تعذر تأكيد الحذف. أعد فتح القسم وحاول مرة أخرى.');}
  });
  card.append(button);
 }}
 new MutationObserver(scan).observe(container,{childList:true});scan();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
'''
(root/'public/qatra-medicine-deletion.js').write_text(ui,encoding='utf-8')
activity.write_text(a,encoding='utf-8')
html.write_text(h,encoding='utf-8')
