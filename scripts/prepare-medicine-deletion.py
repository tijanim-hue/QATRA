from pathlib import Path
root=Path(__file__).resolve().parents[1]
def patch(path,old,new):
 p=root/path;s=p.read_text(encoding='utf-8')
 if new in s:return
 if s.count(old)!=1:raise SystemExit('Unexpected medicine anchor: '+str(path))
 p.write_text(s.replace(old,new,1),encoding='utf-8')
patch('android/app/src/main/java/com/qatra/app/MainActivity.java','registerPlugin(QatraMedicineImagesPlugin.class);','registerPlugin(QatraMedicineImagesPlugin.class);\n        registerPlugin(QatraMedicineDeletionPlugin.class);')
p=root/'public/index.html';s=p.read_text(encoding='utf-8')
if 'src="qatra-medicine-deletion.js"' not in s:
 if s.count('</head>')!=1:raise SystemExit('Invalid HTML')
 p.write_text(s.replace('</head>','<script defer src="qatra-medicine-deletion.js"></script>\n</head>',1),encoding='utf-8')
patch('public/qatra-medicine.js',"const result=await native('addMedicine',payload);form.reset();","const result=await native('addMedicine',payload);await window.QatraMedicineCreationPhoto.save(result.id);form.reset();")
p=root/'android/app/src/main/java/com/qatra/app/QatraMedicineDatabase.kt';s=p.read_text(encoding='utf-8')
if 'qatra_medicine.db", null, 1' in s:
 s=s.replace('qatra_medicine.db", null, 1','qatra_medicine.db", null, 2',1)
 s=s.replace('medicine_id TEXT NOT NULL REFERENCES medicines(id) ON DELETE RESTRICT','medicine_id TEXT REFERENCES medicines(id) ON DELETE SET NULL',1)
 old='''        // No destructive fallback: future schema changes require an explicit migration.
        throw IllegalStateException("Missing medicine migration: $oldVersion -> $newVersion")'''
 new='''        require(oldVersion == 1 && newVersion == 2) { "Unsupported medicine migration" }
        fun schema(name: String): String = db.rawQuery("SELECT sql FROM sqlite_master WHERE type='table' AND name=?", arrayOf(name)).use { check(it.moveToFirst()); it.getString(0) }
        val doseSql = schema("doses")
        val stockSql = schema("stock_movements")
        val migrated = doseSql.replace("CREATE TABLE doses", "CREATE TABLE doses_v2").replace("medicine_id TEXT NOT NULL REFERENCES medicines(id) ON DELETE RESTRICT", "medicine_id TEXT REFERENCES medicines(id) ON DELETE SET NULL")
        check(migrated != doseSql && migrated.contains("ON DELETE SET NULL"))
        db.execSQL("CREATE TEMP TABLE medicine_stock_backup AS SELECT * FROM stock_movements")
        db.execSQL("DROP TABLE stock_movements")
        db.execSQL(migrated)
        db.execSQL("INSERT INTO doses_v2 SELECT * FROM doses")
        db.execSQL("DROP TABLE doses")
        db.execSQL("ALTER TABLE doses_v2 RENAME TO doses")
        db.execSQL(stockSql)
        db.execSQL("INSERT INTO stock_movements SELECT * FROM medicine_stock_backup")
        db.execSQL("DROP TABLE medicine_stock_backup")
        db.execSQL("CREATE INDEX doses_by_time ON doses(status, scheduled_at)")
        db.execSQL("CREATE INDEX stock_by_medicine ON stock_movements(medicine_id, recorded_at)")
        db.rawQuery("PRAGMA foreign_key_check", null).use { check(!it.moveToFirst()) }'''
 if s.count(old)!=1:raise SystemExit('Unexpected database migration')
 s=s.replace(old,new,1);p.write_text(s,encoding='utf-8')
(root/'public/qatra-medicine-deletion.js').write_text((root/'public/qatra-medicine-actions.js').read_text(encoding='utf-8'),encoding='utf-8')
