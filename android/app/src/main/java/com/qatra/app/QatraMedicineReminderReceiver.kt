package com.qatra.app

import android.Manifest
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import androidx.core.content.ContextCompat
import java.math.BigDecimal
import java.util.Date

class QatraMedicineReminderReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val id = intent.getStringExtra(QatraMedicineReminderScheduler.EXTRA_DOSE_ID) ?: return
        val dose = readDose(context, id) ?: return
        val mode = QatraMedicineAlertPolicy.read(context)
        val decision = QatraMedicineAlertPolicy.decide(mode, QatraMedicineAlertPolicy.overlayAvailable(context))
        var overlayAccepted = false
        if (decision.overlay) {
            try {
                overlayAccepted = context.startService(Intent(context, QatraMedicineOverlayService::class.java)
                    .putExtra(QatraMedicineReminderScheduler.EXTRA_DOSE_ID, id)) != null
            } catch (_: Exception) {
                overlayAccepted = false
            }
        }
        if (decision.notification || !overlayAccepted) notifyDose(context, dose)
    }

    data class Dose(val id: String, val name: String, val amount: String, val scheduledAt: Long) {
        fun time(context: Context): String = android.text.format.DateFormat.getTimeFormat(context).format(Date(scheduledAt))
    }

    companion object {
        fun readDose(context: Context, id: String): Dose? {
            if (id.isBlank()) return null
            val helper = QatraMedicineDatabase(context)
            return try {
                helper.readableDatabase.rawQuery(
                    "SELECT d.medicine_name,d.quantity_milli,d.unit,d.scheduled_at FROM doses d JOIN medicines m ON m.id=d.medicine_id WHERE d.id=? AND d.status='pending' AND m.archived=0",
                    arrayOf(id)
                ).use { row ->
                    if (!row.moveToFirst()) null else {
                        val unit = when (row.getString(2)) {
                            "tablet" -> "حبة"
                            "capsule" -> "كبسولة"
                            "ml" -> "مل"
                            "drop" -> "قطرة"
                            else -> "وحدة"
                        }
                        val amount = BigDecimal.valueOf(row.getLong(1), 3).stripTrailingZeros().toPlainString()
                        Dose(id, row.getString(0), "$amount $unit", row.getLong(3))
                    }
                }
            } catch (_: Exception) {
                null
            } finally {
                helper.close()
            }
        }

        private fun action(context: Context, dose: Dose, take: Boolean): PendingIntent {
            val verb = if (take) "take" else "snooze"
            val intent = Intent(context, QatraMedicineActionReceiver::class.java).apply {
                action = if (take) QatraMedicineActionReceiver.ACTION_TAKE else QatraMedicineActionReceiver.ACTION_SNOOZE
                data = Uri.Builder().scheme("qatra").authority("medicine").appendPath(dose.id).appendPath(verb).build()
                putExtra(QatraMedicineReminderScheduler.EXTRA_DOSE_ID, dose.id)
                putExtra(QatraMedicineReminderScheduler.EXTRA_NAME, dose.name)
                putExtra(QatraMedicineReminderScheduler.EXTRA_AMOUNT, dose.amount)
                putExtra(QatraMedicineReminderScheduler.EXTRA_SCHEDULED_AT, dose.scheduledAt)
            }
            return PendingIntent.getBroadcast(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
        }

        fun notifyDose(context: Context, dose: Dose): Boolean {
            if (readDose(context, dose.id) == null) return false
            if (Build.VERSION.SDK_INT >= 33 && ContextCompat.checkSelfPermission(context, Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED) return false
            if (!NotificationManagerCompat.from(context).areNotificationsEnabled()) return false
            return try {
                val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    manager.createNotificationChannel(NotificationChannel(QatraMedicineReminderScheduler.CHANNEL_ID,
                        "تذكيرات الأدوية", NotificationManager.IMPORTANCE_HIGH))
                }
                val open = Intent(context, MainActivity::class.java).apply {
                    putExtra("openMedicine", true)
                    data = Uri.Builder().scheme("qatra").authority("medicine").appendPath(dose.id).appendPath("open").build()
                }
                val pending = PendingIntent.getActivity(context, 0, open, PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
                val time = dose.time(context)
                val notification = NotificationCompat.Builder(context, QatraMedicineReminderScheduler.CHANNEL_ID)
                    .setSmallIcon(R.drawable.ic_stat_qatra)
                    .setContentTitle("وقت جرعة ${dose.name}")
                    .setContentText("${dose.amount} · $time")
                    .setStyle(NotificationCompat.BigTextStyle().bigText("الجرعة المسجّلة: ${dose.amount}\nالوقت: $time\nسجّل التناول فقط بعد تناولها فعلًا."))
                    .setVisibility(NotificationCompat.VISIBILITY_PRIVATE)
                    .setCategory(NotificationCompat.CATEGORY_REMINDER)
                    .setContentIntent(pending).setAutoCancel(true)
                    .addAction(0, "تم التناول", action(context, dose, true))
                    .addAction(0, "تأجيل 10 دقائق", action(context, dose, false)).build()
                manager.notify(("medicine:${dose.id}").hashCode(), notification)
                true
            } catch (_: Exception) {
                false
            }
        }
    }
}
