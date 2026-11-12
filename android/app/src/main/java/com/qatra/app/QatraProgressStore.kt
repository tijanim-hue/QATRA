package com.qatra.app

import android.content.Context
import android.content.Intent
import org.json.JSONArray
import org.json.JSONObject
import java.text.Normalizer
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

/** Package four: one persistent, reversible quote ledger and deduplicated delivery records. */
object QatraProgressStore {
    private const val PREFS = "QatraProgressV4"
    private val trees = listOf("dhikr", "culture", "selfDev", "poetry")
    private fun day(time: Long = System.currentTimeMillis()) = SimpleDateFormat("yyyy-MM-dd", Locale.US).format(Date(time))
    private fun prefs(c: Context) = c.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
    private fun announce(c: Context) { c.sendBroadcast(Intent("com.qatra.app.PROGRESS_CHANGED").setPackage(c.packageName)) }
    private fun category(value: String) = when (value) {
        "quran", "dhikr" -> "dhikr"
        "culture", "generalCulture" -> "culture"
        "poetry", "feelings" -> "poetry"
        else -> "selfDev"
    }
    private fun key(text: String): String = Normalizer.normalize(text, Normalizer.Form.NFKC)
        .replace(Regex("[\\p{M}\\u0640]"), "").replace(Regex("[أإآٱ]"), "ا")
        .replace('ى', 'ي').replace(Regex("\\s+"), " ").trim()
    private fun read(c: Context): JSONObject {
        val raw = prefs(c).getString("state", null)
        if (raw != null) return JSONObject(raw).also { require(it.optInt("schemaVersion") == 4) }
        val old = c.getSharedPreferences("QatraHomeLedgerV1", Context.MODE_PRIVATE)
        return JSONObject().apply {
            put("schemaVersion", 4); put("startedAt", System.currentTimeMillis()); put("webImported", false)
            put("quotes", JSONObject()); put("drops", JSONObject())
            put("legacy", JSONObject().apply {
                put("unmappedNativeLikes", old.getLong("total", 0L))
                put("categories", JSONObject(old.getString("categories", "{}") ?: "{}"))
            })
        }
    }
    private fun write(c: Context, data: JSONObject) {
        data.put("revision", data.optLong("revision", 0L) + 1L)
        check(prefs(c).edit().putString("state", data.toString()).commit()) { "Progress storage failed" }
    }
    private fun quote(data: JSONObject, text: String, cat: String): JSONObject {
        require(text.isNotBlank() && text.length <= 20000) { "Invalid quote" }
        val quotes = data.getJSONObject("quotes"); val id = key(text)
        val item = quotes.optJSONObject(id) ?: JSONObject().apply {
            put("key", id); put("text", text); put("category", category(cat)); put("liked", false)
            put("saved", false); put("copied", false)
        }
        // Canonical source categories are passed by the library, including for custom pools.
        if (cat in listOf("dhikr", "quran", "culture", "generalCulture", "selfDev", "poetry", "feelings")) item.put("category", category(cat))
        quotes.put(id, item); return item
    }
    @Synchronized fun isLiked(c: Context, text: String): Boolean =
        read(c).getJSONObject("quotes").optJSONObject(key(text))?.optBoolean("liked", false) ?: false

