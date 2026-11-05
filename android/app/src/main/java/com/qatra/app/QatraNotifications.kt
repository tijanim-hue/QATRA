package com.qatra.app

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import java.util.Calendar

object QatraNotifications {

    fun schedule(
        context: Context,
        id: String,
        time: String,
        days: com.getcapacitor.JSArray?,
        mode: String,
        quote: String
    ) {
        cancel(context, id)

        val parts = time.split(":")
        val hour = parts.getOrNull(0)?.toIntOrNull() ?: 9
        val minute = parts.getOrNull(1)?.toIntOrNull() ?: 0

        val dayList = mutableListOf<Int>()

        if (days != null) {
            for (i in 0 until days.length()) {
                val day = days.optInt(i, -1)
                if (day in 0..6) dayList.add(day)
            }
        }

        if (dayList.isEmpty()) return

        val alarmManager =
            context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

        dayList.forEach { day ->

            val requestCode = id.hashCode() * 31 + day

            val intent = Intent(context, QatraAlarmReceiver::class.java).apply {
                putExtra("scheduleId", id)
                putExtra("day", day)
                putExtra("time", time)
                putExtra("days", dayList.toIntArray())
                putExtra("mode", mode)
                putExtra("quote", quote)
            }

            val pendingIntent = PendingIntent.getBroadcast(
                context,
                requestCode,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )

            val calendar = Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, hour)
                set(Calendar.MINUTE, minute)
                set(Calendar.SECOND, 0)
                set(Calendar.MILLISECOND, 0)

                val targetDay = day + 1

                while (
                    get(Calendar.DAY_OF_WEEK) != targetDay ||
                    timeInMillis <= System.currentTimeMillis()
                ) {
                    add(Calendar.DAY_OF_YEAR, 1)
                }
            }

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                alarmManager.setExactAndAllowWhileIdle(
                    AlarmManager.RTC_WAKEUP,
                    calendar.timeInMillis,
                    pendingIntent
                )
            } else {
                alarmManager.setExact(
                    AlarmManager.RTC_WAKEUP,
                    calendar.timeInMillis,
                    pendingIntent
                )
            }
        }
    }

    fun cancel(context: Context, id: String) {
        val alarmManager =
            context.getSystemService(Context.ALARM_SERVICE) as AlarmManager

        for (day in 0..6) {
            val intent = Intent(context, QatraAlarmReceiver::class.java)

            val pendingIntent = PendingIntent.getBroadcast(
                context,
                id.hashCode() * 31 + day,
                intent,
                PendingIntent.FLAG_NO_CREATE or PendingIntent.FLAG_IMMUTABLE
            )

            if (pendingIntent != null) {
                alarmManager.cancel(pendingIntent)
                pendingIntent.cancel()
            }
        }
    }
}
