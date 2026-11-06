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
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(context)) {
            val intent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:${context.packageName}"))
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(intent)
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            if (!alarmManager.canScheduleExactAlarms()) {
                val intent = Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM)
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                context.startActivity(intent)
            }
        }
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
        
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent = Intent(context, QatraAlarmReceiver::class.java).apply {
            putExtra("mode", mode); putExtra("duration", duration); putExtra("quote", quote)
        }
        val pendingIntent = PendingIntent.getBroadcast(context, 99999, intent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
        
        if (intervalMinutes > 0) {
            val intervalMillis = intervalMinutes * 60 * 1000L
            alarmManager.setRepeating(AlarmManager.RTC_WAKEUP, System.currentTimeMillis() + intervalMillis, intervalMillis, pendingIntent)
        } else {
            alarmManager.cancel(pendingIntent)
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

        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent = Intent(context, QatraAlarmReceiver::class.java).apply {
            putExtra("id", id); putExtra("mode", mode); putExtra("duration", duration); putExtra("quote", quote)
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
            alarmManager.setWindow(AlarmManager.RTC_WAKEUP, calendar.timeInMillis, 1000*60*5, pendingIntent)
        }
        call.resolve()
    }

    @PluginMethod
    fun cancel(call: PluginCall) {
        val id = call.getInt("id") ?: return call.resolve()
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent = Intent(context, QatraAlarmReceiver::class.java)
        val pendingIntent = PendingIntent.getBroadcast(context, id, intent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
        alarmManager.cancel(pendingIntent)
        call.resolve()
    }

    @PluginMethod
    fun showDrop(call: PluginCall) {
        val quote = call.getString("quote") ?: "سبحان الله"
        val duration = call.getInt("duration") ?: 10000
        val serviceIntent = Intent(context, QatraOverlayService::class.java).apply { 
            putExtra("quote", quote); putExtra("duration", duration)
        }
        // الإصلاح: استخدام startService العادي المعفى من القيود
        context.startService(serviceIntent)
        call.resolve()
    }
}
