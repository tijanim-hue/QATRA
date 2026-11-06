package com.qatra.app

import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.app.Service
import android.content.Intent
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.media.RingtoneManager
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

class QatraOverlayService : Service() {
    private var windowManager: WindowManager? = null
    private var overlayContainer: FrameLayout? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val quote = intent?.getStringExtra("quote") ?: "الحمد لله"
        playCinematicAnimation(quote)
        return START_NOT_STICKY
    }

    private fun playCinematicAnimation(quote: String) {
        if (overlayContainer != null) return
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager

        // خلفية زجاجية مظللة
        overlayContainer = FrameLayout(this).apply { setBackgroundColor(Color.parseColor("#99060A14")) }

        val flags = WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON or
                WindowManager.LayoutParams.FLAG_BLUR_BEHIND

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.MATCH_PARENT,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY else WindowManager.LayoutParams.TYPE_PHONE,
            flags, PixelFormat.TRANSLUCENT
        )
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) params.blurBehindRadius = 50

        // شكل القطرة العمودية الواقعية
        val dropSize = 130
        val dropView = View(this).apply {
            background = GradientDrawable().apply {
                shape = GradientDrawable.RECTANGLE
                val r = dropSize / 2f
                cornerRadii = floatArrayOf(0f, 0f, r, r, r, r, r, r) // رأس حاد في الأعلى
                colors = intArrayOf(Color.parseColor("#ffffff"), Color.parseColor("#00d2ff"), Color.parseColor("#4da6ff"))
            }
            rotation = 45f // لتبدو عمودية
            elevation = 30f
        }

        // العبارة (بدون إطار، خط جميل وظل)
        val quoteText = TextView(this).apply {
            text = quote
            setTextColor(Color.WHITE)
            textSize = 28f
            gravity = Gravity.CENTER
            setShadowLayer(15f, 0f, 0f, Color.parseColor("#00d2ff"))
            setTypeface(null, Typeface.BOLD)
            alpha = 0f
            scaleX = 0.2f
            scaleY = 0.2f
        }

        val dropParams = FrameLayout.LayoutParams(dropSize, dropSize).apply { gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL }
        val textParams = FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.WRAP_CONTENT).apply {
            gravity = Gravity.CENTER
            setMargins(50, 0, 50, 0)
        }

        overlayContainer?.addView(dropView, dropParams)
        overlayContainer?.addView(quoteText, textParams)
        windowManager?.addView(overlayContainer, params)

        // الأنيميشن
        val handler = Handler(Looper.getMainLooper())

        // 1. سقوط القطرة
        dropView.translationY = -500f
        ObjectAnimator.ofFloat(dropView, "translationY", -500f, 1500f).apply {
            duration = 900; interpolator = AccelerateInterpolator(); start()
        }

        // 2. فرقعة، صوت، وصعود العبارة وتكبيرها
        handler.postDelayed({
            playSound()
            dropView.visibility = View.GONE

            quoteText.translationY = 600f
            val rise = ObjectAnimator.ofFloat(quoteText, "translationY", 600f, 0f).setDuration(3000)
            rise.interpolator = DecelerateInterpolator()
            val growX = ObjectAnimator.ofFloat(quoteText, "scaleX", 0.2f, 1f).setDuration(3000)
            val growY = ObjectAnimator.ofFloat(quoteText, "scaleY", 0.2f, 1f).setDuration(3000)
            val fadeIn = ObjectAnimator.ofFloat(quoteText, "alpha", 0f, 1f).setDuration(2000)

            AnimatorSet().apply { playTogether(rise, growX, growY, fadeIn); start() }
        }, 850)

        // 3. وميض واستقرار
        handler.postDelayed({
            val pulseX = ObjectAnimator.ofFloat(quoteText, "scaleX", 1f, 1.05f, 1f).setDuration(1500)
            val pulseY = ObjectAnimator.ofFloat(quoteText, "scaleY", 1f, 1.05f, 1f).setDuration(1500)
            AnimatorSet().apply { playTogether(pulseX, pulseY); start() }
        }, 4000)

        // 4. اختفاء الشاشة
        handler.postDelayed({
            ObjectAnimator.ofFloat(overlayContainer, "alpha", 1f, 0f).setDuration(1000).start()
            handler.postDelayed({ stopSelf() }, 1000)
        }, 9000)
    }

    private fun playSound() {
        try {
            val notification = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
            RingtoneManager.getRingtone(applicationContext, notification)?.play()
        } catch (e: Exception) {}
    }

    override fun onDestroy() {
        super.onDestroy()
        if (overlayContainer != null) { windowManager?.removeView(overlayContainer); overlayContainer = null }
    }
}
