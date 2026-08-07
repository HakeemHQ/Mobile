import type {
    MedicationDraft,
    MedicationReminder,
    MedicationWeekdayCode,
    Reminder,
    ReminderScheduleInput,
} from '@/types/reminder';

const WEEKDAY_CODES: MedicationWeekdayCode[] = [
    'SUN',
    'MON',
    'TUE',
    'WED',
    'THU',
    'FRI',
    'SAT',
];

const WEEKDAY_SHORT_LABELS: Record<
    MedicationWeekdayCode,
    string
> = {
    SUN: 'Sun',
    MON: 'Mon',
    TUE: 'Tue',
    WED: 'Wed',
    THU: 'Thu',
    FRI: 'Fri',
    SAT: 'Sat',
};

export function getErrorMessage(
    error: unknown,
    fallback = 'Please try again.',
): string {
    return error instanceof Error &&
        error.message
        ? error.message
        : fallback;
}

const SINGLE_EVENT_UTC_OFFSET_HOURS =
    3;

function convertLocalDateTimeToUtcIso(
    dateTime: Date,
): string {
    const utcMilliseconds =
        Date.UTC(
            dateTime.getFullYear(),
            dateTime.getMonth(),
            dateTime.getDate(),
            dateTime.getHours() -
            SINGLE_EVENT_UTC_OFFSET_HOURS,
            dateTime.getMinutes(),
            0,
            0,
        );

    return new Date(
        utcMilliseconds,
    ).toISOString();
}

export function createDefaultReminderDateTime(
    referenceDate = new Date(),
): Date {
    const date = new Date(referenceDate);

    date.setDate(date.getDate() + 1);
    date.setHours(8, 0, 0, 0);

    return date;
}

export function createMedicationStartDate(): Date {
    const date = new Date();

    date.setHours(0, 0, 0, 0);

    return date;
}

export function createMedicationEndDate(): Date {
    const date = createMedicationStartDate();

    date.setFullYear(
        date.getFullYear() + 1,
    );

    return date;
}

export function formatLocalTimeValue(
    date: Date,
): string {
    const hours = String(
        date.getHours(),
    ).padStart(2, '0');

    const minutes = String(
        date.getMinutes(),
    ).padStart(2, '0');

    return `${hours}:${minutes}`;
}

export function createMedicationTriggerAtUtc(
    startDate: string,
    localTime: string,
): string {
    const date =
        parseDatabaseDate(
            startDate,
        );

    if (!date) {
        throw new Error(
            'Invalid medication start date.',
        );
    }

    const [
        hoursValue,
        minutesValue,
    ] = localTime.split(':');

    date.setHours(
        Number(hoursValue),
        Number(minutesValue),
        0,
        0,
    );

    // 12:00 local (+03)
    // becomes 09:00Z.
    // Same exact moment.
    return date.toISOString();
}

export function createMedicationDoseTimes(
    firstDoseTime: string,
    timesPerDay: number,
): string[] {
    const count =
        Math.max(
            1,
            Math.trunc(timesPerDay),
        );

    const [
        hoursValue = '0',
        minutesValue = '0',
    ] = firstDoseTime.split(':');

    const firstDoseMinutes =
        Number(hoursValue) * 60 +
        Number(minutesValue);

    if (count === 1) {
        return [
            firstDoseTime,
        ];
    }

    const intervalMinutes =
        (24 * 60) / count;

    return Array.from(
        {
            length: count,
        },
        (_, index) => {
            const totalMinutes =
                firstDoseMinutes +
                Math.round(
                    intervalMinutes *
                    index,
                );

            const normalizedMinutes =
                ((totalMinutes %
                    (24 * 60)) +
                    24 * 60) %
                (24 * 60);

            const hours =
                Math.floor(
                    normalizedMinutes /
                    60,
                );

            const minutes =
                normalizedMinutes %
                60;

            return `${String(
                hours,
            ).padStart(
                2,
                '0',
            )}:${String(
                minutes,
            ).padStart(
                2,
                '0',
            )}`;
        },
    );
}

export function createSingleEventSchedule(
    dateTime: Date,
): ReminderScheduleInput {
    const triggerDate =
        new Date(
            dateTime.getTime() -
            3 *
            60 *
            60 *
            1000,
        );

    return {
        doseSequence: 1,

        // Actual appointment/lab time.
        localTime:
            formatLocalTimeValue(
                dateTime,
            ),

        // 3 hours BEFORE,
        // then represented in UTC.
        triggerAtUtc:
            triggerDate.toISOString(),

        deliveryMode:
            'NOTIFICATION',
    };
}

export function isFutureDateTime(
    dateTime: Date,
    referenceDate = new Date(),
): boolean {
    return (
        Number.isFinite(
            dateTime.getTime(),
        ) &&
        dateTime.getTime() >
        referenceDate.getTime()
    );
}

export function formatDatabaseDate(
    value: Date,
): string {
    return [
        value.getFullYear(),
        String(
            value.getMonth() + 1,
        ).padStart(2, '0'),
        String(
            value.getDate(),
        ).padStart(2, '0'),
    ].join('-');
}

