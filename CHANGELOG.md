# Changelog

## Unreleased — Mindful phase 1
- Foundation and separate native bridge compiled successfully (Actions 43431488973 and 43432476943).
- Add private no-Auto-Backup storage policy and refuse unplanned old-path migration.
- Add a pure legacy import planner without automatic writes or source deletion.
- Add transactional, non-overwriting restore and confirmed erasure with an anti-reimport tombstone.
- Preserve current consent on restore and require renewal for imported consent records.
- Keep UI integration disabled pending complete reader/writer and data-action wiring.
- New increment awaits compilation. Functional/device tests remain unperformed by user request; phase 1 is incomplete.

## UI integration increment — pending build
- Wire existing mindful and notebook persistence to Room on Android, preserving the browser fallback.
- Add Android-native document export/import and a settings data-management panel.
- Preserve notebook-only export; add explicit all-awareness restore/erase actions.
- Keep all existing icons, screen arrangement, themes, scheduled drops and progress unchanged.
- Compilation and final phase acceptance remain pending.
