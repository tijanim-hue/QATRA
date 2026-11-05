package com.qatra.app

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class QatraBootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent?) {
        // A full schedule restoration needs persistent schedule records. This receiver is wired for the next integration step.
        // Android may clear exact alarms after reboot; avoid claiming that schedules are restored until storage is connected.
    }
}
