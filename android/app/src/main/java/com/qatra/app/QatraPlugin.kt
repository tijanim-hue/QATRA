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

@CapacitorPlugin(name = "QatraNative")
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
}
