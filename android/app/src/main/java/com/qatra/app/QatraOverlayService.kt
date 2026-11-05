package com.qatra.app

import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.drawable.GradientDrawable
import android.media.RingtoneManager
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.os.PowerManager
import android.provider.Settings
import android.view.Gravity
import android.view.View
import android.view.WindowManager
import android.widget.FrameLayout
import android.widget.TextView
import androidx.core.app.NotificationCompat

class QatraOverlayService : Service() {
    private var windowManager: WindowManager? = null
    private var overlayContainer: FrameLayout? = null
    private var wakeLock: PowerManager.WakeLock? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        val pm = getSystemService(Context.POWER_SERVICE) as PowerManager
        wakeLock = pm.newWakeLock(
            PowerManager.SCREEN_BRIGHT_WAKE_LOCK or PowerManager.ACQUIRE_CAUSES_WAKEUP or PowerManager.ON_AFTER_RELEASE,
            "Qatra::CinematicWakeLock"
        )
        wakeLock?.acquire(15000)

        try {
            val channelId = "overlay_channel"
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val channel = NotificationChannel(channelId, "Qatra Cinematic", NotificationManager.IMPORTANCE_MIN)
                getSystemService(NotificationManager::class.java).createNotificationChannel(channel)
            }
            startForeground(1992, NotificationCompat.Builder(this, channelId)
                .setContentTitle("قطرة").setContentText("عرض سينمائي...").setSmallIcon(android.R.drawable.ic_popup_reminder).build())
        } catch (e: Exception) { e.printStackTrace() }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val quote = intent?.getStringExtra("quote") ?: "خذ نفسًا من الهدوء."
        val style = intent?.getStringExtra("style") ?: "drop"

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) {
            stopSelf()
            return START_NOT_STICKY
        }

        playCinematicAnimation(quote, style)
        playSound()
        return START_NOT_STICKY
    }

    private fun playCinematicAnimation(quote: String, style: String) {
        if (overlayContainer != null) return
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager

        overlayContainer = FrameLayout(this).apply {
            setBackgroundColor(Color.parseColor("#B3000000")) // تظليل سينمائي أنيق
        }

        val layoutFlag = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            WindowManager.LayoutParams.TYPE_PHONE
        }

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT,
            layoutFlag,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                    WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
                    WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                    WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON,
            PixelFormat.TRANSLUCENT
        )

        // عنصر الشكل (قطرة أو بيضة)
        val shapeSize = if (style == "egg") 280 else 260
        val visualView = View(this).apply {
            val gradient = GradientDrawable()
            if (style == "egg") {
                gradient.shape = GradientDrawable.RECTANGLE
                gradient.cornerRadius = 140f
                gradient.colors = intArrayOf(Color.parseColor("#fff7e6"), Color.parseColor("#ffd180"), Color.parseColor("#f57c00"))
            } else {
                gradient.shape = GradientDrawable.RECTANGLE
                val r = shapeSize / 2f
                gradient.cornerRadii = floatArrayOf(0f, 0f, r, r, r, r, r, r)
                gradient.colors = intArrayOf(Color.parseColor("#ffffff"), Color.parseColor("#80E0FF"), Color.parseColor("#2A75D3"))
                rotation = -45f
            }
            background = gradient
            elevation = 40f
        }

        val visualParams = FrameLayout.LayoutParams(shapeSize, shapeSize).apply {
            gravity = Gravity.CENTER
        }

        // صندوق النص الإيجابي / الدعاء
        val quoteText = TextView(this).apply {
            text = quote
            setTextColor(Color.WHITE)
            textSize = 21f
            gravity = Gravity.CENTER
            setPadding(50, 50, 50, 50)
            alpha = 0f
            val bg = GradientDrawable()
            bg.setColor(Color.parseColor("#E60B1021"))
            bg.cornerRadius = 40f
            bg.setStroke(3, Color.parseColor("#4A90E2"))
            background = bg
        }

        val textParams = FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.WRAP_CONTENT,
            FrameLayout.LayoutParams.WRAP_CONTENT
        ).apply {
            gravity = Gravity.CENTER
            setMargins(50, 0, 50, 0)
        }

        overlayContainer?.addView(visualView, visualParams)
        overlayContainer?.addView(quoteText, textParams)
        windowManager?.addView(overlayContainer, params)

        // حركة السقوط السينمائي (من أعلى الشاشة إلى المنتصف مع تأثير الارتداد والانفجار الخفيف)
        visualView.translationY = -800f
        val fallAnim = ObjectAnimator.ofFloat(visualView, "translationY", -800f, 0f).apply {
            duration = 1200
        }
        val scaleXAnim = ObjectAnimator.ofFloat(visualView, "scaleX", 0.4f, 1.1f, 1f)
        val scaleYAnim = ObjectAnimator.ofFloat(visualView, "scaleY", 0.4f, 1.1f, 1f)
        
        val animatorSet = AnimatorSet().apply {
            playTogether(fallAnim, scaleXAnim, scaleYAnim)
            start()
        }

        // بعد استقرار الشكل، تختفي القطرة/البيضة تدريجياً ويصعد النص للوسط
        Handler(Looper.getMainLooper()).postDelayed({
            val fadeOutVisual = ObjectAnimator.ofFloat(visualView, "alpha", 1f, 0f).setDuration(600)
            val fadeInText = ObjectAnimator.ofFloat(quoteText, "alpha", 0f, 1f).setDuration(800)
            
            val textAnimSet = AnimatorSet().apply {
                playTogether(fadeOutVisual, fadeInText)
                start()
            }
        }, 1400)

        // إغلاق تلقائي بعد قراءة العبارة
        Handler(Looper.getMainLooper()).postDelayed({ stopSelf() }, 10000)
    }

    private fun playSound() {
        try {
            val notification = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
            RingtoneManager.getRingtone(applicationContext, notification)?.play()
        } catch (e: Exception) { e.printStackTrace() }
    }

    override fun onDestroy() {
        super.onDestroy()
        if (overlayContainer != null) {
            windowManager?.removeView(overlayContainer)
            overlayContainer = null
        }
        if (wakeLock?.isHeld == true) wakeLock?.release()
    }
}
