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
    fun askPermissions(call: PluginCall) {
        val activity = activity ?: return call.reject("No activity")
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

    @PluginMethod
    fun showDrop(call: PluginCall) {
        val quote = call.getString("quote") ?: "سبحان الله"
        val serviceIntent = Intent(context, QatraOverlayService::class.java).apply {
            putExtra("quote", quote)
        }
        context.startService(serviceIntent)
        call.resolve()
    }
}
