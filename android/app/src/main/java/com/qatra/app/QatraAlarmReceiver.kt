package com.qatra.app

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.media.AudioAttributes
import android.net.Uri
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import java.util.UUID

class QatraAlarmReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        QatraHomeStore.delivered(context, intent.getIntExtra("id", -1))
        val quote=intent.getStringExtra("quote")?:"حان وقت التأمل"
        val category=intent.getStringExtra("category")?:"dhikr"
        val showImage=intent.getBooleanExtra("showImage",false)
        val mode=intent.getStringExtra("mode")?:"both"
        val duration=intent.getIntExtra("duration",10000)
        val occurrence=UUID.randomUUID().toString()
        // When a notification is posted, its channel is the only audio owner.
        val notificationPosted=if(mode=="notification"||mode=="both")showNotification(context,quote,category,occurrence) else false
        if(mode=="floating"||mode=="both"){
            val serviceIntent=Intent(context,QatraOverlayService::class.java).apply {
                putExtra("scheduled",true)
                putExtra("occurrenceId",occurrence)
                putExtra("quote",quote)
                putExtra("duration",duration)
                putExtra("category",category)
                putExtra("showImage",showImage)
                putExtra("dropSoundFromNotification",notificationPosted)
            }
            try{context.startService(serviceIntent)}
            catch(e:Exception){Log.w("QatraAlarmReceiver","Overlay unavailable; no duplicate sound attempted")}
        }
    }

    private fun showNotification(context:Context,quote:String,category:String,occurrence:String):Boolean {
        if(!NotificationManagerCompat.from(context).areNotificationsEnabled())return false
        val manager=context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        val channelId="qatra_drop_water_v1"
        // Resource-name URI remains stable across APK resource-ID changes.
        val water=Uri.parse("android.resource://${context.packageName}/raw/drop_fall_sound")
        try{
            if(Build.VERSION.SDK_INT>=Build.VERSION_CODES.O){
                if(manager.getNotificationChannel(channelId)==null){
                    val old=manager.getNotificationChannel("qatra_drop_channel")
                    // Do not bypass a previously blocked channel or a deliberate silent setting.
                    if(old?.importance==NotificationManager.IMPORTANCE_NONE)return false
                    val channel=NotificationChannel(channelId,"قطرات قطرة — صوت الماء",old?.importance?:NotificationManager.IMPORTANCE_HIGH)
                    val attributes=AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_NOTIFICATION)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION).build()
                    channel.setSound(if(old!=null&&old.sound==null)null else water,attributes)
                    channel.enableVibration(old?.shouldVibrate()?:true)
                    channel.description="صوت سقوط القطرة بدل نغمة الإشعار العامة"
                    manager.createNotificationChannel(channel)
                }
                if(manager.getNotificationChannel(channelId)?.importance==NotificationManager.IMPORTANCE_NONE)return false
            }
            val builder=NotificationCompat.Builder(context,channelId)
                .setSmallIcon(R.drawable.ic_stat_qatra)
                .setContentTitle("قطرة (QATRA)")
                .setContentText(quote)
                .setDefaults(0)
                .setSound(water)
                .setPriority(NotificationCompat.PRIORITY_HIGH)
                .setAutoCancel(true)
            manager.notify((System.currentTimeMillis()%10000).toInt(),builder.build())
        }catch(e:Exception){
            Log.w("QatraAlarmReceiver","Notification unavailable")
            return false
        }
        try{QatraProgressStore.shown(context,occurrence,quote,category,true)}
        catch(e:Exception){Log.w("QatraAlarmReceiver","Delivery ledger unavailable")}
        return true
    }
}
