package com.qatra.app

import android.app.*
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.IBinder
import android.view.*
import android.widget.*
import android.animation.ValueAnimator

class QatraOverlayService : Service() {
    private lateinit var wm: WindowManager
    private var root: FrameLayout? = null
    private var expanded = false
    private var quote = "خذ لحظة هدوء."
    private val channel = "qatra_overlay_service"

    override fun onCreate() {
        super.onCreate()
        wm = getSystemService(WINDOW_SERVICE) as WindowManager
        createChannel()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val notification = Notification.Builder(this, channel)
                .setContentTitle("قطرة")
                .setContentText("القطرة العائمة جاهزة")
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .build()
            startForeground(77, notification)
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        when (intent?.action) {
            ACTION_HIDE -> { removeDrop(); stopSelf(); return START_NOT_STICKY }
            ACTION_SHOW -> { quote = intent.getStringExtra("quote") ?: quote; showDrop() }
        }
        return START_STICKY
    }

    private fun showDrop() {
        removeDrop()
        expanded = false
        val frame = FrameLayout(this)
        root = frame
        val bubble = TextView(this).apply {
            text = " "
            gravity = Gravity.CENTER
            background = GradientDrawable(
                GradientDrawable.Orientation.TL_BR,
                intArrayOf(Color.argb(235, 195, 246, 255), Color.argb(210, 65, 157, 245), Color.argb(220, 91, 90, 211))
            ).apply {
                shape = GradientDrawable.OVAL
                setStroke(2, Color.argb(180, 255, 255, 255))
            }
            elevation = 18f
        }
        frame.addView(bubble, FrameLayout.LayoutParams(66, 66))
        frame.setOnClickListener { expand(frame, bubble) }
        val params = WindowManager.LayoutParams(
            66, 66,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY else WindowManager.LayoutParams.TYPE_PHONE,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN,
            PixelFormat.TRANSLUCENT
        ).apply { gravity = Gravity.TOP or Gravity.START; x = 24; y = 280 }
        try { wm.addView(frame, params) } catch (_: Exception) { stopSelf() }
    }

    private fun expand(frame: FrameLayout, bubble: TextView) {
        if (expanded) { removeDrop(); stopSelf(); return }
        expanded = true
        val text = TextView(this).apply {
            this.text = quote
            textSize = 16f
            setTextColor(Color.WHITE)
            gravity = Gravity.CENTER
            typeface = Typeface.create("sans-serif", Typeface.BOLD)
            setPadding(24, 18, 24, 18)
            background = GradientDrawable(
                GradientDrawable.Orientation.TL_BR,
                intArrayOf(Color.argb(245, 15, 39, 67), Color.argb(240, 30, 76, 124))
            ).apply { cornerRadius = 32f; setStroke(2, Color.argb(150, 170, 230, 255)) }
        }
        frame.removeAllViews()
        frame.addView(text, FrameLayout.LayoutParams(280, ViewGroup.LayoutParams.WRAP_CONTENT))
        val p = frame.layoutParams as WindowManager.LayoutParams
        p.width = 280
        p.height = ViewGroup.LayoutParams.WRAP_CONTENT
        try { wm.updateViewLayout(frame, p) } catch (_: Exception) {}
        frame.setOnClickListener { removeDrop(); stopSelf() }
        frame.postDelayed({ if (expanded) { removeDrop(); stopSelf() } }, 12000)
    }

    private fun removeDrop() {
        root?.let { try { wm.removeView(it) } catch (_: Exception) {} }
        root = null
    }

    private fun createChannel() {
        if (Build.VERSION.SDK_INT >= 26) {
            val ch = NotificationChannel(channel, "خدمة قطرة العائمة", NotificationManager.IMPORTANCE_LOW)
            (getSystemService(NOTIFICATION_SERVICE) as NotificationManager).createNotificationChannel(ch)
        }
    }

    override fun onDestroy() { removeDrop(); super.onDestroy() }
    override fun onBind(intent: Intent?): IBinder? = null

    companion object {
        const val ACTION_SHOW = "com.qatra.app.SHOW"
        const val ACTION_HIDE = "com.qatra.app.HIDE"
    }
}
