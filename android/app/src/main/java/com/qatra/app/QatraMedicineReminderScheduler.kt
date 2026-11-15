package com.qatra.app

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import java.util.concurrent.TimeUnit

object QatraMedicineReminderScheduler {
    const val CHANNEL_ID = "qatra_medicine_reminders"
    const val EXTRA_DOSE_ID = "doseId"
    const val EXTRA_NAME = "medicineName"
    const val EXTRA_AMOUNT = "doseAmount"
    const val EXTRA_SCHEDULED_AT = "scheduledAt"

    fun schedule(context: Context, doseId: String, name: String, amount: String, scheduledAt: Long) {
        scheduleAt(context, doseId, name, amount, scheduledAt, scheduledAt)
    }

    private fun alarmIntent(context: Context): Intent = Intent(context, QatraMedicineReminderReceiver::class.java)

    private fun scheduleAt(context: Context, doseId: String, name: String, amount: String, triggerAt: Long, originalAt: Long) {
        require(doseId.isNotBlank() && name.isNotBlank() && amount.isNotBlank() && originalAt > 0L)
        if (triggerAt <= System.currentTimeMillis()) return
        val manager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent = alarmIntent(context).apply {
            putExtra(EXTRA_DOSE_ID, doseId)
            putExtra(EXTRA_NAME, name)
            putExtra(EXTRA_AMOUNT, amount)
            putExtra(EXTRA_SCHEDULED_AT, originalAt)
        }
        val pending = PendingIntent.getBroadcast(context, ("reminder:$doseId").hashCode(), intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !manager.canScheduleExactAlarms()) {
                manager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pending)
            } else {
                manager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pending)
            }
        } catch (_: SecurityException) {
            manager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pending)
        }
    }

    fun scheduleSnooze(context: Context, doseId: String, name: String, amount: String, originalScheduledAt: Long) {
        scheduleAt(context, doseId, name, amount,
            System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(10), originalScheduledAt)
    }

    fun cancel(context: Context, doseId: String) {
        val manager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val pending = PendingIntent.getBroadcast(context, ("reminder:$doseId").hashCode(), alarmIntent(context),
            PendingIntent.FLAG_NO_CREATE or PendingIntent.FLAG_IMMUTABLE) ?: return
        manager.cancel(pending)
        pending.cancel()
    }
}
