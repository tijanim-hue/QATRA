package com.qatra.app

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.graphics.Color
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.os.PowerManager
import android.provider.Settings
import android.util.Log
import android.view.View
import android.view.WindowManager
import android.widget.FrameLayout
import java.lang.ref.WeakReference

/** Opt-in only. Does not dismiss keyguard or request full-screen-intent privileges. */
class QatraScreenWakeActivity:Activity(){
    private val timer=Handler(Looper.getMainLooper())
    override fun onCreate(savedInstanceState:Bundle?){
        super.onCreate(savedInstanceState)
        active=WeakReference(this)
        if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.O_MR1){setShowWhenLocked(true);setTurnScreenOn(true)}
        else window.addFlags(WindowManager.LayoutParams.FLAG_SHOW_WHEN_LOCKED or WindowManager.LayoutParams.FLAG_TURN_SCREEN_ON)
        window.addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
        window.clearFlags(WindowManager.LayoutParams.FLAG_DIM_BEHIND)
        window.setBackgroundDrawableResource(android.R.color.transparent)
        setContentView(FrameLayout(this).apply{setBackgroundColor(Color.TRANSPARENT);importantForAccessibility=View.IMPORTANT_FOR_ACCESSIBILITY_NO})
        getSharedPreferences("QatraExperiencePrefs",Context.MODE_PRIVATE).edit().putLong("wakeOpenedAt",System.currentTimeMillis()).apply()
        timer.postDelayed({finish()},intent.getLongExtra("duration",10000L).coerceIn(5000L,15000L)+2200L)
    }
    override fun onDestroy(){timer.removeCallbacksAndMessages(null);if(active?.get()===this)active=null;super.onDestroy()}
    companion object {
        private var active:WeakReference<QatraScreenWakeActivity>?=null
        fun requestIfNeeded(context:Context,duration:Long):Boolean{
            val settings=context.getSharedPreferences("QatraExperiencePrefs",Context.MODE_PRIVATE)
            if(!settings.getBoolean("wakeScreen",false))return false
            if((context.getSystemService(Context.POWER_SERVICE) as PowerManager).isInteractive)return false
            if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.M&&!Settings.canDrawOverlays(context))return false
            return try{
                settings.edit().putLong("wakeAttemptAt",System.currentTimeMillis()).apply()
                context.startActivity(Intent(context,QatraScreenWakeActivity::class.java).apply{
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_NO_ANIMATION or Intent.FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS)
                    putExtra("duration",duration)
                });true
            }catch(e:Exception){Log.w("QatraWake","Wake activity restricted by system",e);false}
        }
        fun closeActive(){active?.get()?.runOnUiThread{active?.get()?.finish()}}
    }
}
