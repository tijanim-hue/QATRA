package com.qatra.app

import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.CapacitorPlugin
import com.qatra.app.awareness.AwarenessDatabase
import com.qatra.app.awareness.AwarenessStore
import com.qatra.app.awareness.AwarenessDataPolicy
import org.json.JSONArray
import org.json.JSONObject
import java.util.concurrent.Executors
import java.util.concurrent.RejectedExecutionException

/** Registered native boundary; current screens do not call it until repository integration. */
@CapacitorPlugin(name = "QatraAwareness")
class QatraAwarenessPlugin : Plugin() {
    private val worker = Executors.newSingleThreadExecutor()
    @Volatile private var closed = false
    private var database: AwarenessDatabase? = null
    private fun repository(): AwarenessStore {
        val db = database ?: AwarenessDataPolicy.open(context).also { database = it }
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
                    "status" -> AwarenessDataPolicy.state(database!!)
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
                        AwarenessDataPolicy.requireImportAllowed(database!!)
                        val values = input.getJSONArray("entries"); require(values.length() <= 2000)
                        val entries = (0 until values.length()).map { entry(values.getJSONObject(it)) }
                        JSONObject().put("count", store.importLegacy(text(input, "batchId"), text(input, "originalJson"), entries))
                    }
                    "export" -> JSONObject().put("data", JSONObject(store.exportData()))
                    "restore" -> {
                        require(input.opt("confirmed") == true)
                        AwarenessDataPolicy.restore(database!!, text(input, "backup"))
                    }
                    "erase" -> {
                        require(input.opt("confirmed") == true)
                        AwarenessDataPolicy.erase(database!!)
                        JSONObject().put("erased", true).put("legacyImportDisabled", true)
                    }
                    else -> throw IllegalArgumentException("Unknown action")
                }
                call.resolve(JSObject(result.toString()))
            } catch (_: Exception) {
                call.reject("تعذر تنفيذ عملية البيانات؛ لم نُسقط السجلات أو نتجاوز الخطأ.", "AWARENESS_STORAGE")
            }
        } } catch (_: RejectedExecutionException) { call.reject("خدمة البيانات غير متاحة.", "AWARENESS_CLOSED") }
    }

    private val fileBusy = java.util.concurrent.atomic.AtomicBoolean(false)
    private var pendingExport: String? = null
    @PluginMethod fun exportDocument(call: PluginCall) {
        if (closed) { call.reject("خدمة الملفات غير متاحة."); return }
        if (!fileBusy.compareAndSet(false, true)) { call.reject("عملية ملفات جارية."); return }
        try { worker.execute {
            try {
                val store = repository()
                pendingExport = if (call.getString("scope") == "notebook") JSONArray().apply {
                    (store.list("note") + store.list("thought")).sortedWith(compareBy<AwarenessDatabase.Entry> { it.createdAt ?: it.updatedAt ?: 0L }.thenBy { it.id })
                        .forEach { put(JSONObject(it.payload)) }
                }.toString() else store.exportData()
                activity.runOnUiThread {
                    try {
                        val intent = android.content.Intent(android.content.Intent.ACTION_CREATE_DOCUMENT)
                            .addCategory(android.content.Intent.CATEGORY_OPENABLE).setType("application/json")
                            .putExtra(android.content.Intent.EXTRA_TITLE, (if (call.getString("scope") == "notebook") "qatra-notebook-" else "qatra-awareness-") + System.currentTimeMillis() + ".json")
                        startActivityForResult(call, intent, "exportResult")
                    } catch (_: Exception) { pendingExport = null; fileBusy.set(false); call.reject("تعذر فتح اختيار ملف التصدير.") }
                }
            } catch (_: Exception) { pendingExport = null; fileBusy.set(false); call.reject("تعذر إعداد نسخة التصدير.") }
        } } catch (_: RejectedExecutionException) { fileBusy.set(false); call.reject("خدمة الملفات غير متاحة.") }
    }
    @com.getcapacitor.annotation.ActivityCallback
    private fun exportResult(call: PluginCall?, result: androidx.activity.result.ActivityResult) {
        if (call == null) { pendingExport = null; fileBusy.set(false); return }
        val uri = result.data?.data
        if (result.resultCode != android.app.Activity.RESULT_OK || uri == null) {
            pendingExport = null; fileBusy.set(false); call.resolve(JSObject().apply { put("cancelled", true) }); return
        }
        try { worker.execute {
            try {
                val contents = pendingExport ?: error("Missing export")
                val output = context.contentResolver.openOutputStream(uri, "wt") ?: error("No output stream")
                output.use { it.write(contents.toByteArray(Charsets.UTF_8)); it.flush() }
                call.resolve(JSObject().apply { put("cancelled", false) })
            } catch (_: Exception) { call.reject("تعذر حفظ الملف؛ قد يحتوي المكان المختار ملفًا غير مكتمل.") }
            finally { pendingExport = null; fileBusy.set(false) }
        } } catch (_: RejectedExecutionException) { pendingExport = null; fileBusy.set(false); call.reject("خدمة الملفات غير متاحة.") }
    }
    @PluginMethod fun importDocument(call: PluginCall) {
        if (closed) { call.reject("خدمة الملفات غير متاحة."); return }
        if (!fileBusy.compareAndSet(false, true)) { call.reject("عملية ملفات جارية."); return }
        activity.runOnUiThread {
            try {
                val intent = android.content.Intent(android.content.Intent.ACTION_OPEN_DOCUMENT)
                    .addCategory(android.content.Intent.CATEGORY_OPENABLE).setType("*/*")
                startActivityForResult(call, intent, "importResult")
            } catch (_: Exception) { fileBusy.set(false); call.reject("تعذر فتح اختيار الملف.") }
        }
    }
    @com.getcapacitor.annotation.ActivityCallback
    private fun importResult(call: PluginCall?, result: androidx.activity.result.ActivityResult) {
        if (call == null) { fileBusy.set(false); return }
        val uri = result.data?.data
        if (result.resultCode != android.app.Activity.RESULT_OK || uri == null) {
            fileBusy.set(false); call.resolve(JSObject().apply { put("cancelled", true) }); return
        }
        try { worker.execute {
            try {
                val input = context.contentResolver.openInputStream(uri) ?: error("No input stream")
                val data = java.io.ByteArrayOutputStream()
                input.use { source ->
                    val buffer = ByteArray(8192)
                    while (true) {
                        val size = source.read(buffer); if (size == -1) break
                        require(data.size().toLong() + size <= 20L * 1024 * 1024)
                        data.write(buffer, 0, size)
                    }
                }
                val decoder = Charsets.UTF_8.newDecoder().onMalformedInput(java.nio.charset.CodingErrorAction.REPORT)
                    .onUnmappableCharacter(java.nio.charset.CodingErrorAction.REPORT)
                val parsed = JSONObject(decoder.decode(java.nio.ByteBuffer.wrap(data.toByteArray())).toString())
                require(parsed.opt("format") == "qatra-awareness" && parsed.opt("schemaVersion") == 1)
                call.resolve(JSObject().apply { put("cancelled", false); put("data", parsed) })
            } catch (_: Exception) { call.reject("ملف غير مدعوم أو تالف أو يتجاوز 20 ميغابايت؛ لم تتغير سجلاتك.") }
            finally { fileBusy.set(false) }
        } } catch (_: RejectedExecutionException) { fileBusy.set(false); call.reject("خدمة الملفات غير متاحة.") }
    }

    override fun handleOnDestroy() {
        closed = true
        try { worker.execute { database?.close(); database = null } } catch (_: RejectedExecutionException) {}
        worker.shutdown()
        super.handleOnDestroy()
    }
}
