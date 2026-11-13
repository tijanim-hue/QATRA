package com.qatra.app.awareness

import android.content.Context
import androidx.room.Room
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.security.MessageDigest
import java.util.concurrent.Callable

/** Production storage policy; never opens or deletes an older database at another path. */
object AwarenessDataPolicy {
    private const val ERASED = "__legacy_import_disabled_after_erasure__"
    fun open(context: Context): AwarenessDatabase {
        val name = "qatra-awareness.db"
        check(!context.getDatabasePath(name).exists()) { "Older awareness database requires an explicit migration" }
        val folder = File(context.noBackupFilesDir, "qatra-awareness")
        check(folder.isDirectory || folder.mkdirs()) { "Cannot prepare private data directory" }
        return Room.databaseBuilder(context.applicationContext, AwarenessDatabase::class.java, File(folder, name).absolutePath).build()
    }
    fun state(db: AwarenessDatabase): JSONObject = JSONObject()
        .put("schemaVersion", 1)
        .put("legacyImported", db.entries().imported("mindful-legacy-web-v1") != null)
        .put("legacyImportDisabled", db.entries().imported(ERASED) != null)
    fun requireImportAllowed(db: AwarenessDatabase) {
        check(db.entries().imported(ERASED) == null) { "Legacy import is disabled after erasure" }
    }
    fun erase(db: AwarenessDatabase) = db.runInTransaction(Runnable {
        val dao = db.entries()
        dao.clearLinks(); dao.clearEntries(); dao.clearImports()
        dao.markImported(AwarenessDatabase.ImportRun().apply {
            id = ERASED; digest = "erased"; originalJson = "{}"
            importedAt = System.currentTimeMillis(); entryCount = 0
        })
    })
    private fun string(o: JSONObject, key: String): String = o.get(key).let { require(it is String); it }
    private fun number(value: Any?): Long {
        require(value is Number && value.toDouble().isFinite())
        val result = value.toLong()
        require(result >= 0 && result <= 9007199254740991L && result.toDouble() == value.toDouble())
        return result
    }
    private fun time(o: JSONObject, key: String): Long? = if (!o.has(key) || o.isNull(key)) null else number(o.get(key))
    private fun hash(text: String) = MessageDigest.getInstance("SHA-256").digest(text.toByteArray(Charsets.UTF_8)).joinToString("") { "%02x".format(it) }
    fun restore(db: AwarenessDatabase, backup: String): JSONObject = db.runInTransaction(Callable {
        require(backup.toByteArray(Charsets.UTF_8).size <= 20 * 1024 * 1024) { "Backup exceeds supported size" }
        val input = JSONObject(backup)
        require(input.opt("format") == "qatra-awareness" && input.opt("schemaVersion") == 1) { "Unsupported backup" }
        val rows = input.getJSONArray("entries"); val links = input.getJSONArray("links")
        val dao = db.entries(); val identities = HashSet<Pair<String, String>>()
        var inserted = 0; var unchanged = 0; var consentsRequiringRenewal = 0
        for (i in 0 until rows.length()) {
            val o = rows.getJSONObject(i); val kind = string(o, "kind"); val id = string(o, "id")
            require(kind in AwarenessStore.kinds && id.isNotBlank() && id.length <= 160)
            require(identities.add(kind to id)) { "Duplicate backup identity" }
            val originalPayload = o.getJSONObject("payload")
            val payload = if (kind == "consent") {
                consentsRequiringRenewal++
                JSONObject().put("status", "revoked").put("requiresRenewal", true).put("restoredRecord", originalPayload).toString()
            } else originalPayload.toString()
            require(payload.toByteArray(Charsets.UTF_8).size <= 65536)
            val created = time(o, "createdAt"); val updated = time(o, "updatedAt")
            val rev = number(o.get("revision")); require(rev >= 1)
            val source = if (o.isNull("sourceKey") || !o.has("sourceKey")) null else string(o, "sourceKey")
            val existing = dao.get(kind, id)
            if (existing != null) {
                // Existing consent cannot be granted, revoked or overwritten by importing a file.
                require(kind == "consent" || existing.payload == payload) { "Backup conflicts with an existing record" }
                unchanged++
            } else {
                dao.insert(AwarenessDatabase.Entry().apply {
                    this.kind = kind; this.id = id; this.payload = payload
                    createdAt = created; updatedAt = updated; revision = rev; sourceKey = source
                }); inserted++
            }
        }
        val knownLinks = dao.links().associateBy { it.id }.toMutableMap()
        for (i in 0 until links.length()) {
            val o = links.getJSONObject(i)
            val fk = string(o, "fromKind"); val fi = string(o, "fromId")
            val tk = string(o, "toKind"); val ti = string(o, "toId")
            require(fk in AwarenessStore.kinds && tk in AwarenessStore.kinds)
            require(fk != tk || fi != ti)
            require(dao.get(fk, fi) != null && dao.get(tk, ti) != null) { "Missing link endpoint" }
            val id = hash(JSONArray(listOf(fk, fi, tk, ti)).toString())
            require(string(o, "id") == id) { "Invalid link identity" }
            val date = number(o.get("createdAt"))
            if (!knownLinks.containsKey(id)) {
                val link = AwarenessDatabase.Link().apply {
                    this.id = id; fromKind = fk; fromId = fi; toKind = tk; toId = ti; createdAt = date
                }
                dao.link(link); knownLinks[id] = link
            }
        }
        // Any error rolls back all new rows and links. Nothing existing is overwritten.
        JSONObject().put("inserted", inserted).put("unchanged", unchanged).put("consentsRequiringRenewal", consentsRequiringRenewal)
    })
}
