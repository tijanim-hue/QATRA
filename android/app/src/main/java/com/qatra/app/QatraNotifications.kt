package com.qatra.app

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import org.json.JSONArray
import org.json.JSONObject
import java.util.Calendar

object QatraNotifications {
    private const val PREFS_NAME = "QatraAlarmsPrefs"
    private const val ALARMS_KEY = "alarms_list"

    fun scheduleSingleDay(context: Context, id: Int, jsDay: Int, time: String, mode: String, quote: String) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val intent = Intent(context, QatraAlarmReceiver::class.java).apply {
            putExtra("id", id)
            putExtra("jsDay", jsDay)
            putExtra("time", time)
            putExtra("mode", mode)
            putExtra("quote", quote)
        }

        val uniqueId = (id * 10) + jsDay
        val pendingIntent = PendingIntent.getBroadcast(
            context, uniqueId, intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val targetTime = calculateNextTime(time, jsDay)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && !alarmManager.canScheduleExactAlarms()) {
            alarmManager.setWindow(AlarmManager.RTC_WAKEUP, targetTime, 1000 * 60 * 5, pendingIntent)
        } else {
            alarmManager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, targetTime, pendingIntent)
        }
    }

    private fun calculateNextTime(time: String, jsDay: Int): Long {
        val parts = time.split(":")
        val hour = parts[0].toInt()
        val minute = parts[1].toInt()

        val calendar = Calendar.getInstance()
        calendar.set(Calendar.HOUR_OF_DAY, hour)
        calendar.set(Calendar.MINUTE, minute)
        calendar.set(Calendar.SECOND, 0)
        calendar.set(Calendar.MILLISECOND, 0)

        val targetDay = jsDay + 1
        while (calendar.get(Calendar.DAY_OF_WEEK) != targetDay || calendar.timeInMillis <= System.currentTimeMillis()) {
            calendar.add(Calendar.DAY_OF_YEAR, 1)
        }
        return calendar.timeInMillis
    }

    fun cancelAlarm(context: Context, id: Int) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        for (jsDay in 0..6) {
            val uniqueId = (id * 10) + jsDay
            val intent = Intent(context, QatraAlarmReceiver::class.java)
            val pendingIntent = PendingIntent.getBroadcast(
                context, uniqueId, intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            alarmManager.cancel(pendingIntent)
        }
        removeAlarmFromPrefs(context, id)
    }

    fun saveAlarmToPrefs(context: Context, id: Int, time: String, days: List<Int>, mode: String, quote: String) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val alarmsStr = prefs.getString(ALARMS_KEY, "[]")
        val array = JSONArray(alarmsStr)
        val newArray = JSONArray()
        
        for (i in 0 until array.length()) {
            val obj = array.getJSONObject(i)
            if (obj.getInt("id") != id) newArray.put(obj)
        }

        val newObj = JSONObject().apply {
            put("id", id)
            put("time", time)
            put("mode", mode)
            put("quote", quote)
            put("days", JSONArray(days))
        }
        newArray.put(newObj)
        prefs.edit().putString(ALARMS_KEY, newArray.toString()).apply()
    }

    private fun removeAlarmFromPrefs(context: Context, id: Int) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val alarmsStr = prefs.getString(ALARMS_KEY, "[]")
        val array = JSONArray(alarmsStr)
        val newArray = JSONArray()
        for (i in 0 until array.length()) {
            val obj = array.getJSONObject(i)
            if (obj.getInt("id") != id) newArray.put(obj)
        }
        prefs.edit().putString(ALARMS_KEY, newArray.toString()).apply()
    }

    fun restoreAlarms(context: Context) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val alarmsStr = prefs.getString(ALARMS_KEY, "[]")
        val array = JSONArray(alarmsStr)

        for (i in 0 until array.length()) {
            val obj = array.getJSONObject(i)
            val id = obj.getInt("id")
            val time = obj.getString("time")
            val mode = obj.getString("mode")
            val quote = obj.getString("quote")
            val daysArray = obj.getJSONArray("days")

            for (j in 0 until daysArray.length()) {
                scheduleSingleDay(context, id, daysArray.getInt(j), time, mode, quote)
            }
        }
    }
}
