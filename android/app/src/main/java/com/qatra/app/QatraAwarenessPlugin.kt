package com.qatra.app

import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.qatra.app.awareness.AwarenessDatabase
import com.qatra.app.awareness.AwarenessStore
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.Executors
import java.util.concurrent.RejectedExecutionException

/** Draft integration boundary. Not registered or called by the current UI yet. */
@CapacitorPlugin(name = "QatraAwareness")
class QatraAwarenessPlugin : Plugin() {
    private val worker = Executors.newSingleThreadExecutor()
    @Volatile private var closed = false
    private var database: AwarenessDatabase? = null
    private fun repository(): AwarenessStore {
        val db = database ?: AwarenessStore.open(context).also { database = it }
        return AwarenessStore(db)
    }
    private fun number(value: Any?): Long {
        require(value is Number && value.toDouble().isFinite())
        val result = value.toLong()
        require(result >= 0 && result <= 9007199254740991L && result.toDouble() == value.toDouble())
        return result
    }
    private fun optionalNumber(json: JSONObject, key: String): Long? =
        if (!json.has(key) || json.isNull(key)) null else number(json.get(key))
    private fun text(json: JSONObject, key: String): String = json.get(key).let {
        require(it is String); it
    }
    private fun entry(json: JSONObject): AwarenessDatabase.Entry = AwarenessDatabase.Entry().apply {
        kind = text(json, "kind"); id = text(json, "id"); payload = text(json, "payload")
        createdAt = optionalNumber(json, "createdAt"); updatedAt = optionalNumber(json, "updatedAt")
        revision = number(json.get("revision")); sourceKey = text(json, "sourceKey")
    }
    private fun encode(entry: AwarenessDatabase.Entry): JSONObject = JSONObject().apply {
        put("kind", entry.kind); put("id", entry.id); put("payload", JSONObject(entry.payload))
        put("createdAt", entry.createdAt ?: JSONObject.NULL); put("updatedAt", entry.updatedAt ?: JSONObject.NULL)
        put("revision", entry.revision); put("sourceKey", entry.sourceKey ?: JSONObject.NULL)
    }
    @PluginMethod fun execute(call: PluginCall) {
        if (closed) { call.reject("خدمة البيانات غير متاحة.", "AWARENESS_CLOSED"); return }
        try { worker.execute {
            try {
                val input = call.data; val store = repository()
                val result = when (text(input, "action")) {
                    "get" -> JSONObject().put("entry", store.get(text(input, "kind"), text(input, "id"))?.let { encode(it) } ?: JSONObject.NULL)
                    "list" -> {
                        val offset = if (input.has("offset")) number(input.get("offset")) else 0L
                        val limit = if (input.has("limit")) number(input.get("limit")) else 100L
                        require(offset <= Int.MAX_VALUE && limit in 1L..100L)
                        val all = store.list(text(input, "kind"))
                        JSONObject().put("entries", JSONArray().apply { all.drop(offset.toInt()).take(limit.toInt()).forEach { put(encode(it)) } }).put("total", all.size)
                    }
                    "put" -> JSONObject().put("entry", encode(store.put(text(input, "kind"), text(input, "id"), text(input, "payload"), number(input.get("expectedRevision")))))
                    "delete" -> JSONObject().put("deleted", store.delete(text(input, "kind"), text(input, "id"), number(input.get("expectedRevision"))))
                    "link" -> JSONObject().put("id", store.link(text(input, "fromKind"), text(input, "fromId"), text(input, "toKind"), text(input, "toId")))
                    "importLegacy" -> {
                        val values = input.getJSONArray("entries"); require(values.length() <= 2000)
                        val entries = (0 until values.length()).map { entry(values.getJSONObject(it)) }
                        JSONObject().put("count", store.importLegacy(text(input, "batchId"), text(input, "originalJson"), entries))
                    }
                    "export" -> JSONObject().put("data", JSONObject(store.exportData()))
                    else -> throw IllegalArgumentException("Unknown action")
                }
                call.resolve(JSObject(result.toString()))
            } catch (_: Exception) {
                // Never include user text or the raw JSON parser message in logs or bridge errors.
                call.reject("تعذر تنفيذ عملية البيانات؛ لم نُسقط السجلات أو نتجاوز الخطأ.", "AWARENESS_STORAGE")
            }
        } } catch (_: RejectedExecutionException) { call.reject("خدمة البيانات غير متاحة.", "AWARENESS_CLOSED") }
    }
    override fun handleOnDestroy() {
        closed = true
        try { worker.execute { database?.close(); database = null } } catch (_: RejectedExecutionException) {}
        worker.shutdown()
        super.handleOnDestroy()
    }
}
