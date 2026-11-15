package com.qatra.app

import android.content.ContentValues
import android.content.Context
import android.database.sqlite.SQLiteDatabase
import android.database.sqlite.SQLiteOpenHelper
import org.json.JSONArray
import org.json.JSONObject
import java.util.UUID

/** Private local storage only. Does not schedule alarms or recommend medication. */
class QatraMedicineDatabase(context: Context) : SQLiteOpenHelper(
    context.applicationContext, "qatra_medicine.db", null, 1
) {
    override fun onConfigure(db: SQLiteDatabase) {
        super.onConfigure(db)
        db.setForeignKeyConstraintsEnabled(true)
    }

    override fun onCreate(db: SQLiteDatabase) {
        db.execSQL("""
            CREATE TABLE medicines (
                id TEXT PRIMARY KEY NOT NULL,
                name TEXT NOT NULL,
                strength TEXT NOT NULL DEFAULT '',
                unit TEXT NOT NULL CHECK(unit IN ('tablet','capsule','ml','drop','other')),
                dose_milli INTEGER NOT NULL CHECK(dose_milli > 0),
                stock_milli INTEGER NOT NULL,
                daily_times_json TEXT NOT NULL,
                image_relative_path TEXT,
                archived INTEGER NOT NULL DEFAULT 0 CHECK(archived IN (0,1)),
                created_at INTEGER NOT NULL
            )
        """.trimIndent())
        db.execSQL("""
            CREATE TABLE doses (
                id TEXT PRIMARY KEY NOT NULL,
                medicine_id TEXT NOT NULL REFERENCES medicines(id) ON DELETE RESTRICT,
                scheduled_at INTEGER NOT NULL,
                medicine_name TEXT NOT NULL,
                medicine_strength TEXT NOT NULL,
                unit TEXT NOT NULL,
                quantity_milli INTEGER NOT NULL CHECK(quantity_milli > 0),
                status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','taken','skipped')),
                taken_at INTEGER,
                snooze_until INTEGER,
                revision INTEGER NOT NULL DEFAULT 0,
                UNIQUE(medicine_id, scheduled_at)
            )
        """.trimIndent())
        db.execSQL("""
            CREATE TABLE stock_movements (
                id TEXT PRIMARY KEY NOT NULL,
                operation_key TEXT NOT NULL UNIQUE,
                medicine_id TEXT NOT NULL REFERENCES medicines(id) ON DELETE RESTRICT,
                dose_id TEXT REFERENCES doses(id) ON DELETE RESTRICT,
                delta_milli INTEGER NOT NULL,
                reason TEXT NOT NULL,
                recorded_at INTEGER NOT NULL
            )
        """.trimIndent())
        db.execSQL("CREATE INDEX doses_by_time ON doses(status, scheduled_at)")
        db.execSQL("CREATE INDEX stock_by_medicine ON stock_movements(medicine_id, recorded_at)")
    }

    override fun onUpgrade(db: SQLiteDatabase, oldVersion: Int, newVersion: Int) {
        // No destructive fallback: future schema changes require an explicit migration.
        throw IllegalStateException("Missing medicine migration: $oldVersion -> $newVersion")
    }

    private fun <T> transaction(block: (SQLiteDatabase) -> T): T {
        val db = writableDatabase
        db.beginTransaction()
        try {
            val result = block(db)
            db.setTransactionSuccessful()
            return result
        } finally {
            db.endTransaction()
        }
    }

    /** Quantities are integers: 1000 = one unit, 500 = half, 250 = quarter. */
    fun addMedicine(
        name: String,
        strength: String,
        unit: String,
        doseMilli: Long,
        openingStockMilli: Long,
        dailyTimes: List<String>
    ): String {
        require(name.trim().length in 1..160)
        require(strength.length <= 160)
        require(unit in setOf("tablet", "capsule", "ml", "drop", "other"))
        require(doseMilli in 1L..1000000000000L)
        require(openingStockMilli in 0L..1000000000000L)
        require(dailyTimes.size in 1..24)
        require(dailyTimes.distinct().size == dailyTimes.size)
        require(dailyTimes.all { Regex("([01][0-9]|2[0-3]):[0-5][0-9]").matches(it) })
        val id = UUID.randomUUID().toString()
        val now = System.currentTimeMillis()
        return transaction { db ->
            db.insertOrThrow("medicines", null, ContentValues().apply {
                put("id", id)
                put("name", name.trim())
                put("strength", strength.trim())
                put("unit", unit)
                put("dose_milli", doseMilli)
                put("stock_milli", openingStockMilli)
                put("daily_times_json", JSONArray(dailyTimes.sorted()).toString())
                put("created_at", now)
            })
            db.insertOrThrow("stock_movements", null, ContentValues().apply {
                put("id", UUID.randomUUID().toString())
                put("operation_key", "opening:$id")
                put("medicine_id", id)
                put("delta_milli", openingStockMilli)
                put("reason", "opening")
                put("recorded_at", now)
            })
            id
        }
    }

    /** Creates a concrete occurrence, not an Android alarm. Retries return the same ID. */
    fun ensureDose(medicineId: String, scheduledAt: Long): String {
        require(scheduledAt > 0)
        return transaction { db ->
            db.rawQuery("SELECT id FROM doses WHERE medicine_id=? AND scheduled_at=?",
                arrayOf(medicineId, scheduledAt.toString())).use { row ->
                if (row.moveToFirst()) return@transaction row.getString(0)
            }
            val id = UUID.randomUUID().toString()
            db.rawQuery("SELECT name,strength,unit,dose_milli FROM medicines WHERE id=? AND archived=0",
                arrayOf(medicineId)).use { medicine ->
                require(medicine.moveToFirst()) { "Active medicine not found" }
                db.insertOrThrow("doses", null, ContentValues().apply {
                    put("id", id)
                    put("medicine_id", medicineId)
                    put("scheduled_at", scheduledAt)
                    put("medicine_name", medicine.getString(0))
                    put("medicine_strength", medicine.getString(1))
                    put("unit", medicine.getString(2))
                    put("quantity_milli", medicine.getLong(3))
                })
            }
            id
        }
    }

    /** True means newly recorded; false means already taken. All writes are atomic. */
    fun confirmTaken(doseId: String, takenAt: Long = System.currentTimeMillis()): Boolean {
        require(takenAt > 0 && takenAt <= System.currentTimeMillis())
        return transaction { db ->
            db.rawQuery("SELECT medicine_id,quantity_milli,status,revision FROM doses WHERE id=?",
                arrayOf(doseId)).use { dose ->
                require(dose.moveToFirst()) { "Dose not found" }
                if (dose.getString(2) == "taken") return@transaction false
                require(dose.getString(2) == "pending") { "Dose is not pending" }
                val medicineId = dose.getString(0)
                val amount = dose.getLong(1)
                val revision = dose.getLong(3) + 1
                val changed = db.update("doses", ContentValues().apply {
                    put("status", "taken")
                    put("taken_at", takenAt)
                    putNull("snooze_until")
                    put("revision", revision)
                }, "id=? AND status='pending'", arrayOf(doseId))
                check(changed == 1)
                // Negative stock flags an inventory discrepancy; never erase a reported dose.
                db.execSQL("UPDATE medicines SET stock_milli=stock_milli-? WHERE id=?",
                    arrayOf<Any>(amount, medicineId))
                db.insertOrThrow("stock_movements", null, ContentValues().apply {
                    put("id", UUID.randomUUID().toString())
                    put("operation_key", "dose:$doseId:$revision")
                    put("medicine_id", medicineId)
                    put("dose_id", doseId)
                    put("delta_milli", -amount)
                    put("reason", "taken")
                    put("recorded_at", takenAt)
                })
                true
            }
        }
    }

    fun listMedicines(): JSONArray {
        val result = JSONArray()
        readableDatabase.rawQuery("SELECT id,name,strength,unit,dose_milli,stock_milli,daily_times_json,archived FROM medicines ORDER BY created_at DESC", null).use { row ->
            while (row.moveToNext()) result.put(JSONObject().apply {
                put("id", row.getString(0))
                put("name", row.getString(1))
                put("strength", row.getString(2))
                put("unit", row.getString(3))
                put("doseMilli", row.getLong(4))
                put("stockMilli", row.getLong(5))
                put("inventoryNeedsReview", row.getLong(5) < 0)
                put("dailyTimes", JSONArray(row.getString(6)))
                put("archived", row.getInt(7) != 0)
            })
        }
        return result
    }
}
