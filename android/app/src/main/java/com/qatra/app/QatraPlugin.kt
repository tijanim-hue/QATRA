package com.qatra.app

import android.Manifest
import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import java.util.Calendar

@CapacitorPlugin(name = "QatraNative")
class QatraPlugin : Plugin() {

    @PluginMethod
    fun askPermissions(call: PluginCall) {
        val activity = activity ?: return call.reject("No activity")
        
        try {
            // 1. إذن الإشعارات
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                if (context.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                    activity.requestPermissions(arrayOf(Manifest.permission.POST_NOTIFICATIONS), 1001)
                }
            }
            // 2. إذن المنبهات الدقيقة (بدونه ينهار التطبيق)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
                if (!alarmManager.canScheduleExactAlarms()) {
                    val intent = Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM)
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                    context.startActivity(intent)
                }
            }
            // 3. إذن الظهور فوق التطبيقات (للقطرة السينمائية)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(context)) {
                val intent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:${context.packageName}"))
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                context.startActivity(intent)
            }
            call.resolve()
        } catch (e: Exception) {
            call.reject("Permission error", e)
        }
    }

    @PluginMethod
    fun showDrop(call: PluginCall) {
        val quote = call.getString("quote") ?: "سبحان الله"
        try {
            val serviceIntent = Intent(context, QatraOverlayService::class.java).apply { putExtra("quote", quote) }
            context.startService(serviceIntent)
        } catch (e: Exception) { e.printStackTrace() }
        call.resolve()
    }

    @PluginMethod
    fun schedule(call: PluginCall) {
        val id = call.getInt("id") ?: return call.reject("ID missing")
        val time = call.getString("time") ?: return call.reject("Time missing") // format "HH:mm"
        val quote = call.getString("quote") ?: "حان وقت التأمل"
        val mode = call.getString("mode") ?: "both"

        try {
            val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            val intent = Intent(context, QatraAlarmReceiver::class.java).apply {
                putExtra("id", id)
                putExtra("quote", quote)
                putExtra("mode", mode)
            }
            
            val pendingIntent = PendingIntent.getBroadcast(
                context, id, intent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            // حساب الوقت
            val parts = time.split(":")
            val calendar = Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, parts[0].toInt())
                set(Calendar.MINUTE, parts[1].toInt())
                set(Calendar.SECOND, 0)
                if (before(Calendar.getInstance())) { add(Calendar.DATE, 1) } // إذا مر الوقت، اجدوله للغد
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !alarmManager.canScheduleExactAlarms()) {
                // تجاوز الانهيار إذا رفض المستخدم الإذن
                alarmManager.setWindow(AlarmManager.RTC_WAKEUP, calendar.timeInMillis, 1000 * 60 * 10, pendingIntent)
            } else {
                alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, calendar.timeInMillis, pendingIntent)
            }
            call.resolve()
        } catch (e: Exception) {
            call.reject("Schedule error", e)
        }
    }

    @PluginMethod
    fun cancel(call: PluginCall) {
        val id = call.getInt("id") ?: return call.reject("ID missing")
        try {
            val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            val intent = Intent(context, QatraAlarmReceiver::class.java)
            val pendingIntent = PendingIntent.getBroadcast(context, id, intent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
            alarmManager.cancel(pendingIntent)
            call.resolve()
        } catch (e: Exception) { call.reject("Cancel error", e) }
    }
}
