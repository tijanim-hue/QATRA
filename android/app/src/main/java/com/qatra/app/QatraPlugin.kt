package com.qatra.app

import android.Manifest
import android.app.AlarmManager
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

@CapacitorPlugin(name = "QatraNative")
class QatraPlugin : Plugin() {

    @PluginMethod
    fun askPermissions(call: PluginCall) {
        val activity = activity ?: return call.reject("No activity")
        
        // إذن الظهور فوق التطبيقات
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(context)) {
            val intent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:${context.packageName}"))
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(intent)
        }
        // إذن الإشعارات
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (context.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                activity.requestPermissions(arrayOf(Manifest.permission.POST_NOTIFICATIONS), 1001)
            }
        }
        // إذن المنبهات الدقيقة
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            if (!alarmManager.canScheduleExactAlarms()) {
                val intent = Intent(Settings.ACTION_REQUEST_SCHEDULE_EXACT_ALARM)
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                context.startActivity(intent)
            }
        }
        call.resolve()
    }

    @PluginMethod
    fun showDrop(call: PluginCall) {
        val quote = call.getString("quote") ?: "سبحان الله"
        val serviceIntent = Intent(context, QatraOverlayService::class.java).apply {
            putExtra("quote", quote)
        }
        context.startService(serviceIntent)
        call.resolve()
    }

    @PluginMethod
    fun schedule(call: PluginCall) {
        val id = call.getInt("id") ?: return call.reject("ID missing")
        call.resolve()
    }
}
