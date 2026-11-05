package com.qatra.app

import android.Manifest
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
    fun schedule(call: PluginCall) {
        val id = call.getInt("id") ?: return call.reject("ID is missing")
        val time = call.getString("time") ?: return call.reject("Time is missing")
        val daysArray = call.getArray("days") ?: return call.reject("Days are missing")
        val mode = call.getString("mode") ?: return call.reject("Mode is missing")
        val quote = call.getString("quote") ?: return call.reject("Quote is missing")

        val days = mutableListOf<Int>()
        for (i in 0 until daysArray.length()) { days.add(daysArray.getInt(i)) }

        QatraNotifications.saveAlarmToPrefs(context, id, time, days, mode, quote)
        for (day in days) { QatraNotifications.scheduleSingleDay(context, id, day, time, mode, quote) }
        call.resolve()
    }

    @PluginMethod
    fun cancel(call: PluginCall) {
        val id = call.getInt("id") ?: return call.reject("ID is missing")
        QatraNotifications.cancelAlarm(context, id)
        call.resolve()
    }

    @PluginMethod
    fun requestOverlayPermission(call: PluginCall) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(context)) {
            val intent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:${context.packageName}"))
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            context.startActivity(intent)
        }
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            if (context.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) {
                activity.requestPermissions(arrayOf(Manifest.permission.POST_NOTIFICATIONS), 1001)
            }
        }
        call.resolve()
    }
}
