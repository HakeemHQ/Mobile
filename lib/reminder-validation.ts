import type {
    MedicationDraftInput,
} from '@/types/reminder';

import {
    formatDatabaseDate,
} from '@/lib/reminder-utils';

export function validateRequiredText(
    value: string,
    message: string,
): string | undefined {
    return value.trim()
        ? undefined
        : message;
}

export function validateMedicationFirstDose(
    input: MedicationDraftInput,
    referenceDate = new Date(),
): string | undefined {
    const firstDoseAt =
        new Date(input.firstDoseTime);

    if (
        !Number.isFinite(
            firstDoseAt.getTime(),
        )
    ) {
        return 'Select a valid first dose date and time.';
    }

    if (
        firstDoseAt.getTime() <=
        referenceDate.getTime()
    ) {
        return 'Select a future first dose date and time.';
    }

    const firstDoseDate =
        formatDatabaseDate(
            firstDoseAt,
        );

    if (
        firstDoseDate <
        input.startDate
    ) {
        return 'The first dose cannot be before the treatment start date.';
    }

    if (
        input.durationType ===
        'FINITE' &&
        input.endDate &&
        firstDoseDate >
        input.endDate
    ) {
        return 'The first dose cannot be after the treatment end date.';
    }

    return undefined;
}

export function validateMedicationDraft(
    input: MedicationDraftInput,
): string | undefined {
    if (
        input.durationType ===
        'FINITE' &&
        input.endDate &&
        input.endDate <
        input.startDate
    ) {
        return 'End date cannot be before the start date.';
    }

    if (
        input.frequencyType ===
        'WEEKLY' &&
        input.weekdays.length === 0
    ) {
        return 'Select at least one weekday.';
    }

    if (
        input.frequencyType ===
        'MONTHLY' &&
        input.monthDays.length === 0
    ) {
        return 'Select at least one day of the month.';
    }

    if (
        input.frequencyType ===
        'DAILY' &&
        (input.timesPerDay < 1 ||
            input.timesPerDay > 4)
    ) {
        return 'Times per day must be between 1 and 4.';
    }

    if (
        !/^([01]\d|2[0-3]):([0-5]\d)$/.test(
            input.firstDoseTime,
        )
    ) {
        return 'Select a valid medication time.';
    }

    return undefined;
}
