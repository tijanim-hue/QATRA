from pathlib import Path
from html.parser import HTMLParser

root = Path(__file__).resolve().parents[1]
html_path = root/'public/index.html'
activity_path = root/'android/app/src/main/java/com/qatra/app/MainActivity.java'
markup = html_path.read_text(encoding='utf-8')
source = activity_path.read_text(encoding='utf-8')
if (activity_path.parent/'MainActivity.kt').exists():
    raise SystemExit('Duplicate MainActivity: refusing medicine integration.')
if markup.count('</head>') != 1 or '</html>' not in markup:
    raise SystemExit('Incomplete index.html: refusing medicine integration.')
for name in ('QatraPlugin', 'QatraAwarenessPlugin'):
    if source.count('registerPlugin('+name+'.class);') != 1:
        raise SystemExit('Existing native registration changed: '+name)

class LibraryFinder(HTMLParser):
    def __init__(self, text):
        super().__init__(convert_charrefs=True)
        self.stack=[]
        self.views={}
        self.headings=[]
        self.offsets=[0]
        for line in text.splitlines(keepends=True):
            self.offsets.append(self.offsets[-1]+len(line))
    def handle_starttag(self, tag, attrs):
        attrs=dict(attrs)
        view=attrs.get('id') if 'view' in attrs.get('class','').split() else None
        line,column=self.getpos()
        if view:
            self.views[view]=self.offsets[line-1]+column+len(self.get_starttag_text())
        if tag not in ('area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'):
            self.stack.append((tag,view))
        if tag in ('h1','h2','h3'):
            owner=next((v for _,v in reversed(self.stack) if v),None)
            self.headings.append([tag,owner,''])
    def handle_data(self, data):
        if self.headings and any(t==self.headings[-1][0] for t,_ in self.stack):
            self.headings[-1][2]+=data
    def handle_endtag(self, tag):
        for index in range(len(self.stack)-1,-1,-1):
            if self.stack[index][0]==tag:
                del self.stack[index:]
                break

if 'id="openQatraMedicine"' not in markup:
    finder=LibraryFinder(markup)
    finder.feed(markup)
    matches=[key for key in finder.views if 'library' in key.lower()]
    if not matches:
        matches=list({owner for _,owner,text in finder.headings if owner and ' '.join(text.split()) in ('المكتبة الشخصية','مكتبتي')})
    if len(matches)!=1:
        raise SystemExit('Personal library is not uniquely identified; refusing a fallback to home.')
    offset=finder.views[matches[0]]
    card='''
<button id="openQatraMedicine" class="glass-card action-card" type="button" aria-haspopup="dialog">
<span class="card-icon"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c3.9 4.2 6 7 6 9.5A6 6 0 1 1 6 12.5C6 10 8.1 7.2 12 3z"/></svg></span>
<span class="card-info"><span class="card-title">قطرة دواء</span><span class="card-sub">أدويتك وجرعاتك ومخزونك</span></span>
</button>
'''
    markup=markup[:offset]+card+markup[offset:]
for snippet in ('<link rel="stylesheet" href="qatra-medicine.css">','<script defer src="qatra-medicine.js"></script>','<script defer src="qatra-medicine-management.js"></script>'):
    if snippet not in markup:
        markup=markup.replace('</head>',snippet+'\n</head>',1)
registration='registerPlugin(QatraMedicinePlugin.class);'
if registration not in source:
    anchor='registerPlugin(QatraAwarenessPlugin.class);'
    source=source.replace(anchor,anchor+'\n        '+registration,1)
if source.count(registration)!=1 or source.index(registration)>source.index('super.onCreate(savedInstanceState);'):
    raise SystemExit('Invalid medicine plugin registration order.')

def patch(path, before, after):
    text=path.read_text(encoding='utf-8')
    if after in text:
        return
    if text.count(before)!=1:
        raise SystemExit('Ambiguous medicine integration anchor: '+str(path))
    path.write_text(text.replace(before,after,1),encoding='utf-8')

