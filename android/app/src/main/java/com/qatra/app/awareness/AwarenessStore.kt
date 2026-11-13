package com.qatra.app.awareness

import android.content.Context
import androidx.room.Room
import org.json.JSONArray
import org.json.JSONObject
import java.security.MessageDigest
import java.util.concurrent.Callable

/** Internal persistence boundary. Not enabled in the UI until the next reviewed integration commit. */
class AwarenessStore(private val db: AwarenessDatabase) {
    companion object {
        val kinds = setOf("feeling", "thought", "session", "gratitude", "intention", "note", "achievement", "consent")
        fun open(context: Context, name: String = "qatra-awareness.db"): AwarenessDatabase =
            Room.databaseBuilder(context.applicationContext, AwarenessDatabase::class.java, name).build()
        private fun digest(text: String) = MessageDigest.getInstance("SHA-256").digest(text.toByteArray(Charsets.UTF_8)).joinToString("") { "%02x".format(it) }
    }
    private val dao get() = db.entries()
    private fun validate(kind: String, id: String, payload: String) {
        require(kind in kinds) { "Unknown record type" }
        require(id.isNotBlank() && id.length <= 160) { "Invalid record id" }
        require(payload.toByteArray(Charsets.UTF_8).size <= 65536) { "Record too large" }
        JSONObject(payload) // Never accept malformed JSON or substitute an empty record.
    }
    fun get(kind: String, id: String): AwarenessDatabase.Entry? {
        require(kind in kinds); return dao.get(kind, id)
    }
    fun list(kind: String): List<AwarenessDatabase.Entry> {
        require(kind in kinds); return dao.list(kind)
    }
    fun put(kind: String, id: String, payload: String, expectedRevision: Long): AwarenessDatabase.Entry =
        db.runInTransaction(Callable {
            validate(kind, id, payload)
            val old = dao.get(kind, id)
            require((old?.revision ?: 0L) == expectedRevision) { "Record changed; reload before saving" }
            val item = AwarenessDatabase.Entry().apply {
                this.kind = kind; this.id = id; this.payload = payload
                createdAt = old?.createdAt ?: if (old == null) System.currentTimeMillis() else null
                updatedAt = System.currentTimeMillis(); revision = expectedRevision + 1
                sourceKey = old?.sourceKey
            }
            if (old == null) dao.insert(item) else check(dao.update(item) == 1)
            item
        })
    fun delete(kind: String, id: String, expectedRevision: Long): Boolean = db.runInTransaction(Callable {
        require(kind in kinds)
        val old = dao.get(kind, id) ?: return@Callable false
        require(old.revision == expectedRevision) { "Record changed; reload before deleting" }
        dao.delete(kind, id) == 1 // Related links are deleted by foreign keys.
    })
    fun link(fromKind: String, fromId: String, toKind: String, toId: String): String = db.runInTransaction(Callable {
        require(fromKind in kinds && toKind in kinds)
        require(dao.get(fromKind, fromId) != null && dao.get(toKind, toId) != null) { "Missing linked record" }
        require(fromKind != toKind || fromId != toId) { "Cannot link a record to itself" }
        val id = digest(JSONArray(listOf(fromKind, fromId, toKind, toId)).toString())
        if (dao.links().none { it.id == id }) dao.link(AwarenessDatabase.Link().apply {
            this.id = id; this.fromKind = fromKind; this.fromId = fromId
            this.toKind = toKind; this.toId = toId; createdAt = System.currentTimeMillis()
        })
        id
    })
    fun importLegacy(batchId: String, originalJson: String, entries: List<AwarenessDatabase.Entry>): Int = db.runInTransaction(Callable {
        require(batchId.isNotBlank() && batchId.length <= 160)
        require(originalJson.toByteArray(Charsets.UTF_8).size <= 10 * 1024 * 1024 && entries.size <= 2000)
        require(entries.sumOf { it.payload.toByteArray(Charsets.UTF_8).size.toLong() } <= 10L * 1024 * 1024)
        JSONObject(originalJson)
        val hash = digest(originalJson)
        val previous = dao.imported(batchId)
        if (previous != null) {
            require(previous.digest == hash) { "Import source changed; manual reconciliation required" }
            return@Callable previous.entryCount
        }
        for (entry in entries) {
            validate(entry.kind, entry.id, entry.payload)
            require(entry.revision == 1L && (entry.updatedAt == null || entry.updatedAt!! >= 0) && (entry.createdAt == null || entry.createdAt!! >= 0))
            require(!entry.sourceKey.isNullOrBlank()) { "Legacy record needs a stable source key" }
            dao.insert(entry) // A duplicate or invalid row rolls back the entire batch.
        }
        dao.markImported(AwarenessDatabase.ImportRun().apply {
            id = batchId; digest = hash; this.originalJson = originalJson
            importedAt = System.currentTimeMillis(); entryCount = entries.size
        })
        entries.size
    })
    fun exportData(): String = db.runInTransaction(Callable {
        val entries = JSONArray()
        for (e in dao.all()) entries.put(JSONObject().apply {
            put("kind", e.kind); put("id", e.id); put("payload", JSONObject(e.payload))
            put("createdAt", e.createdAt ?: JSONObject.NULL); put("updatedAt", e.updatedAt ?: JSONObject.NULL)
            put("revision", e.revision); put("sourceKey", e.sourceKey ?: JSONObject.NULL)
        })
        val links = JSONArray()
        for (e in dao.links()) links.put(JSONObject().apply {
            put("id", e.id); put("fromKind", e.fromKind); put("fromId", e.fromId)
            put("toKind", e.toKind); put("toId", e.toId); put("createdAt", e.createdAt)
        })
        JSONObject().put("format", "qatra-awareness").put("schemaVersion", 1)
            .put("exportedAt", System.currentTimeMillis()).put("entries", entries).put("links", links).toString()
    })
    fun clearAwarenessData() = db.runInTransaction { dao.clearLinks(); dao.clearEntries(); dao.clearImports() }
}
