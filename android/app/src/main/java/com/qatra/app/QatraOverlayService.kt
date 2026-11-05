package com.qatra.app

import android.app.Service
import android.content.Intent
import android.graphics.PixelFormat
import android.media.RingtoneManager
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.provider.Settings
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.WindowManager
import android.widget.ImageView
import android.widget.TextView

class QatraOverlayService : Service() {
    private var windowManager: WindowManager? = null
    private var floatingView: View? = null

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
        if (floatingView != null) return

        windowManager = getSystemService(WINDOW_SERVICE) as WindowManager
        val inflater = getSystemService(LAYOUT_INFLATER_SERVICE) as LayoutInflater
        floatingView = inflater.inflate(R.layout.floating_drop_layout, null)

        val dropImage = floatingView?.findViewById<ImageView>(R.id.drop_image)
        val quoteText = floatingView?.findViewById<TextView>(R.id.quote_text)

        quoteText?.text = quote

        val layoutFlag = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
        } else {
            WindowManager.LayoutParams.TYPE_PHONE
        }

        val params = WindowManager.LayoutParams(
            WindowManager.LayoutParams.WRAP_CONTENT,
            WindowManager.LayoutParams.WRAP_CONTENT,
            layoutFlag,
            WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE,
            PixelFormat.TRANSLUCENT
        )
        params.gravity = Gravity.CENTER
        windowManager?.addView(floatingView, params)

        // برمجة فرقعة القطرة
        dropImage?.setOnClickListener {
            dropImage.visibility = View.GONE
            quoteText?.visibility = View.VISIBLE
            playSound() // صوت آخر عند الفرقعة
            
            // إخفاء الكل بعد 5 ثوانٍ من قراءة العبارة
            Handler(Looper.getMainLooper()).postDelayed({
                stopSelf()
            }, 5000)
        }

        // إخفاء تلقائي إذا لم يلمسها المستخدم بعد 15 ثانية
        Handler(Looper.getMainLooper()).postDelayed({
            stopSelf()
        }, 15000)
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
        if (floatingView != null) {
            windowManager?.removeView(floatingView)
            floatingView = null
        }
    }
}
