package com.qatra.app

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.net.Uri
import android.os.Build
import androidx.core.app.NotificationCompat
import com.qatra.app.R // استيراد مسار R

class QatraAlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val quote = intent.getStringExtra("quote") ?: "حان وقت التأمل"
        val mode = intent.getStringExtra("mode") ?: "both"
        val duration = intent.getIntExtra("duration", 10000)

        if (mode == "floating" || mode == "both") {
            val serviceIntent = Intent(context, QatraOverlayService::class.java).apply {
                putExtra("quote", quote)
                putExtra("duration", duration)
            }
            context.startService(serviceIntent)
        }
        if (mode == "notification" || mode == "both") {
            showNotificationWithDropSound(context, quote)
        }
    }

    private fun showNotificationWithDropSound(context: Context, quote: String) {
        val channelId = "qatra_drop_channel"
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val soundUri = Uri.parse("android.resource://" + context.packageName + "/" + R.raw.drop_sound)

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(channelId, "QATRA Drops", NotificationManager.IMPORTANCE_HIGH).apply {
                setSound(soundUri, AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_NOTIFICATION).build())
            }
            notificationManager.createNotificationChannel(channel)
        }
        val builder = NotificationCompat.Builder(context, channelId)
            .setSmallIcon(android.R.drawable.ic_popup_reminder) // أيقونة الإشعار الافتراضية
            .setContentTitle("قطرة (QATRA)")
            .setContentText(quote)
            .setSound(soundUri)
            .setAutoCancel(true)
        notificationManager.notify((System.currentTimeMillis() % 10000).toInt(), builder.build())
    }
}
