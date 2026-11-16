from pathlib import Path

root=Path(__file__).resolve().parents[1]
css=root/'public/qatra-medicine.css'
html=root/'public/index.html'
service=root/'android/app/src/main/java/com/qatra/app/QatraMedicineOverlayService.kt'
c=css.read_text(encoding='utf-8') if css.exists() else ''
h=html.read_text(encoding='utf-8')
s=service.read_text(encoding='utf-8')
def once(text,before,after):
    if text.count(before)!=1:
        raise SystemExit('Ambiguous medicine glass anchor: '+before[:80])
    return text.replace(before,after,1)
if '#qatraMedicineSheet .qm-panel' not in c:
    c+='''
#qatraMedicineSheet .qm-panel{position:relative;overflow:hidden;border-radius:26px;border:1px solid rgba(255,255,255,.16);background:linear-gradient(145deg,rgba(255,255,255,.13),rgba(255,255,255,.05));backdrop-filter:blur(18px) saturate(1.15);-webkit-backdrop-filter:blur(18px) saturate(1.15);box-shadow:0 18px 44px rgba(2,6,23,.30),inset 0 1px 0 rgba(255,255,255,.16)}
#qatraMedicineSheet .qm-panel::before{content:"";position:absolute;inset:0;background:linear-gradient(120deg,rgba(255,255,255,.18),transparent 42%);pointer-events:none}
#qatraMedicineSheet .qm-panel>*{position:relative;z-index:1}
#qatraMedicineSheet .qm-panel button{border-radius:16px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.10);color:inherit;transition:transform .18s ease,background .18s ease,border-color .18s ease}
#qatraMedicineSheet .qm-panel button:hover{background:rgba(255,255,255,.17);border-color:rgba(255,255,255,.28)}
#qatraMedicineSheet .qm-panel button:active{transform:scale(.98)}
#qatraMedicineSheet .qm-delete{border-color:rgba(248,113,113,.45)!important;background:rgba(248,113,113,.10)!important;color:#fecaca!important}
#qatraMedicineSheet .qm-photo{border-color:rgba(255,255,255,.24)!important;box-shadow:0 10px 24px rgba(2,6,23,.25)}
#qatraMedicineSheet [data-photo-ready]{border-radius:26px}
'''
(css).write_text(c,encoding='utf-8')
if 'src="qatra-medicine-glass.js"' in h:
    raise SystemExit('Duplicate medicine glass script.')
h=once(h,'</head>','<script defer src="qatra-medicine-glass.js"></script>\n</head>')
(root/'public/qatra-medicine-glass.js').write_text('''(() => {
'use strict';
if(window.QatraMedicineGlass)return;window.QatraMedicineGlass=true;
const root=document.getElementById('medicineSheet');if(!root)return;
const sheet=root.querySelector('.qm-sheet,.sheet,.modal,dialog');if(!sheet)return;
sheet.classList.add('qatra-glass');
sheet.style.setProperty('--glass-border','rgba(255,255,255,.18)');
sheet.style.setProperty('--glass-blur','22px');
})();''',encoding='utf-8')
anchor='content.background=image;content.clipToOutline=true'
if anchor in s:
    s=once(s,anchor,'content.background=image;content.clipToOutline=true;content.elevation=18f;content.outlineProvider=object:android.view.ViewOutlineProvider(){override fun getOutline(view:android.view.View,outline:android.graphics.Outline){outline.setRoundRect(0,0,view.width,view.height,24f*view.resources.displayMetrics.density)}}')
service.write_text(s,encoding='utf-8')
html.write_text(h,encoding='utf-8')
