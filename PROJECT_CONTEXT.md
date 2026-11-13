# QATRA — Project context

## Baseline and review
- Main baseline: `79d16097b9983212a68be866c9f3ad550dc4785f`.
- Work branch: `mindful/phase-1-persistence`; PR #1 remains separate from main.
- Integrated implementation: `abc806fc6218e06137f7fb7f55ee4e7dd92067e1`.
- Phase 1 implementation is integrated and its APK compiles. User acceptance and merge remain pending. Phase 2 has not started.

## Verified build evidence
GitHub Actions run 43445700521: build job 131954515604 succeeded on 2026-11-13 at 14:47:31 UTC. The separate summary check reports APK compiled. Earlier successful foundation/bridge builds: 43431488973 and 43432476943. An older cancelled run is not a compilation failure.
Initial instrumentation jobs failed; no functional test success is claimed. Emulator and physical-phone tests were waived by the user. Compilation does not validate actual Android file-picker behavior, process-death recovery, user-data migration, upgrade, reboot or visual regressions.

## Implemented scope
- Room 2.8.4 with logical record kinds, nullable unknown timestamps, revisions and transactional links/imports. No destructive fallback.
- Separate QatraAwareness plugin, serialized background database work and asynchronous JS repository.
- On Android, existing mindful saves and notebook reads/writes use Room; pure-browser behavior retains its existing LocalStorage backend. Native errors do not silently use a second backend.
- Legacy migration starts on the first awareness data operation and runs once. The five sources are feelings, moments, gratitude, intentions and notebook keys. Original snapshots are preserved and malformed or duplicate-id input is rejected, not silently dropped. Legacy import limits: 2000 records, 10 MiB snapshot, 64 KiB per payload.
- Production database lives under noBackupFilesDir/qatra-awareness, excluded from Android Auto Backup. Existing standard-path database files cause a refusal pending explicit migration. Legacy WebView backup behavior is unchanged. No extra database encryption is implemented.
- Notebook-only export is preserved. Settings add all-awareness export, restore and confirmed erasure. Android document pickers handle file selection; no broad storage permission is requested. Portable JSON files are unencrypted personal data.
- Restore accepts versioned qatra-awareness JSON, up to 20 MiB. It merges missing rows and refuses conflicting existing content transactionally. Imported consent requires renewal; existing consent is not overwritten by a backup. Notebook-only legacy array exports are not the all-awareness restore format.
- Erasure includes awareness records, notebook content, links and archived imports. A non-personal tombstone blocks old LocalStorage re-import. Legacy keys and in-memory drafts are cleared; cleanup failures are disclosed. Exported external files and the quote/progress ledger are not deleted.
- Existing optional transfers are preserved and native link APIs exist. Expanded cross-tool features remain in their planned later phases.

## Preserved boundaries
Existing mindful names, element order, SVG icons, theme styles, scheduled drops, garden progress, signing identity and main build workflow are not redesigned. No cloud AI, keys, analytics or external history sharing is introduced. Room schema generation remains configured in the branch build.

## Release gate and rollback
No main merge or phase-2 work is included. Review/acceptance must distinguish source review and compilation from unperformed runtime testing. Main remains the prior working version until an explicitly approved merge. Before deploying a data migration, keep the prior APK and a user-controlled data export where possible. Reverting code after an installed migration is not a guarantee that new-format data will be usable by an older APK; do not delete the database to force rollback.
