# QATRA — Project context

## Baseline and scope
- Last user-confirmed working main: `79d16097b9983212a68be866c9f3ad550dc4785f`.
- Branch: `mindful/phase-1-persistence`; draft PR #1. Main is not merged or modified.
- Phase 1 foundation commit: `f8d0c86c8c3b39c8b7938c72fac1f8b6b1dd186b`.
- Phase 1 is incomplete. The Room database is dormant: no UI bridge or automatic import is enabled.

## Existing foundation
Room 2.8.4, Java annotationProcessor, logically separated record kinds, composite identity, revision checks, transactional links and imports, versioned export and scoped erasure. Unknown legacy dates remain null. Exact supplied legacy snapshots are archived locally; changed snapshots under the same import id are refused. No destructive migration fallback.

## User decision — 2026-11-13
The user requests direct incremental implementation without emulator or phone testing. Stop launching emulator tests. Retain test source files without claiming they passed. Keep APK compilation because a failed build cannot produce a usable application. Do not bypass a compiler error or mark a failed build successful.

## Actual evidence
Both initial persistence-tests runs failed (43429507099 and 43429699505). The provided log tail shows BUILD FAILED, not its underlying cause. Compilation and functional correctness are NOT validated. The replacement workflow runs assembleDebug only, retains its failure result, archives build logs/schema output and exposes a short diagnostic in a separate check name. No emulator is started. No APK is distributed by this branch workflow; persistent signing and the main release/build workflow are unchanged.

## Remaining within phase 1
1. Resolve the actual compilation error before enabling storage.
2. Add the separate asynchronous Awareness bridge and complete legacy adapters.
3. Route all existing notebook readers/writers before changing the source of truth.
4. Add export, restore, deletion and optional record links without redesigning existing screens.
5. Define backup rules before storing personal data in the new database.
6. Preserve schema history and document untested behavior.

## Privacy and regression boundaries
No AI, keys, remote uploads of personal data, analytics or fake UI records. No extra database encryption is implemented or claimed. Keep all existing names, icons, layout, themes and native progress ledger. This CI change does not alter app code, existing user data or the working main branch.

## Rollback
Discard/revert the feature branch commits. No production data migration has been enabled.
