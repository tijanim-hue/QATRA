package com.qatra.app

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import java.util.concurrent.TimeUnit

object QatraMedicineReminderScheduler {
    const val CHANNEL_ID = "qatra_medicine_reminders"
    const val EXTRA_DOSE_ID = "doseId"
    const val EXTRA_NAME = "medicineName"
    const val EXTRA_AMOUNT = "doseAmount"
    const val EXTRA_SCHEDULED_AT = "scheduledAt"

    fun schedule(context: Context, doseId: String, name: String, amount: String, scheduledAt: Long) {
        if (scheduledAt <= System.currentTimeMillis()) return
        val manager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent = Intent(context, QatraMedicineReminderReceiver::class.java).apply {
            putExtra(EXTRA_DOSE_ID, doseId)
            putExtra(EXTRA_NAME, name)
            putExtra(EXTRA_AMOUNT, amount)
            putExtra(EXTRA_SCHEDULED_AT, scheduledAt)
        }
        val pending = PendingIntent.getBroadcast(
            context,
            ("reminder:$doseId").hashCode(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !manager.canScheduleExactAlarms()) {
            manager.setWindow(AlarmManager.RTC_WAKEUP, scheduledAt, TimeUnit.MINUTES.toMillis(5), pending)
        } else {
            manager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, scheduledAt, pending)
        }
    }

    fun scheduleSnooze(context: Context, doseId: String, name: String, amount: String, originalScheduledAt: Long) {
        val target = System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(10)
        schedule(context, "$doseId:snooze", name, amount, target)
    }

    fun cancel(context: Context, doseId: String) {
        val manager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent = Intent(context, QatraMedicineReminderReceiver::class.java)
        val pending = PendingIntent.getBroadcast(
            context,
            ("reminder:$doseId").hashCode(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        manager.cancel(pending)
    }
}
