from pathlib import Path
root=Path(__file__).resolve().parents[1]
def replace(s,old,new):
 if new in s:return s
 if s.count(old)!=1:raise SystemExit('Unexpected background anchor: '+old[:90])
 return s.replace(old,new,1)
p=root/'android/app/src/main/java/com/qatra/app/QatraNewsLinksPlugin.java';s=p.read_text(encoding='utf-8')
if '/* culture-shared-feed-v1 */' not in s:
 start=s.index('    @PluginMethod public void getArticles(');end=s.index('    @Override protected void handleOnDestroy()',start);original=s[start:end]
 a=original.index('                if(epoch!=generation.get())throw new Exception("stale");')
 b=original.index('JSObject response=new JSObject();',a)
 core=original[a:b].replace('epoch!=generation.get()','!guard.active()').replace('current=connection;','guard.connection(connection);')
 if 'call.' in core or 'generation' in core:raise SystemExit('Feed extraction retained plugin state')
 wrapper='''    /* culture-shared-feed-v1 */
    public interface FeedGuard {
        boolean active();
        void connection(HttpURLConnection connection);
    }
    public static JSONArray fetchArticlesChecked(String language,String sourceId,FeedGuard guard) throws Exception {
        Source s=source(language);
        if(s==null||!s.id.equals(sourceId)||!guard.active())throw new IllegalArgumentException("Source/context mismatch");
        HttpURLConnection connection=null;
        try {
'''+core+'''
            if(!guard.active())throw new IllegalStateException("Context changed");
            return result;
        } finally {
            if(connection!=null)connection.disconnect();
            guard.connection(null);
        }
    }
    @PluginMethod public void getArticles(PluginCall call){
        final Source s;final long epoch=call.getData().optLong("epoch",-1);
        try{s=selected(call);if(epoch!=generation.get())throw new IllegalArgumentException("stale");}catch(Exception error){call.reject("CULTURE_CONTEXT_CHANGED");return;}
        try{worker.execute(()->{
            try{
                JSONArray result=fetchArticlesChecked(s.language,s.id,new FeedGuard(){
                    public boolean active(){return epoch==generation.get()&&s.language.equals(activeLanguage);}
                    public void connection(HttpURLConnection connection){current=connection;}
                });
                if(epoch!=generation.get())throw new IllegalStateException("Language changed");
                QatraCultureRuntime.cache(getContext(),s.language,s.id,result);
                JSObject response=new JSObject();response.put("articles",result);response.put("language",s.language);response.put("source",s.id);response.put("epoch",epoch);call.resolve(response);
            }catch(Exception error){call.reject("CULTURE_FEED_UNAVAILABLE");}
        });}catch(Exception error){call.reject("CULTURE_FEED_UNAVAILABLE");}
    }
'''
 s=s[:start]+wrapper+s[end:]
 for signature in ['Source source','boolean validArticle','long date','String plain','String excerpt','boolean cultural','void credits']:
  s=replace(s,'private '+signature+'(','private static '+signature+'(')
 s=replace(s,'QatraCultureRuntime.setLanguage(getContext(),lang);activeLanguage=lang;','QatraCultureRuntime.setLanguage(getContext(),lang);QatraCultureRefreshJob.sync(getContext());activeLanguage=lang;')
 p.write_text(s,encoding='utf-8')
