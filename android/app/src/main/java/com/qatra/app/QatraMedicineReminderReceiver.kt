package com.qatra.app

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat

class QatraMedicineReminderReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val doseId = intent.getStringExtra(QatraMedicineReminderScheduler.EXTRA_DOSE_ID) ?: return
        val name = intent.getStringExtra(QatraMedicineReminderScheduler.EXTRA_NAME) ?: return
        val amount = intent.getStringExtra(QatraMedicineReminderScheduler.EXTRA_AMOUNT) ?: return
        val scheduledAt = intent.getLongExtra(QatraMedicineReminderScheduler.EXTRA_SCHEDULED_AT, 0L)
        if (doseId.isBlank() || name.isBlank() || amount.isBlank() || scheduledAt <= 0L) return

        val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            manager.createNotificationChannel(NotificationChannel(
                QatraMedicineReminderScheduler.CHANNEL_ID,
                "تذكيرات الأدوية",
                NotificationManager.IMPORTANCE_HIGH
            ).apply { description = "تذكيرات جرعات الأدوية المحفوظة في قطرة" })
        }

        val takeIntent = Intent(context, QatraMedicineActionReceiver::class.java).apply {
            action = QatraMedicineActionReceiver.ACTION_TAKE
            putExtra(QatraMedicineReminderScheduler.EXTRA_DOSE_ID, doseId)
        }
        val takePending = PendingIntent.getBroadcast(
            context,
            ("take:$doseId").hashCode(),
            takeIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val snoozeIntent = Intent(context, QatraMedicineActionReceiver::class.java).apply {
            action = QatraMedicineActionReceiver.ACTION_SNOOZE
            putExtra(QatraMedicineReminderScheduler.EXTRA_DOSE_ID, doseId)
            putExtra(QatraMedicineReminderScheduler.EXTRA_NAME, name)
            putExtra(QatraMedicineReminderScheduler.EXTRA_AMOUNT, amount)
            putExtra(QatraMedicineReminderScheduler.EXTRA_SCHEDULED_AT, scheduledAt)
        }
        val snoozePending = PendingIntent.getBroadcast(
            context,
            ("snooze:$doseId").hashCode(),
            snoozeIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val openIntent = Intent(context, MainActivity::class.java).apply {
            putExtra("openMedicine", true)
        }
        val openPending = PendingIntent.getActivity(
            context,
            ("open:$doseId").hashCode(),
            openIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )

        val notification: Notification = NotificationCompat.Builder(context, QatraMedicineReminderScheduler.CHANNEL_ID)
            .setSmallIcon(R.drawable.ic_stat_qatra)
            .setContentTitle("وقت جرعة $name")
            .setContentText("الجرعة المسجّلة: $amount")
            .setStyle(NotificationCompat.BigTextStyle().bigText("الجرعة المسجّلة: $amount\nسجّل التناول فقط بعد تناولها فعلًا."))
            .setContentIntent(openPending)
            .setAutoCancel(true)
            .setCategory(NotificationCompat.CATEGORY_REMINDER)
            .addAction(0, "تم التناول", takePending)
            .addAction(0, "تأجيل 10 دقائق", snoozePending)
            .build()

        manager.notify(("medicine:$doseId").hashCode(), notification)
    }
}
