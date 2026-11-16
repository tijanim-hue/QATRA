package com.qatra.app

import android.content.Context
import android.util.Base64
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import java.util.concurrent.Executors

@CapacitorPlugin(name="QatraMedicineDeletion")
class QatraMedicineDeletionPlugin : Plugin() {
    private val worker=Executors.newSingleThreadExecutor()
    @PluginMethod fun deleteMedicine(call:PluginCall){
        val app=context.applicationContext
        val id=call.getString("id").orEmpty()
        if(!Regex("[0-9a-fA-F-]{36}").matches(id)){call.reject("MEDICINE_DELETE_ID_INVALID");return}
        worker.execute{
            try{
                val helper=QatraMedicineDatabase(app)
                val db=helper.writableDatabase
                try{
                    db.beginTransaction()
                    try{
                        db.execSQL("DELETE FROM stock_movements WHERE medicine_id=?",arrayOf(id))
                        db.execSQL("DELETE FROM doses WHERE medicine_id=? AND status!='taken'",arrayOf(id))
                        db.execSQL("DELETE FROM medicines WHERE id=?",arrayOf(id))
                        db.setTransactionSuccessful()
                    }finally{db.endTransaction()}
                }finally{helper.close()}
                QatraMedicineImages.remove(app,id)
                call.resolve(JSObject().apply{put("deleted",true)})
            }catch(_:Exception){call.reject("MEDICINE_DELETE_FAILED")}
        }
    }
    override fun handleOnDestroy(){worker.shutdown();super.handleOnDestroy()}
}
