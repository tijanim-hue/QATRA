from pathlib import Path
from html.parser import HTMLParser
import runpy

root = Path(__file__).resolve().parents[1]
html_path = root/'public/index.html'
activity_path = root/'android/app/src/main/java/com/qatra/app/MainActivity.java'
markup = html_path.read_text(encoding='utf-8')
source = activity_path.read_text(encoding='utf-8')
if (activity_path.parent/'MainActivity.kt').exists():
    raise SystemExit('Duplicate MainActivity: refusing medicine integration.')
if markup.count('</head>') != 1 or '</html>' not in markup:
    raise SystemExit('Incomplete index.html: refusing medicine integration.')
for name in ('QatraPlugin', 'QatraAwarenessPlugin', 'QatraMedicinePlugin'):
    if source.count('registerPlugin('+name+'.class);') != 1:
        raise SystemExit('Existing native registration changed: '+name)

class LibraryFinder(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.stack=[]
        self.views={}
        self.headings=[]
        self.offsets=[0]
        for line in text.splitlines(keepends=True):
            self.offsets.append(self.offsets[-1]+len(line))
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        view=attrs.get('id') if 'view' in attrs.get('class','').split() else None
        line,column=self.getpos()
        if view:
            self.views[view]=self.offsets[line-1]+column+len(self.get_starttag_text())
        if tag not in ('area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'):
            self.stack.append((tag,view))
        if tag in ('h1','h2','h3'):
            owner=next((v for _,v in reversed(self.stack) if v),None)
            self.headings.append([tag,owner,''])
    def handle_data(self, data):
        if self.headings and any(t==self.headings[-1][0] for t,_ in self.stack):
            self.headings[-1][2]+=data
    def handle_endtag(self, tag):
        for index in range(len(self.stack)-1,-1,-1):
            if self.stack[index][0]==tag:
                del self.stack[index:]
                break

if 'id="openQatraMedicine"' not in markup:
    finder=LibraryFinder(markup)
    finder.feed(markup)
    matches=[key for key in finder.views if 'library' in key.lower()]
    if not matches:
        matches=list({owner for _,owner,text in finder.headings if owner and ' '.join(text.split()) in ('المكتبة الشخصية','مكتبتي')})
    if len(matches)!=1:
        raise SystemExit('Personal library is not uniquely identified; refusing a fallback to home.')
    offset=finder.views[matches[0]]
    card='''
<button id="openQatraMedicine" class="glass-card action-card" type="button" aria-haspopup="dialog">
<span class="card-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c3.9 4.2 6 7 6 9.5A6 6 0 1 1 6 12.5C6 10 8.1 7.2 12 3z"/></svg></span>
<span class="card-info"><span class="card-title">قطرة دواء</span><span class="card-sub">أدويتك وجرعاتك ومخزونك</span></span>
</button>
'''
    markup=markup[:offset]+card+markup[offset:]
for snippet in ('<link rel="stylesheet" href="qatra-medicine.css">','<script defer src="qatra-medicine.js"></script>','<script defer src="qatra-medicine-management.js"></script>'):
    if snippet not in markup:
        markup=markup.replace('</head>',snippet+'\n</head>',1)
registration='registerPlugin(QatraMedicinePlugin.class);'
if registration not in source:
    anchor='registerPlugin(QatraAwarenessPlugin.class);'
    source=source.replace(anchor,anchor+'\n        '+registration,1)
if source.count(registration)!=1 or source.index(registration)>source.index('super.onCreate(savedInstanceState);'):
    raise SystemExit('Invalid medicine plugin registration order.')

def patch(path, before, after):
    text=path.read_text(encoding='utf-8')
    if after in text:
        return
    if text.count(before)!=1:
        raise SystemExit('Ambiguous medicine integration anchor: '+str(path))
    path.write_text(text.replace(before,after,1),encoding='utf-8')

patch(root/'public/qatra-medicine.js','map(m=>`<article class="qm-panel">','map(m=>`<article class="qm-panel" data-medicine-id="${escape(m.id)}">')
html_path.write_text(markup,encoding='utf-8')
activity_path.write_text(source,encoding='utf-8')
runpy.run_path(str(root/'scripts/prepare-medicine-picker.py'),run_name='__main__')
runpy.run_path(str(root/'scripts/prepare-medicine-audio.py'),run_name='__main__')
