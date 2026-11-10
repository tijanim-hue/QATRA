package com.qatra.app
import android.Manifest
import android.app.AlarmManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import android.widget.Toast
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import java.util.Calendar
import com.getcapacitor.PermissionState
import com.getcapacitor.annotation.Permission
import com.getcapacitor.annotation.PermissionCallback
import androidx.core.app.NotificationManagerCompat


@CapacitorPlugin(name = "QatraNative", permissions = [Permission(alias = "qatraNotifications", strings = [Manifest.permission.POST_NOTIFICATIONS])])
class QatraPlugin : Plugin() {

private val likeReceiver = object : BroadcastReceiver() {
override fun onReceive(context: Context?, intent: Intent?) {
if (intent?.action == "com.qatra.app.QUOTE_LIKED") {
val category = intent.getStringExtra("category") ?: "dhikr"
val ret = JSObject()
ret.put("category", category)
notifyListeners("quoteLiked", ret)
}
}
}

override fun load() {
super.load()
context.registerReceiver(likeReceiver, IntentFilter("com.qatra.app.QUOTE_LIKED"), Context.RECEIVER_EXPORTED)
}

@PluginMethod
fun askPermissions(call: PluginCall) {
val activity = activity ?: return call.reject("No activity")
// 1. أولوية قصوى لإذن الطفو فوق التطبيقات
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(context)) {
activity.runOnUiThread {
Toast.makeText(context, "الرجاء تفعيل إذن (الظهور فوق التطبيقات) لكي تعمل القطرة 💧", Toast.LENGTH_LONG).show()
}
val intent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:${context.packageName}"))
intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
context.startActivity(intent)
}
// 2. إذن المنبهات الدقيقة
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
if (!alarmManager.canScheduleExactAlarms()) {
val intent = Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM)
intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
context.startActivity(intent)
}
}
// 3. إذن الإشعارات
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
if (context.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
activity.requestPermissions(arrayOf(Manifest.permission.POST_NOTIFICATIONS), 1001)
}
}
call.resolve()
}