export function parseDatabaseDate(
    value: string,
): Date | null {
    const match =
        /^(\d{4})-(\d{2})-(\d{2})$/.exec(
            value,
        );

    if (!match) {
        return null;
    }

    const year = Number(match[1]);
    const monthIndex =
        Number(match[2]) - 1;
    const day = Number(match[3]);

    const date = new Date(
        year,
        monthIndex,
        day,
    );

    if (
        date.getFullYear() !== year ||
        date.getMonth() !==
        monthIndex ||
        date.getDate() !== day
    ) {
        return null;
    }

    date.setHours(0, 0, 0, 0);

    return date;
}

export function formatDateForDisplay(
    value: Date,
): string {
    return value.toLocaleDateString(
        undefined,
        {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        },
    );
}

export function formatDateTimeDate(
    value: Date,
): string {
    return value.toLocaleDateString(
        undefined,
        {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        },
    );
}

export function formatDateTimeTime(
    value: Date,
): string {
    return value.toLocaleTimeString(
        undefined,
        {
            hour: '2-digit',
            minute: '2-digit',
        },
    );
}

export function formatLocalTime(
    localTime: string | undefined,
): string {
    if (!localTime) {
        return 'No time';
    }

    const [hoursValue, minutesValue] =
        localTime.split(':');

    const hours =
        Number(hoursValue);
    const minutes =
        Number(minutesValue);

    if (
        !Number.isFinite(hours) ||
        !Number.isFinite(minutes)
    ) {
        return localTime;
    }

    const period =
        hours >= 12 ? 'PM' : 'AM';

    const displayHours =
        hours % 12 || 12;

    return `${displayHours}:${minutes
        .toString()
        .padStart(2, '0')} ${period}`;
}

export function localTimeToDate(
    localTime: string,
): Date {
    const [hoursValue, minutesValue] =
        localTime.split(':');

    const date = new Date();

    date.setHours(
        Number(hoursValue) || 0,
        Number(minutesValue) || 0,
        0,
        0,
    );

    return date;
}

export function formatReminderDate(
    isoDate: string,
): string {
    const date = new Date(isoDate);

    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {
        const localDate =
            parseDatabaseDate(
                isoDate,
            );

        return localDate
            ? formatDateForDisplay(
                localDate,
            )
            : isoDate;
    }

    return date.toLocaleDateString(
        undefined,
        {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        },
    );
}

export function getReminderTimestamp(
    reminder: Reminder,
): number {
    if (
        reminder.reminderType ===
        'APPOINTMENT'
    ) {
        return new Date(
            reminder.appointmentDate,
        ).getTime();
    }

    if (
        reminder.reminderType ===
        'LAB_TEST'
    ) {
        return new Date(
            reminder.dueDate,
        ).getTime();
    }

    const [
        hours = '0',
        minutes = '0',
    ] =
        reminder.schedules[0]?.localTime.split(
            ':',
        ) ?? [];

    const today = new Date();

    today.setHours(
        Number(hours),
        Number(minutes),
        0,
        0,
    );

    return today.getTime();
}

export function isMedicationDueOnDate(
    reminder: MedicationReminder,
    date: Date,
): boolean {
    const targetDay =
        new Date(date);

    targetDay.setHours(
        0,
        0,
        0,
        0,
    );

    const startDate =
        parseDatabaseDate(
            reminder.startDate,
        );

    if (!startDate) {
        return false;
    }

    if (
        targetDay.getTime() <
        startDate.getTime()
    ) {
        return false;
    }

    if (reminder.endDate) {
        const endDate =
            parseDatabaseDate(
                reminder.endDate,
            );

        if (!endDate) {
            return false;
        }

        endDate.setHours(
            23,
            59,
            59,
            999,
        );

        if (
            targetDay.getTime() >
            endDate.getTime()
        ) {
            return false;
        }
    }

    switch (
    reminder.frequencyType
    ) {
        case 'WEEKLY':
            return reminder.weekdays.includes(
                WEEKDAY_CODES[
                targetDay.getDay()
                ],
            );

        case 'MONTHLY':
            return reminder.monthDays.includes(
                targetDay.getDate(),
            );

        case 'DAILY':
        default:
            return true;
    }
}

type MedicationScheduleSummarySource =
    Pick<
        MedicationDraft,
        | 'frequencyType'
        | 'weekdays'
        | 'monthDays'
        | 'schedules'
    >;

export function formatMedicationFrequencySummary(
    medication: MedicationScheduleSummarySource,
): string {
    if (
        medication.frequencyType ===
        'WEEKLY'
    ) {
        const labels =
            medication.weekdays.map(
                (weekday) =>
                    WEEKDAY_SHORT_LABELS[
                    weekday
                    ],
            );

        return labels.length > 0
            ? `Every ${labels.join(', ')}`
            : 'Weekly schedule';
    }

    if (
        medication.frequencyType ===
        'MONTHLY'
    ) {
        const count =
            medication.monthDays.length;

        return `${count} ${count === 1
            ? 'date'
            : 'dates'
            } every month`;
    }

    const count =
        medication.schedules.length;

    return `${count} ${count === 1
        ? 'time'
        : 'times'
        } every day`;
}
