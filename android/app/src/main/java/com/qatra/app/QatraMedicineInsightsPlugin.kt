package com.qatra.app

import android.Manifest
import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import org.json.JSONObject
import java.util.Calendar

@CapacitorPlugin(name="QatraMedicineInsights")
class QatraMedicineInsightsPlugin: Plugin() {
    private fun medicine(db:QatraMedicineDatabase,id:String):JSONObject {
        val rows=db.listMedicines()
        for(i in 0 until rows.length()) {
            val m=rows.getJSONObject(i)
            if(m.getString("id")==id&&!m.getBoolean("archived"))return m
        }
        throw IllegalArgumentException("Unavailable")
    }
    @Synchronized private fun execute(call:PluginCall,action:(QatraMedicineDatabase,String)->JSObject) {
        try {
            val db=QatraMedicineDatabase(context)
            val result=try {action(db,call.getString("id").orEmpty())}finally{db.close()}
            call.resolve(result)
        }catch(_:Exception){call.reject("MEDICINE_INSIGHTS_UNAVAILABLE")}
    }
    @PluginMethod fun getDetails(call:PluginCall)=execute(call){db,id->
        val m=medicine(db,id)
        val period=call.getString("period")?:"day"
        require(period in setOf("day","week","month"))
        val day=Calendar.getInstance().apply{set(Calendar.HOUR_OF_DAY,0);set(Calendar.MINUTE,0);set(Calendar.SECOND,0);set(Calendar.MILLISECOND,0)}
        val today=day.timeInMillis
        day.add(Calendar.DAY_OF_MONTH,1);val end=day.timeInMillis
        day.timeInMillis=today;day.add(Calendar.DAY_OF_MONTH,if(period=="week")-6 else if(period=="month")-29 else 0)
        val start=day.timeInMillis;val now=System.currentTimeMillis()
        var taken=0;var upcoming=0;var unrecorded=0;var skipped=0
        db.readableDatabase.rawQuery("SELECT status,COALESCE(snooze_until,scheduled_at) FROM doses WHERE medicine_id=? AND scheduled_at>=? AND scheduled_at<?",arrayOf(id,start.toString(),end.toString())).use{row->
            while(row.moveToNext())when(row.getString(0)) {
                "taken"->taken++
                "skipped"->skipped++
                "pending"->if(row.getLong(1)>now)upcoming++ else unrecorded++
            }
        }
        var opening=0L
        db.readableDatabase.rawQuery("SELECT COALESCE(SUM(delta_milli),0) FROM stock_movements WHERE medicine_id=? AND reason='opening'",arrayOf(id)).use{if(it.moveToFirst())opening=it.getLong(0)}
        val prefs=context.getSharedPreferences("qatra_stock_alerts",Context.MODE_PRIVATE)
        JSObject().apply {
            put("medicine",m);put("openingStockMilli",opening);put("start",start);put("end",end)
            put("counts",JSObject().apply{put("taken",taken);put("upcoming",upcoming);put("unrecorded",unrecorded);put("skipped",skipped)})
            put("thresholdMilli",prefs.getLong("threshold:$id",-1));put("notificationsEnabled",QatraMedicineStockAlerts.allowed(context))
        }
    }
    @PluginMethod fun setStockAlert(call:PluginCall)=execute(call){db,id->
        medicine(db,id)
        val enabled=call.getBoolean("enabled")?:throw IllegalArgumentException("enabled")
        val number=call.data.opt("thresholdMilli") as? Number?:throw IllegalArgumentException("threshold")
        val value=number.toLong();require(number.toDouble().isFinite()&&number.toDouble()==value.toDouble()&&value in 0L..1000000000000L)
        val prefs=context.getSharedPreferences("qatra_stock_alerts",Context.MODE_PRIVATE)
        val threshold=if(enabled)value else -1L
        val edit=prefs.edit().putLong("threshold:$id",threshold)
        if(prefs.getLong("threshold:$id",-1)!=threshold)edit.putBoolean("notified:$id",false)
        check(edit.commit())
        QatraMedicineStockAlerts.check(context)
        JSObject().apply{put("saved",true);put("notificationsEnabled",QatraMedicineStockAlerts.allowed(context))}
    }
}

object QatraMedicineStockAlerts {
    fun allowed(context:Context):Boolean {
        if(Build.VERSION.SDK_INT>=33&&context.checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS)!=PackageManager.PERMISSION_GRANTED)return false
        val manager=context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        if(Build.VERSION.SDK_INT>=24&&!manager.areNotificationsEnabled())return false
        if(Build.VERSION.SDK_INT>=26&&manager.getNotificationChannel("qatra_inventory")?.importance==NotificationManager.IMPORTANCE_NONE)return false
        return true
    }
    @Synchronized fun check(context:Context) {
        try {
            if(!allowed(context))return
            val prefs=context.getSharedPreferences("qatra_stock_alerts",Context.MODE_PRIVATE)
            val helper=QatraMedicineDatabase(context)
            val rows=try{helper.listMedicines()}finally{helper.close()}
            val manager=context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            if(Build.VERSION.SDK_INT>=26)manager.createNotificationChannel(NotificationChannel("qatra_inventory","مخزون الأدوية",NotificationManager.IMPORTANCE_DEFAULT))
            for(i in 0 until rows.length()) {
                val m=rows.getJSONObject(i);val id=m.getString("id");val threshold=prefs.getLong("threshold:$id",-1)
                if(m.getBoolean("archived")||threshold<0)continue
                val stock=m.getLong("stockMilli")
                if(stock>threshold){prefs.edit().putBoolean("notified:$id",false).apply();continue}
                if(prefs.getBoolean("notified:$id",false))continue
                val intent=Intent(context,MainActivity::class.java).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_SINGLE_TOP).putExtra("openMedicine",true)
                val pending=PendingIntent.getActivity(context,("inventory:$id").hashCode(),intent,PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE)
                val builder=if(Build.VERSION.SDK_INT>=26)Notification.Builder(context,"qatra_inventory")else Notification.Builder(context)
                val text=if(stock<0)"المخزون المسجّل يحتاج مراجعة." else "وصل المخزون إلى الحد الذي حددته أو أقل. راجع العبوة."
                manager.notify(("inventory:$id").hashCode(),builder.setSmallIcon(android.R.drawable.ic_dialog_info).setContentTitle("مخزون "+m.getString("name")).setContentText(text).setContentIntent(pending).setAutoCancel(true).build())
                prefs.edit().putBoolean("notified:$id",true).apply()
            }
        }catch(_:Exception){ /* Optional alert never changes a recorded dose. */ }
    }
}