    @Synchronized fun setLike(c: Context, text: String, cat: String, value: Boolean): JSONObject {
        val data = read(c); val q = quote(data, text, cat)
        if (q.optBoolean("liked") != value) {
            q.put("liked", value); q.put("likedOn", day()); q.put("updatedAt", System.currentTimeMillis())
        }
        write(c, data); announce(c); return summary(data)
    }
    @Synchronized fun shown(c: Context, occurrence: String, text: String, cat: String, scheduled: Boolean) {
        if (!scheduled || occurrence.isBlank()) return
        val data = read(c); val q = quote(data, text, cat); val drops = data.getJSONObject("drops")
        if (!drops.has(occurrence)) {
            drops.put(occurrence, JSONObject().apply {
                put("id", occurrence); put("quoteKey", q.getString("key")); put("category", q.getString("category"))
                put("shownAt", System.currentTimeMillis()); put("ignored", false)
            })
            write(c, data); announce(c)
        }
    }
    @Synchronized fun ignore(c: Context, occurrence: String) {
        val data = read(c); val d = data.getJSONObject("drops").optJSONObject(occurrence) ?: return
        val q = data.getJSONObject("quotes").optJSONObject(d.optString("quoteKey"))
        if (d.optBoolean("ignored") || q?.optBoolean("liked", false) == true) return
        d.put("ignored", true); d.put("ignoredAt", System.currentTimeMillis()); write(c, data); announce(c)
    }
    @Synchronized fun mutate(c: Context, action: String, text: String, cat: String, value: Boolean, items: JSONArray): JSONObject {
        if (action == "like") return setLike(c, text, cat, value)
        if (action == "toggleLike") return setLike(c, text, cat, !isLiked(c, text))
        val data = read(c)
        when (action) {
            "read" -> { /* snapshot only */ }
            "copy" -> { val q = quote(data, text, cat); q.put("copied", true); q.put("copiedAt", System.currentTimeMillis()) }
            "syncSaved" -> {
                val quotes = data.getJSONObject("quotes"); val it = quotes.keys()
                while (it.hasNext()) quotes.getJSONObject(it.next()).put("saved", false)
                for (i in 0 until items.length()) {
                    val item = items.getJSONObject(i); quote(data, item.getString("text"), item.optString("category", "selfDev")).put("saved", true)
                }
            }
            "import" -> if (!data.optBoolean("webImported")) {
                for (i in 0 until items.length()) {
                    val item = items.getJSONObject(i); val q = quote(data, item.getString("text"), item.optString("category", "selfDev"))
                    if (item.optBoolean("liked")) { q.put("liked", true); q.put("likedOn", "legacy") }
                    if (item.optBoolean("saved")) q.put("saved", true)
                }
                data.put("webImported", true)
            }
            else -> error("Unknown progress action")
        }
        write(c, data); if (action != "read") announce(c); return summary(data)
    }
    @Synchronized fun snapshot(c: Context): JSONObject {
        val data = read(c); write(c, data); return summary(data)
    }
    private fun summary(data: JSONObject): JSONObject {
        val scores = trees.associateWith { 0L }.toMutableMap()
        var likes = 0L; var saved = 0L; var todayLikes = 0L
        val todayCategories = JSONObject(); val quoteStates = JSONArray()
        val quotes = data.getJSONObject("quotes"); val qi = quotes.keys()
        while (qi.hasNext()) {
            val q = quotes.getJSONObject(qi.next()); val cat = category(q.optString("category"))
            val liked = q.optBoolean("liked"); val kept = q.optBoolean("saved"); val copied = q.optBoolean("copied")
            if (liked) { likes++; scores[cat] = scores.getValue(cat) + 10L
                if (q.optString("likedOn") == day()) { todayLikes++; todayCategories.put(cat, todayCategories.optLong(cat) + 1L) }
            }
            if (kept || copied) saved++
            if (kept) scores[cat] = scores.getValue(cat) + 5L
            if (copied) scores[cat] = scores.getValue(cat) + 2L
            quoteStates.put(q)
        }
        val drops = data.getJSONObject("drops"); val di = drops.keys(); var delivered = 0L; var ignored = 0L
        while (di.hasNext()) {
            val d = drops.getJSONObject(di.next()); val cat = category(d.optString("category")); delivered++
            scores[cat] = scores.getValue(cat) + 1L
            if (d.optBoolean("ignored")) { ignored++; scores[cat] = scores.getValue(cat) - 2L }
        }
        val categories = JSONObject(); var total = 0L
        for (cat in trees) { val score = maxOf(0L, scores.getValue(cat)); categories.put(cat, score); total += score }
        return JSONObject().apply {
            put("schemaVersion", 4); put("revision", data.optLong("revision")); put("startedAt", data.getLong("startedAt")); put("webImported", data.optBoolean("webImported"))
            put("likes", likes); put("delivered", delivered); put("ignored", ignored); put("steps", likes + delivered)
            put("savedUnique", saved); put("todayLikes", todayLikes); put("todayCategories", todayCategories)
            put("categories", categories); put("totalScore", total); put("quotes", quoteStates); put("legacy", data.getJSONObject("legacy"))
        }
    }
}
