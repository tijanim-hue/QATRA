package com.qatra.app

import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.app.Service
import android.content.Context
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

        overlayContainer = FrameLayout(this).apply {
            setBackgroundColor(Color.parseColor("#4D000000")) // سواد شفاف
        }

        val flags = WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
                WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
                WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON or
                WindowManager.LayoutParams.FLAG_BLUR_BEHIND // تأثير الزجاج الخلفي

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT,
            WindowManager.LayoutParams.MATCH_PARENT,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY else WindowManager.LayoutParams.TYPE_PHONE,
            flags,
            PixelFormat.TRANSLUCENT
        )
        // درجة الضبابية (Blur)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            params.blurBehindRadius = 50
        }

        // 1. القطرة المائية (شكل قطرة عمودية)
        val dropSize = 140
        val dropView = View(this).apply {
            background = GradientDrawable().apply {
                shape = GradientDrawable.RECTANGLE
                val r = dropSize / 2f
                // زاوية حادة في أعلى اليمين مع تدوير الشكل 45- درجة لتبدو القطرة عمودية تماماً
                cornerRadii = floatArrayOf(r, r, 0f, 0f, r, r, r, r)
                colors = intArrayOf(Color.parseColor("#ffffff"), Color.parseColor("#7be7e8"), Color.parseColor("#4da6ff"))
            }
            rotation = -45f
            elevation = 30f
        }

        // 2. النص (مقولة / دعاء) - بدون أي إطار
        val quoteText = TextView(this).apply {
            text = quote
            setTextColor(Color.WHITE)
            textSize = 28f
            gravity = Gravity.CENTER
            setShadowLayer(15f, 0f, 5f, Color.BLACK) // ظل قوي للقراءة بوضوح
            setTypeface(null, Typeface.BOLD)
            alpha = 0f
        }

        val dropParams = FrameLayout.LayoutParams(dropSize, dropSize).apply { gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL }
        val textParams = FrameLayout.LayoutParams(FrameLayout.LayoutParams.WRAP_CONTENT, FrameLayout.LayoutParams.WRAP_CONTENT).apply {
            gravity = Gravity.CENTER
            setMargins(40, 0, 40, 0)
        }

        overlayContainer?.addView(dropView, dropParams)
        overlayContainer?.addView(quoteText, textParams)
        windowManager?.addView(overlayContainer, params)

        // ===================================
        // تسلسل الحركات (الأنيميشن)
        // ===================================
        val handler = Handler(Looper.getMainLooper())

        // أ. سقوط القطرة لأسفل الشاشة
        dropView.translationY = -400f
        ObjectAnimator.ofFloat(dropView, "translationY", -400f, 1500f).apply {
            duration = 900
            interpolator = AccelerateInterpolator()
            start()
        }

        // ب. الانفجار والصوت وخروج النص
        handler.postDelayed({
            playSound()
            dropView.visibility = View.GONE // اختفاء القطرة

            // إعداد النص في الأسفل ليكون صغيراً
            quoteText.translationY = 800f
            quoteText.scaleX = 0.2f
            quoteText.scaleY = 0.2f

            // صعود النص ببطء، وتكبيره، وظهوره
            val textRise = ObjectAnimator.ofFloat(quoteText, "translationY", 800f, 0f).setDuration(2500)
            textRise.interpolator = DecelerateInterpolator()
            
            val textGrowX = ObjectAnimator.ofFloat(quoteText, "scaleX", 0.2f, 1f).setDuration(2500)
            val textGrowY = ObjectAnimator.ofFloat(quoteText, "scaleY", 0.2f, 1f).setDuration(2500)
            val textFadeIn = ObjectAnimator.ofFloat(quoteText, "alpha", 0f, 1f).setDuration(1500)

            AnimatorSet().apply {
                playTogether(textRise, textGrowX, textGrowY, textFadeIn)
                start()
            }
        }, 900)

        // ج. وميض خفيف (Pulse) للنص عند استقراره
        handler.postDelayed({
            val pulseUpX = ObjectAnimator.ofFloat(quoteText, "scaleX", 1f, 1.08f).setDuration(800)
            val pulseUpY = ObjectAnimator.ofFloat(quoteText, "scaleY", 1f, 1.08f).setDuration(800)
            val pulseDownX = ObjectAnimator.ofFloat(quoteText, "scaleX", 1.08f, 1f).setDuration(800)
            val pulseDownY = ObjectAnimator.ofFloat(quoteText, "scaleY", 1.08f, 1f).setDuration(800)
            
            AnimatorSet().apply {
                playSequentially(
                    AnimatorSet().apply { playTogether(pulseUpX, pulseUpY) },
                    AnimatorSet().apply { playTogether(pulseDownX, pulseDownY) }
                )
                start()
            }
        }, 3400)

        // د. إغلاق تلقائي بهدوء
        handler.postDelayed({ 
            val fadeOutAll = ObjectAnimator.ofFloat(overlayContainer, "alpha", 1f, 0f).setDuration(800)
            fadeOutAll.start()
            handler.postDelayed({ stopSelf() }, 800)
        }, 8000)
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
    }
}
