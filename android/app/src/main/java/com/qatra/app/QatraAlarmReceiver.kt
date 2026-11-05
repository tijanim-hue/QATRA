package com.qatra.app

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat

class QatraAlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val id = intent.getIntExtra("id", 0)
        val jsDay = intent.getIntExtra("jsDay", -1)
        val time = intent.getStringExtra("time") ?: return
        val mode = intent.getStringExtra("mode") ?: "both"
        val quote = intent.getStringExtra("quote") ?: "حان وقت التأمل"

        // استدعاء القطرة العائمة بطريقة آمنة
        if (mode == "floating" || mode == "both") {
            val serviceIntent = Intent(context, QatraOverlayService::class.java).apply {
                putExtra("quote", quote)
            }
            // استخدام startService مسموح هنا لأننا نملك إذن SYSTEM_ALERT_WINDOW
            context.startService(serviceIntent)
        }

        // إرسال الإشعار
        if (mode == "notification" || mode == "both") {
            showNotification(context, id, quote)
        }

        // إعادة الجدولة
        if (jsDay != -1) {
            QatraNotifications.scheduleSingleDay(context, id, jsDay, time, mode, quote)
        }
    }

    private fun showNotification(context: Context, id: Int, quote: String) {
        val channelId = "qatra_channel"
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(channelId, "QATRA Reminders", NotificationManager.IMPORTANCE_HIGH)
            notificationManager.createNotificationChannel(channel)
        }
        val builder = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(android.R.drawable.ic_popup_reminder)
            .setContentTitle("قطرة (QATRA)")
            .setContentText(quote)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)
        notificationManager.notify(id, builder.build())
    }
}
