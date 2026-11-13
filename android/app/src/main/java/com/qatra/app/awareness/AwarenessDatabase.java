package com.qatra.app.awareness;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.room.*;
import java.util.List;

@Database(entities={AwarenessDatabase.Entry.class, AwarenessDatabase.Link.class, AwarenessDatabase.ImportRun.class}, version=1, exportSchema=true)
public abstract class AwarenessDatabase extends RoomDatabase {
    public abstract Entries entries();

    @Entity(tableName="awareness_entries", primaryKeys={"kind","id"}, indices={@Index(value={"kind","updatedAt"}), @Index(value={"kind","sourceKey"}, unique=true)})
    public static class Entry {
        @NonNull public String kind="";
        @NonNull public String id="";
        @NonNull public String payload="{}";
        @Nullable public Long createdAt;
        @Nullable public Long updatedAt;
        public long revision=1;
        @Nullable public String sourceKey;
    }

    @Entity(tableName="awareness_links", foreignKeys={
        @ForeignKey(entity=Entry.class,parentColumns={"kind","id"},childColumns={"fromKind","fromId"},onDelete=ForeignKey.CASCADE),
        @ForeignKey(entity=Entry.class,parentColumns={"kind","id"},childColumns={"toKind","toId"},onDelete=ForeignKey.CASCADE)
    }, indices={@Index(value={"fromKind","fromId"}),@Index(value={"toKind","toId"})})
    public static class Link {
        @PrimaryKey @NonNull public String id="";
        @NonNull public String fromKind="";
        @NonNull public String fromId="";
        @NonNull public String toKind="";
        @NonNull public String toId="";
        public long createdAt;
    }

    @Entity(tableName="awareness_imports")
    public static class ImportRun {
        @PrimaryKey @NonNull public String id="";
        @NonNull public String digest="";
        @NonNull public String originalJson="{}";
        public long importedAt;
        public int entryCount;
    }

    @Dao public interface Entries {
        @Query("SELECT * FROM awareness_entries WHERE kind=:kind AND id=:id LIMIT 1") Entry get(String kind,String id);
        @Query("SELECT * FROM awareness_entries WHERE kind=:kind ORDER BY updatedAt DESC,id ASC") List<Entry> list(String kind);
        @Query("SELECT * FROM awareness_entries ORDER BY kind,id") List<Entry> all();
        @Insert(onConflict=OnConflictStrategy.ABORT) void insert(Entry entry);
        @Update int update(Entry entry);
        @Query("DELETE FROM awareness_entries WHERE kind=:kind AND id=:id") int delete(String kind,String id);
        @Insert(onConflict=OnConflictStrategy.ABORT) void link(Link link);
        @Query("SELECT * FROM awareness_links ORDER BY id") List<Link> links();
        @Query("SELECT * FROM awareness_imports WHERE id=:id LIMIT 1") ImportRun imported(String id);
        @Insert(onConflict=OnConflictStrategy.ABORT) void markImported(ImportRun run);
        @Query("DELETE FROM awareness_links") void clearLinks();
        @Query("DELETE FROM awareness_entries") void clearEntries();
        @Query("DELETE FROM awareness_imports") void clearImports();
    }
}
