package com.qatra.app

import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.app.Service
import android.content.Intent
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
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
import android.widget.ImageView
import android.widget.TextView

class QatraOverlayService : Service() {
    private var windowManager: WindowManager? = null
    private var overlayContainer: FrameLayout? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val quote = intent?.getStringExtra("quote") ?: "الحمد لله"
        val category = intent?.getStringExtra("category") ?: "dhikr"
        val duration = intent?.getIntExtra("duration", 10000) ?: 10000
        playCinematicAnimation(quote, category, duration.toLong())
        return START_NOT_STICKY
    }

    private fun playCinematicAnimation(quote: String, category: String, displayDuration: Long) {
        if (overlayContainer != null) return
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        val screenHeight = resources.displayMetrics.heightPixels.toFloat()
        val bottomLandingY = screenHeight - 200f

        // الشاشة الزجاجية المظلمة التي تملأ الهاتف بالكامل
        overlayContainer = FrameLayout(this).apply { setBackgroundColor(Color.parseColor("#E6030610")) }
        
        var layoutFlags = WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or 
                          WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or 
                          WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS or
                          WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                          WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
                          
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            layoutFlags = layoutFlags or WindowManager.LayoutParams.FLAG_BLUR_BEHIND
        }

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.MATCH_PARENT,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY else WindowManager.LayoutParams.TYPE_PHONE,
            layoutFlags,
            PixelFormat.TRANSLUCENT
        )
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) params.blurBehindRadius = 40

        // 1. القطرة الساقطة
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

        // 2. البطاقة المصورة ذات الحواف الدائرية للعبارة
        val cardView = FrameLayout(this).apply {
            alpha = 0f
            // الحواف الدائرية والإطار
            background = GradientDrawable().apply {
                shape = GradientDrawable.RECTANGLE; cornerRadius = 40f
                setStroke(2, Color.parseColor("#8000d2ff"))
            }
            clipToOutline = true
            elevation = 50f
        }
        
        // الصورة الخلفية للبطاقة بناءً على القسم
        val bgImageName = when (category) {
            "dhikr", "quran" -> "bg_islamic"
            "selfDev" -> "bg_motivation"
            "culture" -> "bg_culture"
            "myLibrary" -> "bg_custom"
            else -> "bg_islamic"
        }
        
        val bgImageView = ImageView(this).apply {
            scaleType = ImageView.ScaleType.CENTER_CROP
            try {
                val resId = resources.getIdentifier(bgImageName, "drawable", packageName)
                if (resId != 0) setImageResource(resId) else setBackgroundColor(Color.parseColor("#1E293B"))
            } catch (e: Exception) { setBackgroundColor(Color.parseColor("#1E293B")) }
        }
        
        // تعتيم خفيف فوق الصورة لكي يبرز النص
        val darkOverlay = View(this).apply { setBackgroundColor(Color.parseColor("#80000000")) }

        // النص الذي سيطبع فوق الصورة
        val quoteText = TextView(this).apply {
            text = quote
            setTextColor(Color.WHITE)
            textSize = 24f
            gravity = Gravity.CENTER
            setShadowLayer(15f, 0f, 0f, Color.BLACK)
            setTypeface(null, Typeface.BOLD)
            setPadding(40, 40, 40, 40)
        }
        
        cardView.addView(bgImageView, FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT)
        cardView.addView(darkOverlay, FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT)
        cardView.addView(quoteText, FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT)

        val cardParams = FrameLayout.LayoutParams(
            (resources.displayMetrics.widthPixels * 0.85).toInt(),
            FrameLayout.LayoutParams.WRAP_CONTENT
        ).apply { gravity = Gravity.CENTER; setMargins(0, 0, 0, 100) }

        overlayContainer?.addView(dropView, dropParams)
        overlayContainer?.addView(cardView, cardParams)
        windowManager?.addView(overlayContainer, params)

        val handler = Handler(Looper.getMainLooper())
        
        // الحركة 1: سقوط القطرة
        dropView.translationY = -screenHeight
        ObjectAnimator.ofFloat(dropView, "translationY", -screenHeight, bottomLandingY).apply {
            duration = 1000; interpolator = AccelerateInterpolator(); start()
        }

        handler.postDelayed({
            dropView.visibility = View.GONE
            
            // الحركة 2: ظهور البطاقة المصورة بأسلوب سينمائي
            cardView.scaleX = 0.5f; cardView.scaleY = 0.5f
            val tGrowX = ObjectAnimator.ofFloat(cardView, "scaleX", 0.5f, 1f).setDuration(1500)
            val tGrowY = ObjectAnimator.ofFloat(cardView, "scaleY", 0.5f, 1f).setDuration(1500)
            tGrowX.interpolator = DecelerateInterpolator(1.5f)
            tGrowY.interpolator = DecelerateInterpolator(1.5f)
            val tFade = ObjectAnimator.ofFloat(cardView, "alpha", 0f, 1f).setDuration(1000)
            AnimatorSet().apply { playTogether(tGrowX, tGrowY, tFade); start() }

        }, 1000)

        handler.postDelayed({
            ObjectAnimator.ofFloat(overlayContainer, "alpha", 1f, 0f).setDuration(800).start()
            handler.postDelayed({ stopSelf() }, 800)
        }, displayDuration)
    }

    override fun onDestroy() {
        super.onDestroy()
        if (overlayContainer != null) { windowManager?.removeView(overlayContainer); overlayContainer = null }
    }
}
