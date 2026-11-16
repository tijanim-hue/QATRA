package com.qatra.app

import android.Manifest
import android.app.*
import android.content.*
import android.content.pm.PackageManager
import android.graphics.*
import android.graphics.drawable.GradientDrawable
import android.net.Uri
import android.os.*
import android.provider.Settings
import android.view.*
import android.widget.*
import com.getcapacitor.*
import com.getcapacitor.annotation.CapacitorPlugin
import org.json.JSONArray
import org.json.JSONObject
import java.util.Date
import java.util.Locale
import java.util.UUID

object QatraCultureRuntime {
    private const val CHANNEL="qatra_culture"
    private const val NOTICE=713402
    private val languages=setOf("ar","en","fr","es","de")
    private fun prefs(c:Context)=c.getSharedPreferences("qatra_culture_runtime",Context.MODE_PRIVATE)
    private fun lang(c:Context)=prefs(c).getString("language","").orEmpty()
    private fun key(l:String,name:String)="$l:$name"
    private fun allowed(l:String)=l in languages
    fun word(l:String,index:Int):String {
        val words=when(l){
            "ar"->listOf("قطرة ثقافة","قراءة المقال في المصدر","رجوع","الكاتب غير مذكور","مقالات الثقافة")
            "fr"->listOf("Goutte de culture","Lire à la source","Retour","Auteur non indiqué","Articles culturels")
            "es"->listOf("Gota de cultura","Leer en la fuente","Volver","Autor no indicado","Artículos culturales")
            "de"->listOf("Kulturtropfen","Bei der Quelle lesen","Zurück","Autor nicht angegeben","Kulturartikel")
            else->listOf("Culture Drop","Read at the source","Back","Author not provided","Culture articles")
        };return words[index]
    }
    fun notificationAllowed(c:Context):Boolean {
        if(Build.VERSION.SDK_INT>=33&&c.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)!=PackageManager.PERMISSION_GRANTED)return false
        val manager=c.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        return (Build.VERSION.SDK_INT<24||manager.areNotificationsEnabled())&&(Build.VERSION.SDK_INT<26||manager.getNotificationChannel(CHANNEL)?.importance!=NotificationManager.IMPORTANCE_NONE)
    }
    fun overlayAllowed(c:Context)=Build.VERSION.SDK_INT<23||Settings.canDrawOverlays(c)
    private fun pending(c:Context,flags:Int):PendingIntent? {
        val p=prefs(c);val intent=Intent(c,QatraCultureAlarmReceiver::class.java).setAction("com.qatra.CULTURE_TICK").setData(Uri.parse("qatra://culture/tick")).putExtra("revision",p.getLong("revision",0)).putExtra("language",lang(c))
        return PendingIntent.getBroadcast(c,713402,intent,flags or PendingIntent.FLAG_IMMUTABLE)
    }
    private fun cancelAlarm(c:Context){pending(c,PendingIntent.FLAG_NO_CREATE)?.let{(c.getSystemService(Context.ALARM_SERVICE) as AlarmManager).cancel(it);it.cancel()}}
    private fun clearDelivery(c:Context){
        prefs(c).edit().remove("delivery").apply()
        (c.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager).cancel(NOTICE)
        runCatching{c.stopService(Intent(c,QatraCultureOverlayService::class.java))}
    }
    @JvmStatic @Synchronized fun setLanguage(c:Context,l:String){
        val p=prefs(c);if(lang(c)==l)return;cancelAlarm(c);clearDelivery(c)
        p.edit().putString("language",l).putLong("revision",p.getLong("revision",0)+1).putLong("nextAt",0).commit();schedule(c)
    }
    @JvmStatic @Synchronized fun cache(c:Context,l:String,source:String,rows:JSONArray){
        if(!allowed(l)||source!="gv-$l"||lang(c)!=l)return
        val result=JSONArray();for(i in 0 until rows.length()){val a=rows.optJSONObject(i)?:continue;if(valid(a,l)&&a.optString("source")==source)result.put(a)}
        prefs(c).edit().putString(key(l,"cache"),result.toString()).apply()
    }
    private fun valid(a:JSONObject,l:String):Boolean {
        if(!allowed(l)||a.optString("language")!=l||a.optString("source")!="gv-$l"||a.optString("title").isBlank())return false
        return try{val uri=Uri.parse(a.getString("url"));uri.scheme=="https"&&uri.host==(if(l=="en")"globalvoices.org" else "$l.globalvoices.org")&&uri.userInfo==null&&(uri.port==-1||uri.port==443)&&uri.path.orEmpty().matches(Regex("/[0-9]{4}/[0-9]{2}/[0-9]{2}/[^/]+/?"))}catch(_:Exception){false}
    }
    private fun candidates(c:Context,unseen:Boolean):List<JSONObject>{
        val p=prefs(c);val l=lang(c);if(!allowed(l))return emptyList()
        val source=p.getString(key(l,"source"),"gv-$l");val field=p.getString(key(l,"field"),"all")
        val rows=runCatching{JSONArray(p.getString(key(l,"cache"),"[]"))}.getOrDefault(JSONArray())
        val history=runCatching{JSONArray(p.getString(key(l,"history"),"[]"))}.getOrDefault(JSONArray())
        val seen=(0 until history.length()).map{history.optString(it)}.toSet()
        return (0 until rows.length()).mapNotNull{rows.optJSONObject(it)}.filter{a->valid(a,l)&&a.optString("source")==source&&(field=="all"||(0 until (a.optJSONArray("categories")?.length()?:0)).any{a.optJSONArray("categories")?.optString(it)==field})&&(!unseen||a.optString("url") !in seen)}
    }
    @Synchronized fun schedule(c:Context,delay:Long?=null):Boolean {
        cancelAlarm(c);val p=prefs(c);val l=lang(c)
        if(!allowed(l)||!p.getBoolean(key(l,"enabled"),false)){p.edit().putLong("nextAt",0).apply();return false}
        val at=System.currentTimeMillis()+(delay?:p.getInt(key(l,"hours"),6)*3600000L)
        return try{val alarm=c.getSystemService(Context.ALARM_SERVICE) as AlarmManager;val pi=pending(c,PendingIntent.FLAG_UPDATE_CURRENT)!!;if(Build.VERSION.SDK_INT>=23)alarm.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP,at,pi)else alarm.set(AlarmManager.RTC_WAKEUP,at,pi);p.edit().putLong("nextAt",at).apply();true}catch(_:Exception){p.edit().putLong("nextAt",0).apply();false}
    }
    @Synchronized fun selection(c:Context,l:String,source:String,field:String){
        require(l==lang(c)&&allowed(l)&&source=="gv-$l"&&field.length<=120)
        val p=prefs(c);if(p.getString(key(l,"source"),"gv-$l")==source&&p.getString(key(l,"field"),"all")==field)return
        clearDelivery(c);cancelAlarm(c);p.edit().putString(key(l,"source"),source).putString(key(l,"field"),field).putLong("revision",p.getLong("revision",0)+1).commit();schedule(c)
    }
    @Synchronized fun configure(c:Context,l:String,source:String,field:String,enabled:Boolean,hours:Int,mode:String):JSObject {
        require(l==lang(c)&&allowed(l)&&source=="gv-$l"&&field.length<=120&&hours in setOf(3,6,12,24)&&mode in setOf("notification","overlay","both"))
        selection(c,l,source,field);require(!enabled||candidates(c,false).isNotEmpty())
        val p=prefs(c);clearDelivery(c);cancelAlarm(c);check(p.edit().putBoolean(key(l,"enabled"),enabled).putInt(key(l,"hours"),hours).putString(key(l,"mode"),mode).putLong("revision",p.getLong("revision",0)+1).commit());schedule(c);return status(c,l).apply{put("saved",true)}
    }
    fun status(c:Context,l:String):JSObject {
        require(l==lang(c)&&allowed(l));val p=prefs(c)
        return JSObject().apply{put("enabled",p.getBoolean(key(l,"enabled"),false));put("hours",p.getInt(key(l,"hours"),6));put("mode",p.getString(key(l,"mode"),"both"));put("nextAt",p.getLong("nextAt",0));put("available",candidates(c,true).size);put("notifications",notificationAllowed(c));put("overlay",overlayAllowed(c))}
    }
    fun delivery(c:Context,id:String?):JSONObject? {
        return runCatching{val d=JSONObject(prefs(c).getString("delivery","").orEmpty());val l=lang(c);if(d.optString("deliveryId")==id&&d.optLong("revision")==prefs(c).getLong("revision",0)&&prefs(c).getBoolean(key(l,"enabled"),false)&&valid(d,l))d else null}.getOrNull()
    }
    @Synchronized fun mark(c:Context,d:JSONObject){
        if(d.optBoolean("test"))return;val l=lang(c);if(delivery(c,d.optString("deliveryId"))==null)return;val p=prefs(c);val old=runCatching{JSONArray(p.getString(key(l,"history"),"[]"))}.getOrDefault(JSONArray());val urls=(0 until old.length()).map{old.optString(it)}.filter{it!=d.optString("url")}.takeLast(99)+d.optString("url");p.edit().putString(key(l,"history"),JSONArray(urls).toString()).apply()
    }
    fun notify(c:Context,d:JSONObject):Boolean {
        if(delivery(c,d.optString("deliveryId"))==null||!notificationAllowed(c))return false
        return try{val l=d.getString("language");val manager=c.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager;if(Build.VERSION.SDK_INT>=26)manager.createNotificationChannel(NotificationChannel(CHANNEL,word(l,4),NotificationManager.IMPORTANCE_DEFAULT));val intent=Intent(c,QatraCultureCardActivity::class.java).putExtra("delivery",d.getString("deliveryId")).setData(Uri.parse("qatra://culture/card/"+d.getString("deliveryId")));val pi=PendingIntent.getActivity(c,NOTICE,intent,PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE);val builder=if(Build.VERSION.SDK_INT>=26)Notification.Builder(c,CHANNEL)else Notification.Builder(c);val body=d.optString("author").ifBlank{word(l,3)}+"\n"+d.optString("excerpt");manager.notify(NOTICE,builder.setSmallIcon(R.drawable.ic_stat_qatra).setContentTitle(d.getString("title")).setContentText(body).setStyle(Notification.BigTextStyle().bigText(body)).setVisibility(Notification.VISIBILITY_PRIVATE).setContentIntent(pi).setAutoCancel(true).build());mark(c,d);true}catch(_:Exception){false}
    }
    @Synchronized fun deliver(c:Context,test:Boolean=false):Boolean {
        val p=prefs(c);val l=lang(c);if(!p.getBoolean(key(l,"enabled"),false)||QatraMedicineOverlayService.culturePriorityActive)return false
        val a=candidates(c,!test).firstOrNull()?:return false;val d=JSONObject(a.toString()).put("deliveryId",UUID.randomUUID().toString()).put("revision",p.getLong("revision",0)).put("test",test);p.edit().putString("delivery",d.toString()).commit()
        val mode=p.getString(key(l,"mode"),"both");val power=c.getSystemService(Context.POWER_SERVICE) as PowerManager;val keyguard=c.getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager;var accepted=false
        if(mode!="notification"&&overlayAllowed(c)&&power.isInteractive&&!keyguard.isKeyguardLocked)accepted=runCatching{c.startService(Intent(c,QatraCultureOverlayService::class.java).putExtra("delivery",d.getString("deliveryId")))!=null}.getOrDefault(false)
        val posted=if(mode!="overlay"||!accepted)notify(c,d)else false;return accepted||posted
    }
    fun tick(c:Context,intent:Intent){
        val p=prefs(c);if(intent.getStringExtra("language")!=lang(c)||intent.getLongExtra("revision",-1)!=p.getLong("revision",0)||p.getLong("nextAt",Long.MAX_VALUE)>System.currentTimeMillis()+60000)return
        if(QatraMedicineOverlayService.culturePriorityActive){schedule(c,15*60000L);return};schedule(c);deliver(c)
    }
    fun scene(c:Context,d:JSONObject,close:()->Unit):View {
        fun dp(x: Int): Int {
            return (x * c.resources.displayMetrics.density).toInt()
        }
        val l = d.getString("language")
        val root=FrameLayout(c).apply{setBackgroundColor(0x77000000);setOnClickListener{close()}}
        val content=LinearLayout(c).apply{orientation=LinearLayout.VERTICAL;layoutDirection=if(l=="ar")View.LAYOUT_DIRECTION_RTL else View.LAYOUT_DIRECTION_LTR;setPadding(dp(22),dp(20),dp(22),dp(20));background=GradientDrawable(GradientDrawable.Orientation.TL_BR,intArrayOf(0xF21D354F.toInt(),0xF20F192B.toInt())).apply{cornerRadius=dp(24).toFloat();setStroke(dp(1).coerceAtLeast(1),0x668ACFEF)}}
        fun line(text:String,size:Float){content.addView(TextView(c).apply{this.text=text;textSize=size;setTextColor(Color.WHITE);setPadding(0,dp(5),0,dp(5))},LinearLayout.LayoutParams(-1,-2))}
        line(word(l,0),13f);line(d.getString("title"),21f);line(d.optString("author").ifBlank{word(l,3)},15f);if(d.optString("translator").isNotBlank())line(d.getString("translator"),13f);line(d.optString("excerpt"),16f);line("Global Voices",13f);if(d.optLong("publishedAt")>0)line(java.text.DateFormat.getDateInstance(java.text.DateFormat.MEDIUM,Locale.forLanguageTag(l)).format(Date(d.getLong("publishedAt"))),12f)
        val message=TextView(c).apply{setTextColor(Color.WHITE)}
        fun button(text:String,action:()->Unit){content.addView(Button(c).apply{this.text=text;isAllCaps=false;minHeight=dp(48);setOnClickListener{action()}},LinearLayout.LayoutParams(-1,-2).apply{topMargin=dp(10)})}
        button(word(l,1)){if(delivery(c,d.optString("deliveryId"))!=null)runCatching{c.startActivity(Intent(Intent.ACTION_VIEW,Uri.parse(d.getString("url"))).addCategory(Intent.CATEGORY_BROWSABLE).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK));close()}.onFailure{message.text="Global Voices: "+word(l,1)}};button(word(l,2),close);content.addView(message)
        val card=object:ScrollView(c){override fun onMeasure(w:Int,h:Int){super.onMeasure(w,View.MeasureSpec.makeMeasureSpec((resources.displayMetrics.heightPixels*.78f).toInt(),View.MeasureSpec.AT_MOST))}}.apply{isClickable=true;visibility=View.INVISIBLE;addView(content)}
        val width=(c.resources.displayMetrics.widthPixels-dp(32)).coerceAtMost(dp(460)).coerceAtLeast(1);root.addView(card,FrameLayout.LayoutParams(width,-2,Gravity.CENTER))
        val drop=object:View(c){val paint=Paint(Paint.ANTI_ALIAS_FLAG).apply{color=0xFF7BDBF4.toInt()};override fun onDraw(canvas:Canvas){val path=Path();val w=width.toFloat();val h=height.toFloat();path.moveTo(w/2,0f);path.cubicTo(w*.4f,h*.25f,0f,h*.45f,0f,h*.68f);path.cubicTo(0f,h*1.1f,w,h*1.1f,w,h*.68f);path.cubicTo(w,h*.45f,w*.6f,h*.25f,w/2,0f);canvas.drawPath(path,paint)}}
        root.addView(drop,FrameLayout.LayoutParams(dp(54),dp(76),Gravity.CENTER));root.post{if(root.isAttachedToWindow){val reduced=Build.VERSION.SDK_INT>=26&&!android.animation.ValueAnimator.areAnimatorsEnabled();val reveal={drop.visibility=View.GONE;card.visibility=View.VISIBLE};if(reduced)reveal()else{drop.translationY=-c.resources.displayMetrics.heightPixels*.55f;drop.animate().translationY(0f).setDuration(900).withEndAction{if(root.isAttachedToWindow)reveal()}.start()}}};return root
    }
}

