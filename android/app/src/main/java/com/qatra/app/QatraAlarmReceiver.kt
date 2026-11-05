package com.tijanim.qatra

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat

class QatraAlarmReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val id = intent.getIntExtra("id", 0)
        val mode = intent.getStringExtra("mode") ?: "notification"
        val quote = intent.getStringExtra("quote") ?: "حان وقت قطرة"

        if (mode == "floating") {
            val serviceIntent = Intent(context, QatraOverlayService::class.java).apply {
                action = "SHOW_DROP"
                putExtra("quote", quote)
            }

            try {
                context.startService(serviceIntent)
            } catch (_: Exception) {
            }
        } else {
            val notification = NotificationCompat.Builder(
                context,
                "qatra_channel"
            )
                .setSmallIcon(R.mipmap.ic_launcher)
                .setContentTitle("قطرة")
                .setContentText(quote)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true)
                .build()

            try {
                NotificationManagerCompat.from(context)
                    .notify(id, notification)
            } catch (_: SecurityException) {
            }
        }
    }
}
