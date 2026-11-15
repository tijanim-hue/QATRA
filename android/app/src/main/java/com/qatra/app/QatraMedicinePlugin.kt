package com.qatra.app

import android.app.NotificationManager
import android.content.ContentValues
import android.content.Context
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import org.json.JSONArray
import org.json.JSONObject
import java.util.Calendar

@CapacitorPlugin(name = "QatraMedicine")
class QatraMedicinePlugin : Plugin() {
    private var database: QatraMedicineDatabase? = null

    @Synchronized private fun execute(call: PluginCall, action: (QatraMedicineDatabase) -> JSObject) {
        try {
            val db = database ?: QatraMedicineDatabase(context).also { database = it }
            call.resolve(action(db))
        } catch (error: IllegalArgumentException) {
            call.reject("MEDICINE_INPUT_INVALID")
        } catch (error: Exception) {
            // Do not log medicine names or other health data.
            call.reject("MEDICINE_STORAGE_UNAVAILABLE")
        }
    }

    private fun integer(call: PluginCall, key: String): Long {
        val number = call.data.opt(key) as? Number ?: throw IllegalArgumentException(key)
        val result = number.toLong()
        require(number.toDouble().isFinite() && number.toDouble() == result.toDouble())
        return result
    }

    private data class MedicinePlan(val id: String, val at: Long, val name: String, val amount: String)

    private fun expectedMedicine(helper: QatraMedicineDatabase, id: String, expected: JSONObject): JSONObject {
        val rows = helper.listMedicines()
        val current = (0 until rows.length()).map { rows.getJSONObject(it) }
            .firstOrNull { it.getString("id") == id }
            ?: throw IllegalArgumentException("Medicine not found")
        for (key in listOf("name", "strength", "unit")) {
            require(current.getString(key) == expected.getString(key))
        }
        for (key in listOf("doseMilli", "stockMilli")) {
            require(current.getLong(key) == expected.getLong(key))
        }
        require(current.getBoolean("archived") == expected.getBoolean("archived"))
        require(current.getJSONArray("dailyTimes").toString() == expected.getJSONArray("dailyTimes").toString())
        return current
    }

    private fun pendingMedicineIds(helper: QatraMedicineDatabase, id: String, futureOnly: Boolean): List<String> {
        val result = mutableListOf<String>()
        val extra = if (futureOnly) " AND scheduled_at>${System.currentTimeMillis()}" else ""
        helper.readableDatabase.rawQuery(
            "SELECT id FROM doses WHERE medicine_id=? AND status='pending'$extra",
            arrayOf(id)
        ).use { row ->
            while (row.moveToNext()) result.add(row.getString(0))
        }
        return result
    }

    private fun rebuildMedicineToday(helper: QatraMedicineDatabase, id: String): List<MedicinePlan> {
        val rows = helper.listMedicines()
        val medicine = (0 until rows.length()).map { rows.getJSONObject(it) }
            .first { it.getString("id") == id }
        require(!medicine.getBoolean("archived"))
        val sql = helper.writableDatabase
        val now = System.currentTimeMillis()
        sql.execSQL(
            "UPDATE doses SET status='skipped',snooze_until=NULL WHERE medicine_id=? AND status='pending' AND scheduled_at>?",
            arrayOf<Any>(id, now)
        )
        val times = medicine.getJSONArray("dailyTimes")
        val plans = mutableListOf<MedicinePlan>()
        for (index in 0 until times.length()) {
            val parts = times.getString(index).split(":")
            val day = Calendar.getInstance().apply {
                isLenient = false
                set(Calendar.HOUR_OF_DAY, parts[0].toInt())
                set(Calendar.MINUTE, parts[1].toInt())
                set(Calendar.SECOND, 0)
                set(Calendar.MILLISECOND, 0)
            }
            val at = day.timeInMillis
            if (at <= now) continue
            val doseId = helper.ensureDose(id, at)
            val changed = sql.update(
                "doses",
                ContentValues().apply {
                    put("medicine_name", medicine.getString("name"))
                    put("medicine_strength", medicine.getString("strength"))
                    put("unit", medicine.getString("unit"))
                    put("quantity_milli", medicine.getLong("doseMilli"))
                    put("status", "pending")
                    putNull("snooze_until")
                },
                "id=? AND status!='taken'",
                arrayOf(doseId)
            )
            if (changed == 1) {
                plans.add(
                    MedicinePlan(
                        doseId,
                        at,
                        medicine.getString("name"),
                        "${medicine.getLong("doseMilli") / 1000.0} ${medicine.getString("unit")}"
                    )
                )
            }
        }
        return plans
    }

    private fun reconcileMedicine(cancelled: List<String>, plans: List<MedicinePlan>): Boolean {
        var warning = false
        for (id in cancelled) {
            try {
                dismissMedicineReminder(context, id)
            } catch (_: Exception) {
                warning = true
            }
        }
        for (plan in plans) {
            try {
                QatraMedicineReminderScheduler.schedule(
                    context, plan.id, plan.name, plan.amount, plan.at
                )
            } catch (_: Exception) {
                warning = true
            }
        }
        return warning
    }

    @PluginMethod fun listMedicines(call: PluginCall) = execute(call) { db ->
        JSObject().apply { put("medicines", db.listMedicines()) }
    }