java=root/'android/app/src/main/java/com/qatra/app'
plugin=java/'QatraMedicinePlugin.kt'
methods=r'''
    private data class MedicinePlan(val id:String,val at:Long,val name:String,val amount:String)

    private fun expectedMedicine(helper:QatraMedicineDatabase,id:String,expected:JSONObject):JSONObject {
        val rows=helper.listMedicines()
        val current=(0 until rows.length()).map { rows.getJSONObject(it) }.firstOrNull { it.getString("id")==id }
            ?: throw IllegalArgumentException("Medicine not found")
        for(key in listOf("name","strength","unit"))require(current.getString(key)==expected.getString(key))
        for(key in listOf("doseMilli","stockMilli"))require(current.getLong(key)==expected.getLong(key))
        require(current.getBoolean("archived")==expected.getBoolean("archived"))
        require(current.getJSONArray("dailyTimes").toString()==expected.getJSONArray("dailyTimes").toString())
        return current
    }

    private fun pendingMedicineIds(helper:QatraMedicineDatabase,id:String,futureOnly:Boolean):List<String> {
        val result=mutableListOf<String>()
        val extra=if(futureOnly)" AND scheduled_at>"+System.currentTimeMillis() else ""
        helper.readableDatabase.rawQuery("SELECT id FROM doses WHERE medicine_id=? AND status='pending'"+extra,arrayOf(id)).use { row ->
            while(row.moveToNext())result.add(row.getString(0))
        }
        return result
    }

    private fun rebuildMedicineToday(helper:QatraMedicineDatabase,id:String):List<MedicinePlan> {
        val rows=helper.listMedicines()
        val medicine=(0 until rows.length()).map { rows.getJSONObject(it) }.first { it.getString("id")==id }
        require(!medicine.getBoolean("archived"))
        val sql=helper.writableDatabase
        val now=System.currentTimeMillis()
        sql.execSQL("UPDATE doses SET status='skipped',snooze_until=NULL WHERE medicine_id=? AND status='pending' AND scheduled_at>?",arrayOf<Any>(id,now))
        val times=medicine.getJSONArray("dailyTimes")
        val plans=mutableListOf<MedicinePlan>()
        for(index in 0 until times.length()) {
            val parts=times.getString(index).split(":")
            val day=Calendar.getInstance().apply {
                isLenient=false
                set(Calendar.HOUR_OF_DAY,parts[0].toInt());set(Calendar.MINUTE,parts[1].toInt())
                set(Calendar.SECOND,0);set(Calendar.MILLISECOND,0)
            }
            val at=day.timeInMillis
            if(at<=now)continue
            val doseId=helper.ensureDose(id,at)
            val changed=sql.update("doses",android.content.ContentValues().apply {
                put("medicine_name",medicine.getString("name"));put("medicine_strength",medicine.getString("strength"))
                put("unit",medicine.getString("unit"));put("quantity_milli",medicine.getLong("doseMilli"))
                put("status","pending");putNull("snooze_until")
            },"id=? AND status!='taken'",arrayOf(doseId))
            if(changed==1)plans.add(MedicinePlan(doseId,at,medicine.getString("name"),"${medicine.getLong("doseMilli")/1000.0} ${medicine.getString("unit")}"))
        }
        return plans
    }

    private fun reconcileMedicine(cancelled:List<String>,plans:List<MedicinePlan>):Boolean {
        var warning=false
        for(id in cancelled)try { dismissMedicineReminder(context,id) }catch(_:Exception){warning=true}
        for(plan in plans)try { QatraMedicineReminderScheduler.schedule(context,plan.id,plan.name,plan.amount,plan.at) }catch(_:Exception){warning=true}
        return warning
    }

    @PluginMethod fun updateMedicine(call:PluginCall)=execute(call) { helper ->
        val id=call.getString("id").orEmpty()
        val values=call.getArray("dailyTimes")?:throw IllegalArgumentException("dailyTimes")
        val times=(0 until values.length()).map { values.get(it) as? String ?: throw IllegalArgumentException("dailyTimes") }
        val sql=helper.writableDatabase
        var cancelled:List<String> = emptyList()
        var plans:List<MedicinePlan> = emptyList()
        sql.beginTransaction()
        try {
            val old=expectedMedicine(helper,id,call.data.getJSONObject("expected"))
            require(!old.getBoolean("archived"))
            require(call.getString("unit")==old.getString("unit"))
            cancelled=pendingMedicineIds(helper,id,true)
            require(helper.updateMedicine(id,call.getString("name").orEmpty(),call.getString("strength").orEmpty(),old.getString("unit"),integer(call,"doseMilli"),times))
            plans=rebuildMedicineToday(helper,id)
            sql.setTransactionSuccessful()
        }finally{sql.endTransaction()}
        val warning=reconcileMedicine(cancelled,plans)
        JSObject().apply { put("saved",true);put("reminderWarning",warning) }
    }

    @PluginMethod fun setArchived(call:PluginCall)=execute(call) { helper ->
        val id=call.getString("id").orEmpty()
        val archived=call.getBoolean("archived")?:throw IllegalArgumentException("archived")
        val sql=helper.writableDatabase
        var cancelled:List<String> = emptyList()
        var plans:List<MedicinePlan> = emptyList()
        sql.beginTransaction()
        try {
            expectedMedicine(helper,id,call.data.getJSONObject("expected"))
            cancelled=pendingMedicineIds(helper,id,false)
            require(helper.setArchived(id,archived))
            if(!archived)plans=rebuildMedicineToday(helper,id)
            sql.setTransactionSuccessful()
        }finally{sql.endTransaction()}
        val warning=reconcileMedicine(cancelled,plans)
        JSObject().apply { put("saved",true);put("reminderWarning",warning) }
    }

    companion object {
        fun activeMedicineDose(context:android.content.Context,id:String):Boolean {
            return try {
                val helper=QatraMedicineDatabase(context)
                try {
                    helper.readableDatabase.rawQuery("SELECT 1 FROM doses d JOIN medicines m ON m.id=d.medicine_id WHERE d.id=? AND d.status='pending' AND m.archived=0",arrayOf(id)).use { it.moveToFirst() }
                }finally{helper.close()}
            }catch(_:Exception){false}
        }
        fun dismissMedicineReminder(context:android.content.Context,id:String) {
            QatraMedicineReminderScheduler.cancel(context,id)
            QatraMedicineReminderScheduler.cancel(context,"$id:snooze")
            val manager=context.getSystemService(android.content.Context.NOTIFICATION_SERVICE) as android.app.NotificationManager
            manager.cancel(("medicine:$id").hashCode());manager.cancel(("medicine:$id:snooze").hashCode())
        }
    }

'''
anchor='    @PluginMethod fun listMedicines(call: PluginCall)'
patch(plugin,anchor,methods+anchor)
patch(plugin,'WHERE scheduled_at>=? AND scheduled_at<? ORDER BY scheduled_at,id',"WHERE scheduled_at>=? AND scheduled_at<? AND (status!='pending' OR medicine_id IN (SELECT id FROM medicines WHERE archived=0)) ORDER BY scheduled_at,id")
patch(java/'QatraMedicineActionReceiver.kt','        if (doseId.isBlank()) return','        if (doseId.isBlank()) return\n        if (!QatraMedicinePlugin.activeMedicineDose(context, doseId)) return')
patch(java/'QatraMedicineReminderReceiver.kt','        if (doseId.isBlank() || name.isBlank() || amount.isBlank() || scheduledAt <= 0L) return','        if (doseId.isBlank() || name.isBlank() || amount.isBlank() || scheduledAt <= 0L) return\n        if (!QatraMedicinePlugin.activeMedicineDose(context, doseId)) return')
patch(root/'public/qatra-medicine.js','map(m=>`<article class="qm-panel">','map(m=>`<article class="qm-panel" data-medicine-id="${escape(m.id)}">')
html_path.write_text(markup,encoding='utf-8')
activity_path.write_text(source,encoding='utf-8')
