# Qatra Medicine — official permanent module

## Storage foundation

QatraMedicineDatabase uses a separate Android SQLiteOpenHelper database, schema version 1, with medicines, dose occurrences and stock movements. Integer thousandths represent quantities. Strength and dose quantity are distinct. Occurrences snapshot the medicine information. Confirmation and stock deduction are atomic and repeated confirmation does not deduct again. Negative stock flags a discrepancy without discarding a reported intake. Future schema changes require explicit non-destructive migrations.

## Management interface package

QatraMedicinePlugin exposes medicine addition/listing, reading existing occurrences for the device's current calendar day, and confirming a specific stored dose. Reads do not generate occurrences or schedule alarms. Day boundaries use calendar arithmetic rather than a fixed 24-hour duration.

prepare-medicine.py makes guarded additive changes to the full index.html and MainActivity.java during the existing build pipeline. It preserves current plugin registrations, registers the medicine plugin before super.onCreate, and refuses a duplicate Kotlin activity. It identifies a unique library view or stops the build rather than mounting a medicine card on home by guesswork.

The interface saves names, strengths, units, numeric quantities and daily clock times; displays inventory; and shows existing daily occurrences and their confirmation actions. Its warning explicitly says reminders and photos are not enabled. The bridge serializes its database calls and does not log health details. UI labels are currently Arabic and styles use the existing theme variables.

## Still pending

Photo import; medicine editing and archiving controls; treatment start/end dates; weekday and time-zone policies; creation of complete scheduled occurrences; reminder alarms; notification actions; overlay pill; snooze/repetition; boot recovery; stock corrections and refills; undo; statistics; backup exclusions; automated and device tests.

Clock times saved in this package are configuration only, not an active treatment schedule. Fractional input is not permission to split a medicine, and the app does not prescribe or suggest catch-up doses. The local database is not claimed to be encrypted or excluded from Android backup.

## Release boundary

No build, device verification, or visual inspection is claimed. Existing signing-key restoration and APK certificate verification remain unchanged. Before release, build the APK, verify the pinned certificate and a higher version, and install as an update over the existing baseline without uninstalling. Default theme, speech preferences and unrelated stored data must remain unchanged.
