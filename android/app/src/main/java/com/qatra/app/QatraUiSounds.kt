package com.qatra.app

import android.content.Context
import android.media.AudioAttributes
import android.media.AudioManager
import android.media.SoundPool
import android.util.Log

class QatraUiSounds(private val context:Context) {
    private var pool:SoundPool?=SoundPool.Builder().setMaxStreams(3).setAudioAttributes(
        AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_ASSISTANCE_SONIFICATION)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION).build()).build()
    private val ids=mutableMapOf<String,Int>()
    private val loaded=mutableSetOf<Int>()
    private var pendingStartup=false
    init {
        pool?.setOnLoadCompleteListener { _,id,result -> synchronized(this){
            if(result==0)loaded.add(id)
            if(pendingStartup&&ids["startup"]==id&&result==0){pendingStartup=false;play("startup")}
        }}
        for((name,file) in mapOf("tap" to "qatra_ui_tap","startup" to "qatra_ui_startup")){
            val resource=context.resources.getIdentifier(file,"raw",context.packageName)
            if(resource!=0)ids[name]=pool?.load(context,resource,1)?:0
        }
    }
    @Synchronized fun play(name:String){
        if(!context.getSharedPreferences("QatraExperiencePrefs",Context.MODE_PRIVATE).getBoolean("uiSounds",true))return
        val audio=context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
        if(audio.ringerMode!=AudioManager.RINGER_MODE_NORMAL||audio.getStreamVolume(AudioManager.STREAM_SYSTEM)<=0)return
        val id=ids[name]?:return
        if(!loaded.contains(id)){if(name=="startup")pendingStartup=true;return}
        try{val volume=if(name=="startup").42f else .28f;pool?.play(id,volume,volume,1,0,1f)}catch(e:Exception){Log.w("QatraUiSounds","Optional sound unavailable",e)}
    }
    @Synchronized fun release(){pendingStartup=false;pool?.release();pool=null;ids.clear();loaded.clear()}
}
