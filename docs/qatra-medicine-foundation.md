# Qatra Medicine — official module

Qatra Medicine is a permanent feature planned within the personal library, not a temporary experiment.

## This foundation

- Adds an Android SQLiteOpenHelper storage component with no new third-party dependency.
- Uses a separate private app database, qatra_medicine.db, schema version 1.
- Stores medicines, daily clock-time configuration, concrete dose occurrences, and stock movements.
- Stores whole-number thousandths of a unit: 1000 = one tablet, 500 = half, 250 = quarter.
- Separates medication strength from dose quantity.
- Snapshots the medicine name, strength, unit, and quantity on each occurrence.
- Uniquely identifies a medicine/time occurrence; repeated creation returns the same ID.
- Atomically records intake, clears its stored snooze time, updates stock, and adds a stock-ledger movement.
- Repeated confirmation of an already recorded dose returns false without another deduction.
- Preserves a reported intake even if stock becomes negative; inventoryNeedsReview flags the discrepancy.
- Does not destructively recreate a database when a migration is missing.

## Not implemented in this foundation

The component is not registered with a Capacitor bridge or invoked by the existing application. It therefore does not create a visible medicine section yet. The database is created only when its helper is opened.

The UI, image import, schedule editing, treatment date ranges, weekday rules, quantity corrections, intake undo, refill controls, user-facing snooze controls, medicine reminders, notification actions, overlay pill, boot/time-zone handling, statistics, backup exclusions, and automated tests remain to be implemented. A snooze column is storage preparation only: no Android alarms are cancelled or scheduled here.

Clock times alone do not constitute a complete treatment schedule. Concrete occurrences must be created by the future scheduling component with explicit treatment boundaries and time-zone handling. The UI must not present this foundation as working reminders.

Photos must later be copied into app-private storage; the nullable image-path column does not implement image import or permissions. Local storage is not a claim of database encryption or exclusion from Android backup.

## Safety and release boundaries

This module records user-entered prescribed regimens; it must not recommend dose amounts, tablet splitting, catch-up doses, or treatment changes. Fractional quantity support is numeric storage, not approval to split a medicine.

The existing signing identity, default theme, speech preferences, navigation, notification sounds, and unrelated databases are unchanged. No build or device verification is claimed by this commit. An APK must be built and its pinned certificate and higher version verified before delivery as an update over the current baseline.
