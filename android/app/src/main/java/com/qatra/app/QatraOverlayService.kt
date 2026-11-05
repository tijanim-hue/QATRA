package com.qatra.app

import android.app.Service
import android.content.Intent
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.drawable.GradientDrawable
import android.media.RingtoneManager
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.provider.Settings
import android.view.Gravity
import android.view.View
import android.view.WindowManager
import android.widget.FrameLayout
import android.widget.TextView

class QatraOverlayService : Service() {
    private var windowManager: WindowManager? = null
    private var overlayContainer: FrameLayout? = null

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val quote = intent?.getStringExtra("quote") ?: "خذ نفسًا من الهدوء."
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) {
            stopSelf()
            return START_NOT_STICKY
        }

        showFloatingDrop(quote)
        playSound()
        return START_NOT_STICKY
    }

    private fun showFloatingDrop(quote: String) {
        if (overlayContainer != null) return

        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        
        // 1. إنشاء الحاوية التي ستظلل الشاشة باللون الأسود الشفاف
        overlayContainer = FrameLayout(this).apply {
            setBackgroundColor(Color.parseColor("#99000000"))
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
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
            PixelFormat.TRANSLUCENT
        )

        // 2. رسم القطرة العجيبة برمجياً (مربع بحواف دائرية غير متساوية ومائل بزاوية)
        val dropSize = 350
        val dropView = View(this).apply {
            val gradient = GradientDrawable(
                GradientDrawable.Orientation.TL_BR,
                intArrayOf(Color.parseColor("#ffffff"), Color.parseColor("#80E0FF"), Color.parseColor("#2A75D3"))
            )
            gradient.shape = GradientDrawable.RECTANGLE
            val r = dropSize / 2f
            // جعل الزاوية العلوية اليسرى حادة، والباقي دائري للحصول على شكل قطرة
            gradient.cornerRadii = floatArrayOf(0f, 0f, r, r, r, r, r, r)
            background = gradient
            rotation = -45f
            elevation = 30f
        }

        val dropParams = FrameLayout.LayoutParams(dropSize, dropSize).apply {
            gravity = Gravity.CENTER
        }

        // 3. النص الذي سيظهر بعد فرقعة القطرة
        val quoteText = TextView(this).apply {
            text = quote
            setTextColor(Color.WHITE)
            textSize = 24f
            gravity = Gravity.CENTER
            setPadding(60, 60, 60, 60)
            visibility = View.GONE
            
            val bg = GradientDrawable()
            bg.setColor(Color.parseColor("#E60B1021"))
            bg.cornerRadius = 50f
            bg.setStroke(3, Color.parseColor("#4A90E2"))
            background = bg
        }

        val textParams = FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.WRAP_CONTENT,
            FrameLayout.LayoutParams.WRAP_CONTENT
        ).apply {
            gravity = Gravity.CENTER
            setMargins(80, 0, 80, 0)
        }

        overlayContainer?.addView(dropView, dropParams)
        overlayContainer?.addView(quoteText, textParams)

        // 4. برمجة فرقعة القطرة
        overlayContainer?.setOnClickListener {
            if (dropView.visibility == View.VISIBLE) {
                dropView.visibility = View.GONE
                quoteText.visibility = View.VISIBLE
                playSound() // صوت الفرقعة
                
                Handler(Looper.getMainLooper()).postDelayed({ stopSelf() }, 6000)
            } else {
                stopSelf()
            }
        }

        windowManager?.addView(overlayContainer, params)

        // إغلاق تلقائي إذا نسيها المستخدم
        Handler(Looper.getMainLooper()).postDelayed({ stopSelf() }, 25000)
    }

    private fun playSound() {
        try {
            val notification = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION)
            val r = RingtoneManager.getRingtone(applicationContext, notification)
            r.play()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        if (overlayContainer != null) {
            windowManager?.removeView(overlayContainer)
            overlayContainer = null
        }
    }
}
