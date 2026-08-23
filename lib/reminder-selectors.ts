import {
    getReminderTimestamp,
    isMedicationDueOnDate,
} from '@/lib/reminder-utils';

import type {
    MedicationReminder,
    Reminder,
} from '@/types/reminder';

export function selectTodayMedicationReminders(
    reminders: Reminder[],
    referenceDate = new Date(),
): MedicationReminder[] {
    return reminders
        .filter(
            (
                reminder,
            ): reminder is MedicationReminder =>
                reminder.reminderType ===
                'MEDICATION' &&
                isMedicationDueOnDate(
                    reminder,
                    referenceDate,
                ),
        )
        .sort(
            (
                firstReminder,
                secondReminder,
            ) =>
                getReminderTimestamp(
                    firstReminder,
                ) -
                getReminderTimestamp(
                    secondReminder,
                ),
        );
}

export function selectUpcomingDatedReminders(
    reminders: Reminder[],
    referenceDate = new Date(),
): Reminder[] {
    const todayMedicationIds = new Set(
        selectTodayMedicationReminders(reminders, referenceDate).map(
            (reminder) => reminder.reminderId,
        ),
    );

    return reminders
        .filter((reminder) => !todayMedicationIds.has(reminder.reminderId))
        .sort(
            (firstReminder, secondReminder) =>
                getReminderTimestamp(firstReminder) - getReminderTimestamp(secondReminder),
        );
}
