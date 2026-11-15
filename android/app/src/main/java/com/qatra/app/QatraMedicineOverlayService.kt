package com.qatra.app

import android.app.NotificationManager
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
import android.widget.NumberPicker
import android.widget.ScrollView
import android.widget.TextView
import java.util.ArrayDeque
import java.util.Date

/** Medicine actions never infer ingestion from display or dismissal. */
class QatraMedicineOverlayService : Service() {
    private val handler=Handler(Looper.getMainLooper())
    private val queue=ArrayDeque<String>()
    private var scene: QatraMedicineScene?=null
    private var activeId: String?=null
    private var expiresAt=0L
    private var cardReady=false
    private var actionBusy=false
    private val manager: WindowManager by lazy {getSystemService(WINDOW_SERVICE) as WindowManager}
    override fun onBind(intent: Intent?): IBinder?=null
    private fun dp(value: Int)=(value*resources.displayMetrics.density).toInt()
    override fun onStartCommand(intent: Intent?,flags: Int,startId: Int): Int {
        val id=intent?.getStringExtra(QatraMedicineReminderScheduler.EXTRA_DOSE_ID)
        if(!id.isNullOrBlank()&&id!=activeId&&!queue.contains(id))queue.addLast(id)
        if(scene==null)next()
        return START_NOT_STICKY
    }