    @PluginMethod fun addMedicine(call: PluginCall) = execute(call) { db ->
        val values = call.getArray("dailyTimes") ?: throw IllegalArgumentException("dailyTimes")
        val times = (0 until values.length()).map { index ->
            values.get(index) as? String ?: throw IllegalArgumentException("dailyTimes")
        }
        val doseMilli = integer(call, "doseMilli")
        val id = db.addMedicine(
            call.getString("name").orEmpty(), call.getString("strength").orEmpty(),
            call.getString("unit").orEmpty(), doseMilli,
            integer(call, "openingStockMilli"), times
        )
        var created = 0
        val today = Calendar.getInstance()
        for (time in times) {
            val parts = time.split(":")
            today.set(Calendar.HOUR_OF_DAY, parts[0].toInt())
            today.set(Calendar.MINUTE, parts[1].toInt())
            today.set(Calendar.SECOND, 0)
            today.set(Calendar.MILLISECOND, 0)
            val scheduledAt = today.timeInMillis
            if (scheduledAt > System.currentTimeMillis()) {
                val doseId = db.ensureDose(id, scheduledAt)
                QatraMedicineReminderScheduler.schedule(
                    context, doseId, call.getString("name").orEmpty(),
                    "${doseMilli / 1000.0} ${call.getString("unit").orEmpty()}", scheduledAt
                )
                created++
            }
        }
        JSObject().apply { put("id", id); put("createdDoses", created) }
    }

    @PluginMethod fun updateMedicine(call: PluginCall) = execute(call) { helper ->
        val id = call.getString("id").orEmpty()
        val values = call.getArray("dailyTimes") ?: throw IllegalArgumentException("dailyTimes")
        val times = (0 until values.length()).map { index ->
            values.get(index) as? String ?: throw IllegalArgumentException("dailyTimes")
        }
        val sql = helper.writableDatabase
        var cancelled: List<String> = emptyList()
        var plans: List<MedicinePlan> = emptyList()
        sql.beginTransaction()
        try {
            val old = expectedMedicine(helper, id, call.data.getJSONObject("expected"))
            require(!old.getBoolean("archived"))
            require(call.getString("unit") == old.getString("unit"))
            cancelled = pendingMedicineIds(helper, id, true)
            require(
                helper.updateMedicine(
                    id,
                    call.getString("name").orEmpty(),
                    call.getString("strength").orEmpty(),
                    old.getString("unit"),
                    integer(call, "doseMilli"),
                    times
                )
            )
            plans = rebuildMedicineToday(helper, id)
            sql.setTransactionSuccessful()
        } finally {
            sql.endTransaction()
        }
        val warning = reconcileMedicine(cancelled, plans)
        JSObject().apply { put("saved", true); put("reminderWarning", warning) }
    }

    @PluginMethod fun setArchived(call: PluginCall) = execute(call) { helper ->
        val id = call.getString("id").orEmpty()
        val archived = call.getBoolean("archived") ?: throw IllegalArgumentException("archived")
        val sql = helper.writableDatabase
        var cancelled: List<String> = emptyList()
        var plans: List<MedicinePlan> = emptyList()
        sql.beginTransaction()
        try {
            expectedMedicine(helper, id, call.data.getJSONObject("expected"))
            cancelled = pendingMedicineIds(helper, id, false)
            require(helper.setArchived(id, archived))
            if (!archived) plans = rebuildMedicineToday(helper, id)
            sql.setTransactionSuccessful()
        } finally {
            sql.endTransaction()
        }
        val warning = reconcileMedicine(cancelled, plans)
        JSObject().apply { put("saved", true); put("reminderWarning", warning) }
    }

    @PluginMethod fun listTodayDoses(call: PluginCall) = execute(call) { db ->
        val day = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, 0); set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0); set(Calendar.MILLISECOND, 0)
        }
        val start = day.timeInMillis
        day.add(Calendar.DAY_OF_MONTH, 1)
        val rows = JSONArray()
        db.readableDatabase.rawQuery(
            "SELECT id,medicine_name,medicine_strength,unit,quantity_milli,scheduled_at,status,taken_at FROM doses WHERE scheduled_at>=? AND scheduled_at<? AND (status!='pending' OR medicine_id IN (SELECT id FROM medicines WHERE archived=0)) ORDER BY scheduled_at,id",
            arrayOf(start.toString(), day.timeInMillis.toString())
        ).use { cursor ->
            while (cursor.moveToNext()) rows.put(JSONObject().apply {
                put("id", cursor.getString(0)); put("name", cursor.getString(1))
                put("strength", cursor.getString(2)); put("unit", cursor.getString(3))
                put("quantityMilli", cursor.getLong(4)); put("scheduledAt", cursor.getLong(5))
                put("status", cursor.getString(6))
                put("takenAt", if (cursor.isNull(7)) JSONObject.NULL else cursor.getLong(7))
            })
        }
        JSObject().apply { put("doses", rows) }
    }

    @PluginMethod fun confirmDoseTaken(call: PluginCall) = execute(call) { db ->
        val id = call.getString("doseId").orEmpty()
        require(id.isNotBlank())
        QatraMedicineReminderScheduler.cancel(context, id)
        JSObject().apply { put("recorded", db.confirmTaken(id)) }
    }

    companion object {
        fun activeMedicineDose(context: Context, id: String): Boolean {
            return try {
                val helper = QatraMedicineDatabase(context)
                try {
                    helper.readableDatabase.rawQuery(
                        "SELECT 1 FROM doses d JOIN medicines m ON m.id=d.medicine_id WHERE d.id=? AND d.status='pending' AND m.archived=0",
                        arrayOf(id)
                    ).use { it.moveToFirst() }
                } finally {
                    helper.close()
                }
            } catch (_: Exception) {
                false
            }
        }

        fun dismissMedicineReminder(context: Context, id: String) {
            QatraMedicineReminderScheduler.cancel(context, id)
            QatraMedicineReminderScheduler.cancel(context, "$id:snooze")
            val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.cancel(("medicine:$id").hashCode())
            manager.cancel(("medicine:$id:snooze").hashCode())
        }
    }

    @Synchronized override fun handleOnDestroy() {
        database?.close()
        database = null
        super.handleOnDestroy()
    }
}
