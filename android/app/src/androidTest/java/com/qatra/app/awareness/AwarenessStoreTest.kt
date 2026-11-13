package com.qatra.app.awareness

import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import android.content.Context
import org.json.JSONObject
import org.junit.Assert.*
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.junit.runner.RunWith

/** Fixtures exist only in the test database. No user data or UI sample records are created. */
@RunWith(AndroidJUnit4::class)
class AwarenessStoreTest {
    private lateinit var context: Context
    private lateinit var db: AwarenessDatabase
    private lateinit var store: AwarenessStore
    private val name = "qatra-awareness-instrumentation-test.db"
    @Before fun setup() {
        context = ApplicationProvider.getApplicationContext()
        context.deleteDatabase(name)
        db = AwarenessStore.open(context, name); store = AwarenessStore(db)
    }
    @After fun cleanup() { db.close(); context.deleteDatabase(name) }
    @Test fun recordsAreIsolatedAndSurviveReopen() {
        store.put("feeling", "same-id", "{\"intensity\":5}", 0)
        store.put("note", "same-id", "{\"text\":\"fixture\"}", 0)
        db.close(); db = AwarenessStore.open(context, name); store = AwarenessStore(db)
        assertEquals(1, store.list("feeling").size)
        assertEquals(1, store.list("note").size)
        assertEquals(5, JSONObject(store.get("feeling", "same-id")!!.payload).getInt("intensity"))
    }
    @Test fun staleEditsDoNotOverwriteAndDeletionCascades() {
        store.put("thought", "a", "{}", 0); store.put("intention", "b", "{}", 0)
        store.link("thought", "a", "intention", "b")
        store.link("thought", "a", "intention", "b")
        assertEquals(1, db.entries().links().size)
        store.put("thought", "a", "{\"text\":\"new\"}", 1)
        try { store.put("thought", "a", "{}", 1); fail("stale update accepted") } catch (_: IllegalArgumentException) {}
        assertEquals(2L, store.get("thought", "a")!!.revision)
        assertTrue(store.delete("thought", "a", 2)); assertTrue(db.entries().links().isEmpty())
        assertNotNull(store.get("intention", "b"))
    }
    private fun legacy(id: String, payload: String = "{}"): AwarenessDatabase.Entry = AwarenessDatabase.Entry().apply {
        kind = "gratitude"; this.id = id; this.payload = payload; createdAt = null
        updatedAt = null; sourceKey = "legacy:" + id
    }
    @Test fun importIsIdempotentAndKeepsUnknownDates() {
        val original = "{\"qatra_gratitude_log\":[]}"; val batch = listOf(legacy("one"))
        assertEquals(1, store.importLegacy("batch", original, batch))
        assertEquals(1, store.importLegacy("batch", original, batch))
        assertEquals(1, store.list("gratitude").size); assertNull(store.get("gratitude", "one")!!.createdAt)
        assertEquals(original, db.entries().imported("batch")!!.originalJson)
        try { store.importLegacy("batch", "{}", batch); fail("changed source accepted") } catch (_: IllegalArgumentException) {}
    }
    @Test fun invalidBatchRollsBackAndExportUsesRealRecordsOnly() {
        try { store.importLegacy("invalid", "{}", listOf(legacy("ok"), legacy("bad", "invalid-json"))); fail("invalid batch accepted") } catch (_: Exception) {}
        assertTrue(store.list("gratitude").isEmpty()); assertNull(db.entries().imported("invalid"))
        store.put("note", "real", "{\"text\":\"fixture\"}", 0)
        val exported = JSONObject(store.exportData())
        assertEquals(1, exported.getJSONArray("entries").length())
        store.clearAwarenessData(); assertEquals(0, JSONObject(store.exportData()).getJSONArray("entries").length())
    }
}
