from pathlib import Path

root=Path(__file__).resolve().parents[1]
java=root/'android/app/src/main/java/com/qatra/app'
def once(text,old,new):
    if text.count(old)!=1:
        raise SystemExit('Unexpected audio integration anchor: '+old[:100])
    return text.replace(old,new,1)

plugin=java/'QatraPlugin.kt'
text=plugin.read_text(encoding='utf-8')
anchor='QatraUiSounds(context)'
if text.count(anchor)!=2:
    raise SystemExit('Unexpected UI sound preparation/call sites.')
text=text.replace(anchor,'QatraUiSounds(context){activity?.window?.decorView}')
plugin.write_text(text,encoding='utf-8')

service=java/'QatraOverlayService.kt'
text=service.read_text(encoding='utf-8')
text=once(text,'private var scheduledDrop = false','private var scheduledDrop = false\n    private var notificationOwnsSound = false')
text=once(text,'scheduledDrop = intent.getBooleanExtra("scheduled", false)','scheduledDrop = intent.getBooleanExtra("scheduled", false)\n            notificationOwnsSound = intent.getBooleanExtra("dropSoundFromNotification", false)')
text=once(text,'if(!reducedMotion){\n                if(wakeDelay>0L)','if(!notificationOwnsSound){\n                if(wakeDelay>0L)')
text=once(text,'impactPlayed=true;playSound("drop_pop_sound",false)','impactPlayed=true')
text=once(text,'experienceSounds?.play("tap")','QatraUiSounds.feedback(like)')
text=once(text,'private var experienceSounds:QatraUiSounds? = null','')
text=once(text,'experienceSounds=try{QatraUiSounds(this)}catch(error:Exception){Log.w(TAG,"Optional UI sounds unavailable",error);null}','')
text=once(text,'experienceSounds?.release();experienceSounds=null','')
start=text.index('    private fun playSound(name:String,fall:Boolean) {')
end=text.index('    private fun finish()',start)
text=text[:start]+'''    private fun playSound(name:String,fall:Boolean) {
        if(notificationOwnsSound||name!="drop_fall_sound"||!fall)return
        try {
            val audio=getSystemService(Context.AUDIO_SERVICE) as android.media.AudioManager
            if(audio.ringerMode!=android.media.AudioManager.RINGER_MODE_NORMAL||audio.getStreamVolume(android.media.AudioManager.STREAM_NOTIFICATION)<=0)return
            if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.M){
                val notifications=getSystemService(Context.NOTIFICATION_SERVICE) as android.app.NotificationManager
                val filter=notifications.currentInterruptionFilter
                if(filter!=android.app.NotificationManager.INTERRUPTION_FILTER_ALL&&filter!=android.app.NotificationManager.INTERRUPTION_FILTER_UNKNOWN)return
            }
            val resource=resources.getIdentifier("drop_fall_sound","raw",packageName)
            if(resource==0)return
            val player=MediaPlayer()
            try {
                player.setAudioAttributes(android.media.AudioAttributes.Builder()
                    .setUsage(android.media.AudioAttributes.USAGE_NOTIFICATION)
                    .setContentType(android.media.AudioAttributes.CONTENT_TYPE_SONIFICATION).build())
                resources.openRawResourceFd(resource).use { file ->
                    player.setDataSource(file.fileDescriptor,file.startOffset,file.length)
                }
                player.setOnCompletionListener { completed ->
                    if(fallPlayer===completed)fallPlayer=null
                    completed.release()
                }
                player.prepare()
                fallPlayer?.release()
                fallPlayer=player
                player.start()
            }catch(error:Exception){
                if(fallPlayer===player)fallPlayer=null
                player.release()
                throw error
            }
        }catch(error:Exception){Log.w(TAG,"Optional water sound unavailable")}
    }

'''+text[end:]
service.write_text(text,encoding='utf-8')
# The preceding preparation step keeps the event bridge; its generated custom tap is no longer shipped.
(root/'android/app/src/main/res/raw/qatra_ui_tap.wav').unlink(missing_ok=True)