@CapacitorPlugin(name="QatraCultureSchedule")
class QatraCultureSchedulePlugin:Plugin(){
    private fun run(call:PluginCall,action:(String)->JSObject){try{call.resolve(action(call.getString("language").orEmpty()))}catch(_:Exception){call.reject("CULTURE_SCHEDULE_FAILED")}}
    @PluginMethod fun getStatus(call:PluginCall)=run(call){QatraCultureRuntime.status(context,it)}
    @PluginMethod fun selection(call:PluginCall)=run(call){l->QatraCultureRuntime.selection(context,l,call.getString("source").orEmpty(),call.getString("field")?:"all");JSObject().apply{put("saved",true)}}
    @PluginMethod fun configure(call:PluginCall)=run(call){l->val number=call.data.opt("hours") as? Number?:throw IllegalArgumentException();require(number.toDouble()==number.toInt().toDouble());QatraCultureRuntime.configure(context,l,call.getString("source").orEmpty(),call.getString("field")?:"all",call.getBoolean("enabled")?:false,number.toInt(),call.getString("mode")?:"both")}
    @PluginMethod fun testNow(call:PluginCall)=run(call){l->QatraCultureRuntime.status(context,l);JSObject().apply{put("accepted",QatraCultureRuntime.deliver(context,true))}}
    @PluginMethod fun openPermission(call:PluginCall)=run(call){l->QatraCultureRuntime.status(context,l);val kind=call.getString("kind");require(kind in setOf("overlay","notifications"));val intent=if(kind=="overlay")Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,Uri.parse("package:"+context.packageName))else Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).putExtra(Settings.EXTRA_APP_PACKAGE,context.packageName);activity.startActivity(intent);JSObject().apply{put("opened",true)}}
}
class QatraCultureAlarmReceiver:BroadcastReceiver(){override fun onReceive(context:Context,intent:Intent){runCatching{QatraCultureRuntime.tick(context,intent)}}}
class QatraCultureBootReceiver:BroadcastReceiver(){override fun onReceive(context:Context,intent:Intent){if(intent.action in setOf(Intent.ACTION_BOOT_COMPLETED,Intent.ACTION_MY_PACKAGE_REPLACED))runCatching{QatraCultureRuntime.schedule(context)}}}
class QatraCultureCardActivity:Activity(){
    private val handler=Handler(Looper.getMainLooper());private var id:String?=null
    private val check=object:Runnable{override fun run(){if(QatraCultureRuntime.delivery(this@QatraCultureCardActivity,id)==null)finish()else handler.postDelayed(this,500)}}
    override fun onCreate(state:Bundle?){super.onCreate(state);window.setBackgroundDrawable(android.graphics.drawable.ColorDrawable(Color.TRANSPARENT));id=intent.getStringExtra("delivery");val d=QatraCultureRuntime.delivery(this,id);if(d==null){finish();return};setContentView(QatraCultureRuntime.scene(this,d){finish()});handler.post(check)}
    override fun onDestroy(){handler.removeCallbacksAndMessages(null);super.onDestroy()}
}
class QatraCultureOverlayService:Service(){
    private val handler=Handler(Looper.getMainLooper());private var root:View?=null;private var id:String?=null
    private val manager:WindowManager by lazy{getSystemService(WINDOW_SERVICE) as WindowManager}
    private val check=object:Runnable{override fun run(){if(QatraCultureRuntime.delivery(this@QatraCultureOverlayService,id)==null||QatraMedicineOverlayService.culturePriorityActive)stopSelf()else handler.postDelayed(this,400)}}
    override fun onBind(intent:Intent?):IBinder?=null
    override fun onStartCommand(intent:Intent?,flags:Int,startId:Int):Int {
        id=intent?.getStringExtra("delivery");val d=QatraCultureRuntime.delivery(this,id);if(d==null||QatraMedicineOverlayService.culturePriorityActive){stopSelf();return START_NOT_STICKY}
        root?.let{runCatching{manager.removeViewImmediate(it)}}
        try{val view=QatraCultureRuntime.scene(this,d){stopSelf()};root=view;val params=WindowManager.LayoutParams(-1,-1,if(Build.VERSION.SDK_INT>=26)WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY else WindowManager.LayoutParams.TYPE_PHONE,WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,PixelFormat.TRANSLUCENT);manager.addView(view,params);QatraCultureRuntime.mark(this,d);handler.removeCallbacks(check);handler.post(check)}catch(_:Exception){QatraCultureRuntime.notify(this,d);stopSelf()};return START_NOT_STICKY
    }
    override fun onDestroy(){handler.removeCallbacksAndMessages(null);root?.let{it.animate().cancel();runCatching{manager.removeViewImmediate(it)}};root=null;super.onDestroy()}
}
