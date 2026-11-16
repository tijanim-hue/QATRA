package com.qatra.app
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import org.json.JSONArray
import java.util.concurrent.Executors
@CapacitorPlugin(name="QatraMedicineDeletion")
class QatraMedicineDeletionPlugin : Plugin() {
 private val worker=Executors.newSingleThreadExecutor()
 @PluginMethod fun deleteMedicine(call:PluginCall)=remove(call,listOf(call.getString("id").orEmpty()))
 @PluginMethod fun deleteMedicines(call:PluginCall){
  val array=call.getArray("ids")
  if(array==null){call.reject("MEDICINE_IDS_REQUIRED");return}
  val ids=(0 until array.length()).map{array.optString(it,"")}
  remove(call,ids)
 }
 private fun remove(call:PluginCall,requested:List<String>){
  val ids=requested.distinct()
  if(ids.isEmpty()||ids.size>1000||ids.any{!Regex("[0-9a-fA-F-]{36}").matches(it)}){call.reject("MEDICINE_DELETE_ID_INVALID");return}
  val app=context.applicationContext
  worker.execute{
   try{
    val doses=mutableListOf<String>()
    val helper=QatraMedicineDatabase(app)
    try{
     val db=helper.writableDatabase
     db.beginTransaction()
     try{
      for(id in ids){
       db.rawQuery("SELECT id FROM doses WHERE medicine_id=?",arrayOf(id)).use{while(it.moveToNext())doses.add(it.getString(0))}
       db.execSQL("DELETE FROM stock_movements WHERE medicine_id=?",arrayOf(id))
       db.execSQL("DELETE FROM doses WHERE medicine_id=? AND status!='taken'",arrayOf(id))
       check(db.delete("medicines","id=?",arrayOf(id))==1)
      }
      db.setTransactionSuccessful()
     }finally{db.endTransaction()}
    }finally{helper.close()}
    var cleanupWarning=false
    for(id in doses)try{QatraMedicinePlugin.dismissMedicineReminder(app,id)}catch(_:Exception){cleanupWarning=true}
    for(id in ids)try{QatraMedicineImages.remove(app,id)}catch(_:Exception){cleanupWarning=true}
    call.resolve(JSObject().apply{put("deleted",true);put("ids",JSONArray(ids));put("cleanupWarning",cleanupWarning)})
   }catch(_:Exception){call.reject("MEDICINE_DELETE_FAILED")}
  }
 }
 override fun handleOnDestroy(){worker.shutdown();super.handleOnDestroy()}
}
