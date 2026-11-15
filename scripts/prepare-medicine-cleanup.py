from pathlib import Path
import re

root=Path(__file__).resolve().parents[1]
js_path=root/'public/qatra-medicine.js'
management_path=root/'public/qatra-medicine-management.js'
css_path=root/'public/qatra-medicine.css'
js=js_path.read_text(encoding='utf-8')
management=management_path.read_text(encoding='utf-8')
css=css_path.read_text(encoding='utf-8')
def once(text,before,after):
    if text.count(before)!=1:
        raise SystemExit('Ambiguous medicine cleanup anchor: '+before[:100])
    return text.replace(before,after,1)

js=once(js,"'هذا إعداد عام لجميع الأدوية. حُفظ الاختيار؛ تطبيقه على التنبيه العائم لم يكتمل بعد.'","''")
if js.count(' العرض العائم لم يُربط بعد.')!=2:
    raise SystemExit('Unexpected floating reminder copy.')
js=js.replace(' العرض العائم لم يُربط بعد.','')
warning='<p class="qm-warning">تُنشأ هنا الجرعات القادمة لليوم فقط. اختيار نمط التنبيه محفوظ، لكن ربط العرض العائم لم يكتمل بعد. الصور غير مفعّلة.</p>'
js=once(js,warning,'')
js=once(js,'<button type="button" id="qmAlertRetry">إعادة قراءة الإعداد</button>','')
js=once(js," q('#qmAlertRetry').addEventListener('click',loadAlertSettings);",'')
js,count=re.subn(r"q\('#qmAlertRetry'\)\.disabled=(?:true|false);",'',js)
if count!=4:
    raise SystemExit('Unexpected settings retry references.')
js=once(js,'أعد قراءة الإعداد قبل تغييره مجددًا.','أعد فتح القسم قبل تغييره مجددًا.')

old=" const cancel=button('إلغاء التعديل',reset),clear=button('إعادة اختيار الأوقات',()=>{field('times').value='';});controls.append(cancel,clear);form.appendChild(controls);"
management=once(management,old,' form.appendChild(controls);')
management=once(management,"  field('unit').dispatchEvent(new Event('change'));\n }","  field('unit').dispatchEvent(new Event('change'));\n  field('times').readOnly=true;\n }")
management=once(management,"  field('times').value=m.dailyTimes.join(', ');","  field('times').readOnly=false;\n  field('times').value=m.dailyTimes.join(', ');")
anchor=" form.addEventListener('submit',async event=>{"
management=once(management,anchor," root.addEventListener('click',event=>{\n  if(!(event.target instanceof Element)||!event.target.closest('[data-close]')||locked)return;\n  if(editing){reset();say('');}\n });\n"+anchor)
for forbidden in ('إلغاء التعديل','إعادة اختيار الأوقات','إعادة قراءة الإعداد','العرض العائم لم يُربط بعد.','تطبيقه على التنبيه العائم لم يكتمل بعد.','الصور غير مفعّلة.'):
    if forbidden in js or forbidden in management:
        raise SystemExit('Obsolete medicine UI text remains: '+forbidden)
if 'qmAlertRetry' in js:
    raise SystemExit('Dangling settings retry reference.')
css+='\n/* medicine-copy-cleanup */\n#medicineSheet #qmAlertStatus:empty{display:none}\n'
js_path.write_text(js,encoding='utf-8')
management_path.write_text(management,encoding='utf-8')
css_path.write_text(css,encoding='utf-8')
