package com.qatra.app

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.getcapacitor.*
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.annotation.PluginMethod

@CapacitorPlugin(name = "QatraNative")
class QatraPlugin : Plugin() {
    @PluginMethod
    fun requestOverlayPermission(call: PluginCall) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(context)) {
            val intent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:${context.packageName}"))
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            activity.startActivity(intent)
            call.resolve(JSObject().put("granted", false).put("openedSettings", true))
        } else {
            call.resolve(JSObject().put("granted", true))
        }
    }

    @PluginMethod
    fun showDrop(call: PluginCall) {
        val text = call.getString("text") ?: "خذ لحظة هدوء."
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(context)) {
            call.reject("يرجى السماح لقطرة بالظهور فوق التطبيقات أولاً")
            return
        }
        val i = Intent(context, QatraOverlayService::class.java).apply {
            action = QatraOverlayService.ACTION_SHOW
            putExtra("quote", text)
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) context.startForegroundService(i) else context.startService(i)
        call.resolve()
    }

    @PluginMethod
    fun hideDrop(call: PluginCall) {
        val i = Intent(context, QatraOverlayService::class.java).apply { action = QatraOverlayService.ACTION_HIDE }
        context.startService(i)
        call.resolve()
    }

    @PluginMethod
    fun schedule(call: PluginCall) {
        val id = call.getString("id") ?: System.currentTimeMillis().toString()
        val time = call.getString("time") ?: "09:00"
        val days = call.getArray("days")
        val mode = call.getString("mode") ?: "both"
        val quote = call.getString("quote") ?: "امنح نفسك لحظة هدوء."
        QatraNotifications.schedule(context, id, time, days, mode, quote)
        call.resolve()
    }

    @PluginMethod
    fun cancel(call: PluginCall) {
        val id = call.getString("id") ?: ""
        QatraNotifications.cancel(context, id)
        call.resolve()
    }

    @PluginMethod
    fun requestNotificationPermission(call: PluginCall) {
        if (Build.VERSION.SDK_INT >= 33) {
            permission台(call)
        } else call.resolve(JSObject().put("granted", true))
    }

    private fun permission台(call: PluginCall) {
        // Permission prompt is requested by the app's Activity through the Capacitor permission flow.
        // Keep result explicit rather than falsely reporting that permission has been granted.
        call.resolve(JSObject().put("required", true).put("granted", false).put("note", "اطلب POST_NOTIFICATIONS من واجهة Android"))
    }
}
