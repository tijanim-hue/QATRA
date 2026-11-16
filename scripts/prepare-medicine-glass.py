from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
def edit(relative, transform):
    path = root / relative
    text = path.read_text(encoding='utf-8')
    updated = transform(text)
    path.write_text(updated, encoding='utf-8')

def replace_checked(text, old, new):
    if new in text:
        return text
    if text.count(old) != 1:
        raise SystemExit('Unexpected medicine source: ' + old[:70])
    return text.replace(old, new, 1)

edit('public/index.html', lambda s: re.sub(r'<script\b[^>]*\bsrc=[^>]*qatra-medicine-glass\.js[^>]*>\s*</script>\s*', '', s))
edit('android/app/src/main/java/com/qatra/app/MainActivity.java', lambda s: re.sub(r'^[ \t]*registerPlugin\(QatraMedicineGlassPlugin\.class\);[ \t]*\n?', '', s, flags=re.MULTILINE))
asset = root / 'public/qatra-medicine-glass.js'
if asset.exists():
    asset.unlink()

edit('android/app/src/main/java/com/qatra/app/QatraMedicineOverlayService.kt', lambda s: replace_checked(s, 'if(SystemClock.uptimeMillis()>=expiresAt||', 'if('))
edit('public/qatra-medicine.js', lambda s: replace_checked(s, " timePicker.hidden=false;", " timePicker.dispatchEvent(new Event('qatra-reset-time'));\n timePicker.hidden=false;"))
edit('public/qatra-medicine.js', lambda s: replace_checked(s, " const preview=timePicker.querySelector('#qmTimePreview');", " timePicker.addEventListener('qatra-reset-time',()=>{const now=new Date();hourWheel.set(now.getHours(),false);minuteWheel.set(now.getMinutes(),false);});\n const preview=timePicker.querySelector('#qmTimePreview');"))
edit('public/qatra-medicine-management.js', lambda s: replace_checked(s, "row.append(button('تعديل',()=>edit(m)),button('أرشفة',()=>toggle(m)));", "row.append(button('تعديل',()=>edit(m)));"))
edit('public/qatra-medicine-management.js', lambda s: replace_checked(s, "archived.hidden=!items.length;", "archived.hidden=true;"))

marker = '/* QATRA compact medicine cards */'
styles = '''
#medicineSheet #qmMedicines > .qm-panel {display:block;width:100%;min-width:0;height:auto;min-height:0;aspect-ratio:auto;border-radius:16px;padding:14px 16px;margin:0 0 12px;box-sizing:border-box}
#medicineSheet #qmMedicines > .qm-panel h3 {margin:0 0 6px;line-height:1.5}
#medicineSheet #qmMedicines > .qm-panel p {margin:5px 0;line-height:1.65}
#medicineSheet #qmMedicines > .qm-panel .qm-row {margin-top:10px;gap:8px}
#medicineSheet #qmMedicines > .qm-panel button {min-height:44px;padding:8px 12px;border-radius:12px}
'''
edit('public/qatra-medicine.css', lambda s: s if marker in s else s+'\n'+marker+styles)
