package com.qatra.app
import android.content.Intent
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "QatraNative")
class QatraPlugin : Plugin() {
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
