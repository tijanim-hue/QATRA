package com.qatra.app

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.app.NotificationManager
import android.app.NotificationChannel
import android.app.Notification
import android.app.PendingIntent
import android.os.Build

class QatraAlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val quote = intent.getStringExtra("quote") ?: "امنح نفسك لحظة هدوء."
        val mode = intent.getStringExtra("mode") ?: "both"
        if (mode == "both" || mode == "notification") {
            val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            val channelId = "qatra_reminders"
            if (Build.VERSION.SDK_INT >= 26) manager.createNotificationChannel(
                NotificationChannel(channelId, "تذكيرات قطرة", NotificationManager.IMPORTANCE_DEFAULT)
            )
            val n = if (Build.VERSION.SDK_INT >= 26) Notification.Builder(context, channelId) else Notification.Builder(context)
            n.setSmallIcon(android.R.drawable.ic_dialog_info).setContentTitle("قطرة لك").setContentText(quote).setAutoCancel(true)
            manager.notify((System.currentTimeMillis() % Int.MAX_VALUE).toInt(), n.build())
        }
        if (mode == "both" || mode == "floating") {
            val service = Intent(context, QatraOverlayService::class.java).apply {
                action = QatraOverlayService.ACTION_SHOW; putExtra("quote", quote)
            }
            try {
                if (Build.VERSION.SDK_INT >= 26) context.startForegroundService(service) else context.startService(service)
            } catch (_: Exception) {}
        }
    }
}
