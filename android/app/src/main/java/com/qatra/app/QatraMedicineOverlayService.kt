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
import android.view.ViewGroup
import android.view.WindowManager
import android.widget.Button
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import java.util.ArrayDeque

/** Medicine-only scene. Never records quote likes or speaks health data. */
class QatraMedicineOverlayService : Service() {
    private val handler=Handler(Looper.getMainLooper())
    private val queue=ArrayDeque<String>()
    private var scene: QatraMedicineScene?=null
    private var activeId: String?=null
    private var expiresAt=0L
    private var cardReady=false
    private val manager: WindowManager by lazy {getSystemService(WINDOW_SERVICE) as WindowManager}
    override fun onBind(intent: Intent?): IBinder?=null
    private fun dp(value: Int)=(value*resources.displayMetrics.density).toInt()
    override fun onStartCommand(intent: Intent?,flags: Int,startId: Int): Int {
        val id=intent?.getStringExtra(QatraMedicineReminderScheduler.EXTRA_DOSE_ID)
        if(!id.isNullOrBlank()&&id!=activeId&&!queue.contains(id))queue.addLast(id)
        if(scene==null)next()
        return START_NOT_STICKY
    }

    private fun next(){
        clearScene()
        while(queue.isNotEmpty()){
            val id=queue.removeFirst()
            val dose=QatraMedicineReminderReceiver.readDose(this,id)?:continue
            val mode=QatraMedicineAlertPolicy.read(this)
            if(!QatraMedicineAlertPolicy.decide(mode,QatraMedicineAlertPolicy.overlayAvailable(this)).overlay){
                QatraMedicineReminderReceiver.notifyDose(this,dose);continue
            }
            try{
                val controls=mutableListOf<Button>()
                val content=LinearLayout(this).apply{
                    orientation=LinearLayout.VERTICAL;gravity=Gravity.CENTER
                    layoutDirection=View.LAYOUT_DIRECTION_RTL
                    setPadding(dp(22),dp(18),dp(22),dp(18))
                    background=GradientDrawable(GradientDrawable.Orientation.TL_BR,
                        intArrayOf(Color.rgb(29,53,79),Color.rgb(15,25,43))).apply{cornerRadius=dp(24).toFloat();setStroke(dp(1).coerceAtLeast(1),0x668ACFEF)}
                }
                fun line(value: String,size: Float){
                    content.addView(TextView(this).apply{
                        text=value;textSize=size;gravity=Gravity.CENTER;setTextColor(Color.WHITE)
                        setPadding(0,dp(5),0,dp(5))
                    },LinearLayout.LayoutParams(-1,-2))
                }
                line("وقت جرعة ${dose.name}",22f)
                line("الجرعة المسجّلة: ${dose.amount}",18f)
                line("الوقت: ${dose.time(this)}",17f)
                line("سجّل التناول فقط بعد تناولها فعلًا.",14f)
                fun button(label: String,action: () -> Unit){
                    val item=Button(this).apply{text=label;isEnabled=false;setOnClickListener{if(cardReady)action()}}
                    controls.add(item);content.addView(item,LinearLayout.LayoutParams(-1,-2))
                }
                button("فتح قسم الأدوية"){
                    try{
                        startActivity(Intent(this,MainActivity::class.java)
                            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP).putExtra("openMedicine",true))
                        next()
                    }catch(_:Exception){QatraMedicineReminderReceiver.notifyDose(this,dose)}
                }
                button("إغلاق"){next()}
                val card=object:ScrollView(this){
                    override fun onMeasure(widthMeasureSpec:Int,heightMeasureSpec:Int){
                        val maxHeight=(resources.displayMetrics.heightPixels*.72f).toInt()
                        super.onMeasure(widthMeasureSpec,View.MeasureSpec.makeMeasureSpec(maxHeight,View.MeasureSpec.AT_MOST))
                    }
                }.apply{isFillViewport=false;addView(content,ViewGroup.LayoutParams(-1,-2))}
                val reduced=Build.VERSION.SDK_INT>=Build.VERSION_CODES.O&&!android.animation.ValueAnimator.areAnimatorsEnabled()
                val root=QatraMedicineScene(this,card,reduced){
                    if(activeId==id){cardReady=true;expiresAt=SystemClock.uptimeMillis()+12000L;controls.forEach{it.isEnabled=true}}
                }
                val width=(resources.displayMetrics.widthPixels-dp(32)).coerceAtMost(dp(440)).coerceAtLeast(1)
                root.addView(card,FrameLayout.LayoutParams(width,ViewGroup.LayoutParams.WRAP_CONTENT,Gravity.CENTER))
                val params=WindowManager.LayoutParams(-1,-1,
                    if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.O)WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY else WindowManager.LayoutParams.TYPE_PHONE,
                    WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL,
                    PixelFormat.TRANSLUCENT)
                activeId=id;scene=root;cardReady=false;expiresAt=SystemClock.uptimeMillis()+20000L
                manager.addView(root,params)
                root.post{if(scene===root)root.start()}
                handler.postDelayed(check,1000L)
                return
            }catch(_:Exception){clearScene();QatraMedicineReminderReceiver.notifyDose(this,dose)}
        }
        stopSelf()
    }

    private val check=object:Runnable{
        override fun run(){
            val id=activeId?:return
            if(SystemClock.uptimeMillis()>=expiresAt||
                !QatraMedicineAlertPolicy.overlayAvailable(this@QatraMedicineOverlayService)||
                QatraMedicineAlertPolicy.read(this@QatraMedicineOverlayService)==QatraMedicineAlertPolicy.Mode.NOTIFICATION||
                QatraMedicineReminderReceiver.readDose(this@QatraMedicineOverlayService,id)==null)next()
            else handler.postDelayed(this,1000L)
        }
    }
    private fun clearScene(){
        handler.removeCallbacks(check)
        scene?.let{it.release();try{manager.removeViewImmediate(it)}catch(_:Exception){}}
        scene=null;activeId=null;cardReady=false
    }
    override fun onDestroy(){clearScene();queue.clear();handler.removeCallbacksAndMessages(null);super.onDestroy()}
}
