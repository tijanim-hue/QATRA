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
        
        val displayMetrics = resources.displayMetrics
        val screenHeight = displayMetrics.heightPixels.toFloat()
        // نقطة القاع التي ستصطدم بها القطرة (أسفل الشاشة بمسافة قليلة)
        val bottomLandingY = screenHeight - 350f 

        // التعتيم الزجاجي الخلفي
        overlayContainer = FrameLayout(this).apply {
            setBackgroundColor(Color.parseColor("#99030610"))
        }

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
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) params.blurBehindRadius = 40

        // 1. دوائر الماء (Ripples) عند الارتطام
        val ripple = View(this).apply {
            background = GradientDrawable().apply { shape = GradientDrawable.OVAL; setColor(Color.parseColor("#8000e5ff")) }
            alpha = 0f
            translationY = bottomLandingY - (screenHeight / 2f) + 150f // ضبط الموقع أسفل الشاشة
        }
        val rippleParams = FrameLayout.LayoutParams(120, 60).apply { gravity = Gravity.CENTER }

        // 2. القطرة المائية العمودية الحقيقية
        val dropSize = 120
        val dropView = View(this).apply {
            background = GradientDrawable().apply {
                shape = GradientDrawable.RECTANGLE
                val r = dropSize / 2f
                cornerRadii = floatArrayOf(0f, 0f, r, r, r, r, r, r) // رأس حاد
                colors = intArrayOf(Color.parseColor("#ffffff"), Color.parseColor("#00e5ff"), Color.parseColor("#0066ff"))
            }
            rotation = 45f // لتبدو عمودية
            elevation = 30f
        }
        val dropParams = FrameLayout.LayoutParams(dropSize, dropSize).apply { gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL }

        // 3. العبارة بدون إطار (نص نقي بخط أنيق وظل واضح)
        val quoteText = TextView(this).apply {
            text = quote
            setTextColor(Color.WHITE)
            textSize = 28f
            gravity = Gravity.CENTER
            setShadowLayer(25f, 0f, 10f, Color.parseColor("#00e5ff")) // ظل نيون قوي للوضوح
            setTypeface(null, Typeface.BOLD)
            alpha = 0f
        }
        val textParams = FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.WRAP_CONTENT).apply {
            gravity = Gravity.CENTER
            setMargins(40, 0, 40, 0)
        }

        overlayContainer?.addView(ripple, rippleParams)
        overlayContainer?.addView(dropView, dropParams)
        overlayContainer?.addView(quoteText, textParams)
        windowManager?.addView(overlayContainer, params)

        // ===================================
        // السحر الحركي (الأنيميشن)
        // ===================================
        val handler = Handler(Looper.getMainLooper())

        // 1. سقوط القطرة لأسفل الهاتف
        dropView.translationY = -300f
        ObjectAnimator.ofFloat(dropView, "translationY", -300f, bottomLandingY).apply {
            duration = 1000
            interpolator = AccelerateInterpolator() // تسارع الجاذبية
            start()
        }

        // 2. لحظة الارتطام
        handler.postDelayed({
            dropView.visibility = View.GONE // اختفاء القطرة
            playSound() // صوت الارتطام

            // تأثير دوائر الماء (Ripple Effect)
            ripple.alpha = 1f
            val rScaleX = ObjectAnimator.ofFloat(ripple, "scaleX", 1f, 12f).setDuration(800)
            val rScaleY = ObjectAnimator.ofFloat(ripple, "scaleY", 1f, 12f).setDuration(800)
            val rFade = ObjectAnimator.ofFloat(ripple, "alpha", 1f, 0f).setDuration(800)
            AnimatorSet().apply { playTogether(rScaleX, rScaleY, rFade); start() }

            // 3. خروج النص من القاع وصعوده للمنتصف
            quoteText.translationY = (bottomLandingY / 2f)
            quoteText.scaleX = 0.3f
            quoteText.scaleY = 0.3f

            val tRise = ObjectAnimator.ofFloat(quoteText, "translationY", (bottomLandingY / 2f), 0f).setDuration(2500)
            tRise.interpolator = DecelerateInterpolator(1.2f) // تباطؤ عند الوصول للمنتصف
            val tGrowX = ObjectAnimator.ofFloat(quoteText, "scaleX", 0.3f, 1f).setDuration(2500)
            val tGrowY = ObjectAnimator.ofFloat(quoteText, "scaleY", 0.3f, 1f).setDuration(2500)
            val tFade = ObjectAnimator.ofFloat(quoteText, "alpha", 0f, 1f).setDuration(1500)

            AnimatorSet().apply { playTogether(tRise, tGrowX, tGrowY, tFade); start() }

        }, 1000)

        // 4. وميض واستقرار النص
        handler.postDelayed({
            val pulseX = ObjectAnimator.ofFloat(quoteText, "scaleX", 1f, 1.05f, 1f).setDuration(1500)
            val pulseY = ObjectAnimator.ofFloat(quoteText, "scaleY", 1f, 1.05f, 1f).setDuration(1500)
            AnimatorSet().apply { playTogether(pulseX, pulseY); start() }
        }, 3800)

        // 5. اختفاء الشاشة تلقائياً بعد 10 ثوانٍ
        handler.postDelayed({
            ObjectAnimator.ofFloat(overlayContainer, "alpha", 1f, 0f).setDuration(1000).start()
            handler.postDelayed({ stopSelf() }, 1000)
        }, 10000)
    }

    private fun playSound() {
        try {
            val notification = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
            RingtoneManager.getRingtone(applicationContext, notification)?.play()
        } catch (e: Exception) {}
    }

    override fun onDestroy() {
        super.onDestroy()
        if (overlayContainer != null) {
            windowManager?.removeView(overlayContainer)
            overlayContainer = null
        }
    }
}
