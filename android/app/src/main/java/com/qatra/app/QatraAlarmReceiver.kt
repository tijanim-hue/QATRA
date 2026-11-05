package com.qatra.app

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Build
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat

class QatraAlarmReceiver : BroadcastReceiver() {

    override fun onReceive(context: Context, intent: Intent) {
        val scheduleId = intent.getStringExtra("scheduleId") ?: "qatra"
        val day = intent.getIntExtra("day", 0)
        val id = 31 * scheduleId.hashCode() + day
        val mode = intent.getStringExtra("mode") ?: "notification"
        val quote = intent.getStringExtra("quote") ?: "حان وقت قطرة"

        if (mode == "floating") {
            val serviceIntent = Intent(context, QatraOverlayService::class.java).apply {
                action = QatraOverlayService.ACTION_SHOW
                putExtra("quote", quote)
            }

            try {
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                    context.startForegroundService(serviceIntent)
                } else {
                    context.startService(serviceIntent)
                }
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
