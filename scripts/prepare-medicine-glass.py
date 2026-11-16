from pathlib import Path
import re

root = Path(__file__).resolve().parents[1]
html = root / 'public/index.html'
activity = root / 'android/app/src/main/java/com/qatra/app/MainActivity.java'
css = root / 'public/qatra-medicine.css'

h = html.read_text(encoding='utf-8')
h = re.sub(r'<script\b[^>]*\bsrc=[^>]*qatra-medicine-glass\.js[^>]*>\s*</script>\s*', '', h)
html.write_text(h, encoding='utf-8')
a = activity.read_text(encoding='utf-8')
a = re.sub(r'^[ \t]*registerPlugin\(QatraMedicineGlassPlugin\.class\);[ \t]*\n?', '', a, flags=re.MULTILINE)
activity.write_text(a, encoding='utf-8')
asset = root / 'public/qatra-medicine-glass.js'
if asset.exists():
    asset.unlink()

marker = '/* QATRA compact medicine cards */'
styles = '''
#medicineSheet #qmMedicines > .qm-panel {
 display:block; width:100%; min-width:0; height:auto; min-height:0;
 aspect-ratio:auto; border-radius:16px; padding:14px 16px;
 margin:0 0 12px; box-sizing:border-box;
}
#medicineSheet #qmMedicines > .qm-panel h3 {margin:0 0 6px;line-height:1.5}
#medicineSheet #qmMedicines > .qm-panel p {margin:5px 0;line-height:1.65}
#medicineSheet #qmMedicines > .qm-panel .qm-row {margin-top:10px;gap:8px}
#medicineSheet #qmMedicines > .qm-panel button {min-height:44px;padding:8px 12px;border-radius:12px}
'''
s = css.read_text(encoding='utf-8')
if marker not in s:
    css.write_text(s + '\n' + marker + styles, encoding='utf-8')
