package com.qatra.app

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.BitmapShader
import android.graphics.Canvas
import android.graphics.ColorFilter
import android.graphics.Matrix
import android.graphics.Outline
import android.graphics.Paint
import android.graphics.PixelFormat
import android.graphics.Rect
import android.graphics.RectF
import android.graphics.Shader
import android.graphics.drawable.Drawable
import android.util.AtomicFile
import android.util.Base64
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import java.io.File
import java.util.concurrent.Executors
import kotlin.math.max

@CapacitorPlugin(name="QatraMedicineImages")
class QatraMedicineImagesPlugin : Plugin() {
    private val worker=Executors.newSingleThreadExecutor()
    private fun execute(call:PluginCall,work:(Context,String)->JSObject){
        val app=context.applicationContext
        val id=call.getString("id").orEmpty()
        if(!Regex("[0-9a-fA-F-]{36}").matches(id)){call.reject("MEDICINE_IMAGE_ID_INVALID");return}
        worker.execute{
            try{
                val helper=QatraMedicineDatabase(app)
                try{helper.readableDatabase.rawQuery("SELECT 1 FROM medicines WHERE id=?",arrayOf(id)).use{require(it.moveToFirst())}}
                finally{helper.close()}
                call.resolve(work(app,id))
            }catch(_:Exception){call.reject("MEDICINE_IMAGE_OPERATION_FAILED")}
        }
    }
    @PluginMethod fun getImage(call:PluginCall)=execute(call){app,id->
        val bytes=QatraMedicineImages.read(app,id)
        JSObject().apply{put("image",if(bytes==null)org.json.JSONObject.NULL else Base64.encodeToString(bytes,Base64.NO_WRAP))}
    }
    @PluginMethod fun saveImage(call:PluginCall){
        val data=call.getString("data").orEmpty()
        if(data.isEmpty()||data.length>2000000){call.reject("MEDICINE_IMAGE_TOO_LARGE");return}
        execute(call){app,id->
            QatraMedicineImages.save(app,id,Base64.decode(data,Base64.DEFAULT))
            JSObject().apply{put("saved",true)}
        }
    }
    @PluginMethod fun removeImage(call:PluginCall)=execute(call){app,id->
        QatraMedicineImages.remove(app,id)
        JSObject().apply{put("removed",true)}
    }
    override fun handleOnDestroy(){worker.shutdown();super.handleOnDestroy()}
}

/** Local JPEG copies only; never stores a public photo URI or uploads health data. */
object QatraMedicineImages {
    private fun file(context:Context,id:String):AtomicFile{
        require(Regex("[0-9a-fA-F-]{36}").matches(id))
        val dir=File(context.filesDir,"medicine_images")
        check(dir.isDirectory||dir.mkdirs())
        return AtomicFile(File(dir,"$id.jpg"))
    }
    @Synchronized fun read(context:Context,id:String):ByteArray?{
        val atomic=file(context,id)
        if(!atomic.baseFile.exists()&&!File(atomic.baseFile.path+".bak").exists())return null
        return atomic.openRead().use{input->
            val bytes=input.readBytes()
            require(bytes.size<=1500000)
            bytes
        }
    }
    @Synchronized fun save(context:Context,id:String,bytes:ByteArray){
        require(bytes.size in 1..1500000)
        val bounds=BitmapFactory.Options().apply{inJustDecodeBounds=true}
        BitmapFactory.decodeByteArray(bytes,0,bytes.size,bounds)
        require(bounds.outWidth in 1..1600&&bounds.outHeight in 1..1600)
        val bitmap=BitmapFactory.decodeByteArray(bytes,0,bytes.size)?:throw IllegalArgumentException("Invalid image")
        try{
            val atomic=file(context,id)
            val stream=atomic.startWrite()
            try{check(bitmap.compress(Bitmap.CompressFormat.JPEG,88,stream));atomic.finishWrite(stream)}
            catch(error:Exception){atomic.failWrite(stream);throw error}
        }finally{bitmap.recycle()}
    }
    @Synchronized fun remove(context:Context,id:String){
        val atomic=file(context,id)
        atomic.delete()
        check(!atomic.baseFile.exists()&&!File(atomic.baseFile.path+".bak").exists())
    }
    fun backgroundForDose(context:Context,doseId:String):Drawable?{
        val helper=QatraMedicineDatabase(context)
        val medicineId=try{
            helper.readableDatabase.rawQuery("SELECT m.id FROM medicines m JOIN doses d ON d.medicine_id=m.id WHERE d.id=? AND d.status='pending' AND m.archived=0",arrayOf(doseId)).use{
                if(it.moveToFirst())it.getString(0)else null
            }
        }finally{helper.close()}
        if(medicineId==null)return null
        val bytes=read(context,medicineId)?:return null
        val bitmap=BitmapFactory.decodeByteArray(bytes,0,bytes.size)?:return null
        val radius=24f*context.resources.displayMetrics.density
        return object:Drawable(){
            private val imageShader=BitmapShader(bitmap,Shader.TileMode.CLAMP,Shader.TileMode.CLAMP)
            private val paint=Paint(Paint.ANTI_ALIAS_FLAG or Paint.FILTER_BITMAP_FLAG).also{it.shader=imageShader}
            private val shade=Paint(Paint.ANTI_ALIAS_FLAG).apply{color=0xB8071522.toInt()}
            override fun onBoundsChange(bounds:Rect){
                val scale=max(bounds.width().toFloat()/bitmap.width,bounds.height().toFloat()/bitmap.height)
                val matrix=Matrix();matrix.setScale(scale,scale)
                matrix.postTranslate(bounds.left+(bounds.width()-bitmap.width*scale)/2f,bounds.top+(bounds.height()-bitmap.height*scale)/2f)
                imageShader.setLocalMatrix(matrix)
            }
            override fun draw(canvas:Canvas){val rect=RectF(bounds);canvas.drawRoundRect(rect,radius,radius,paint);canvas.drawRoundRect(rect,radius,radius,shade)}
            override fun getOutline(outline:Outline){outline.setRoundRect(bounds,radius)}
            override fun setAlpha(alpha:Int){paint.alpha=alpha;invalidateSelf()}
            override fun setColorFilter(filter:ColorFilter?){paint.colorFilter=filter;invalidateSelf()}
            @Deprecated("Legacy drawable opacity") override fun getOpacity():Int=PixelFormat.TRANSLUCENT
        }
    }
}
