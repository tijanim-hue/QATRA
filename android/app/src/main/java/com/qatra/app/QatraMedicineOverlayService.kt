package com.qatra.app

import android.app.Service
import android.content.Intent
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.os.SystemClock
import android.view.Gravity
import android.view.View
import android.view.WindowManager
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import java.util.ArrayDeque

/** Independent medicine surface: no quote ledger, likes, audio or speech. */
class QatraMedicineOverlayService : Service() {
    private val handler = Handler(Looper.getMainLooper())
    private val queue = ArrayDeque<String>()
    private var panel: View? = null
    private var activeId: String? = null
    private var expiresAt = 0L
    private val manager: WindowManager by lazy { getSystemService(WINDOW_SERVICE) as WindowManager }
    override fun onBind(intent: Intent?): IBinder? = null
    private fun dp(value: Int): Int = (value * resources.displayMetrics.density).toInt()

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val id = intent?.getStringExtra(QatraMedicineReminderScheduler.EXTRA_DOSE_ID)
        if (!id.isNullOrBlank() && id != activeId && !queue.contains(id)) queue.addLast(id)
        if (panel == null) next()
        return START_NOT_STICKY
    }

    private fun next() {
        clearPanel()
        while (queue.isNotEmpty()) {
            val id = queue.removeFirst()
            val dose = QatraMedicineReminderReceiver.readDose(this, id) ?: continue
            val mode = QatraMedicineAlertPolicy.read(this)
            val decision = QatraMedicineAlertPolicy.decide(mode, QatraMedicineAlertPolicy.overlayAvailable(this))
            if (!decision.overlay) {
                QatraMedicineReminderReceiver.notifyDose(this, dose)
                continue
            }
            try {
                val layout = LinearLayout(this).apply {
                    orientation = LinearLayout.VERTICAL
                    gravity = Gravity.CENTER
                    layoutDirection = View.LAYOUT_DIRECTION_RTL
                    setPadding(dp(22), dp(18), dp(22), dp(18))
                    background = GradientDrawable(GradientDrawable.Orientation.TL_BR,
                        intArrayOf(Color.rgb(29, 53, 79), Color.rgb(15, 25, 43))).apply { cornerRadius = dp(24).toFloat() }
                    elevation = dp(12).toFloat()
                }
                fun text(value: String, size: Float) {
                    layout.addView(TextView(this).apply {
                        this.text = value
                        textSize = size
                        gravity = Gravity.CENTER
                        setTextColor(Color.WHITE)
                        setPadding(0, dp(5), 0, dp(5))
                    }, LinearLayout.LayoutParams(-1, -2))
                }
                text("وقت جرعة ${dose.name}", 22f)
                text("الجرعة المسجّلة: ${dose.amount}", 18f)
                text("الوقت: ${dose.time(this)}", 17f)
                text("سجّل التناول فقط بعد تناولها فعلًا.", 14f)
                layout.addView(Button(this).apply {
                    text = "فتح قسم الأدوية"
                    setOnClickListener {
                        try {
                            startActivity(Intent(this@QatraMedicineOverlayService, MainActivity::class.java)
                                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP)
                                .putExtra("openMedicine", true))
                            next()
                        } catch (_: Exception) {
                            QatraMedicineReminderReceiver.notifyDose(this@QatraMedicineOverlayService, dose)
                        }
                    }
                })
                layout.addView(Button(this).apply { text = "إغلاق"; setOnClickListener { next() } })
                val width = (resources.displayMetrics.widthPixels - dp(32)).coerceAtMost(dp(440)).coerceAtLeast(1)
                val params = WindowManager.LayoutParams(width, WindowManager.LayoutParams.WRAP_CONTENT,
                    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY else WindowManager.LayoutParams.TYPE_PHONE,
                    WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
                    PixelFormat.TRANSLUCENT).apply { gravity = Gravity.CENTER }
                activeId = id
                manager.addView(layout, params)
                panel = layout
                expiresAt = SystemClock.uptimeMillis() + 12000L
                handler.postDelayed(check, 1000L)
                return
            } catch (_: Exception) {
                clearPanel()
                QatraMedicineReminderReceiver.notifyDose(this, dose)
            }
        }
        stopSelf()
    }

    private val check = object : Runnable {
        override fun run() {
            val id = activeId ?: return
            if (SystemClock.uptimeMillis() >= expiresAt ||
                !QatraMedicineAlertPolicy.overlayAvailable(this@QatraMedicineOverlayService) ||
                QatraMedicineAlertPolicy.read(this@QatraMedicineOverlayService) == QatraMedicineAlertPolicy.Mode.NOTIFICATION ||
                QatraMedicineReminderReceiver.readDose(this@QatraMedicineOverlayService, id) == null) {
                next()
            } else handler.postDelayed(this, 1000L)
        }
    }

    private fun clearPanel() {
        handler.removeCallbacks(check)
        panel?.let { try { manager.removeViewImmediate(it) } catch (_: Exception) {} }
        panel = null
        activeId = null
    }

    override fun onDestroy() {
        clearPanel()
        queue.clear()
        handler.removeCallbacksAndMessages(null)
        super.onDestroy()
    }
}
