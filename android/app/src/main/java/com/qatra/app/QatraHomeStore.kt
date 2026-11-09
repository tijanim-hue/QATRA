package com.qatra.app

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import org.json.JSONArray
import org.json.JSONObject
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/** Native ledger: the preview reads the exact payload registered with AlarmManager. */
object QatraHomeStore {
    private const val PREFS = "QatraHomeLedgerV1"
    private fun prefs(context: Context) = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
    private fun json(value: String?): JSONObject = try { JSONObject(value ?: "{}") } catch (_: Exception) { JSONObject() }
    private fun array(value: String?): JSONArray = try { JSONArray(value ?: "[]") } catch (_: Exception) { JSONArray() }
    private fun today(): String = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date())

    @Synchronized
    fun remember(context: Context, id: Int, at: Long, interval: Long, quote: String,
                 category: String, mode: String, duration: Int, showImage: Boolean) {
        val p = prefs(context)
        val alarms = json(p.getString("alarms", null))
        alarms.put(id.toString(), JSONObject().apply {
            put("id", id); put("at", at); put("interval", interval); put("quote", quote)
            put("category", category); put("mode", mode); put("duration", duration); put("showImage", showImage)
        })
        p.edit().putString("alarms", alarms.toString()).putBoolean("initialized", true).commit()
    }

    @Synchronized
    fun remove(context: Context, id: Int) {
        val p = prefs(context)
        val alarms = json(p.getString("alarms", null))
        alarms.remove(id.toString())
        p.edit().putString("alarms", alarms.toString()).commit()
    }

    @Synchronized
    fun delivered(context: Context, id: Int) {
        val p = prefs(context)
        val alarms = json(p.getString("alarms", null))
        val alarm = alarms.optJSONObject(id.toString()) ?: return
        val interval = alarm.optLong("interval", 0L)
        if (interval > 0L) {
            val at = alarm.optLong("at")
            val steps = maxOf(1L, (System.currentTimeMillis() - at) / interval + 1L)
            alarm.put("at", at + steps * interval)
        } else alarms.remove(id.toString())
        p.edit().putString("alarms", alarms.toString()).commit()
    }

    @Synchronized
    fun prune(context: Context, ids: Set<Int>) {
        val p = prefs(context)
        val alarms = json(p.getString("alarms", null))
        val manager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val keys = mutableListOf<String>()
        val iterator = alarms.keys()
        while (iterator.hasNext()) keys.add(iterator.next())
        for (key in keys) {
            val id = key.toIntOrNull() ?: continue
            if (id != 99999 && !ids.contains(id)) {
                val intent = Intent(context, QatraAlarmReceiver::class.java)
                val pending = PendingIntent.getBroadcast(context, id, intent,
                    PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
                manager.cancel(pending)
                alarms.remove(key)
            }
        }
        p.edit().putString("alarms", alarms.toString()).putBoolean("initialized", true).commit()
    }

    @Synchronized
    fun like(context: Context, occurrence: String, category: String): Boolean {
        val p = prefs(context)
        val seen = array(p.getString("seen", null))
        for (i in 0 until seen.length()) if (seen.optString(i) == occurrence) return false
        val trimmed = JSONArray()
        for (i in maxOf(0, seen.length() - 255) until seen.length()) trimmed.put(seen.optString(i))
        trimmed.put(occurrence)
        val days = json(p.getString("days", null))
        val date = today()
        val day = days.optJSONObject(date) ?: JSONObject()
        day.put("likes", day.optLong("likes", 0L) + 1L)
        val dayCategories = day.optJSONObject("categories") ?: JSONObject()
        dayCategories.put(category, dayCategories.optLong(category, 0L) + 1L)
        day.put("categories", dayCategories)
        days.put(date, day)
        val categories = json(p.getString("categories", null))
        categories.put(category, categories.optLong(category, 0L) + 1L)
        return p.edit().putString("seen", trimmed.toString()).putString("days", days.toString())
            .putString("categories", categories.toString()).putLong("total", p.getLong("total", 0L) + 1L).commit()
    }

    @Synchronized
    fun snapshot(context: Context): JSONObject {
        val p = prefs(context)
        val alarms = json(p.getString("alarms", null))
        var next: JSONObject? = null
        val iterator = alarms.keys()
        while (iterator.hasNext()) {
            val item = alarms.optJSONObject(iterator.next()) ?: continue
            if (next == null || item.optLong("at") < next.optLong("at")) next = item
        }
        val day = json(p.getString("days", null)).optJSONObject(today()) ?: JSONObject()
        return JSONObject().apply {
            put("nativeNow", System.currentTimeMillis()); put("date", today())
            put("initialized", p.getBoolean("initialized", false)); put("next", next ?: JSONObject.NULL)
            put("todayLikes", day.optLong("likes", 0L)); put("todayCategories", day.optJSONObject("categories") ?: JSONObject())
            put("totalLikes", p.getLong("total", 0L)); put("categories", json(p.getString("categories", null)))
        }
    }

    @Synchronized
    fun restore(context: Context) {
        val p = prefs(context)
        val alarms = json(p.getString("alarms", null))
        val manager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val iterator = alarms.keys()
        val now = System.currentTimeMillis()
        while (iterator.hasNext()) {
            val item = alarms.optJSONObject(iterator.next()) ?: continue
            val id = item.optInt("id")
            val interval = item.optLong("interval", 0L)
            var at = item.optLong("at")
            if (at <= now) at = if (interval > 0L) at + ((now - at) / interval + 1L) * interval else now + 2000L
            val intent = Intent(context, QatraAlarmReceiver::class.java).apply {
                putExtra("id", id); putExtra("quote", item.optString("quote")); putExtra("category", item.optString("category", "dhikr"))
                putExtra("mode", item.optString("mode", "both")); putExtra("duration", item.optInt("duration", 10000))
                putExtra("showImage", item.optBoolean("showImage", false))
            }
            val pending = PendingIntent.getBroadcast(context, id, intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
            try {
                if (interval > 0L) manager.setRepeating(AlarmManager.RTC_WAKEUP, at, interval, pending)
                else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) manager.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, at, pending)
                else manager.setExact(AlarmManager.RTC_WAKEUP, at, pending)
                item.put("at", at)
            } catch (_: SecurityException) {
                manager.setWindow(AlarmManager.RTC_WAKEUP, at, 600000L, pending)
                item.put("at", at)
                if (interval > 0L) item.put("interval", 0L)
            }
        }
        p.edit().putString("alarms", alarms.toString()).commit()
    }
}
