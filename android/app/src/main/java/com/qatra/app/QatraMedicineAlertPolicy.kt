package com.qatra.app

import android.content.Context
import android.os.Build
import android.provider.Settings

object QatraMedicineAlertPolicy {
    enum class Mode(val value: String) {
        OVERLAY("overlay"), NOTIFICATION("notification"), BOTH("both");
        companion object {
            fun parse(value: String): Mode = values().firstOrNull { it.value == value }
                ?: throw IllegalArgumentException("Invalid medicine alert mode")
        }
    }

    data class Decision(val overlay: Boolean, val notification: Boolean)

    fun read(context: Context): Mode {
        val value = context.getSharedPreferences("QatraMedicinePrefs", Context.MODE_PRIVATE)
            .getString("alertMode", Mode.NOTIFICATION.value)
        return Mode.values().firstOrNull { it.value == value } ?: Mode.NOTIFICATION
    }

    @Synchronized fun save(context: Context, value: String): Boolean {
        val mode = Mode.parse(value)
        return context.getSharedPreferences("QatraMedicinePrefs", Context.MODE_PRIVATE)
            .edit().putString("alertMode", mode.value).commit()
    }

    fun decide(mode: Mode, overlayAvailable: Boolean): Decision = when (mode) {
        Mode.NOTIFICATION -> Decision(false, true)
        Mode.BOTH -> Decision(overlayAvailable, true)
        Mode.OVERLAY -> Decision(overlayAvailable, !overlayAvailable)
    }

    fun overlayAvailable(context: Context): Boolean =
        Build.VERSION.SDK_INT < Build.VERSION_CODES.M || Settings.canDrawOverlays(context)
}
