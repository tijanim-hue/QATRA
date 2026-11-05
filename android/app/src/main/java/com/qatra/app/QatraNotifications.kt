package com.qatra.app

import android.app.*
import android.content.Context
import android.content.Intent
import android.os.Build
import java.util.Calendar

object QatraNotifications {
    fun schedule(context: Context, id: String, time: String, days: com.getcapacitor.JSArray?, mode: String, quote: String) {
        val parts = time.split(":")
        val hour = parts.getOrNull(0)?.toIntOrNull() ?: 9
        val minute = parts.getOrNull(1)?.toIntOrNull() ?: 0
        val dayList = mutableListOf<Int>()
        if (days != null) for (i in 0 until days.length()) {
            val d = days.optInt(i, -1)
            if (d in 0..6) dayList.add(d)
        }
        if (dayList.isEmpty()) return
        dayList.forEach { day ->
            val requestCode = (id.hashCode() * 31 + day)
            val intent = Intent(context, QatraAlarmReceiver::class.java).apply {
                putExtra("scheduleId", id); putExtra("mode", mode); putExtra("quote", quote)
            }
            val pending = PendingIntent.getBroadcast(context, requestCode, intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
            val cal = Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, hour); set(Calendar.MINUTE, minute); set(Calendar.SECOND, 0); set(Calendar.MILLISECOND, 0)
                // Calendar Sunday=1, our JS Sunday=0
                val target = day + 1
                while (get(Calendar.DAY_OF_WEEK) != target || timeInMillis <= System.currentTimeMillis()) add(Calendar.DAY_OF_YEAR, 1)
            }
            val alarm = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
            if (Build.VERSION.SDK_INT >= 23) alarm.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, cal.timeInMillis, pending)
            else alarm.setExact(AlarmManager.RTC_WAKEUP, cal.timeInMillis, pending)
        }
    }

    fun cancel(context: Context, id: String) {
        for (day in 0..6) {
            val intent = Intent(context, QatraAlarmReceiver::class.java)
            val pi = PendingIntent.getBroadcast(context, id.hashCode() * 31 + day, intent,
                PendingIntent.FLAG_NO_CREATE or PendingIntent.FLAG_IMMUTABLE)
            if (pi != null) (context.getSystemService(Context.ALARM_SERVICE) as AlarmManager).cancel(pi)
        }
    }
}
