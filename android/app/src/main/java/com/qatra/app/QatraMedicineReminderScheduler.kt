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

    fun exactAlarmsAvailable(context: Context): Boolean {
        val manager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        return Build.VERSION.SDK_INT < Build.VERSION_CODES.S || manager.canScheduleExactAlarms()
    }

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
            if (!exactAlarmsAvailable(context)) {
                manager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pending)
                return
            }
            val showIntent = Intent(context, MainActivity::class.java).apply {
                putExtra("openMedicine", true)
                data = Uri.Builder().scheme("qatra").authority("medicine")
                    .appendPath(doseId).appendPath("alarm-settings").build()
            }
            val showPending = PendingIntent.getActivity(context, 0, showIntent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
            manager.setAlarmClock(AlarmManager.AlarmClockInfo(triggerAt, showPending), pending)
        } catch (_: SecurityException) {
            manager.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAt, pending)
        }
    }

    /** Snoozing changes only delivery time, never the original dose timestamp. */
    fun scheduleSnooze(context: Context, doseId: String, name: String, amount: String,
        originalScheduledAt: Long, delayMinutes: Long = 10L): Long {
        require(delayMinutes in 1L..1440L)
        val target = Math.addExact(System.currentTimeMillis(), TimeUnit.MINUTES.toMillis(delayMinutes))
        scheduleAt(context, doseId, name, amount, target, originalScheduledAt)
        return target
    }

    fun cancel(context: Context, doseId: String) {
        val manager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val pending = PendingIntent.getBroadcast(context, ("reminder:$doseId").hashCode(), alarmIntent(context),
            PendingIntent.FLAG_NO_CREATE or PendingIntent.FLAG_IMMUTABLE) ?: return
        manager.cancel(pending)
        pending.cancel()
    }
}
