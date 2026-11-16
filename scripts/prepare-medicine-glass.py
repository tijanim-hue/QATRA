from pathlib import Path
import re
from html import escape as html_escape, unescape
from html.parser import HTMLParser
root=Path(__file__).resolve().parents[1]
def edit(relative,transform):
 p=root/relative;s=p.read_text(encoding='utf-8');p.write_text(transform(s),encoding='utf-8')
def replace_checked(text,old,new):
 count=text.count(old)
 if count==1:return text.replace(old,new,1)
 if count==0 and new in text:return text
 raise SystemExit('Unexpected medicine source: '+old[:70])
edit('public/index.html',lambda s:re.sub(r'<script\b[^>]*\bsrc=[^>]*qatra-medicine-glass\.js[^>]*>\s*</script>\s*','',s))
edit('android/app/src/main/java/com/qatra/app/MainActivity.java',lambda s:re.sub(r'^[ \t]*registerPlugin\(QatraMedicineGlassPlugin\.class\);[ \t]*\n?','',s,flags=re.MULTILINE))
asset=root/'public/qatra-medicine-glass.js'
if asset.exists():asset.unlink()
edit('android/app/src/main/java/com/qatra/app/QatraMedicineOverlayService.kt',lambda s:replace_checked(s,'if(SystemClock.uptimeMillis()>=expiresAt||','if(/* Explicit action or invalidated dose only. */'))
edit('public/qatra-medicine.js',lambda s:s if 'qatra-reset-time' in s else replace_checked(s,' timePicker.hidden=false;'," timePicker.dispatchEvent(new Event('qatra-reset-time'));\n timePicker.hidden=false;"))
edit('public/qatra-medicine.js',lambda s:s if "addEventListener('qatra-reset-time'" in s else replace_checked(s," const preview=timePicker.querySelector('#qmTimePreview');"," timePicker.addEventListener('qatra-reset-time',()=>{const now=new Date();hourWheel.set(now.getHours(),false);minuteWheel.set(now.getMinutes(),false);});\n const preview=timePicker.querySelector('#qmTimePreview');"))
edit('public/qatra-medicine-management.js',lambda s:replace_checked(s,"row.append(button('تعديل',()=>edit(m)),button('أرشفة',()=>toggle(m)));","row.append(button('تعديل',()=>edit(m)));"))
edit('public/qatra-medicine-management.js',lambda s:replace_checked(s,'archived.hidden=!items.length;','archived.hidden=true;'))
marker='/* QATRA compact medicine cards */'
styles='''
#medicineSheet #qmMedicines > .qm-panel{display:block;width:100%;min-width:0;height:auto;min-height:0;aspect-ratio:auto;border-radius:16px;padding:14px 16px;margin:0 0 12px;box-sizing:border-box}
#medicineSheet #qmMedicines > .qm-panel h3{margin:0 0 6px;line-height:1.5}
#medicineSheet #qmMedicines > .qm-panel p{margin:5px 0;line-height:1.65}
#medicineSheet #qmMedicines > .qm-panel .qm-row{margin-top:10px;gap:8px}
#medicineSheet #qmMedicines > .qm-panel button{min-height:44px;padding:8px 12px;border-radius:12px}
'''
edit('public/qatra-medicine.css',lambda s:s if marker in s else s+'\n'+marker+styles)
edit('android/app/src/main/java/com/qatra/app/QatraMedicinePlugin.kt',lambda s:replace_checked(s,"AND (status!='pending' OR medicine_id IN (SELECT id FROM medicines WHERE archived=0))","AND medicine_id IN (SELECT id FROM medicines WHERE archived=0)"))
edit('public/qatra-medicine.js',lambda s:replace_checked(s,'map(d=>`<article class="qm-panel">','map(d=>`<article class="qm-panel" data-dose-id="${escape(d.id)}">'))
p=root/'public/qatra-medicine-deletion.js'
s=p.read_text(encoding='utf-8')
for filename,marker in [('qatra-medicine-polish.js','/* qatra-medicine-polish-v1 */'),('qatra-medicine-dashboard.js','/* qatra-medicine-dashboard-v1 */'),('qatra-medicine-entry.js','/* qatra-medicine-entry-v1 */')]:
 extra=(root/'public'/filename).read_text(encoding='utf-8')
 if marker not in s:s+='\n'+extra
p.write_text(s,encoding='utf-8')
def overlay(s):
 s=replace_checked(s,'line("وقت جرعة ${dose.name}",22f)','line("حان وقت جرعتك",22f)\n                line(dose.name,20f)')
 s=replace_checked(s,'line("الجرعة المسجّلة: ${dose.amount}",18f)','line("الجرعة: ${dose.amount}",18f)')
 pattern=r'                button\(content,"فتح قسم الأدوية"\)\{.*?\n                \}\n                button\(content,"إغلاق"\)\{next\(\)\}\n'
 if 'button(content,"فتح قسم الأدوية")' in s:
  s,count=re.subn(pattern,'',s,flags=re.S)
  if count!=1:raise SystemExit('Unexpected overlay navigation block')
 return replace_checked(s,'                root.addView(card,FrameLayout.LayoutParams(width,ViewGroup.LayoutParams.WRAP_CONTENT,Gravity.CENTER))','                root.setOnClickListener { if(cardReady&&!actionBusy&&activeId==id)next() }\n                root.addView(card,FrameLayout.LayoutParams(width,ViewGroup.LayoutParams.WRAP_CONTENT,Gravity.CENTER))')
edit('android/app/src/main/java/com/qatra/app/QatraMedicineOverlayService.kt',overlay)
class Policy(HTMLParser):
 def __init__(self):super().__init__(convert_charrefs=True);self.changes=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag!='meta' or a.get('http-equiv','').lower()!='content-security-policy':return
  policy=a.get('content','');parts=[x.strip() for x in policy.split(';') if x.strip()]
  rules={x.split()[0]:x.split()[1:] for x in parts};allowed=rules.get('connect-src',rules.get('default-src',[]))
  origin='https://clinicaltables.nlm.nih.gov'
  if origin in allowed:return
  tokens=[x for x in allowed if x!="'none'"]+[origin]
  updated='connect-src '+' '.join(tokens)
  parts=[updated if x.split()[0]=='connect-src' else x for x in parts]
  if 'connect-src' not in rules:parts.append(updated)
  old=self.get_starttag_text();new=re.sub(r'''\bcontent\s*=\s*(["']).*?\1''',lambda _: 'content="'+html_escape('; '.join(parts),quote=True)+'"',old,count=1,flags=re.I|re.S)
  if old==new:raise SystemExit('Could not update CSP content')
  self.changes.append((old,new))
p=root/'public/index.html';s=p.read_text(encoding='utf-8');policy=Policy();policy.feed(s)
for old,new in policy.changes:s=replace_checked(s,old,new)
p.write_text(s,encoding='utf-8')
