package com.qatra.app

import android.animation.AnimatorSet
import android.animation.ObjectAnimator
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
import com.qatra.app.R // استيراد مسار R

class QatraOverlayService : Service() {
    private var windowManager: WindowManager? = null
    private var overlayContainer: FrameLayout? = null
    private var mediaPlayer: MediaPlayer? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val quote = intent?.getStringExtra("quote") ?: "الحمد لله"
        val duration = intent?.getIntExtra("duration", 10000) ?: 10000
        playCinematicAnimation(quote, duration.toLong())
        return START_NOT_STICKY
    }

    private fun playCinematicAnimation(quote: String, displayDuration: Long) {
        if (overlayContainer != null) return
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        val screenHeight = resources.displayMetrics.heightPixels.toFloat()
        val bottomLandingY = screenHeight - 200f // القاع تماماً

        overlayContainer = FrameLayout(this).apply { setBackgroundColor(Color.parseColor("#99030610")) }
        
        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.MATCH_PARENT,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY else WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON or WindowManager.LayoutParams.FLAG_BLUR_BEHIND,
            PixelFormat.TRANSLUCENT
        )
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) params.blurBehindRadius = 40

        // دوائر الماء (مخفية في القاع)
        val ripple = View(this).apply {
            background = GradientDrawable().apply { shape = GradientDrawable.OVAL; setColor(Color.parseColor("#8000d2ff")) }
            alpha = 0f
            translationY = bottomLandingY - (screenHeight / 2f) + 100f
        }
        val rippleParams = FrameLayout.LayoutParams(100, 40).apply { gravity = Gravity.CENTER }

        // القطرة العمودية
        val dropSize = 100
        val dropView = View(this).apply {
            background = GradientDrawable().apply {
                shape = GradientDrawable.RECTANGLE; val r = dropSize / 2f
                cornerRadii = floatArrayOf(0f, 0f, r, r, r, r, r, r)
                colors = intArrayOf(Color.parseColor("#ffffff"), Color.parseColor("#00d2ff"))
            }
            rotation = 45f; elevation = 30f
        }
        val dropParams = FrameLayout.LayoutParams(dropSize, dropSize).apply { gravity = Gravity.TOP or Gravity.CENTER_HORIZONTAL }

        // النص بخط عربي أنيق بدون إطار
        val quoteText = TextView(this).apply {
            text = quote
            setTextColor(Color.WHITE)
            textSize = 28f
            gravity = Gravity.CENTER
            setShadowLayer(25f, 0f, 0f, Color.parseColor("#00d2ff"))
            setTypeface(null, Typeface.BOLD)
            alpha = 0f
        }
        val textParams = FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.WRAP_CONTENT).apply {
            gravity = Gravity.CENTER; setMargins(40, 0, 40, 0)
        }

        overlayContainer?.addView(ripple, rippleParams)
        overlayContainer?.addView(dropView, dropParams)
        overlayContainer?.addView(quoteText, textParams)
        windowManager?.addView(overlayContainer, params)

        val handler = Handler(Looper.getMainLooper())
        
        // 1. السقوط للقاع
        dropView.translationY = -300f
        ObjectAnimator.ofFloat(dropView, "translationY", -300f, bottomLandingY).apply {
            duration = 1000; interpolator = AccelerateInterpolator(); start()
        }

        // 2. الارتطام، تشغيل صوت القطرة المحمل، ودوائر الماء
        handler.postDelayed({
            dropView.visibility = View.GONE
            
            // تشغيل صوت القطرة المائية الحقيقي
            try {
                mediaPlayer = MediaPlayer.create(this, R.raw.drop_sound)
                mediaPlayer?.start()
            } catch (e: Exception) {}

            ripple.alpha = 1f
            val rScaleX = ObjectAnimator.ofFloat(ripple, "scaleX", 1f, 15f).setDuration(800)
            val rScaleY = ObjectAnimator.ofFloat(ripple, "scaleY", 1f, 15f).setDuration(800)
            val rFade = ObjectAnimator.ofFloat(ripple, "alpha", 1f, 0f).setDuration(800)
            AnimatorSet().apply { playTogether(rScaleX, rScaleY, rFade); start() }

            // 3. خروج النص من القاع وصعوده للمنتصف
            quoteText.translationY = bottomLandingY / 2f
            quoteText.scaleX = 0.2f
            quoteText.scaleY = 0.2f
            
            val tRise = ObjectAnimator.ofFloat(quoteText, "translationY", bottomLandingY / 2f, 0f).setDuration(2500)
            tRise.interpolator = DecelerateInterpolator(1.2f)
            val tGrowX = ObjectAnimator.ofFloat(quoteText, "scaleX", 0.2f, 1f).setDuration(2500)
            val tGrowY = ObjectAnimator.ofFloat(quoteText, "scaleY", 0.2f, 1f).setDuration(2500)
            val tFade = ObjectAnimator.ofFloat(quoteText, "alpha", 0f, 1f).setDuration(1500)
            
            AnimatorSet().apply { playTogether(tRise, tGrowX, tGrowY, tFade); start() }

        }, 1000)

        // 4. الاختفاء حسب المدة المحددة
        handler.postDelayed({
            ObjectAnimator.ofFloat(overlayContainer, "alpha", 1f, 0f).setDuration(800).start()
            handler.postDelayed({ stopSelf() }, 800)
        }, displayDuration)
    }

    override fun onDestroy() {
        super.onDestroy()
        mediaPlayer?.release()
        if (overlayContainer != null) { windowManager?.removeView(overlayContainer); overlayContainer = null }
    }
}
