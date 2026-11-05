package com.qatra.app

import android.content.Intent
import android.net.Uri
import android.os.Build
import android.provider.Settings
import com.getcapacitor.*
import com.getcapacitor.annotation.CapacitorPlugin
import com.getcapacitor.PluginMethod


@CapacitorPlugin(
    name = "QatraNative")
class QatraPlugin : Plugin() {

    @PluginMethod
    fun requestOverlayPermission(call: PluginCall) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M &&
            !Settings.canDrawOverlays(context)
        ) {
            val intent = Intent(
                Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                Uri.parse("package:${context.packageName}")
            )
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            activity.startActivity(intent)

            call.resolve(
                JSObject()
                    .put("granted", false)
                    .put("openedSettings", true)
            )
        } else {
            call.resolve(JSObject().put("granted", true))
        }
    }

    @PluginMethod
    fun showDrop(call: PluginCall) {
        val text = call.getString("text") ?: "خذ لحظة هدوء."

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M &&
            !Settings.canDrawOverlays(context)
        ) {
            call.reject("يرجى السماح لقطرة بالظهور فوق التطبيقات أولاً")
            return
        }

        val intent = Intent(context, QatraOverlayService::class.java).apply {
            action = QatraOverlayService.ACTION_SHOW
            putExtra("quote", text)
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            context.startForegroundService(intent)
        } else {
            context.startService(intent)
        }

        call.resolve()
    }

    @PluginMethod
    fun hideDrop(call: PluginCall) {
        val intent = Intent(context, QatraOverlayService::class.java).apply {
            action = QatraOverlayService.ACTION_HIDE
        }

        context.startService(intent)
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
        if (Build.VERSION.SDK_INT < 33) {
            call.resolve(JSObject().put("granted", true))
            return
        }

        if (getPermissionState("notifications") == PermissionState.GRANTED) {
            call.resolve(JSObject().put("granted", true))
        } else {
            requestPermissionForAlias("notifications", call, "notificationPermissionCallback")
        }
    }

    @PermissionCallback
    private fun notificationPermissionCallback(call: PluginCall) {
        val granted = getPermissionState("notifications") == PermissionState.GRANTED
        call.resolve(JSObject().put("granted", granted))
    }
}
