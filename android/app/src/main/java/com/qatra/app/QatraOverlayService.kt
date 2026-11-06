package com.qatra.app

import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.media.MediaPlayer
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.view.Gravity
import android.view.View
import android.view.WindowManager
import android.view.animation.AccelerateInterpolator
import android.view.animation.DecelerateInterpolator
import android.widget.FrameLayout
import android.widget.TextView
import androidx.core.app.NotificationCompat

class QatraOverlayService : Service() {
    private var windowManager: WindowManager? = null
    private var overlayContainer: FrameLayout? = null
    private var mediaPlayer: MediaPlayer? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val quote = intent?.getStringExtra("quote") ?: "الحمد لله"
        val duration = intent?.getIntExtra("duration", 10000) ?: 10000
        
        val channelId = "qatra_overlay_channel"
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(channelId, "Cinematic Drop", NotificationManager.IMPORTANCE_MIN)
            getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
        }
        val notification = NotificationCompat.Builder(this, channelId).setContentTitle("قطرة").setContentText("يتم عرض القطرة السينمائية...").setSmallIcon(android.R.drawable.ic_popup_reminder).build()
        startForeground(999, notification)

        playCinematicAnimation(quote, duration.toLong())
        return START_NOT_STICKY
    }

    private fun playCinematicAnimation(quote: String, displayDuration: Long) {
        if (overlayContainer != null) return
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        val screenHeight = resources.displayMetrics.heightPixels.toFloat()
        val bottomLandingY = screenHeight - 200f // القاع تماماً

        overlayContainer = FrameLayout(this).apply { setBackgroundColor(Color.parseColor("#99000000")) }
        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.MATCH_PARENT,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY else WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON or WindowManager.LayoutParams.FLAG_BLUR_BEHIND,
            PixelFormat.TRANSLUCENT
        )
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) params.blurBehindRadius = 50

        val ripple = View(this).apply {
            background = GradientDrawable().apply { shape = GradientDrawable.OVAL; setColor(Color.parseColor("#8000F0FF")) }
            alpha = 0f; translationY = bottomLandingY - (screenHeight / 2f) + 100f
        }
        val dropView = View(this).apply {
            background = GradientDrawable().apply {
                shape = GradientDrawable.RECTANGLE; val r = 50f
                cornerRadii = floatArrayOf(0f, 0f, r, r, r, r, r, r)
                colors = intArrayOf(Color.parseColor("#ffffff"), Color.parseColor("#00F0FF"))
            }
            rotation = 45f; elevation = 30f
        }
        val quoteText = TextView(this).apply {
            text = quote; setTextColor(Color.WHITE); textSize = 28f; gravity = Gravity.CENTER
            setShadowLayer(25f, 0f, 0f, Color.parseColor("#00F0FF")); setTypeface(null, Typeface.BOLD); alpha = 0f
        }

        overlayContainer?.addView(ripple, FrameLayout.LayoutParams(100, 40).apply { gravity = Gravity.CENTER })
        overlayContainer?.addView(dropView, FrameLayout.LayoutParams(100, 100).apply { gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL })
        overlayContainer?.addView(quoteText, FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.WRAP_CONTENT).apply { gravity = Gravity.CENTER; setMargins(40,0,40,0) })
        windowManager?.addView(overlayContainer, params)

        val handler = Handler(Looper.getMainLooper())
        dropView.translationY = -300f
        ObjectAnimator.ofFloat(dropView, "translationY", -300f, bottomLandingY).apply { duration = 1000; interpolator = AccelerateInterpolator(); start() }

        handler.postDelayed({
            dropView.visibility = View.GONE
            try {
                val resId = resources.getIdentifier("drop_sound", "raw", packageName)
                if (resId != 0) { mediaPlayer = MediaPlayer.create(this, resId); mediaPlayer?.start() }
            } catch (e: Exception) {}

            ripple.alpha = 1f
            AnimatorSet().apply { playTogether(
                ObjectAnimator.ofFloat(ripple, "scaleX", 1f, 15f).setDuration(800),
                ObjectAnimator.ofFloat(ripple, "scaleY", 1f, 15f).setDuration(800),
                ObjectAnimator.ofFloat(ripple, "alpha", 1f, 0f).setDuration(800)
            ); start() }

            quoteText.translationY = bottomLandingY / 2f
            quoteText.scaleX = 0.2f; quoteText.scaleY = 0.2f
            AnimatorSet().apply { playTogether(
                ObjectAnimator.ofFloat(quoteText, "translationY", bottomLandingY / 2f, 0f).apply { duration = 2500; interpolator = DecelerateInterpolator(1.2f) },
                ObjectAnimator.ofFloat(quoteText, "scaleX", 0.2f, 1f).setDuration(2500),
                ObjectAnimator.ofFloat(quoteText, "scaleY", 0.2f, 1f).setDuration(2500),
                ObjectAnimator.ofFloat(quoteText, "alpha", 0f, 1f).setDuration(1500)
            ); start() }
        }, 1000)

        handler.postDelayed({
            ObjectAnimator.ofFloat(overlayContainer, "alpha", 1f, 0f).setDuration(800).start()
            handler.postDelayed({ stopForeground(true); stopSelf() }, 800)
        }, displayDuration)
    }
    override fun onDestroy() { super.onDestroy(); mediaPlayer?.release(); if (overlayContainer != null) { windowManager?.removeView(overlayContainer); overlayContainer = null } }
}
