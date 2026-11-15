package com.qatra.app

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class QatraMedicineActionReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val doseId = intent.getStringExtra(QatraMedicineReminderScheduler.EXTRA_DOSE_ID) ?: return
        if (doseId.isBlank()) return
        val database = QatraMedicineDatabase(context)
        try {
            when (intent.action) {
                ACTION_TAKE -> database.confirmTaken(doseId)
                ACTION_SNOOZE -> {
                    val name = intent.getStringExtra(QatraMedicineReminderScheduler.EXTRA_NAME) ?: return
                    val amount = intent.getStringExtra(QatraMedicineReminderScheduler.EXTRA_AMOUNT) ?: return
                    val scheduledAt = intent.getLongExtra(QatraMedicineReminderScheduler.EXTRA_SCHEDULED_AT, 0L)
                    if (name.isBlank() || amount.isBlank() || scheduledAt <= 0L) return
                    QatraMedicineReminderScheduler.scheduleSnooze(context, doseId, name, amount, scheduledAt)
                }
            }
        } finally {
            database.close()
        }
    }

    companion object {
        const val ACTION_TAKE = "com.qatra.app.MEDICINE_TAKE"
        const val ACTION_SNOOZE = "com.qatra.app.MEDICINE_SNOOZE"
    }
}
