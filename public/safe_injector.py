import re

with open('pro_step_html.txt', 'r', encoding='utf-8') as f:
    html_inj = f.read()

with open('pro_step_js.txt', 'r', encoding='utf-8') as f:
    js_inj = f.read()

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = re.sub(r'<!-- PRO DAILY STEP SHEET -->.*?<!-- END PRO DAILY STEP -->', '', html, flags=re.DOTALL)
html = html.replace('</body>', html_inj + '\n</body>')
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

with open('app.js', 'r', encoding='utf-8') as f:
    js = f.read()

js = re.sub(r'// === PRO PHASE 1: DAILY STEP ===.*?// === END PRO PHASE 1 ===', '', js, flags=re.DOTALL)
js = js + '\n' + js_inj
with open('app.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("✅ تم الحقن بنجاح وأمان تام!")
