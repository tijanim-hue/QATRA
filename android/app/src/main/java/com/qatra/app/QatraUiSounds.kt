package com.qatra.app

import android.content.Context
import android.media.AudioAttributes
import android.media.AudioManager
import android.media.SoundPool
import android.os.SystemClock
import android.util.Log
import android.view.HapticFeedbackConstants
import android.view.SoundEffectConstants
import android.view.View

class QatraUiSounds(private val context:Context,private val feedbackView:(()->View?)?=null) {
    private var pool:SoundPool?=SoundPool.Builder().setMaxStreams(1).setAudioAttributes(
        AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ASSISTANCE_SONIFICATION)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION).build()).build()
    private var startupId=0
    private var startupLoaded=false
    private var pendingStartup=false

    init {
        pool?.setOnLoadCompleteListener { _,id,result -> synchronized(this){
            if(result==0&&id==startupId){
                startupLoaded=true
                if(pendingStartup){pendingStartup=false;play("startup")}
            }
        }}
        val resource=context.resources.getIdentifier("qatra_ui_startup","raw",context.packageName)
        if(resource!=0)startupId=pool?.load(context,resource,1)?:0
    }

    @Synchronized fun play(name:String){
        if(name=="tap"){
            feedbackView?.invoke()?.let{feedback(it)}
            return
        }
        if(name!="startup")return
        if(!context.getSharedPreferences("QatraExperiencePrefs",Context.MODE_PRIVATE).getBoolean("uiSounds",true))return
        val audio=context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
        if(audio.ringerMode!=AudioManager.RINGER_MODE_NORMAL||audio.getStreamVolume(AudioManager.STREAM_SYSTEM)<=0)return
        if(startupId==0)return
        if(!startupLoaded){pendingStartup=true;return}
        try{pool?.play(startupId,.42f,.42f,1,0,1f)}
        catch(e:Exception){Log.w("QatraUiSounds","Optional startup sound unavailable",e)}
    }

    @Synchronized fun release(){
        pendingStartup=false
        pool?.release()
        pool=null
        startupLoaded=false
        startupId=0
    }

    companion object {
        private var lastFeedbackAt=-1000L
        @Synchronized fun feedback(view:View){
            val now=SystemClock.uptimeMillis()
            if(now-lastFeedbackAt<45L)return
            lastFeedbackAt=now
            view.post {
                if(!view.isAttachedToWindow)return@post
                try{
                    val audio=view.context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
                    if(audio.ringerMode==AudioManager.RINGER_MODE_NORMAL)view.playSoundEffect(SoundEffectConstants.CLICK)
                    // No IGNORE flags and no custom vibration pattern: Android owns the feedback.
                    view.performHapticFeedback(HapticFeedbackConstants.VIRTUAL_KEY)
                }catch(e:Exception){Log.w("QatraUiSounds","System touch feedback unavailable",e)}
            }
        }
    }
}
