package com.qatra.app

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import java.util.UUID

class QatraAlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        QatraHomeStore.delivered(context, intent.getIntExtra("id", -1))
        val quote = intent.getStringExtra("quote") ?: "حان وقت التأمل"
        val category = intent.getStringExtra("category") ?: "dhikr"
        val showImage = intent.getBooleanExtra("showImage", false)
        val mode = intent.getStringExtra("mode") ?: "both"
        val duration = intent.getIntExtra("duration", 10000)
        val occurrence = UUID.randomUUID().toString()

        if (mode == "floating" || mode == "both") {
            val serviceIntent = Intent(context, QatraOverlayService::class.java).apply {
                putExtra("scheduled", true); putExtra("occurrenceId", occurrence); putExtra("quote", quote); putExtra("duration", duration); putExtra("category", category); putExtra("showImage", showImage)
            }
            try { context.startService(serviceIntent) } catch (e: Exception) {}
        }
        if (mode == "notification" || mode == "both") {
            showNotification(context, quote, category, occurrence)
        }
    }

    private fun showNotification(context: Context, quote: String, category: String, occurrence: String) {
        if (!NotificationManagerCompat.from(context).areNotificationsEnabled()) return
        val channelId = "qatra_drop_channel"
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(channelId, "QATRA Drops", NotificationManager.IMPORTANCE_HIGH)
            notificationManager.createNotificationChannel(channel)
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && notificationManager.getNotificationChannel(channelId)?.importance == NotificationManager.IMPORTANCE_NONE) return
        val builder = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(R.drawable.ic_stat_qatra)
            .setContentTitle("قطرة (QATRA)")
            .setContentText(quote)
            .setAutoCancel(true)
        notificationManager.notify((System.currentTimeMillis() % 10000).toInt(), builder.build())
        QatraProgressStore.shown(context, occurrence, quote, category, true)
    }
}
