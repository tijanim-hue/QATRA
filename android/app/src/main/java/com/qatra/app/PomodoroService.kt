package com.qatra.app

import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.media.MediaPlayer
import android.os.Build
import android.os.CountDownTimer
import android.os.IBinder
import androidx.core.app.NotificationCompat

class PomodoroService : Service() {
    private var mediaPlayer: MediaPlayer? = null
    private var timer: CountDownTimer? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val minutes = intent?.getIntExtra("minutes", 25) ?: 25
        val audioUrl = intent?.getStringExtra("audioUrl") ?: ""
        
        val channelId = "pomodoro_channel"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(channelId, "جلسة تركيز", NotificationManager.IMPORTANCE_LOW)
            getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
        }

        // إشعار يشبه قارئ الموسيقى به عداد تنازلي
        val notification = NotificationCompat.Builder(this, channelId)
            .setContentTitle("جلسة تركيز وهدوء")
            .setContentText("جارٍ الاسترخاء...")
            .setSmallIcon(android.R.drawable.ic_media_play)
            .setUsesChronometer(true)
            .setChronometerCountDown(true) // عد تنازلي
            .setWhen(System.currentTimeMillis() + (minutes * 60 * 1000L))
            .setOngoing(true)
            .build()

        startForeground(1993, notification)

        if (audioUrl.isNotEmpty() && audioUrl != "none") {
            try {
                mediaPlayer = MediaPlayer().apply {
                    setDataSource(audioUrl)
                    prepareAsync()
                    setOnPreparedListener { it.isLooping = true; it.start() }
                }
            } catch (e: Exception) {}
        }

        timer = object : CountDownTimer(minutes * 60 * 1000L, 1000) {
            override fun onTick(millisUntilFinished: Long) {}
            override fun onFinish() { stopSelf() }
        }.start()

        return START_NOT_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        mediaPlayer?.release()
        timer?.cancel()
    }
}
