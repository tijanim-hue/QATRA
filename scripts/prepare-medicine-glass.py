from pathlib import Path

root=Path(__file__).resolve().parents[1]
java=root/'android/app/src/main/java/com/qatra/app'
activity=java/'MainActivity.java'
html=root/'public/index.html'
a=activity.read_text(encoding='utf-8')
h=html.read_text(encoding='utf-8')
def once(text,before,after):
    if text.count(before)!=1:
        raise SystemExit('Ambiguous medicine glass anchor: '+before[:80])
    return text.replace(before,after,1)
if 'content.background=image;content.clipToOutline=true' not in a:
    a=once(a,'content.background=image;content.clipToOutline=true','content.background=image;content.clipToOutline=true')
if 'registerPlugin(QatraMedicineGlassPlugin.class);' not in a:
    a=once(a,'registerPlugin(QatraMedicineImagesPlugin.class);','registerPlugin(QatraMedicineImagesPlugin.class);\n        registerPlugin(QatraMedicineGlassPlugin.class);')
if 'src="qatra-medicine-glass.js"' in h:
    raise SystemExit('Duplicate medicine glass script.')
h=once(h,'</head>','<script defer src="qatra-medicine-glass.js"></script>\n</head>')
ui=r'''
(() => {
'use strict';
if(window.QatraMedicineGlassUI)return;
window.QatraMedicineGlassUI=true;
let plugin;
async function native(method,data){
 const cap=window.Capacitor;plugin=plugin||cap?.Plugins?.QatraMedicineGlass||cap?.registerPlugin?.('QatraMedicineGlass');
 if(!plugin)throw Error('bridge');return plugin[method](data);
}
function start(){
 const root=document.getElementById('medicineSheet'),container=document.getElementById('qmMedicines');if(!root||!container)return;
 const say=text=>{root.querySelector('#qmStatus').textContent=text;};
 const style=document.createElement('style');style.textContent='#medicineSheet .qm-glass{margin-top:10px;width:100%;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);color:#fff;border-radius:16px;padding:10px 14px;font:inherit;cursor:pointer}#medicineSheet .qm-glass:disabled{opacity:.55;cursor:default}';document.head.appendChild(style);
 function scan(){for(const card of container.querySelectorAll('[data-medicine-id]')){
  if(card.dataset.glassReady)continue;card.dataset.glassReady='true';
  const id=card.dataset.medicineId;
  const name=card.querySelector('.card-title')?.textContent?.trim()||'هذا الدواء';
  const button=document.createElement('button');button.type='button';button.className='qm-glass';button.textContent='تصميم زجاجي';
  button.addEventListener('click',async()=>{
   if(button.disabled)return;
   if(!window.confirm('تطبيق التصميم الزجاجي على '+name+'؟'))return;
   button.disabled=true;button.textContent='جارٍ التطبيق…';
   try{const result=await native('applyGlass',{id});if(result.applied!==true)throw Error('glass');
    card.classList.add('glass');say('تم تطبيق التصميم الزجاجي على '+name+'.');
   }catch(_){button.disabled=false;button.textContent='تصميم زجاجي';say('تعذر تطبيق التصميم الزجاجي. أعد فتح القسم وحاول مرة أخرى.');}
  });
  card.append(button);
 }}
 new MutationObserver(scan).observe(container,{childList:true});scan();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
'''
(root/'public/qatra-medicine-glass.js').write_text(ui,encoding='utf-8')
activity.write_text(a,encoding='utf-8')
html.write_text(h,encoding='utf-8')
