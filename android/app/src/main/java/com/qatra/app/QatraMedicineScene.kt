package com.qatra.app

import android.animation.ValueAnimator
import android.content.Context
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.LinearGradient
import android.graphics.Paint
import android.graphics.Path
import android.graphics.Shader
import android.view.View
import android.widget.FrameLayout
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin

/** Decorative vector scene. The real dose card remains a native accessible view. */
class QatraMedicineScene(context: Context, private val card: View, private val reduced: Boolean,
    private val ready: () -> Unit) : FrameLayout(context) {
    private val ink = Paint(Paint.ANTI_ALIAS_FLAG)
    private val water = Path().apply {
        moveTo(50f, 0f)
        cubicTo(42f, 22f, 7f, 53f, 7f, 85f)
        cubicTo(7f, 154f, 93f, 154f, 93f, 85f)
        cubicTo(93f, 53f, 58f, 22f, 50f, 0f)
        close()
    }
    private val left = Path().apply {
        addRoundRect(-112f, -48f, 0f, 48f, floatArrayOf(48f,48f,0f,0f,0f,0f,48f,48f), Path.Direction.CW)
    }
    private val right = Path().apply {
        addRoundRect(0f, -48f, 112f, 48f, floatArrayOf(0f,0f,48f,48f,48f,48f,0f,0f), Path.Direction.CW)
    }
    private val blue = LinearGradient(-110f,-48f,0f,48f,
        intArrayOf(Color.rgb(133,241,255),Color.rgb(30,155,223),Color.rgb(23,76,146)),null,Shader.TileMode.CLAMP)
    private val pearl = LinearGradient(0f,-48f,110f,48f,
        intArrayOf(Color.WHITE,Color.rgb(211,239,251),Color.rgb(128,176,207)),null,Shader.TileMode.CLAMP)
    private val waterLight = LinearGradient(15f,0f,80f,137f,
        intArrayOf(Color.WHITE,Color.rgb(67,211,255),Color.rgb(104,105,228)),null,Shader.TileMode.CLAMP)
    private var elapsed = 0f
    private var animator: ValueAnimator? = null
    private var delivered = false
    private var started = false
    private val density = resources.displayMetrics.density

    init {
        setWillNotDraw(false)
        clipChildren = false
        card.visibility = View.INVISIBLE
        card.alpha = 0f
    }

    private fun phase(start: Float, duration: Float) = ((elapsed-start)/duration).coerceIn(0f,1f)
    private fun ease(t: Float): Float = 1f-(1f-t)*(1f-t)*(1f-t)

    fun start() {
        if (started) return
        started = true
        if (reduced) { elapsed=3400f; renderCard(); return }
        animator = ValueAnimator.ofFloat(0f,3400f).apply {
            duration=3400L
            interpolator=android.view.animation.LinearInterpolator()
            addUpdateListener { elapsed=it.animatedValue as Float; renderCard(); invalidate() }
            start()
        }
    }

    private fun renderCard() {
        val progress=if(reduced)1f else ease(phase(2550f,800f))
        if(progress>0f)card.visibility=View.VISIBLE
        card.alpha=progress
        card.scaleX=.12f+.88f*progress
        card.scaleY=.12f+.88f*progress
        card.translationY=(1f-progress)*24f*density
        card.isClickable=progress>=.99f
        if(progress>=1f&&!delivered){delivered=true;ready()}
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        if(reduced)return
        val w=width/density
        val h=height/density
        val impact=h-40f
        val rise=ease(phase(1100f,1200f))
        val split=ease(phase(2300f,700f))
        canvas.save()
        canvas.scale(density,density)
        if(elapsed<950f){
            val fall=phase(0f,950f)
            val y=-70f+(impact+70f)*fall*fall
            canvas.save();canvas.translate(w/2f-21.5f,y-59f);canvas.scale(.43f,.43f)
            ink.style=Paint.Style.FILL;ink.alpha=255;ink.shader=waterLight
            canvas.drawPath(water,ink);ink.shader=null
            ink.color=0xAAEFFFFF.toInt();canvas.drawOval(27f,60f,38f,89f,ink)
            canvas.restore()
        }
        val ripple=phase(950f,850f)
        if(elapsed>=950f&&ripple<1f){
            ink.shader=null;ink.style=Paint.Style.STROKE;ink.strokeWidth=1.7f
            for(i in 0..1){
                val radius=15f+w*.48f*ripple*(1f-i*.25f)
                ink.color=Color.argb(((1f-ripple)*170).toInt(),95,219,255)
                canvas.drawOval(w/2f-radius,impact-radius*.13f,w/2f+radius,impact+radius*.13f,ink)
            }
            ink.style=Paint.Style.FILL
            for(i in 0 until 10){
                val angle=i*PI*2/10
                val radius=18f+95f*ripple
                ink.color=Color.argb(((1f-ripple)*190).toInt(),158,233,255)
                canvas.drawCircle(w/2f+(cos(angle)*radius).toFloat(),impact-10f-(sin(angle)*radius*.5f).toFloat(),2.3f*(1f-ripple),ink)
            }
        }
        if(elapsed>=1100f&&elapsed<3100f){
            val cy=impact-30f+(h/2f-impact+30f)*rise
            val scale=.11f+.89f*rise
            canvas.save();canvas.translate(w/2f,cy);canvas.scale(scale,scale)
            canvas.rotate(-24f*(1f-rise))
            ink.style=Paint.Style.FILL
            for(side in 0..1){
                val sign=if(side==0)-1f else 1f
                canvas.save();canvas.translate(sign*145f*split,-15f*split)
                canvas.rotate(sign*14f*split)
                ink.shader=if(side==0)blue else pearl
                ink.alpha=((1f-phase(2780f,320f))*255).toInt()
                canvas.drawPath(if(side==0)left else right,ink)
                ink.shader=null
                ink.color=Color.argb(((1f-phase(2780f,320f))*150).toInt(),255,255,255)
                canvas.drawRoundRect(if(side==0)-90f else 18f,-33f,if(side==0)-18f else 90f,-23f,5f,5f,ink)
                canvas.restore()
            }
            ink.alpha=255;ink.shader=null
            canvas.restore()
        }
        canvas.restore()
    }

    fun release() { animator?.cancel(); animator?.removeAllUpdateListeners(); animator=null }
    override fun onDetachedFromWindow(){release();super.onDetachedFromWindow()}
}