    private fun dismissNotification(id: String){
        try{(getSystemService(NOTIFICATION_SERVICE) as NotificationManager).cancel(("medicine:$id").hashCode())}catch(_:Exception){}
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
                        intArrayOf(0xEF1D354F.toInt(),0xF20F192B.toInt())).apply{
                        cornerRadius=dp(24).toFloat();setStroke(dp(1).coerceAtLeast(1),0x668ACFEF)
                    }
                }
                fun line(value: String,size: Float): TextView{
                    val label=TextView(this).apply{
                        text=value;textSize=size;gravity=Gravity.CENTER;setTextColor(Color.WHITE)
                        setPadding(0,dp(5),0,dp(5))
                    }
                    content.addView(label,LinearLayout.LayoutParams(-1,-2));return label
                }
                line("وقت جرعة ${dose.name}",22f)
                line("الجرعة المسجّلة: ${dose.amount}",18f)
                line("الوقت: ${dose.time(this)}",17f)
                val message=line("اضغط أخذت الجرعة فقط بعد تناولها فعلًا.",14f)
                message.accessibilityLiveRegion=View.ACCESSIBILITY_LIVE_REGION_POLITE
                fun button(parent: LinearLayout,label: String,primary: Boolean=false,action: () -> Unit): Button{
                    val item=Button(this).apply{
                        text=label;isEnabled=false;isAllCaps=false;minHeight=dp(48)
                        setTextColor(if(primary)0xFF071522.toInt() else Color.WHITE)
                        background=GradientDrawable().apply{
                            cornerRadius=dp(15).toFloat();setColor(if(primary)0xFF7BDBF4.toInt() else 0x222FB2D3)
                            setStroke(dp(1).coerceAtLeast(1),0x668ACFEF)
                        }
                        setOnClickListener{if(cardReady&&!actionBusy)action()}
                    }
                    controls.add(item)
                    parent.addView(item,LinearLayout.LayoutParams(-1,-2).apply{topMargin=dp(9)})
                    return item
                }
                fun finishAction(text: String){
                    handler.removeCallbacks(check);cardReady=false
                    controls.forEach{it.isEnabled=false};message.text=text
                    handler.postDelayed({if(activeId==id)next()},1000L)
                }
                val delayPanel=LinearLayout(this).apply{orientation=LinearLayout.VERTICAL;visibility=View.GONE}
                button(content,"أخذت الجرعة",true){
                    actionBusy=true
                    try{
                        val db=QatraMedicineDatabase(this)
                        val recorded=try{db.confirmTaken(id)}finally{db.close()}
                        try{QatraMedicineReminderScheduler.cancel(this,id)}catch(_:Exception){}
                        dismissNotification(id)
                        finishAction(if(recorded)"تم تسجيل تناول الجرعة وتحديث المخزون." else "الجرعة مسجّلة مسبقًا؛ لم يُخصم المخزون مرة أخرى.")
                    }catch(_:Exception){message.text="تعذر تأكيد التسجيل. افتح قسم الأدوية للتحقق قبل إعادة المحاولة."}
                    finally{actionBusy=false}
                }
                button(content,"تأجيل"){
                    delayPanel.visibility=View.VISIBLE
                    expiresAt=SystemClock.uptimeMillis()+300000L
                }
                content.addView(delayPanel,LinearLayout.LayoutParams(-1,-2))
                val heading=TextView(this).apply{text="إعادة التذكير بعد";setTextColor(Color.WHITE);gravity=Gravity.CENTER;setPadding(0,dp(12),0,dp(8))}
                delayPanel.addView(heading)
                val wheels=LinearLayout(this).apply{orientation=LinearLayout.HORIZONTAL;gravity=Gravity.CENTER;layoutDirection=View.LAYOUT_DIRECTION_LTR}
                fun picker(title: String,max: Int,initial: Int): NumberPicker{
                    val column=LinearLayout(this).apply{orientation=LinearLayout.VERTICAL;gravity=Gravity.CENTER}
                    column.addView(TextView(this).apply{text=title;setTextColor(Color.WHITE);gravity=Gravity.CENTER})
                    val picker=NumberPicker(this).apply{
                        minValue=0;maxValue=max;value=initial;wrapSelectorWheel=true
                        descendantFocusability=ViewGroup.FOCUS_BLOCK_DESCENDANTS
                        contentDescription=title
                        setFormatter{String.format(java.util.Locale.ROOT,"%02d",it)}
                    }
                    column.addView(picker,LinearLayout.LayoutParams(dp(96),dp(150)))
                    wheels.addView(column,LinearLayout.LayoutParams(0,-2,1f));return picker
                }
                val hours=picker("الساعات",23,0)
                val minutes=picker("الدقائق",59,10)
                delayPanel.addView(wheels)
                val preview=TextView(this).apply{setTextColor(Color.WHITE);gravity=Gravity.CENTER;setPadding(0,dp(8),0,dp(8))}
                delayPanel.addView(preview)
                fun updatePreview(){
                    val delay=hours.value*60L+minutes.value
                    preview.text=if(delay<1)"اختر دقيقة واحدة على الأقل." else "موعد تقريبي: "+android.text.format.DateFormat.getTimeFormat(this)
                        .format(Date(System.currentTimeMillis()+delay*60000L))
                }
                hours.setOnValueChangedListener{_,_,_->updatePreview()}
                minutes.setOnValueChangedListener{_,_,_->updatePreview()}
                updatePreview()
                button(delayPanel,"تأكيد التأجيل",true){
                    val delay=hours.value*60L+minutes.value
                    if(delay<1){message.text="اختر دقيقة واحدة على الأقل."}
                    else{
                        actionBusy=true
                        try{
                            val current=QatraMedicineReminderReceiver.readDose(this,id)?:throw IllegalStateException("Dose unavailable")
                            val at=QatraMedicineReminderScheduler.scheduleSnooze(this,id,current.name,current.amount,current.scheduledAt,delay)
                            if(QatraMedicineReminderReceiver.readDose(this,id)==null){
                                QatraMedicineReminderScheduler.cancel(this,id)
                                throw IllegalStateException("Dose changed")
                            }
                            dismissNotification(id)
                            finishAction("تم طلب التذكير عند "+android.text.format.DateFormat.getTimeFormat(this).format(Date(at))+". قد يؤخره النظام حسب الأذونات.")
                        }catch(_:Exception){message.text="تعذر تأكيد التأجيل. راجع قسم الأدوية وأذونات التنبيه."}
                        finally{actionBusy=false}
                    }
                }
                button(delayPanel,"إلغاء التأجيل"){
                    delayPanel.visibility=View.GONE;expiresAt=SystemClock.uptimeMillis()+12000L
                }
                button(content,"فتح قسم الأدوية"){
                    try{
                        startActivity(Intent(this,MainActivity::class.java)
                            .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP).putExtra("openMedicine",true))
                        next()
                    }catch(_:Exception){QatraMedicineReminderReceiver.notifyDose(this,dose)}
                }
                button(content,"إغلاق"){next()}
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
        scene=null;activeId=null;cardReady=false;actionBusy=false
    }
    override fun onDestroy(){clearScene();queue.clear();handler.removeCallbacksAndMessages(null);super.onDestroy()}
}
