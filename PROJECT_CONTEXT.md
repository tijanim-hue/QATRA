# QATRA — Project context

## Baseline
Main remains `79d16097b9983212a68be866c9f3ad550dc4785f`. Development branch: `mindful/phase-1-persistence`, draft PR #1. Phase 1 is NOT complete and no merge is performed.

## Verified builds
- Foundation: Actions run 43431488973, build success.
- Registered data bridge: Actions run 43432476943, build success at 2026-11-13 13:24:57 UTC.
- These establish APK compilation only. Initial instrumentation runs failed; functional, migration, device update and reboot behavior remain untested. Emulator/phone tests were waived by the user.

## This increment (pending build)
Production bridge opens a Room database under noBackupFilesDir/qatra-awareness. It refuses an existing database at the prior standard path rather than deleting it or silently opening a different store. Android Auto Backup excludes the new location; no additional database encryption is claimed. Legacy WebView storage and unrelated app backup behavior are not changed.

Adds a pure legacy planner for the five known source keys, stable hashed identities, preserved raw snapshots, nullable unknown dates and fail-closed format/duplicate/size checks. Planning neither writes nor deletes data. Native legacy import remains transactional and explicit.

Restore validates version, records and links in one transaction. It merges missing records, keeps identical current records and refuses conflicts rather than overwriting user edits. Restored consent is revoked and requires renewal; existing consent is not altered by a backup. Backups over 20 MiB and malformed records are rejected without partial changes. Portable JSON exports are not encrypted and must be handled as personal data.

Explicit native erasure clears entries, links and archived imports, then writes a non-personal tombstone in the same transaction to prevent old LocalStorage records being automatically re-imported. Bridge restore and erase actions require explicit confirmation. A manual restore may add records after erasure but does not remove the anti-reimport tombstone.

## Integration gate
The new JS modules are NOT loaded in index.html. Existing screens still use their old storage. No migration, restore or erasure is automatically invoked. The next increment must route ALL existing notebook and mindful readers/writers, clear legacy sources on user erasure, and add working export/restore/delete actions without changing existing layout or names. Partial integrations must not be merged.

## Still pending
Actual UI integration, complete export/restore file handling, optional cross-tool links, schema history, final APK compilation and honest documentation of untested behavior. No AI keys, AI requests, analytics, model calls or new permissions. Existing themes, drops, progress, signing identity and main workflow remain untouched.

## Rollback
Discard/revert branch commits. No UI data migration has been enabled in this increment.
