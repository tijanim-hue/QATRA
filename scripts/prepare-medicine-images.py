from pathlib import Path

root=Path(__file__).resolve().parents[1]
java=root/'android/app/src/main/java/com/qatra/app'
activity=java/'MainActivity.java'
service=java/'QatraMedicineOverlayService.kt'
html=root/'public/index.html'
a=activity.read_text(encoding='utf-8')
s=service.read_text(encoding='utf-8')
h=html.read_text(encoding='utf-8')
def once(text,before,after):
    if text.count(before)!=1:
        raise SystemExit('Ambiguous medicine photo anchor: '+before[:80])
    return text.replace(before,after,1)
a=once(a,'registerPlugin(QatraMedicineAlertsPlugin.class);','registerPlugin(QatraMedicineAlertsPlugin.class);\n        registerPlugin(QatraMedicineImagesPlugin.class);')
anchor='                root.post{if(scene===root)root.start()}'
s=once(s,anchor,anchor+'''
                Thread({
                    val image=try{QatraMedicineImages.backgroundForDose(applicationContext,id)}catch(_:Exception){null}
                    handler.post{
                        if(activeId==id&&scene===root&&image!=null){content.background=image;content.clipToOutline=true}
                    }
                },"qatra-medicine-image").start()
''')
if 'src="qatra-medicine-images.js"' in h:
    raise SystemExit('Duplicate medicine photo script.')
h=once(h,'</head>','<script defer src="qatra-medicine-images.js"></script>\n</head>')
ui=r'''
(() => {
'use strict';
if(window.QatraMedicineImagesUI)return;
window.QatraMedicineImagesUI=true;
let plugin;
async function native(method,data){
 const cap=window.Capacitor;plugin=plugin||cap?.Plugins?.QatraMedicineImages||cap?.registerPlugin?.('QatraMedicineImages');
 if(!plugin)throw Error('bridge');return plugin[method](data);
}
async function encode(file){
 if(!file.type.startsWith('image/')||file.size>15000000)throw Error('image');
 const url=URL.createObjectURL(file);
 try{
  const image=new Image();await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=reject;image.src=url;});
  if(!image.naturalWidth||!image.naturalHeight||image.naturalWidth*image.naturalHeight>50000000)throw Error('dimensions');
  const scale=Math.min(1,1024/Math.max(image.naturalWidth,image.naturalHeight));
  const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
  const context=canvas.getContext('2d');if(!context)throw Error('canvas');
  context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(image,0,0,canvas.width,canvas.height);
  const data=canvas.toDataURL('image/jpeg',.85).split(',')[1];if(!data||data.length>2000000)throw Error('size');return data;
 }finally{URL.revokeObjectURL(url);}
}
function start(){
 const root=document.getElementById('medicineSheet'),container=document.getElementById('qmMedicines');if(!root||!container)return;
 const say=text=>{root.querySelector('#qmStatus').textContent=text;};
 const style=document.createElement('style');style.textContent='#medicineSheet .qm-photo-tools{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:14px}#medicineSheet .qm-photo{width:76px;height:76px;object-fit:cover;border-radius:20px;border:1px solid var(--border)}#medicineSheet [data-photo-ready]{position:relative;box-shadow:var(--shadow);border-radius:26px}';document.head.appendChild(style);
 function scan(){for(const card of container.querySelectorAll('[data-medicine-id]')){
  if(card.dataset.photoReady)continue;card.dataset.photoReady='true';
  const id=card.dataset.medicineId;let busy=false;
  const row=document.createElement('div');row.className='qm-photo-tools';
  const image=document.createElement('img');image.className='qm-photo';image.alt='صورة الدواء';image.hidden=true;
  const input=document.createElement('input');input.type='file';input.accept='image/*';input.hidden=true;input.style.display='none';
  const choose=document.createElement('button');choose.type='button';choose.textContent='إضافة صورة';
  const remove=document.createElement('button');remove.type='button';remove.textContent='إزالة الصورة';remove.hidden=true;
  row.append(image,choose,remove,input);card.prepend(row);
  async function refresh(){const result=await native('getImage',{id});if(!card.isConnected)return;
   if(result.image){image.src='data:image/jpeg;base64,'+result.image;image.hidden=false;remove.hidden=false;choose.textContent='استبدال الصورة';}
   else{image.removeAttribute('src');image.hidden=true;remove.hidden=true;choose.textContent='إضافة صورة';}
  }
  function lock(value){busy=value;choose.disabled=value;remove.disabled=value;}
  choose.addEventListener('click',()=>{if(!busy)input.click();});
  input.addEventListener('change',async()=>{
   const file=input.files?.[0];input.value='';if(!file||busy)return;lock(true);
   try{const data=await encode(file);const result=await native('saveImage',{id,data});if(result.saved!==true)throw Error('save');await refresh();say('تم حفظ صورة الدواء على الجهاز. ستظهر خلف بطاقة الجرعة القادمة.');}
   catch(_){say('تعذر تأكيد حفظ الصورة. أعد فتح القسم للتحقق، أو اختر صورة أصغر.');}finally{lock(false);}
  });
  remove.addEventListener('click',async()=>{
   if(busy||!window.confirm('إزالة صورة هذا الدواء؟ لن يتغير الدواء أو سجل الجرعات.'))return;lock(true);
   try{const result=await native('removeImage',{id});if(result.removed!==true)throw Error('remove');await refresh();say('تمت إزالة الصورة.');}
   catch(_){say('تعذر تأكيد إزالة الصورة. أعد فتح القسم للتحقق.');}finally{lock(false);}
  });
  refresh().catch(()=>say('تعذر قراءة صورة الدواء. أعد فتح القسم للمحاولة.'));
 }}
 new MutationObserver(scan).observe(container,{childList:true});scan();
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
'''
(root/'public/qatra-medicine-images.js').write_text(ui,encoding='utf-8')
activity.write_text(a,encoding='utf-8')
service.write_text(s,encoding='utf-8')
html.write_text(h,encoding='utf-8')
