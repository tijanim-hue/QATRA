package com.qatra.app

import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.res.Configuration
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.LinearGradient
import android.graphics.Paint
import android.graphics.Path
import android.graphics.PixelFormat
import android.graphics.RadialGradient
import android.graphics.Rect
import android.graphics.Shader
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.media.MediaPlayer
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.os.SystemClock
import android.provider.Settings
import android.speech.tts.TextToSpeech
import java.util.Locale
import android.text.method.ScrollingMovementMethod
import android.util.Log
import android.view.Gravity
import android.view.View
import android.view.WindowInsets
import android.view.WindowManager
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.TextView
import java.util.UUID
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin

/** Phase 4: same Intent API and native like ledger; new visual implementation only. */
class QatraOverlayService : Service() {
    private val handler = Handler(Looper.getMainLooper())
    private var manager: WindowManager? = null
    private var scene: Scene? = null
    private var card: FrameLayout? = null
    private var heart: Heart? = null
    private var params: WindowManager.LayoutParams? = null
    private var fallPlayer: MediaPlayer? = null
    private var popPlayer: MediaPlayer? = null
    private var experienceSounds:QatraUiSounds? = null
    private var tts: TextToSpeech? = null
    private var readAloudEnabled = true
    private var textToRead = ""
    private var startedAt = 0L
    private var totalMs = 10000L
    private var impactMs = 1050L
    private var riseMs = 1750L
    private var reducedMotion = false
    private var impactPlayed = false
    private var active = false
    private var blurApplied = false
    private var blurCheckedAt = -1000L
    private var originY = 0f
    private var heartTargetY = 0f
    private var likedAt = -1L
    private var occurrenceId = ""

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        if (intent == null) { stopSelf(startId); return START_NOT_STICKY }
        if (active) return START_NOT_STICKY
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) {
            Log.w(TAG, "Overlay permission is not granted")
            stopSelf(startId)
            return START_NOT_STICKY
        }
        try {
            show(
                intent.getStringExtra("quote") ?: "الحمد لله",
                intent.getStringExtra("category") ?: "dhikr",
                intent.getBooleanExtra("showImage", false),
                intent.getIntExtra("duration", 10000)
            )
        } catch (error: Exception) {
            Log.e(TAG, "Unable to show cinematic drop", error)
            finish()
        }
        return START_NOT_STICKY
    }

    private fun dp(value: Float): Float = value * resources.displayMetrics.density
    private fun px(value: Float): Int = dp(value).toInt()
    private fun smooth(value: Float): Float { val p = value.coerceIn(0f, 1f); return 1f - (1f-p)*(1f-p)*(1f-p) }
    private fun progress(elapsed: Long, start: Long, duration: Long): Float = ((elapsed-start).toFloat()/duration.toFloat()).coerceIn(0f,1f)

    private fun glass(blur: Boolean): GradientDrawable = GradientDrawable(
        GradientDrawable.Orientation.TL_BR,
        if (blur) intArrayOf(Color.parseColor("#E3223453"), Color.parseColor("#EF101A30"))
        else intArrayOf(Color.parseColor("#FA24324D"), Color.parseColor("#FC10192B"))
    ).apply { cornerRadius=dp(27f); setStroke(px(1f).coerceAtLeast(1),Color.parseColor("#668BC9EF")) }

    private fun show(quote: String, category: String, showImage: Boolean, duration: Int) {
        manager = getSystemService(WINDOW_SERVICE) as WindowManager
        experienceSounds=try{QatraUiSounds(this)}catch(error:Exception){Log.w(TAG,"Optional UI sounds unavailable",error);null}
        totalMs = duration.coerceIn(5000,15000).toLong()
        reducedMotion = Build.VERSION.SDK_INT >= Build.VERSION_CODES.O && !android.animation.ValueAnimator.areAnimatorsEnabled()
        val prefs = getSharedPreferences("QatraExperiencePrefs", Context.MODE_PRIVATE)
        readAloudEnabled = prefs.getBoolean("readAloud", true)
        textToRead = quote
        if (readAloudEnabled) {
            tts = TextToSpeech(this) { status ->
                if (status == TextToSpeech.SUCCESS) {
                    val locale = Locale("ar")
                    if (tts?.isLanguageAvailable(locale)!! >= TextToSpeech.LANG_AVAILABLE) {
                        tts?.language = locale
                        tts?.setPitch(0.85f) // صوت أعمق وأكثر رزانة
                        tts?.setSpeechRate(0.85f) // قراءة متأنية
                    }
                }
            }
        }

        impactMs = if (reducedMotion) 0L else 1050L
        riseMs = if (reducedMotion) 1L else 1750L
        occurrenceId = UUID.randomUUID().toString()
        impactPlayed=false; likedAt=-1L; blurApplied=false; blurCheckedAt=-1000L
        val root=Scene(this)
        root.setWillNotDraw(false)
        root.importantForAccessibility=View.IMPORTANT_FOR_ACCESSIBILITY_NO
        val panel=FrameLayout(this).apply {
            background=glass(false); clipToOutline=true; alpha=0f; elevation=dp(18f)
        }
        if (showImage) {
            val name=when(category) {
                "dhikr","quran" -> "bg_islamic"
                "selfDev" -> "bg_motivation"
                "culture","generalCulture" -> "bg_culture"
                "myGroups","myLibrary","favorites","poetry" -> "bg_custom"
                else -> "bg_custom"
            }
            val image=ImageView(this).apply {
                scaleType=ImageView.ScaleType.CENTER_CROP; alpha=.38f
                val resource=resources.getIdentifier(name,"drawable",packageName)
                if(resource!=0)setImageResource(resource)
            }
            panel.addView(image,FrameLayout.LayoutParams(-1,-1))
            panel.addView(View(this).apply {setBackgroundColor(Color.parseColor("#B310192B"))},FrameLayout.LayoutParams(-1,-1))
        }
        val text=TextView(this).apply {
            this.text=quote; textSize=if(quote.length>220)19f else 23f
            setTextColor(Color.parseColor("#F4F8FF"));setTypeface(null,Typeface.BOLD)
            gravity=Gravity.CENTER; textDirection=View.TEXT_DIRECTION_FIRST_STRONG
            setLineSpacing(dp(5f),1.08f);setPadding(px(22f),px(25f),px(22f),px(25f))
            maxHeight=(resources.displayMetrics.heightPixels*.47f).toInt()
            movementMethod=ScrollingMovementMethod();isVerticalScrollBarEnabled=true
            setShadowLayer(dp(2f),0f,dp(1f),Color.parseColor("#55101828"))
        }
        panel.addView(text,FrameLayout.LayoutParams(-1,-2))
        val width=(resources.displayMetrics.widthPixels*.86f).toInt().coerceAtMost(px(440f))
        val maxCardHeight=(resources.displayMetrics.heightPixels*.47f).toInt()
        text.measure(View.MeasureSpec.makeMeasureSpec(width,View.MeasureSpec.EXACTLY),
            View.MeasureSpec.makeMeasureSpec(maxCardHeight,View.MeasureSpec.AT_MOST))
        val panelHeight=text.measuredHeight.coerceAtLeast(px(110f)).coerceAtMost(maxCardHeight)
        root.addView(panel,FrameLayout.LayoutParams(width,panelHeight,Gravity.CENTER))
        val like=Heart(this).apply {alpha=0f;isEnabled=false;elevation=dp(22f)}
        like.contentDescription=if(resources.configuration.locale.language=="ar")"إعجاب بالعبارة" else "Like quote"
        like.isClickable=true;like.isFocusable=true
        like.setOnClickListener {
            if(like.liked || !active || like.alpha<.5f)return@setOnClickListener
            if(!QatraHomeStore.like(this@QatraOverlayService,occurrenceId,category))return@setOnClickListener
            like.liked=true;likedAt=SystemClock.uptimeMillis()-startedAt
            experienceSounds?.play("tap")
            like.contentDescription=if(resources.configuration.locale.language=="ar")"تم تسجيل الإعجاب" else "Quote liked"
            val event=Intent("com.qatra.app.QUOTE_LIKED").setPackage(packageName)
            event.putExtra("category",category);event.putExtra("occurrenceId",occurrenceId)
            sendBroadcast(event)
            like.announceForAccessibility(like.contentDescription)
            like.invalidate()
        }
        root.addView(like,FrameLayout.LayoutParams(px(64f),px(64f),Gravity.TOP or Gravity.CENTER_HORIZONTAL))
        val flags=WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or
            WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL or
            WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN or
            WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS or
            WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or
            WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON
        val layout=WindowManager.LayoutParams(-1,-1,
            if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.O)WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY else WindowManager.LayoutParams.TYPE_PHONE,
            flags,PixelFormat.TRANSLUCENT)
        root.setBackgroundColor(Color.TRANSPARENT)
        scene=root;card=panel;heart=like;params=layout
        manager?.addView(root,layout)
        active=true
        root.post {
            if(!active||scene!==root)return@post
            val insets=insets(root)
            root.impactY=(root.height-insets.bottom-dp(10f)).coerceAtLeast(root.height*.65f)
            root.dropWidth=dp(43f)
            root.dropHeight=dp(59f)
            originY=root.impactY-root.dropHeight*.45f-(panel.top+panel.height/2f)
            panel.pivotX=panel.width/2f;panel.pivotY=panel.height/2f
            heartTargetY=(panel.top-px(76f)).toFloat().coerceAtLeast(insets.top+dp(8f))
            val wakeRequested=QatraScreenWakeActivity.requestIfNeeded(this@QatraOverlayService,totalMs)
            val wakeDelay=if(wakeRequested)650L else 0L
            startedAt=SystemClock.uptimeMillis()+wakeDelay
            if(!reducedMotion){
                if(wakeDelay>0L)handler.postDelayed({if(active)playSound("drop_fall_sound",true)},wakeDelay)
                else playSound("drop_fall_sound",true)
            }
            handler.post(tick)
        }
    }

    private val tick=object:Runnable {
        override fun run() {
            val root=scene ?: return
            val panel=card ?: return
            val like=heart ?: return
            if(!active)return
            val elapsed=SystemClock.uptimeMillis()-startedAt
            if(elapsed>=totalMs){finish();return}
            val rise=if(reducedMotion)1f else smooth(progress(elapsed,impactMs,riseMs))
            val settling=elapsed-impactMs-riseMs
            val fade=progress(elapsed,totalMs-550L,550L)
            if(elapsed>=impactMs&&!impactPlayed){impactPlayed=true;playSound("drop_pop_sound",false)
            if (readAloudEnabled) {
                tts?.speak(textToRead, TextToSpeech.QUEUE_FLUSH, null, null)
            }}
            panel.alpha=if(elapsed<impactMs)0f else progress(elapsed,impactMs,650L)
            panel.translationY=originY*(1f-rise)
            val pulse=if(!reducedMotion&&settling in 0L..650L) (sin(settling/650f*PI*2)*.012f).toFloat() else 0f
            panel.scaleX=.045f+.955f*rise+pulse;panel.scaleY=.045f+.955f*rise+pulse
            panel.translationX=if(!reducedMotion&&settling in 0L..550L)(sin(settling/550f*PI*4)*dp(2f)*(1f-settling/550f)).toFloat() else 0f
            if(!reducedMotion&&settling in 0L..500L)panel.alpha*=.96f+.04f*cos(settling/500f*PI*2).toFloat()
            val heartProgress=if(reducedMotion)1f else smooth(progress(elapsed,impactMs+riseMs-450L,600L))
            val heartOrigin=root.impactY-dp(70f)
            like.translationY=heartOrigin+(heartTargetY-heartOrigin)*heartProgress+
                if(!reducedMotion&&heartProgress>=1f)(sin(elapsed/900.0)*dp(5f)).toFloat() else 0f
            like.alpha=if(elapsed<0L)0f else heartProgress
            like.isEnabled=elapsed>=0L&&heartProgress>.90f&&fade==0f
            val burst=if(likedAt<0L)1f else progress(elapsed,likedAt,800L)
            like.burst=burst
            val heartPulse=if(likedAt>=0L&&burst<1f&&!reducedMotion)(sin(burst*PI)*.22f).toFloat() else 0f
            like.scaleX=1f+heartPulse;like.scaleY=1f+heartPulse
            root.alpha=1f-fade
            root.elapsed=elapsed
            root.invalidate();like.invalidate()
            if(elapsed>=impactMs&&elapsed-blurCheckedAt>=500L){blurCheckedAt=elapsed;refreshBlur()}
            handler.postDelayed(this,16L)
        }
    }

    private fun insets(view:View):Rect {
        if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.R){
            val value=view.rootWindowInsets?.getInsetsIgnoringVisibility(WindowInsets.Type.systemBars() or WindowInsets.Type.displayCutout())
            if(value!=null)return Rect(value.left,value.top,value.right,value.bottom)
        }else if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.M){
            val value=view.rootWindowInsets
            if(value!=null)return Rect(value.stableInsetLeft,value.stableInsetTop,value.stableInsetRight,value.stableInsetBottom)
        }
        return Rect(0,px(24f),0,px(24f))
    }

    private fun refreshBlur() {
        if(Build.VERSION.SDK_INT<Build.VERSION_CODES.S)return
        val root=scene ?: return
        val layout=params ?: return
        val enabled=try {manager?.isCrossWindowBlurEnabled==true} catch(_:Exception){false}
        if(enabled==blurApplied)return
        try {
            if(enabled){layout.flags=layout.flags or WindowManager.LayoutParams.FLAG_BLUR_BEHIND;layout.setBlurBehindRadius(px(18f))}
            else{layout.flags=layout.flags and WindowManager.LayoutParams.FLAG_BLUR_BEHIND.inv();layout.setBlurBehindRadius(0)}
            manager?.updateViewLayout(root,layout)
            card?.background=glass(enabled)
            blurApplied=enabled
        }catch(error:Exception){Log.w(TAG,"Cross-window blur unavailable; opaque glass is retained",error)}
    }

    private fun playSound(name:String,fall:Boolean) {
        try {
            val resource=resources.getIdentifier(name,"raw",packageName)
            if(resource==0)return
            val player=MediaPlayer.create(this,resource) ?: return
            if(fall){fallPlayer?.release();fallPlayer=player}else{popPlayer?.release();popPlayer=player}
            player.start()
        }catch(error:Exception){Log.w(TAG,"Optional drop sound unavailable",error)}
    }

    private fun finish(){cleanup();stopSelf()}
    private fun cleanup(){
        active=false;QatraScreenWakeActivity.closeActive();handler.removeCallbacksAndMessages(null)
        experienceSounds?.release();experienceSounds=null
        tts?.stop()
        tts?.shutdown()
        tts = null

        try{fallPlayer?.release()}catch(_:Exception){};fallPlayer=null
        try{popPlayer?.release()}catch(_:Exception){};popPlayer=null
        scene?.let{try{manager?.removeViewImmediate(it)}catch(_:Exception){}}
        scene=null;card=null;heart=null;params=null;manager=null
    }
    override fun onConfigurationChanged(newConfig:Configuration){super.onConfigurationChanged(newConfig);finish()}
    override fun onDestroy(){cleanup();super.onDestroy()}

    private inner class Scene(context:Context):FrameLayout(context){
        var elapsed=0L
        var impactY=0f
        var dropWidth=0f
        var dropHeight=0f
        private val paint=Paint(Paint.ANTI_ALIAS_FLAG)
        private val water=Path().apply {
            moveTo(50f,0f);cubicTo(42f,22f,7f,53f,7f,85f)
            cubicTo(7f,116f,27f,137f,50f,137f)
            cubicTo(74f,137f,93f,116f,93f,85f)
            cubicTo(93f,53f,58f,22f,50f,0f);close()
        }
        private val waterGradient=LinearGradient(20f,5f,75f,138f,intArrayOf(Color.parseColor("#ECFFFF"),Color.parseColor("#38D5FF"),Color.parseColor("#8170F7")),null,Shader.TileMode.CLAMP)
        override fun onDraw(canvas:Canvas){
            super.onDraw(canvas)
            val cx=width/2f
            if(!reducedMotion&&elapsed<impactMs){
                val p=progress(elapsed,0L,impactMs)
                val y=-dropHeight*2f+(impactY+dropHeight*2f)*(p*p)
                paint.style=Paint.Style.FILL;paint.shader=null;paint.color=Color.parseColor("#34B5EAFF")
                canvas.drawOval(cx-dropWidth*.42f,y-dropHeight*.95f,cx+dropWidth*.42f,y+dropHeight*.2f,paint)
                canvas.save();canvas.translate(cx-dropWidth/2f,y-dropHeight)
                canvas.scale(dropWidth/100f,dropHeight/137f)
                paint.shader=waterGradient;paint.alpha=255;canvas.drawPath(water,paint)
                paint.shader=null;paint.color=Color.parseColor("#AAEFFFFF");canvas.drawOval(27f,60f,38f,89f,paint)
                canvas.restore()
            }
            val impactProgress=progress(elapsed,impactMs,850L)
            if(!reducedMotion&&elapsed>=impactMs&&impactProgress<1f){
                paint.shader=null;paint.style=Paint.Style.STROKE;paint.strokeWidth=dp(2f)
                for(i in 0..1){val r=dp(20f)+width*.65f*impactProgress*(1f-i*.25f);paint.color=Color.argb(((1f-impactProgress)*150).toInt(),92,209,255);canvas.drawOval(cx-r,impactY-r*.14f,cx+r,impactY+r*.14f,paint)}
                paint.style=Paint.Style.FILL
                for(i in 0 until 12){val angle=i*(PI*2/12);val distance=dp(12f)+dp(115f)*impactProgress;paint.color=Color.argb(((1f-impactProgress)*190).toInt(),150,220,255);canvas.drawCircle(cx+(cos(angle)*distance).toFloat(),impactY-dp(12f)-(sin(angle)*distance*.45f).toFloat(),dp(2f)*(1f-impactProgress),paint)}
            }
            val reveal=progress(elapsed,impactMs+riseMs-150L,1100L)
            if(!reducedMotion&&elapsed>=impactMs+riseMs-150L&&reveal<1f){
                paint.style=Paint.Style.FILL;paint.shader=null
                for(i in 0 until 18){val angle=i*(PI*2/18);val r=dp(45f)+dp(130f)*reveal;paint.color=Color.argb(((1f-reveal)*150).toInt(),if(i%2==0)129 else 70,170,255);canvas.drawCircle(cx+(cos(angle)*r).toFloat(),height/2f+(sin(angle)*r*.6f).toFloat(),dp(1.8f),paint)}
            }
        }
    }

    private inner class Heart(context:Context):View(context){
        var liked=false
        var burst=1f
        private val paint=Paint(Paint.ANTI_ALIAS_FLAG)
        private val path=Path().apply {
            moveTo(12f,21f);cubicTo(10f,19f,2f,13f,2f,7.8f)
            cubicTo(2f,2.4f,8.5f,.7f,12f,5.5f)
            cubicTo(15.5f,.7f,22f,2.4f,22f,7.8f)
            cubicTo(22f,13f,14f,19f,12f,21f);close()
        }
        override fun onDraw(canvas:Canvas){
            super.onDraw(canvas)
            val cx=width/2f;val cy=height/2f;val radius=width*.44f
            paint.style=Paint.Style.FILL;paint.shader=RadialGradient(cx,cy,radius,
                if(liked)intArrayOf(Color.parseColor("#77FF385B"),Color.TRANSPARENT)
                else intArrayOf(Color.parseColor("#3A74CFFF"),Color.TRANSPARENT),null,Shader.TileMode.CLAMP)
            canvas.drawCircle(cx,cy,radius,paint)
            paint.shader=null;paint.color=Color.parseColor("#DE18243A");canvas.drawCircle(cx,cy,width*.32f,paint)
            paint.style=Paint.Style.STROKE;paint.strokeWidth=dp(1f);paint.color=if(liked)Color.parseColor("#A6FF6081")else Color.parseColor("#5CA7CFFF");canvas.drawCircle(cx,cy,width*.32f,paint)
            canvas.save();val size=width*.45f;canvas.translate(cx-size/2f,cy-size/2f);canvas.scale(size/24f,size/24f)
            paint.style=if(liked)Paint.Style.FILL else Paint.Style.STROKE;paint.strokeWidth=1.65f;paint.strokeJoin=Paint.Join.ROUND
            paint.color=if(liked)Color.parseColor("#FF4168")else Color.parseColor("#EBF6FF");canvas.drawPath(path,paint);canvas.restore()
            if(liked&&burst<1f&&!reducedMotion){
                paint.style=Paint.Style.FILL;paint.color=Color.argb(((1f-burst)*230).toInt(),255,91,129)
                for(i in 0 until 10){val angle=i*(PI*2/10);val r=width*(.20f+.25f*burst);canvas.drawCircle(cx+(cos(angle)*r).toFloat(),cy+(sin(angle)*r).toFloat(),dp(2f)*(1f-burst),paint)}
            }
        }
    }
    companion object {private const val TAG="QatraCinematic"}
}
