from pathlib import Path
root=Path(__file__).resolve().parents[1]
p=root/'public/index.html';s=p.read_text(encoding='utf-8');tag='<script defer src="qatra-news.js"></script>'
if tag not in s:
 if s.count('</head>')!=1:raise SystemExit('Unexpected news HTML anchor')
 p.write_text(s.replace('</head>',tag+'\n</head>',1),encoding='utf-8')
p=root/'android/app/src/main/java/com/qatra/app/MainActivity.java';s=p.read_text(encoding='utf-8');old='registerPlugin(QatraNavigationPlugin.class);';new=old+'\n        registerPlugin(QatraNewsLinksPlugin.class);'
if new not in s:
 if s.count(old)!=1:raise SystemExit('Unexpected news registration anchor')
 p.write_text(s.replace(old,new,1),encoding='utf-8')
p=root/'public/navigation.js';s=p.read_text(encoding='utf-8');old='async function back(){\n if(busy)return;busy=true;';new="async function back(){\n if(window.QatraNews?.isOpen()){window.QatraNews.close();return;}\n if(busy)return;busy=true;"
if new not in s:
 if s.count(old)!=1:raise SystemExit('Unexpected news back anchor')
 p.write_text(s.replace(old,new,1),encoding='utf-8')
