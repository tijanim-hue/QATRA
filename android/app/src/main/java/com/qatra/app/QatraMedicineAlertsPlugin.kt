package com.qatra.app

import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "QatraMedicineAlerts")
class QatraMedicineAlertsPlugin : Plugin() {
    private fun snapshot(): JSObject = JSObject().apply {
        put("mode", QatraMedicineAlertPolicy.read(context).value)
        put("overlayAvailable", QatraMedicineAlertPolicy.overlayAvailable(context))
    }

    @PluginMethod fun getSettings(call: PluginCall) {
        try {
            call.resolve(snapshot())
        } catch (_: Exception) {
            call.reject("MEDICINE_ALERT_SETTINGS_UNAVAILABLE")
        }
    }

    @PluginMethod fun setSettings(call: PluginCall) {
        val value = call.getString("mode")
        if (value == null) {
            call.reject("MEDICINE_ALERT_MODE_INVALID")
            return
        }
        try {
            QatraMedicineAlertPolicy.Mode.parse(value)
            if (!QatraMedicineAlertPolicy.save(context, value)) {
                call.reject("MEDICINE_ALERT_SAVE_FAILED")
                return
            }
            call.resolve(snapshot().apply { put("saved", true) })
        } catch (_: IllegalArgumentException) {
            call.reject("MEDICINE_ALERT_MODE_INVALID")
        } catch (_: Exception) {
            call.reject("MEDICINE_ALERT_SETTINGS_UNAVAILABLE")
        }
    }
}
