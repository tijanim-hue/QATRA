from pathlib import Path
import math
import random
import struct
import wave

root=Path(__file__).resolve().parents[1]
java=root/'android/app/src/main/java/com/qatra/app'
scene_path=java/'QatraMedicineScene.kt'
service_path=java/'QatraMedicineOverlayService.kt'
scene=scene_path.read_text(encoding='utf-8')
service=service_path.read_text(encoding='utf-8')
def once(text,before,after):
    if text.count(before)!=1:
        raise SystemExit('Ambiguous medicine audio anchor: '+before[:90])
    return text.replace(before,after,1)
scene=once(scene,'    private val ready: () -> Unit) : FrameLayout(context) {','    private val settled: () -> Unit = {},\n    private val ready: () -> Unit) : FrameLayout(context) {')
scene=once(scene,'    private var delivered = false','    private var delivered = false\n    private var settledDelivered = false')
scene=once(scene,'    private fun renderCard() {','    private fun renderCard() {\n        if(!reduced && elapsed>=2300f && !settledDelivered){\n            settledDelivered=true\n            try{settled()}catch(_:Exception){}\n        }')
service=once(service,'    private var actionBusy=false','    private var actionBusy=false\n    private var medicineSounds: QatraMedicineSounds?=null')
service=once(service,'                val root=QatraMedicineScene(this,card,reduced){','                if(medicineSounds==null)medicineSounds=try{QatraMedicineSounds(this)}catch(_:Exception){null}\n                val root=QatraMedicineScene(this,card,reduced,{medicineSounds?.play("rattle")}){')
service=once(service,'                        finishAction(if(recorded)','                        if(recorded)medicineSounds?.play("success")\n                        finishAction(if(recorded)')
service=once(service,'override fun onDestroy(){clearScene();queue.clear();handler.removeCallbacksAndMessages(null);super.onDestroy()}','override fun onDestroy(){clearScene();queue.clear();handler.removeCallbacksAndMessages(null);medicineSounds?.release();medicineSounds=null;super.onDestroy()}')
helper='''package com.qatra.app

import android.app.NotificationManager
import android.content.Context
import android.media.AudioAttributes
import android.media.AudioManager
import android.media.SoundPool
import android.os.Build

/** Optional feedback. Never changes device volume, focus or notification policy. */
class QatraMedicineSounds(context: Context) {
    private val app=context.applicationContext
    private val loaded=mutableSetOf<Int>()
    private val ids=mutableMapOf<String,Int>()
    private var released=false
    private val pool=SoundPool.Builder().setMaxStreams(1).setAudioAttributes(
        AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_NOTIFICATION_EVENT)
            .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION).build()).build()

    init {
        pool.setOnLoadCompleteListener { _,sample,status ->
            if(!released&&status==0)loaded.add(sample)
        }
        ids["rattle"]=pool.load(app,R.raw.qatra_medicine_rattle,1)
        ids["success"]=pool.load(app,R.raw.qatra_medicine_success,1)
    }

    fun play(name: String) {
        if(released)return
        try {
            val audio=app.getSystemService(Context.AUDIO_SERVICE) as AudioManager
            if(audio.ringerMode!=AudioManager.RINGER_MODE_NORMAL ||
                audio.getStreamVolume(AudioManager.STREAM_NOTIFICATION)<=0)return
            if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.M){
                val notifications=app.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                if(notifications.currentInterruptionFilter!=NotificationManager.INTERRUPTION_FILTER_ALL)return
            }
            val sample=ids[name]?:return
            if(sample !in loaded)return
            pool.play(sample,.65f,.65f,1,0,1f)
        }catch(_:Exception){ /* Sound must never change dose recording results. */ }
    }

    fun release(){
        if(released)return
        released=true
        pool.setOnLoadCompleteListener(null)
        pool.release()
        loaded.clear();ids.clear()
    }
}
'''
raw=root/'android/app/src/main/res/raw'
raw.mkdir(parents=True,exist_ok=True)
rate=22050
for kind,duration in [('rattle',.66),('success',.48)]:
    rng=random.Random(725)
    samples=[]
    for i in range(int(rate*duration)):
        t=i/rate
        value=0.0
        if kind=='rattle':
            noise=rng.uniform(-1,1)
            for delay,gain in [(.02,.8),(.085,1),(.15,.65),(.23,.9),(.31,.55),(.39,.35)]:
                u=t-delay
                if u>=0:
                    env=(1-math.exp(-u*1800))*math.exp(-u*65)
                    value+=gain*env*(.6*noise+.25*math.sin(2*math.pi*1650*u)+.15*math.sin(2*math.pi*2630*u))
        else:
            for delay,freq,gain in [(0,659.255,.7),(.095,987.767,1)]:
                u=t-delay
                if u>=0:
                    value+=gain*(1-math.exp(-u*400))*math.exp(-u*12)*(math.sin(2*math.pi*freq*u)+.12*math.sin(2*math.pi*2*freq*u))
        samples.append(value*min(1,max(0,(duration-t)/.045)))
    peak=max(map(abs,samples)) or 1
    pcm=[round(v/peak*.48*32767) for v in samples]
    if max(map(abs,pcm))>=32767:
        raise SystemExit('Medicine sound clipping detected.')
    with wave.open(str(raw/('qatra_medicine_'+kind+'.wav')),'wb') as output:
        output.setnchannels(1)
        output.setsampwidth(2)
        output.setframerate(rate)
        output.writeframes(b''.join(struct.pack('<h',v) for v in pcm))
(java/'QatraMedicineSounds.kt').write_text(helper,encoding='utf-8')
scene_path.write_text(scene,encoding='utf-8')
service_path.write_text(service,encoding='utf-8')
