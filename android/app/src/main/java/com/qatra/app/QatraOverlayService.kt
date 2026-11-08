package com.qatra.app

import android.animation.AnimatorSet
import android.animation.ObjectAnimator
import android.animation.ValueAnimator
import android.app.Service
import android.content.Context
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
import android.view.animation.AccelerateDecelerateInterpolator
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.TextView

class QatraOverlayService : Service() {
    private var windowManager: WindowManager? = null
    private var overlayContainer: FrameLayout? = null
    private var fallPlayer: MediaPlayer? = null
    private var popPlayer: MediaPlayer? = null
    private var quoteAudioPlayer: MediaPlayer? = null // مشغل الصوت للقطرة
    private var isLiked = false
    private var isAudioPlaying = false

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

        val cardView = FrameLayout(this).apply {
            alpha = 0f
            if (showImage) {
                background = GradientDrawable().apply {
                    shape = GradientDrawable.RECTANGLE; cornerRadius = 40f
                    setStroke(2, Color.parseColor("#8000d2ff"))
                }
                clipToOutline = true; elevation = 50f
            }
        }
        
        if (showImage) {
            val bgImageName = when (category) {
                "cat_dhikr", "cat_quran" -> "bg_islamic"
                "cat_selfDev" -> "bg_motivation"
                "cat_culture" -> "bg_culture"
                "myLibrary", "favorites", "cat_poetry", "cat_awareness", "family" -> "bg_custom"
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
            text = quote; setTextColor(Color.WHITE); textSize = 24f; gravity = Gravity.CENTER
            setShadowLayer(15f, 0f, 0f, if(showImage) Color.BLACK else Color.parseColor("#00d2ff"))
            setTypeface(null, Typeface.BOLD); setPadding(40, 80, 40, 80) // تم تكبير الـ padding لاحتواء الأزرار الإضافية
        }
        cardView.addView(quoteText, FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT)
        val cardParams = FrameLayout.LayoutParams((resources.displayMetrics.widthPixels * 0.85).toInt(), FrameLayout.LayoutParams.WRAP_CONTENT).apply { 
            gravity = Gravity.CENTER; setMargins(0, 0, 0, 100) 
        }

        // القلب العائم الاحترافي
        val likeButton = TextView(this).apply {
            text = "♡" 
            setTextColor(Color.WHITE)
            textSize = 34f
            gravity = Gravity.CENTER
            alpha = 0f
            background = GradientDrawable().apply { 
                shape = GradientDrawable.OVAL
                colors = intArrayOf(Color.parseColor("#66000000"), Color.parseColor("#33000000"))
                setStroke(2, Color.parseColor("#4Dffffff"))
            }
            setPadding(35, 20, 35, 20)
            elevation = 60f
            
            setOnClickListener {
                if (!isLiked) {
                    isLiked = true; text = "♥"; setTextColor(Color.parseColor("#FF3B30"))
                    background = GradientDrawable().apply { 
                        shape = GradientDrawable.OVAL; setColor(Color.parseColor("#33FF3B30")); setStroke(2, Color.parseColor("#FF3B30"))
                    }
                    setShadowLayer(30f, 0f, 0f, Color.parseColor("#FF3B30"))
                    
                    val intent = Intent("com.qatra.app.QUOTE_LIKED")
                    intent.putExtra("category", category)
                    sendBroadcast(intent)
                    
                    val pScaleX = ObjectAnimator.ofFloat(this, "scaleX", 1f, 1.5f, 1f).setDuration(400)
                    val pScaleY = ObjectAnimator.ofFloat(this, "scaleY", 1f, 1.5f, 1f).setDuration(400)
                    AnimatorSet().apply { playTogether(pScaleX, pScaleY); start() }
                }
            }
        }
        val likeParams = FrameLayout.LayoutParams(FrameLayout.LayoutParams.WRAP_CONTENT, FrameLayout.LayoutParams.WRAP_CONTENT).apply {
            gravity = Gravity.CENTER; setMargins(0, 450, 0, 0) // أسفل البطاقة
        }

        // زر "أجب الآن" (لأسئلة الوعي فقط)
        var actionButton: TextView? = null
        var actionParams: FrameLayout.LayoutParams? = null
        
        if (category == "cat_awareness") {
            actionButton = TextView(this).apply {
                text = "📝 أجب الآن"
                setTextColor(Color.WHITE)
                textSize = 18f
                gravity = Gravity.CENTER
                background = GradientDrawable().apply {
                    shape = GradientDrawable.RECTANGLE
                    cornerRadius = 40f
                    setColor(Color.parseColor("#0EA5E9"))
                }
                setPadding(50, 20, 50, 20)
                elevation = 60f
                alpha = 0f
                
                setOnClickListener {
                    val intent = Intent("com.qatra.app.OPEN_JOURNAL")
                    intent.putExtra("quote", quote)
                    sendBroadcast(intent)
                    
                    val launchIntent = packageManager.getLaunchIntentForPackage(packageName)
                    if (launchIntent != null) {
                        launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
                        startActivity(launchIntent)
                    }
                    stopSelf()
                }
            }
            actionParams = FrameLayout.LayoutParams(FrameLayout.LayoutParams.WRAP_CONTENT, FrameLayout.LayoutParams.WRAP_CONTENT).apply {
                gravity = Gravity.CENTER; setMargins(0, 700, 0, 0)
            }
        }

        // زر تشغيل الصوت (يظهر إذا كانت القطرة قرآن أو أذكار كمثال - المرحلة الثالثة)
        var audioButton: TextView? = null
        var audioParams: FrameLayout.LayoutParams? = null
        
        if (category == "cat_quran" || category == "cat_dhikr") {
            audioButton = TextView(this).apply {
                text = "▶️ استمع"
                setTextColor(Color.WHITE)
                textSize = 16f
                gravity = Gravity.CENTER
                background = GradientDrawable().apply {
                    shape = GradientDrawable.RECTANGLE
                    cornerRadius = 40f
                    setColor(Color.parseColor("#10B981")) // لون أخضر مريح
                }
                setPadding(40, 15, 40, 15)
                elevation = 60f
                alpha = 0f
                
                setOnClickListener {
                    if (!isAudioPlaying) {
                        isAudioPlaying = true
                        text = "⏸️ إيقاف"
                        try {
                            // سنستخدم صوت افتراضي للاختبار (يمكن ربطه بمسارات أخرى لاحقاً)
                            val audioResId = resources.getIdentifier("drop_fall_sound", "raw", packageName)
                            if (audioResId != 0) {
                                quoteAudioPlayer = MediaPlayer.create(this@QatraOverlayService, audioResId)
                                quoteAudioPlayer?.isLooping = true
                                quoteAudioPlayer?.start()
                            }
                        } catch (e: Exception) {}
                    } else {
                        isAudioPlaying = false
                        text = "▶️ استمع"
                        quoteAudioPlayer?.pause()
                    }
                }
            }
            audioParams = FrameLayout.LayoutParams(FrameLayout.LayoutParams.WRAP_CONTENT, FrameLayout.LayoutParams.WRAP_CONTENT).apply {
                gravity = Gravity.CENTER; setMargins(0, -350, 0, 0) // يظهر أعلى البطاقة قليلاً
            }
        }

        overlayContainer?.addView(ripple, rippleParams)
        overlayContainer?.addView(dropView, dropParams)
        overlayContainer?.addView(cardView, cardParams)
        overlayContainer?.addView(likeButton, likeParams) 
        if (actionButton != null) overlayContainer?.addView(actionButton, actionParams)
        if (audioButton != null) overlayContainer?.addView(audioButton, audioParams) // إضافة زر الصوت للقطرة
        
        params.flags = params.flags and WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE.inv()
        params.flags = params.flags or WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL
        
        windowManager?.addView(overlayContainer, params)

        val handler = Handler(Looper.getMainLooper())
        
        try {
            val fallResId = resources.getIdentifier("drop_fall_sound", "raw", packageName)
            if (fallResId != 0) { fallPlayer = MediaPlayer.create(this, fallResId); fallPlayer?.start() }
        } catch (e: Exception) {}

        dropView.translationY = -screenHeight
        ObjectAnimator.ofFloat(dropView, "translationY", -screenHeight, bottomLandingY).apply {
            duration = 1000; interpolator = AccelerateInterpolator(); start()
        }

        handler.postDelayed({
            dropView.visibility = View.GONE
            try {
                val popResId = resources.getIdentifier("drop_pop_sound", "raw", packageName)
                if (popResId != 0) { popPlayer = MediaPlayer.create(this, popResId); popPlayer?.start() }
            } catch (e: Exception) {}

            ripple.alpha = 1f
            val rScaleX = ObjectAnimator.ofFloat(ripple, "scaleX", 1f, 15f).setDuration(800)
            val rScaleY = ObjectAnimator.ofFloat(ripple, "scaleY", 1f, 15f).setDuration(800)
            val rFade = ObjectAnimator.ofFloat(ripple, "alpha", 1f, 0f).setDuration(800)
            AnimatorSet().apply { playTogether(rScaleX, rScaleY, rFade); start() }

            cardView.translationY = bottomLandingY / 2f
            cardView.scaleX = 0.5f; cardView.scaleY = 0.5f
            val tRise = ObjectAnimator.ofFloat(cardView, "translationY", bottomLandingY / 2f, 0f).setDuration(2500)
            tRise.interpolator = DecelerateInterpolator(1.5f)
            val tGrowX = ObjectAnimator.ofFloat(cardView, "scaleX", 0.5f, 1f).setDuration(2500)
            val tGrowY = ObjectAnimator.ofFloat(cardView, "scaleY", 0.5f, 1f).setDuration(2500)
            val tFade = ObjectAnimator.ofFloat(cardView, "alpha", 0f, 1f).setDuration(1500)
            val pulseFade = ObjectAnimator.ofFloat(cardView, "alpha", 1f, 0.4f, 1f).apply { duration = 1200; startDelay = 2500 }
            
            val likeFade = ObjectAnimator.ofFloat(likeButton, "alpha", 0f, 1f).apply { duration = 1500; startDelay = 1000 }
            val actionFade = ObjectAnimator.ofFloat(actionButton, "alpha", 0f, 1f).apply { duration = 1500; startDelay = 1000 }
            val audioFade = ObjectAnimator.ofFloat(audioButton, "alpha", 0f, 1f).apply { duration = 1500; startDelay = 1000 }
            
            AnimatorSet().apply { playTogether(tRise, tGrowX, tGrowY, tFade, pulseFade, likeFade, actionFade, audioFade); start() }

            handler.postDelayed({
                ObjectAnimator.ofFloat(likeButton, "translationY", 0f, -20f).apply {
                    duration = 1500; repeatCount = ObjectAnimator.INFINITE; repeatMode = ValueAnimator.REVERSE
                    interpolator = AccelerateDecelerateInterpolator(); start()
                }
            }, 2500)

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
        quoteAudioPlayer?.release() // إيقاف الصوت عند إغلاق القطرة تلقائياً
        if (overlayContainer != null) { windowManager?.removeView(overlayContainer); overlayContainer = null }
    }
}
