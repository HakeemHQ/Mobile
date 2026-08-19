import type {
    MedicationDraftInput,
} from '@/types/reminder';

import {
    formatDatabaseDate,
} from '@/lib/reminder-utils';

import i18n from '@/localization/i18n';

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
    const isArabic = i18n.language === 'ar';
    const firstDoseAt =
        new Date(input.firstDoseTime);

    if (
        !Number.isFinite(
            firstDoseAt.getTime(),
        )
    ) {
        return isArabic ? 'اختر تاريخاً ووقتاً صالحين للجرعة الأولى.' : 'Select a valid first dose date and time.';
    }

    if (
        firstDoseAt.getTime() <=
        referenceDate.getTime()
    ) {
        return isArabic ? 'اختر تاريخاً ووقتاً مستقبليين للجرعة الأولى.' : 'Select a future first dose date and time.';
    }

    const firstDoseDate =
        formatDatabaseDate(
            firstDoseAt,
        );

    if (
        firstDoseDate <
        input.startDate
    ) {
        return isArabic ? 'لا يمكن أن تكون الجرعة الأولى قبل تاريخ بدء العلاج.' : 'The first dose cannot be before the treatment start date.';
    }

    if (
        input.durationType ===
        'FINITE' &&
        input.endDate &&
        firstDoseDate >
        input.endDate
    ) {
        return isArabic ? 'لا يمكن أن تكون الجرعة الأولى بعد تاريخ انتهاء العلاج.' : 'The first dose cannot be after the treatment end date.';
    }

    return undefined;
}

export function validateMedicationDraft(
    input: MedicationDraftInput,
): string | undefined {
    const isArabic = i18n.language === 'ar';

    if (input.durationType === 'FINITE') {
        if (!input.endDate) {
            return isArabic ? 'يرجى اختيار تاريخ الانتهاء.' : 'Please select an end date.';
        }
        if (input.endDate < input.startDate) {
            return isArabic ? 'تاريخ الانتهاء لا يمكن أن يكون قبل تاريخ البدء.' : 'End date cannot be before the start date.';
        }
    }

    if (
        input.frequencyType ===
        'WEEKLY' &&
        input.weekdays.length === 0
    ) {
        return isArabic ? 'اختر يوماً واحداً على الأقل من أيام الأسبوع.' : 'Select at least one weekday.';
    }

    if (
        input.frequencyType ===
        'MONTHLY' &&
        input.monthDays.length === 0
    ) {
        return isArabic ? 'اختر يوماً واحداً على الأقل من أيام الشهر.' : 'Select at least one day of the month.';
    }

    if (
        input.frequencyType ===
        'DAILY' &&
        (input.timesPerDay < 1 ||
            input.timesPerDay > 4)
    ) {
        return isArabic ? 'عدد المرات في اليوم يجب أن يكون بين 1 و 4.' : 'Times per day must be between 1 and 4.';
    }

    if (
        !/^([01]\d|2[0-3]):([0-5]\d)$/.test(
            input.firstDoseTime,
        )
    ) {
        return isArabic ? 'اختر وقتاً صالحاً للدواء.' : 'Select a valid medication time.';
    }

    return undefined;
}