p=root/'android/app/src/main/java/com/qatra/app/QatraCultureRuntime.kt';s=p.read_text(encoding='utf-8')
s=replace(s,'@Synchronized fun schedule(c:Context,delay:Long?=null):Boolean {\n        cancelAlarm(c);','@Synchronized fun schedule(c:Context,delay:Long?=null):Boolean {\n        QatraCultureRefreshJob.sync(c)\n        cancelAlarm(c);')
s=replace(s,'prefs(c).edit().putString(key(l,"cache"),result.toString()).apply()','prefs(c).edit().putString(key(l,"cache"),result.toString()).putLong(key(l,"lastRefreshAt"),System.currentTimeMillis()).apply()')
s=replace(s,'put("overlay",overlayAllowed(c))}','put("overlay",overlayAllowed(c));put("backgroundRefreshScheduled",QatraCultureRefreshJob.scheduled(c,l));put("lastRefreshAt",p.getLong(key(l,"lastRefreshAt"),0))}')
p.write_text(s,encoding='utf-8')
p=root/'android/app/src/main/AndroidManifest.xml';s=p.read_text(encoding='utf-8')
if 'android.permission.ACCESS_NETWORK_STATE' not in s:s=replace(s,'    <application','    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />\n\n    <application')
if '.QatraCultureRefreshJob' not in s:s=replace(s,'</application>','    <service android:name=".QatraCultureRefreshJob" android:permission="android.permission.BIND_JOB_SERVICE" android:exported="true" />\n    </application>')
p.write_text(s,encoding='utf-8')
p=root/'public/qatra-culture-schedule.js';s=p.read_text(encoding='utf-8')
for old,new in [
 ('تستخدم الجدولة المقالات المحمّلة عند تحديث القسم، ولا تجلب مواد جديدة من الإنترنت في الخلفية. قد يؤخر Android المواعيد. عند نفاد المقالات يتوقف العرض حتى التحديث.','عند تفعيل الجدولة، يُطلب تحديث المقالات في الخلفية كل 6 ساعات تقريبًا مع توفر الشبكة. قد يؤخر Android التحديث والقطرات. يبقى المحتوى السابق عند فشل الاتصال، ولا تُرسل بطاقة فارغة عند نفاد المقالات.'),
 ('Uses articles downloaded when you refresh this section; no background internet fetching. Android may delay delivery. Display pauses when unseen articles run out.','When enabled, requests a background article refresh about every 6 hours with network access. Android may delay refreshes and drops. Connection failures preserve existing content; no empty cards are sent.'),
 ('Utilise les articles téléchargés lors de l’actualisation, sans collecte internet en arrière-plan. Android peut retarder l’affichage. Pause lorsque les articles inédits sont épuisés.','Une fois activé, demande une actualisation en arrière-plan environ toutes les 6 heures avec réseau. Android peut retarder les tâches. Le contenu précédent est conservé en cas d’échec ; aucune carte vide.'),
 ('Usa artículos descargados al actualizar la sección; no descarga en segundo plano. Android puede retrasar la entrega. Se pausa al agotarse los artículos sin mostrar.','Al activarse, solicita actualizar artículos en segundo plano aproximadamente cada 6 horas con red. Android puede retrasarlo. Los fallos conservan el contenido anterior; no se envían tarjetas vacías.'),
 ('Nutzt beim Aktualisieren heruntergeladene Artikel, ohne Internetabruf im Hintergrund. Android kann Termine verzögern. Ohne ungesehene Artikel pausiert die Anzeige.','Bei Aktivierung wird etwa alle 6 Stunden mit Netzwerk eine Hintergrundaktualisierung angefordert. Android kann Aufgaben verzögern. Bei Fehlern bleiben vorhandene Artikel erhalten; keine leeren Karten.')]:s=replace(s,old,new)
insert=""" const refreshInfo=el('small');
 const backgroundText={ar:['تحديث الخلفية مجدول','تحديث الخلفية غير مجدول','آخر تحقق من المصدر: ','لم يُسجّل تحقق ناجح بعد'],en:['Background refresh scheduled','Background refresh not scheduled','Last source check: ','No successful check recorded'],fr:['Actualisation en arrière-plan programmée','Actualisation non programmée','Dernière vérification : ','Aucune vérification réussie'],es:['Actualización en segundo plano programada','Actualización no programada','Última comprobación: ','Sin comprobación correcta'],de:['Hintergrundaktualisierung geplant','Keine Hintergrundaktualisierung geplant','Letzte Quellenprüfung: ','Noch keine erfolgreiche Prüfung']}[c.language]||['Background refresh scheduled','Background refresh not scheduled','Last source check: ','No successful check recorded'];
"""
s=replace(s,' box.append(label,hoursLabel,modeLabel,save,test,permissions,overlay,notifications,status,el(\'small\',t[15]));',insert+' box.append(label,hoursLabel,modeLabel,save,test,permissions,overlay,notifications,status,refreshInfo,el(\'small\',t[15]));')
s=replace(s,"if(value.enabled&&value.available===0)status.textContent+=' '+t[14]}","if(value.enabled&&value.available===0)status.textContent+=' '+t[14];refreshInfo.textContent=backgroundText[value.backgroundRefreshScheduled?0:1]+' · '+(value.lastRefreshAt>0?backgroundText[2]+new Date(value.lastRefreshAt).toLocaleString(c.language):backgroundText[3])}")
p.write_text(s,encoding='utf-8')
