# QATRA — Project context

## Baseline
- Last user-confirmed working main: `79d16097b9983212a68be866c9f3ad550dc4785f`.
- Work branch: `mindful/phase-1-persistence`.
- Current scope: new Mindful phase 1, storage foundation (part A). Phase 1 is NOT complete.
- No changes to existing UI, names, icons, order, theme files, native drop ledger or saved user data.

## This commit
Adds a Room 2.8.4 data layer with logically separated record kinds, composite identity, nullable unknown legacy creation dates, optimistic revisions, transactional links and imports, a versioned export and scoped erasure. Import archives the exact supplied legacy snapshot locally and refuses changed snapshots under the same import id. No destructive migration fallback.
Java Room declarations use annotationProcessor to avoid changing the Kotlin compiler plugins. The database is dormant: no plugin, UI or automatic import is enabled in this commit.

## Remaining within phase 1
1. Register the separate Awareness plugin; add asynchronous repository and legacy format adapters.
2. Route ALL existing notebook readers/writers before switching the source of truth.
3. Add export/restore/delete user actions and safe optional routes; preserve current screen order and appearance.
4. Define Android backup rules before persisting personal records to the new database.
5. Add web and migration tests, schema history and emulator update/reboot checks.
6. Review test evidence and full APK build before phase acceptance.

## Privacy boundaries
No AI calls, model keys, network uploads, analytics, permissions prompts or fake user records. Test fixtures are confined to the test database. Logical record kinds share one app-private database; no additional database encryption is implemented or claimed. Cloud consent and full database backup policy are still pending.

## Evidence
- Source and local static review performed. Android compilation and instrumentation have NOT run at commit preparation time.
- New branch workflow is configured for emulator tests; outcome must be read from GitHub Actions, not inferred from workflow presence.
- Tests cover reopen persistence, type isolation, stale edit rejection, link deduplication/cascade, import idempotency, rollback, export and scoped deletion.
- Device installation, on-device update, physical phone reboot and visual regression are NOT tested.
- No APK from the test workflow is offered for installation; the existing main build/signing workflow is unchanged.

## Rollback
Revert this foundation commit or discard this branch. There is no UI data migration to undo yet. Main and the previous data stores are untouched.
