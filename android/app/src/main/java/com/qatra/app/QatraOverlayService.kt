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
import android.widget.ImageView
import android.widget.TextView

class QatraOverlayService : Service() {
    private var windowManager: WindowManager? = null
    private var overlayContainer: FrameLayout? = null
    private var fallPlayer: MediaPlayer? = null
    private var popPlayer: MediaPlayer? = null
    private var isLiked = false

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val quote = intent?.getStringExtra("quote") ?: "الحمد لله"
        val category = intent?.getStringExtra("category") ?: "dhikr"
        val showImage = intent?.getBooleanExtra("showImage", false) ?: false
        val duration = intent?.getIntExtra("duration", 10000) ?: 10000
        playCinematicAnimation(quote, category, showImage, duration.toLong())
        return START_NOT_STICKY
    }

    private fun playCinematicAnimation(quote: String, category: String, showImage: Boolean, displayDuration: Long) {
        if (overlayContainer != null) return
        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        val screenHeight = resources.displayMetrics.heightPixels.toFloat()
        val bottomLandingY = screenHeight - 200f

        // الشفافية التامة
        overlayContainer = FrameLayout(this).apply { setBackgroundColor(Color.TRANSPARENT) }
        
        val layoutFlags = WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or 
                          WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or 
                          WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS or
                          WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
                          WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.MATCH_PARENT, WindowManager.LayoutParams.MATCH_PARENT,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY else WindowManager.LayoutParams.TYPE_PHONE,
            layoutFlags,
            PixelFormat.TRANSLUCENT
        )

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

        val ripple = View(this).apply {
            background = GradientDrawable().apply { shape = GradientDrawable.OVAL; setColor(Color.parseColor("#8000d2ff")) }
            alpha = 0f
            translationY = bottomLandingY - (screenHeight / 2f) + 100f
        }
        val rippleParams = FrameLayout.LayoutParams(100, 40).apply { gravity = Gravity.CENTER }

        // 2. الحاوية للعبارة (مع أو بدون صورة)
        val cardView = FrameLayout(this).apply {
            alpha = 0f
            if (showImage) {
                background = GradientDrawable().apply {
                    shape = GradientDrawable.RECTANGLE; cornerRadius = 40f
                    setStroke(2, Color.parseColor("#8000d2ff"))
                }
                clipToOutline = true
                elevation = 50f
            }
        }
        
        if (showImage) {
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
            val darkOverlay = View(this).apply { setBackgroundColor(Color.parseColor("#80000000")) }
            cardView.addView(bgImageView, FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT)
            cardView.addView(darkOverlay, FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT)
        }

        val quoteText = TextView(this).apply {
            text = quote
            setTextColor(Color.WHITE)
            textSize = 24f
            gravity = Gravity.CENTER
            setShadowLayer(15f, 0f, 0f, if(showImage) Color.BLACK else Color.parseColor("#00d2ff"))
            setTypeface(null, Typeface.BOLD)
            setPadding(40, 40, 40, 40)
        }
        
        cardView.addView(quoteText, FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT)

        val cardParams = FrameLayout.LayoutParams(
            (resources.displayMetrics.widthPixels * 0.85).toInt(),
            FrameLayout.LayoutParams.WRAP_CONTENT
        ).apply { gravity = Gravity.CENTER; setMargins(0, 0, 0, 100) }

        // 3. زر الإعجاب العائم (القلب) - الإضافة الجديدة
        val likeButton = TextView(this).apply {
            text = "♡" // قلب فارغ
            setTextColor(Color.WHITE)
            textSize = 36f
            gravity = Gravity.CENTER
            alpha = 0f
            background = GradientDrawable().apply { shape = GradientDrawable.OVAL; setColor(Color.parseColor("#80000000")) }
            setPadding(30, 20, 30, 20)
            elevation = 60f
            
            // عند الضغط على القلب
            setOnClickListener {
                if (!isLiked) {
                    isLiked = true
                    text = "♥" // قلب ممتلئ
                    setTextColor(Color.parseColor("#EF4444")) // أحمر مشع
                    setShadowLayer(25f, 0f, 0f, Color.parseColor("#EF4444"))
                    
                    // إرسال تفاعل (Broadcast) للتطبيق ليحسبه في أثر اليوم وحديقتي
                    val intent = Intent("com.qatra.app.QUOTE_LIKED")
                    intent.putExtra("category", category)
                    sendBroadcast(intent)
                    
                    // حركة نبض للقلب
                    val pScaleX = ObjectAnimator.ofFloat(this, "scaleX", 1f, 1.4f, 1f).setDuration(400)
                    val pScaleY = ObjectAnimator.ofFloat(this, "scaleY", 1f, 1.4f, 1f).setDuration(400)
                    AnimatorSet().apply { playTogether(pScaleX, pScaleY); start() }
                }
            }
        }
        
        val likeParams = FrameLayout.LayoutParams(FrameLayout.LayoutParams.WRAP_CONTENT, FrameLayout.LayoutParams.WRAP_CONTENT).apply {
            gravity = Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL
            setMargins(0, 0, 0, 50) // يظهر تحت البطاقة
        }

        overlayContainer?.addView(ripple, rippleParams)
        overlayContainer?.addView(dropView, dropParams)
        overlayContainer?.addView(cardView, cardParams)
        overlayContainer?.addView(likeButton, likeParams) 
        
        // تعديل مهم: السماح بالتفاعل مع الحاوية (Touch Events) لكي يعمل زر القلب
        params.flags = params.flags and WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE.inv()
        params.flags = params.flags or WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL
        
        windowManager?.addView(overlayContainer, params)

        val handler = Handler(Looper.getMainLooper())
        
        // تشغيل صوت السقوط
        try {
            val fallResId = resources.getIdentifier("drop_fall_sound", "raw", packageName)
            if (fallResId != 0) { fallPlayer = MediaPlayer.create(this, fallResId); fallPlayer?.start() }
        } catch (e: Exception) {}

        // الحركة 1: سقوط القطرة من أعلى الشاشة
        dropView.translationY = -screenHeight
        ObjectAnimator.ofFloat(dropView, "translationY", -screenHeight, bottomLandingY).apply {
            duration = 1000; interpolator = AccelerateInterpolator(); start()
        }

        handler.postDelayed({
            dropView.visibility = View.GONE
            
            // تشغيل صوت الفرقعة
            try {
                val popResId = resources.getIdentifier("drop_pop_sound", "raw", packageName)
                if (popResId != 0) { popPlayer = MediaPlayer.create(this, popResId); popPlayer?.start() }
            } catch (e: Exception) {}

            ripple.alpha = 1f
            val rScaleX = ObjectAnimator.ofFloat(ripple, "scaleX", 1f, 15f).setDuration(800)
            val rScaleY = ObjectAnimator.ofFloat(ripple, "scaleY", 1f, 15f).setDuration(800)
            val rFade = ObjectAnimator.ofFloat(ripple, "alpha", 1f, 0f).setDuration(800)
            AnimatorSet().apply { playTogether(rScaleX, rScaleY, rFade); start() }

            // الحركة 2: صعود العبارة إلى وسط الشاشة
            cardView.translationY = bottomLandingY / 2f
            cardView.scaleX = 0.5f; cardView.scaleY = 0.5f
            
            val tRise = ObjectAnimator.ofFloat(cardView, "translationY", bottomLandingY / 2f, 0f).setDuration(2500)
            tRise.interpolator = DecelerateInterpolator(1.5f)
            val tGrowX = ObjectAnimator.ofFloat(cardView, "scaleX", 0.5f, 1f).setDuration(2500)
            val tGrowY = ObjectAnimator.ofFloat(cardView, "scaleY", 0.5f, 1f).setDuration(2500)
            val tFade = ObjectAnimator.ofFloat(cardView, "alpha", 0f, 1f).setDuration(1500)
            
            // الحركة 3: وميض العبارة عند الاستقرار
            val pulseFade = ObjectAnimator.ofFloat(cardView, "alpha", 1f, 0.4f, 1f).apply {
                duration = 1200
                startDelay = 2500
            }
            
            // ظهور زر القلب
            val likeFade = ObjectAnimator.ofFloat(likeButton, "alpha", 0f, 1f).apply { duration = 1500; startDelay = 1000 }
            
            AnimatorSet().apply { playTogether(tRise, tGrowX, tGrowY, tFade, pulseFade, likeFade); start() }

        }, 1000)

        handler.postDelayed({
            ObjectAnimator.ofFloat(overlayContainer, "alpha", 1f, 0f).setDuration(800).start()
            handler.postDelayed({ stopSelf() }, 800)
        }, displayDuration)
    }

    override fun onDestroy() {
        super.onDestroy()
        fallPlayer?.release()
        popPlayer?.release()
        if (overlayContainer != null) { windowManager?.removeView(overlayContainer); overlayContainer = null }
    }
}
