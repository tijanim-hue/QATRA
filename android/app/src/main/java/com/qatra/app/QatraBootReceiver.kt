package com.qatra.app

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class QatraBootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_BOOT_COMPLETED || intent.action == "android.intent.action.QUICKBOOT_POWERON") {
            QatraNotifications.restoreAlarms(context)
            QatraHomeStore.restore(context)
        }
    }
}
