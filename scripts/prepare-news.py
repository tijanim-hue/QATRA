from pathlib import Path
root=Path(__file__).resolve().parents[1]
def patch(path,old,new):
 p=root/path;s=p.read_text(encoding='utf-8')
 if new in s:return
 if s.count(old)!=1:raise SystemExit('Unexpected culture integration: '+path+' '+old[:55])
 p.write_text(s.replace(old,new,1),encoding='utf-8')
p=root/'public/index.html';s=p.read_text(encoding='utf-8');tag='<script defer src="qatra-news.js"></script>'
if tag not in s:
 if s.count('</head>')!=1:raise SystemExit('Unexpected culture HTML')
 s=s.replace('</head>',tag+'\n</head>',1)
extra='<script defer src="qatra-culture-schedule.js"></script>'
if extra not in s:s=s.replace(tag,extra+'\n'+tag,1)
p.write_text(s,encoding='utf-8')
patch('android/app/src/main/java/com/qatra/app/MainActivity.java','registerPlugin(QatraNavigationPlugin.class);','registerPlugin(QatraNavigationPlugin.class);\n        registerPlugin(QatraNewsLinksPlugin.class);')
patch('android/app/src/main/java/com/qatra/app/MainActivity.java','registerPlugin(QatraNewsLinksPlugin.class);','registerPlugin(QatraNewsLinksPlugin.class);\n        registerPlugin(QatraCultureSchedulePlugin.class);')
patch('public/navigation.js','async function back(){\n if(busy)return;busy=true;',"async function back(){\n if(window.QatraNews?.isOpen()){window.QatraNews.close();return;}\n if(busy)return;busy=true;")
patch('android/app/src/main/java/com/qatra/app/QatraNewsLinksPlugin.java','activeLanguage=lang;long epoch=', 'QatraCultureRuntime.setLanguage(getContext(),lang);activeLanguage=lang;long epoch=')
patch('android/app/src/main/java/com/qatra/app/QatraNewsLinksPlugin.java','response.put("epoch",epoch);call.resolve(response);','response.put("epoch",epoch);if(epoch!=generation.get())throw new IllegalStateException("Language changed");QatraCultureRuntime.cache(getContext(),s.language,s.id,result);call.resolve(response);')
patch('android/app/src/main/java/com/qatra/app/QatraMedicineOverlayService.kt','class QatraMedicineOverlayService : Service() {','class QatraMedicineOverlayService : Service() {\n    companion object { @Volatile var culturePriorityActive=false }')
patch('android/app/src/main/java/com/qatra/app/QatraMedicineOverlayService.kt','                manager.addView(root,params)','                manager.addView(root,params)\n                culturePriorityActive=true')
patch('android/app/src/main/java/com/qatra/app/QatraMedicineOverlayService.kt','    private fun clearScene(){','    private fun clearScene(){\n        culturePriorityActive=false')
p=root/'android/app/src/main/AndroidManifest.xml';s=p.read_text(encoding='utf-8')
if '.QatraCultureAlarmReceiver' not in s:
 block='''        <receiver android:name=".QatraCultureAlarmReceiver" android:exported="false" />
        <receiver android:name=".QatraCultureBootReceiver" android:exported="false">
            <intent-filter><action android:name="android.intent.action.BOOT_COMPLETED" /><action android:name="android.intent.action.MY_PACKAGE_REPLACED" /></intent-filter>
        </receiver>
        <service android:name=".QatraCultureOverlayService" android:exported="false" />
        <activity android:name=".QatraCultureCardActivity" android:exported="false" android:excludeFromRecents="true" android:theme="@android:style/Theme.Material.NoActionBar" />
'''
 if s.count('</application>')!=1:raise SystemExit('Unexpected culture manifest')
 p.write_text(s.replace('</application>',block+'    </application>',1),encoding='utf-8')
patch('public/qatra-news.js','c.refresh.disabled=c.home.disabled=c.policy.disabled=false;if(sheet.open)load(c);','c.refresh.disabled=c.home.disabled=c.policy.disabled=false;window.QatraCultureSchedule?.mount({panel,language:lang,source:()=>c.source.value,field:()=>c.field.value,controls:[c.source,c.field],current:()=>current(c)});if(sheet.open)load(c);')
for old,new in [('جدولة الخلفية غير مفعّلة.','المواعيد التقريبية تُضبط أدناه.'),('No full articles or background scheduling.','No full articles. Scheduling uses downloaded articles.'),('Aucun article complet ni programmation en arrière-plan.','Aucun article complet. La programmation utilise les articles téléchargés.'),('Sin artículos completos ni programación en segundo plano.','Sin artículos completos. La programación usa artículos descargados.'),('Keine vollständigen Artikel oder Hintergrundplanung.','Keine vollständigen Artikel. Die Planung nutzt heruntergeladene Artikel.')]:
 patch('public/qatra-news.js',old,new)