@PluginMethod
fun scheduleInterval(call: PluginCall) {
val intervalMinutes = call.getInt("intervalMinutes") ?: 0
val mode = call.getString("mode") ?: "both"
val duration = call.getInt("duration") ?: 10000
val quote = call.getString("quote") ?: "سبحان الله"
val category = call.getString("category") ?: "dhikr"
val showImage = call.getBoolean("showImage") ?: false
val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
val intent = Intent(context, QatraAlarmReceiver::class.java).apply {
putExtra("id", 99999); putExtra("mode", mode); putExtra("duration", duration); putExtra("quote", quote); putExtra("category", category); putExtra("showImage", showImage)
}
val pendingIntent = PendingIntent.getBroadcast(context, 99999, intent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
if (intervalMinutes > 0) {
val intervalMillis = intervalMinutes * 60 * 1000L
val firstAt = System.currentTimeMillis() + intervalMillis
alarmManager.setRepeating(AlarmManager.RTC_WAKEUP, firstAt, intervalMillis, pendingIntent)
QatraHomeStore.remember(context, 99999, firstAt, intervalMillis, quote, category, mode, duration, showImage)
} else {
alarmManager.cancel(pendingIntent)
QatraHomeStore.remove(context, 99999)
}
call.resolve()
}

@PluginMethod
fun schedule(call: PluginCall) {
val id = call.getInt("id") ?: return call.reject("ID missing")
val time = call.getString("time") ?: return call.reject("Time missing")
val mode = call.getString("mode") ?: "both"
val duration = call.getInt("duration") ?: 10000
val quote = call.getString("quote") ?: "الحمد لله"
val category = call.getString("category") ?: "dhikr"
val showImage = call.getBoolean("showImage") ?: false
val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
val intent = Intent(context, QatraAlarmReceiver::class.java).apply {
putExtra("id", id); putExtra("mode", mode); putExtra("duration", duration); putExtra("quote", quote); putExtra("category", category); putExtra("showImage", showImage)
}
val pendingIntent = PendingIntent.getBroadcast(context, id, intent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
val parts = time.split(":")
val calendar = Calendar.getInstance().apply {
set(Calendar.HOUR_OF_DAY, parts[0].toInt())
set(Calendar.MINUTE, parts[1].toInt())
set(Calendar.SECOND, 0)
set(Calendar.MILLISECOND, 0)
if (timeInMillis <= System.currentTimeMillis()) add(Calendar.DATE, 1)
}
try {
alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, calendar.timeInMillis, pendingIntent)
} catch (e: Exception) {
alarmManager.setWindow(AlarmManager.RTC_WAKEUP, calendar.timeInMillis, 1000605, pendingIntent)
}
QatraHomeStore.remember(context, id, calendar.timeInMillis, 0L, quote, category, mode, duration, showImage)
call.resolve()
}

@PluginMethod
fun cancel(call: PluginCall) {
val id = call.getInt("id") ?: return call.resolve()
val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
val intent = Intent(context, QatraAlarmReceiver::class.java)
val pendingIntent = PendingIntent.getBroadcast(context, id, intent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
alarmManager.cancel(pendingIntent)
QatraHomeStore.remove(context, id)
call.resolve()
}

@PluginMethod
fun showDrop(call: PluginCall) {
val quote = call.getString("quote") ?: "سبحان الله"
val category = call.getString("category") ?: "dhikr"
val duration = call.getInt("duration") ?: 10000
val showImage = call.getBoolean("showImage") ?: false
val surprise = call.getBoolean("surprise") ?: false
val serviceIntent = Intent(context, QatraOverlayService::class.java).apply {
putExtra("surprise", surprise); putExtra("quote", quote); putExtra("duration", duration); putExtra("category", category); putExtra("showImage", showImage)
}
context.startService(serviceIntent)
call.resolve()
}

@PluginMethod
fun getHomeData(call: PluginCall) {
try { call.resolve(JSObject(QatraHomeStore.snapshot(context).toString())) }
catch (e: Exception) { call.reject("Unable to read home data", e) }
}

@PluginMethod
fun reconcileHomeAlarms(call: PluginCall) {
try {
val values = call.getArray("ids")
val ids = mutableSetOf<Int>()
if (values != null) for (i in 0 until values.length()) ids.add(values.getInt(i))
QatraHomeStore.prune(context, ids)
call.resolve()
} catch (e: Exception) { call.reject("Unable to reconcile alarms", e) }
}

// QATRA stage 5: experience bridge; existing alarms and likes remain unchanged.
private var qatraUiSounds:QatraUiSounds?=null
private fun experienceStatus():JSObject {
    val p=context.getSharedPreferences("QatraExperiencePrefs",Context.MODE_PRIVATE)
    val alarms=context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    return JSObject().apply{
        put("overlay",Build.VERSION.SDK_INT<Build.VERSION_CODES.M||Settings.canDrawOverlays(context))
        put("notifications",NotificationManagerCompat.from(context).areNotificationsEnabled())
        put("exactAlarms",Build.VERSION.SDK_INT<Build.VERSION_CODES.S||alarms.canScheduleExactAlarms())
        put("readAloud",p.getBoolean("readAloud",true))
        put("selectedVoice",p.getString("selectedVoice",""));put("wakeScreen",p.getBoolean("wakeScreen",false))
        put("wakeAttemptAt",p.getLong("wakeAttemptAt",0L));put("wakeOpenedAt",p.getLong("wakeOpenedAt",0L))
    }
}
@PluginMethod
fun getExperienceStatus(call:PluginCall){call.resolve(experienceStatus())}
@PluginMethod
fun openOverlayPermission(call:PluginCall){
    if(Build.VERSION.SDK_INT<Build.VERSION_CODES.M||Settings.canDrawOverlays(context)){call.resolve(experienceStatus());return}
    val screen=activity?:return call.reject("No activity")
    try{screen.startActivity(Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION,Uri.parse("package:${context.packageName}")));call.resolve()}
    catch(e:Exception){call.reject("Unable to open overlay settings",e)}
}
@PluginMethod
fun requestQatraNotifications(call:PluginCall){
    if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.TIRAMISU&&context.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)!=PackageManager.PERMISSION_GRANTED&&getPermissionState("qatraNotifications")!=PermissionState.DENIED){
        requestPermissionForAlias("qatraNotifications",call,"qatraNotificationsResult")
    }else if(!NotificationManagerCompat.from(context).areNotificationsEnabled()){
        val screen=activity?:return call.reject("No activity")
        try{
            val intent=if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.O)Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).putExtra(Settings.EXTRA_APP_PACKAGE,context.packageName)
                else Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS,Uri.parse("package:${context.packageName}"))
            screen.startActivity(intent);call.resolve()
        }catch(e:Exception){call.reject("Unable to open notification settings",e)}
    }else call.resolve(experienceStatus())
}
@PermissionCallback
private fun qatraNotificationsResult(call:PluginCall){call.resolve(experienceStatus())}
@PluginMethod
fun setExperiencePreferences(call:PluginCall){
    val edit=context.getSharedPreferences("QatraExperiencePrefs",Context.MODE_PRIVATE).edit()
    call.getBoolean("readAloud")?.let{edit.putBoolean("readAloud",it)}
    call.getBoolean("wakeScreen")?.let{edit.putBoolean("wakeScreen",it)}
    edit.commit();call.resolve(experienceStatus())
}
@PluginMethod
fun playUiSound(call:PluginCall){
    val name=call.getString("name")?:"tap"
    if(name!="tap"&&name!="startup"){call.reject("Unknown sound");return}
    val screen=activity?:return call.resolve()
    screen.runOnUiThread{try{if(qatraUiSounds==null)qatraUiSounds=QatraUiSounds(context);qatraUiSounds?.play(name)}catch(e:Exception){android.util.Log.w("QatraUiSounds","Optional UI sound unavailable",e)}}
    call.resolve()
}
override fun handleOnResume(){super.handleOnResume();notifyListeners("experienceResumed",experienceStatus())}
override fun handleOnDestroy(){qatraUiSounds?.release();qatraUiSounds=null;super.handleOnDestroy()}


    private var pluginTts: android.speech.tts.TextToSpeech? = null

    @PluginMethod
    fun getAvailableVoices(call: PluginCall) {
        if (pluginTts == null) {
            activity?.runOnUiThread {
                pluginTts = android.speech.tts.TextToSpeech(context) { status ->
                    if (status == android.speech.tts.TextToSpeech.SUCCESS) {
                        fetchVoices(call)
                    } else {
                        call.reject("TTS failed")
                    }
                }
            }
        } else {
            fetchVoices(call)
        }
    }

    private fun fetchVoices(call: PluginCall) {
        try {
            val arr = org.json.JSONArray()
            pluginTts?.voices?.forEach { v ->
                if (v.locale.language.startsWith("ar")) {
                    val obj = JSObject()
                    obj.put("id", v.name)
                    // تنظيف الاسم ليظهر بشكل مناسب
                    val shortName = v.name.split("-").lastOrNull() ?: v.name
                    obj.put("name", "${v.locale.displayName} ($shortName)")
                    arr.put(obj)
                }
            }
            call.resolve(JSObject().put("voices", arr))
        } catch (e: Exception) { call.reject(e.message) }
    }

    @PluginMethod
    fun testVoice(call: PluginCall) {
        val voiceId = call.getString("voiceId") ?: return call.reject("No id")
        try {
            val v = pluginTts?.voices?.firstOrNull { it.name == voiceId }
            if (v != null) {
                pluginTts?.voice = v
                pluginTts?.setPitch(0.85f)
                pluginTts?.setSpeechRate(0.85f)
                pluginTts?.speak("هكذا سيكون صوتي", android.speech.tts.TextToSpeech.QUEUE_FLUSH, null, null)
            }
        } catch (e: Exception) {}
        call.resolve()
    }

    @PluginMethod
    fun setVoicePreference(call: PluginCall) {
        val voiceId = call.getString("voiceId")
        context.getSharedPreferences("QatraExperiencePrefs", Context.MODE_PRIVATE).edit().putString("selectedVoice", voiceId).apply()
        call.resolve()
    }
}
