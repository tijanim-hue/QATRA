package com.qatra.app

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

    @PluginMethod fun listMedicines(call: PluginCall) = execute(call) { db ->
        JSObject().apply { put("medicines", db.listMedicines()) }
    }

    @PluginMethod fun addMedicine(call: PluginCall) = execute(call) { db ->
        val values = call.getArray("dailyTimes") ?: throw IllegalArgumentException("dailyTimes")
        val times = (0 until values.length()).map { index ->
            values.get(index) as? String ?: throw IllegalArgumentException("dailyTimes")
        }
        val id = db.addMedicine(
            call.getString("name").orEmpty(), call.getString("strength").orEmpty(),
            call.getString("unit").orEmpty(), integer(call, "doseMilli"),
            integer(call, "openingStockMilli"), times
        )
        JSObject().apply { put("id", id) }
    }

    /** Reads already-created occurrences; never creates doses or Android alarms. */
    @PluginMethod fun listTodayDoses(call: PluginCall) = execute(call) { db ->
        val day = Calendar.getInstance().apply {
            set(Calendar.HOUR_OF_DAY, 0); set(Calendar.MINUTE, 0)
            set(Calendar.SECOND, 0); set(Calendar.MILLISECOND, 0)
        }
        val start = day.timeInMillis
        day.add(Calendar.DAY_OF_MONTH, 1)
        val rows = JSONArray()
        db.readableDatabase.rawQuery(
            "SELECT id,medicine_name,medicine_strength,unit,quantity_milli,scheduled_at,status,taken_at FROM doses WHERE scheduled_at>=? AND scheduled_at<? ORDER BY scheduled_at,id",
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
        JSObject().apply { put("recorded", db.confirmTaken(id)) }
    }

    @Synchronized override fun handleOnDestroy() {
        database?.close()
        database = null
        super.handleOnDestroy()
    }
}
