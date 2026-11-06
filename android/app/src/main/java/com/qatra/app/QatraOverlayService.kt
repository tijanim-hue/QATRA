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
import android.view.animation.AccelerateInterpolator
import android.view.animation.OvershootInterpolator
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
                .setContentTitle("قطرة").setContentText("تأمل اللحظة...").setSmallIcon(android.R.drawable.ic_popup_reminder).build())
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
        return START_NOT_STICKY
    }

    private fun playCinematicAnimation(quote: String, style: String) {
        if (overlayContainer != null) return
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager

        // خلفية مظللة
        overlayContainer = FrameLayout(this).apply {
            setBackgroundColor(Color.parseColor("#D9080E1C")) // لون داكن شفاف أنيق
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

        // 1. حاويات دوائر الماء (Ripples)
        val ripple1 = View(this).apply {
            background = GradientDrawable().apply { shape = GradientDrawable.OVAL; setColor(Color.parseColor("#4080E0FF")) }
            alpha = 0f
        }
        val ripple2 = View(this).apply {
            background = GradientDrawable().apply { shape = GradientDrawable.OVAL; setColor(Color.parseColor("#20ffffff")) }
            alpha = 0f
        }

        // 2. شكل القطرة أو البيضة
        val shapeSize = if (style == "egg") 180 else 160
        val visualView = View(this).apply {
            val gradient = GradientDrawable()
            if (style == "egg") {
                gradient.shape = GradientDrawable.RECTANGLE
                gradient.cornerRadius = 90f // شكل بيضاوي
                gradient.colors = intArrayOf(Color.parseColor("#fff7e6"), Color.parseColor("#ffd180"), Color.parseColor("#f57c00"))
            } else {
                gradient.shape = GradientDrawable.RECTANGLE
                val r = shapeSize / 2f
                gradient.cornerRadii = floatArrayOf(0f, 0f, r, r, r, r, r, r) // زاوية حادة
                gradient.colors = intArrayOf(Color.parseColor("#ffffff"), Color.parseColor("#80E0FF"), Color.parseColor("#2A75D3"))
                rotation = -45f
            }
            background = gradient
            elevation = 40f
        }

        // 3. النص (الذكر أو المقولة)
        val quoteText = TextView(this).apply {
            text = quote
            setTextColor(Color.WHITE)
            textSize = 22f
            gravity = Gravity.CENTER
            setPadding(60, 60, 60, 60)
            alpha = 0f // مخفي في البداية
            val bg = GradientDrawable()
            bg.setColor(Color.parseColor("#111A2D"))
            bg.cornerRadius = 50f
            bg.setStroke(3, Color.parseColor("#67C8FF"))
            background = bg
        }

        val centerParams = FrameLayout.LayoutParams(shapeSize, shapeSize).apply { gravity = Gravity.CENTER }
        val textParams = FrameLayout.LayoutParams(FrameLayout.LayoutParams.WRAP_CONTENT, FrameLayout.LayoutParams.WRAP_CONTENT).apply {
            gravity = Gravity.CENTER
            setMargins(50, 0, 50, 0)
        }

        overlayContainer?.addView(ripple1, centerParams)
        overlayContainer?.addView(ripple2, centerParams)
        overlayContainer?.addView(visualView, centerParams)
        overlayContainer?.addView(quoteText, textParams)
        
        windowManager?.addView(overlayContainer, params)

        // ============================================
        // برمجة الحركات السينمائية (Animations)
        // ============================================

        val handler = Handler(Looper.getMainLooper())

        // 1. حركة السقوط من أعلى الشاشة
        visualView.translationY = -1500f
        ObjectAnimator.ofFloat(visualView, "translationY", -1500f, 0f).apply {
            duration = 700
            interpolator = AccelerateInterpolator()
            start()
        }

        // 2. الاصطدام ودوائر الماء والصوت (بعد السقوط مباشرة)
        handler.postDelayed({
            playSound()
            
            // اهتزاز واصطدام
            val squashX = ObjectAnimator.ofFloat(visualView, "scaleX", 1f, 1.25f, 1f).setDuration(250)
            val squashY = ObjectAnimator.ofFloat(visualView, "scaleY", 1f, 0.75f, 1f).setDuration(250)
            AnimatorSet().apply { playTogether(squashX, squashY); start() }

            // انتشار الدوائر المائية
            ripple1.alpha = 1f; ripple2.alpha = 1f
            val r1ScaleX = ObjectAnimator.ofFloat(ripple1, "scaleX", 1f, 4.5f).setDuration(900)
            val r1ScaleY = ObjectAnimator.ofFloat(ripple1, "scaleY", 1f, 4.5f).setDuration(900)
            val r1Alpha = ObjectAnimator.ofFloat(ripple1, "alpha", 1f, 0f).setDuration(900)

            val r2ScaleX = ObjectAnimator.ofFloat(ripple2, "scaleX", 1f, 6.5f).setDuration(1300)
            val r2ScaleY = ObjectAnimator.ofFloat(ripple2, "scaleY", 1f, 6.5f).setDuration(1300)
            val r2Alpha = ObjectAnimator.ofFloat(ripple2, "alpha", 1f, 0f).setDuration(1300)

            AnimatorSet().apply { playTogether(r1ScaleX, r1ScaleY, r1Alpha, r2ScaleX, r2ScaleY, r2Alpha); start() }

        }, 700)

        // 3. تلاشي القطرة وصعود النص ببطء (دون لمس المستخدم)
        handler.postDelayed({
            val fadeOutVisual = ObjectAnimator.ofFloat(visualView, "alpha", 1f, 0f).setDuration(500)
            
            quoteText.translationY = 200f
            val fadeInText = ObjectAnimator.ofFloat(quoteText, "alpha", 0f, 1f).setDuration(800)
            val riseText = ObjectAnimator.ofFloat(quoteText, "translationY", 200f, 0f).apply {
                duration = 1000
                interpolator = OvershootInterpolator(1.2f)
            }
            
            AnimatorSet().apply { playTogether(fadeOutVisual, fadeInText, riseText); start() }
        }, 1200)

        // 4. إغلاق الخدمة تلقائياً بعد 10 ثوانٍ لمنح المستخدم فرصة للقراءة
        handler.postDelayed({ stopSelf() }, 10000)
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
