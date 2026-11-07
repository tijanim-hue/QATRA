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
        val quote = intent.getStringExtra("quote") ?: "حان وقت التأمل"
        val category = intent.getStringExtra("category") ?: "dhikr"
        val mode = intent.getStringExtra("mode") ?: "both"
        val duration = intent.getIntExtra("duration", 10000)

        if (mode == "floating" || mode == "both") {
            val serviceIntent = Intent(context, QatraOverlayService::class.java).apply {
                putExtra("quote", quote); putExtra("duration", duration); putExtra("category", category)
            }
            try { context.startService(serviceIntent) } catch (e: Exception) {}
        }
        if (mode == "notification" || mode == "both") {
            showNotification(context, quote)
        }
    }

    private fun showNotification(context: Context, quote: String) {
        val channelId = "qatra_drop_channel"
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(channelId, "QATRA Drops", NotificationManager.IMPORTANCE_HIGH)
            notificationManager.createNotificationChannel(channel)
        }
        val builder = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(android.R.drawable.ic_popup_reminder)
            .setContentTitle("قطرة (QATRA)")
            .setContentText(quote)
            .setAutoCancel(true)
        notificationManager.notify((System.currentTimeMillis() % 10000).toInt(), builder.build())
    }
}
