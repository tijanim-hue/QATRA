# QATRA — Project context

## Baseline and branch
- Working main remains `79d16097b9983212a68be866c9f3ad550dc4785f`.
- Development branch: `mindful/phase-1-persistence`; draft PR #1. No merge authorized/performed.
- Foundation commit: `f8d0c86c8c3b39c8b7938c72fac1f8b6b1dd186b`.
- APK-only CI commit: `bf3fbefaab13586a35f1225c6d30b391035e3108`.

## Verified evidence
GitHub Actions run 43431488973 completed its build job successfully on 2026-11-13 at 13:13:22 UTC, with check `Result - APK compiled`. This verifies APK compilation of the foundation, NOT functional behavior. Initial instrumentation runs failed; their precise root cause was not established. Emulator/phone tests are disabled by user request, not relabeled as passed.

## This bridge increment
- Register QatraAwareness separately from the existing QatraNative plugin.
- Run Room calls on a single worker; reject malformed inputs and never expose raw personal JSON in error messages.
- Add explicit CRUD, revision checks, links, legacy batch import and JSON export bridge actions.
- Add an unloaded JavaScript repository with serialized requests and explicit migration permission.
- No automatic migration, screen event changes, script loading, data deletion or AI/network calls.
- The existing UI still uses its previous stores. Do NOT enable the new repository before backup policy and all legacy readers/writers are integrated.

## Remaining within phase 1
1. Adopt a no-cloud-backup policy for the new database before the UI writes personal records.
2. Add/review the legacy adapter and map every notebook/awareness reader and writer.
3. Integrate the repository without changing names, icons, layout, theme or activity order.
4. Complete versioned restore and explicit export/delete UI actions, including avoiding re-import after erasure.
5. Preserve migration schema history and publish actual build results.

## Boundaries
Room 2.8.4 remains app-private storage with logical kind separation, nullable unknown timestamps, transactional imports/links and no destructive migration fallback. Additional database encryption is not implemented. Existing progress ledger, themes, signing identity and main workflow are unchanged. New APIs are dormant to normal UI use; APIs existing does not mean the complete user feature has shipped.

## Status and rollback
Phase 1 is NOT complete. The bridge increment must compile before further integration. Restore/reboot/update/physical-device behavior is untested. Discard or revert branch commits to return to the baseline; no UI migration has run.
