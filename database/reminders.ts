import type {
    SQLiteDatabase,
} from 'expo-sqlite';

import {
    getDatabase,
} from '@/database';

import type {
    AppointmentReminder,
    CreateReminderInput,
    LabTestReminder,
    MedicationMealName,
    MedicationMealRelation,
    MedicationReminder,
    MedicationWeekdayCode,
    Reminder,
    ReminderDeliveryMode,
    ReminderSchedule,
    ReminderScheduleInput,
    ReminderType,
    UpdateReminderInput,
} from '@/types/reminder';

interface ReminderRow {
    reminder_id: string;
    owner_user_id: string;
    reminder_type: ReminderType;
    title: string;
    is_enabled: number;
    created_at: string;
    dosage: string | null;
    instructions: string | null;
    duration_type:
        | MedicationReminder['durationType']
        | null;
    start_date: string | null;
    end_date: string | null;
    frequency_type:
        | MedicationReminder['frequencyType']
        | null;
    meal_relation:
        | MedicationMealRelation
        | null;
    meal_name:
        | MedicationMealName
        | null;
    appointment_date: string | null;
    provider_name: string | null;
    due_date: string | null;
    lab_name: string | null;
}

interface ScheduleRow {
    schedule_id: string;
    reminder_id: string;
    dose_sequence: number;
    local_time: string;
    trigger_at_utc: string | null;
    delivery_mode:
        ReminderDeliveryMode;
    native_alarm_id:
        number | null;
    created_at: string;
}

interface WeekdayRow {
    reminder_id: string;
    weekday_code:
        MedicationWeekdayCode;
}

interface MonthDayRow {
    reminder_id: string;
    month_day: number;
}

type SqlValue =
    | string
    | number
    | null;

function createUuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        (character) => {
            const randomValue =
                Math.floor(
                    Math.random() * 16,
                );

            const value =
                character === 'x'
                    ? randomValue
                    : (randomValue &
                          0x3) |
                      0x8;

            return value.toString(16);
        },
    );
}

function normalizeOptionalText(
    value:
        | string
        | null
        | undefined,
): string | null {
    if (value == null) {
        return null;
    }

    const trimmedValue =
        value.trim();

    return trimmedValue.length > 0
        ? trimmedValue
        : null;
}

function normalizeTitle(
    title: string,
): string {
    const normalizedTitle =
        title.trim();

    if (!normalizedTitle) {
        throw new Error(
            'Reminder title is required.',
        );
    }

    return normalizedTitle;
}

function normalizeLocalTime(
    localTime: string,
): string {
    const match =
        /^([01]\d|2[0-3]):([0-5]\d)$/.exec(
            localTime,
        );

    if (!match) {
        throw new Error(
            'Reminder time must use HH:mm format.',
        );
    }

    return `${match[1]}:${match[2]}`;
}

function validateCreateReminderInput(
    input: CreateReminderInput,
): void {
    normalizeTitle(input.title);

    if (
        input.schedules.length === 0
    ) {
        throw new Error(
            'At least one reminder time is required.',
        );
    }

    const doseSequences =
        input.schedules.map(
            (schedule, index) =>
                schedule.doseSequence ??
                index + 1,
        );

    if (
        new Set(doseSequences).size !==
        doseSequences.length
    ) {
        throw new Error(
            'Medication reminder times require unique dose sequences.',
        );
    }

    for (const schedule of input.schedules) {
        normalizeLocalTime(
            schedule.localTime,
        );
    }

    if (
        input.reminderType !==
        'MEDICATION'
    ) {
        return;
    }

    if (
        input.durationType ===
            'FINITE' &&
        !input.endDate
    ) {
        throw new Error(
            'A finite medication reminder requires an end date.',
        );
    }

    if (
        input.frequencyType ===
            'WEEKLY' &&
        (input.weekdays?.length ??
            0) === 0
    ) {
        throw new Error(
            'A weekly medication reminder requires at least one weekday.',
        );
    }

    if (
        input.frequencyType ===
            'MONTHLY' &&
        (input.monthDays?.length ??
            0) === 0
    ) {
        throw new Error(
            'A monthly medication reminder requires at least one day of the month.',
        );
    }
}

function mapSchedule(
    row: ScheduleRow,
): ReminderSchedule {
    return {
        scheduleId:
            row.schedule_id,
        reminderId:
            row.reminder_id,
        doseSequence:
            row.dose_sequence,
        localTime:
            row.local_time,
        triggerAtUtc:
            row.trigger_at_utc,
        deliveryMode:
            row.delivery_mode,
        nativeAlarmId:
            row.native_alarm_id,
        createdAt:
            row.created_at,
    };
}

async function insertSchedules(
    database: SQLiteDatabase,
    reminderId: string,
    schedules:
        ReminderScheduleInput[],
    createdAt: string,
): Promise<void> {
    for (
        const [
            index,
            schedule,
        ] of schedules.entries()
    ) {
        const nativeAlarmId =
            schedule.nativeAlarmId ??
            Math.floor(
                Math.random() * 2147483647,
            );

        await database.runAsync(
            `
                INSERT INTO reminder_schedules (
                    schedule_id,
                    reminder_id,
                    dose_sequence,
                    local_time,
                    trigger_at_utc,
                    delivery_mode,
                    native_alarm_id,
                    created_at
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?);
            `,
            [
                createUuid(),
                reminderId,
                schedule.doseSequence ??
                    index + 1,
                normalizeLocalTime(
                    schedule.localTime,
                ),
                schedule.triggerAtUtc ??
                    null,
                schedule.deliveryMode ??
                    'NOTIFICATION',
                nativeAlarmId,
                createdAt,
            ],
        );
    }
}

async function replaceMedicationWeekdays(
    database: SQLiteDatabase,
    reminderId: string,
    weekdays:
        MedicationWeekdayCode[],
): Promise<void> {
    await database.runAsync(
        'DELETE FROM medication_weekdays WHERE reminder_id = ?;',
        [reminderId],
    );

    for (const weekday of [
        ...new Set(weekdays),
    ]) {
        await database.runAsync(
            `
                INSERT INTO medication_weekdays (
                    reminder_id,
                    weekday_code
                )
                VALUES (?, ?);
            `,
            [
                reminderId,
                weekday,
            ],
        );
    }
}

async function replaceMedicationMonthDays(
    database: SQLiteDatabase,
    reminderId: string,
    monthDays: number[],
): Promise<void> {
    await database.runAsync(
        'DELETE FROM medication_monthly WHERE reminder_id = ?;',
        [reminderId],
    );

    const normalizedMonthDays = [
        ...new Set(monthDays),
    ].sort(
        (first, second) =>
            first - second,
    );

    for (
        const monthDay of normalizedMonthDays
    ) {
        if (
            monthDay < 1 ||
            monthDay > 31
        ) {
            throw new Error(
                'Month days must be between 1 and 31.',
            );
        }

        await database.runAsync(
            `
                INSERT INTO medication_monthly (
                    reminder_id,
                    month_day
                )
                VALUES (?, ?);
            `,
            [
                reminderId,
                monthDay,
            ],
        );
    }
}

async function insertReminder(
    database: SQLiteDatabase,
    input: CreateReminderInput,
): Promise<string> {
    validateCreateReminderInput(
        input,
    );

    const reminderId =
        createUuid();

    const createdAt =
        new Date().toISOString();

    await database.runAsync(
        `
            INSERT INTO reminders (
                reminder_id,
                owner_user_id,
                reminder_type,
                title,
                is_enabled,
                created_at
            )
            VALUES (?, ?, ?, ?, ?, ?);
        `,
        [
            reminderId,
            input.ownerUserId,
            input.reminderType,
            normalizeTitle(
                input.title,
            ),
            input.isEnabled ===
            false
                ? 0
                : 1,
            createdAt,
        ],
    );

    switch (input.reminderType) {
        case 'MEDICATION':
            await database.runAsync(
                `
                    INSERT INTO medication_reminders (
                        reminder_id,
                        dosage,
                        instructions,
                        duration_type,
                        start_date,
                        end_date,
                        frequency_type,
                        meal_relation,
                        meal_name
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
                `,
                [
                    reminderId,
                    normalizeOptionalText(
                        input.dosage,
                    ),
                    normalizeOptionalText(
                        input.instructions,
                    ),
                    input.durationType,
                    input.startDate,
                    input.durationType ===
                    'LIFELONG'
                        ? null
                        : input.endDate ??
                          null,
                    input.frequencyType,
                    input.mealRelation ??
                        null,
                    input.mealName ??
                        null,
                ],
            );

            await replaceMedicationWeekdays(
                database,
                reminderId,
                input.frequencyType ===
                'WEEKLY'
                    ? input.weekdays ??
                      []
                    : [],
            );

            await replaceMedicationMonthDays(
                database,
                reminderId,
                input.frequencyType ===
                'MONTHLY'
                    ? input.monthDays ??
                      []
                    : [],
            );
            break;

        case 'APPOINTMENT':
            await database.runAsync(
                `
                    INSERT INTO appointment_reminders (
                        reminder_id,
                        appointment_date,
                        provider_name
                    )
                    VALUES (?, ?, ?);
                `,
                [
                    reminderId,
                    input.appointmentDate,
                    normalizeOptionalText(
                        input.providerName,
                    ),
                ],
            );
            break;

        case 'LAB_TEST':
            await database.runAsync(
                `
                    INSERT INTO lab_test_reminders (
                        reminder_id,
                        due_date,
                        lab_name
                    )
                    VALUES (?, ?, ?);
                `,
                [
                    reminderId,
                    input.dueDate,
                    normalizeOptionalText(
                        input.labName,
                    ),
                ],
            );
            break;
    }

    await insertSchedules(
        database,
        reminderId,
        input.schedules,
        createdAt,
    );

    return reminderId;
}

export async function createReminder(
    input: CreateReminderInput,
): Promise<string> {
    const database =
        await getDatabase();

    let reminderId = '';

    await database.withTransactionAsync(
        async () => {
            reminderId =
                await insertReminder(
                    database,
                    input,
                );
        },
    );

    return reminderId;
}

export async function createReminders(
    inputs: CreateReminderInput[],
): Promise<string[]> {
    if (inputs.length === 0) {
        throw new Error(
            'At least one reminder is required.',
        );
    }

    const database =
        await getDatabase();

    const reminderIds:
        string[] = [];

    await database.withTransactionAsync(
        async () => {
            for (const input of inputs) {
                const reminderId =
                    await insertReminder(
                        database,
                        input,
                    );

                reminderIds.push(
                    reminderId,
                );
            }
        },
    );

    return reminderIds;
}

export async function listReminders(
    ownerUserId: string,
): Promise<Reminder[]> {
    const database =
        await getDatabase();

    const rows =
        await database.getAllAsync<ReminderRow>(
            `
                SELECT
                    r.reminder_id,
                    r.owner_user_id,
                    r.reminder_type,
                    r.title,
                    r.is_enabled,
                    r.created_at,
                    mr.dosage,
                    mr.instructions,
                    mr.duration_type,
                    mr.start_date,
                    mr.end_date,
                    mr.frequency_type,
                    mr.meal_relation,
                    mr.meal_name,
                    ar.appointment_date,
                    ar.provider_name,
                    lr.due_date,
                    lr.lab_name
                FROM reminders r
                LEFT JOIN medication_reminders mr
                    ON mr.reminder_id = r.reminder_id
                LEFT JOIN appointment_reminders ar
                    ON ar.reminder_id = r.reminder_id
                LEFT JOIN lab_test_reminders lr
                    ON lr.reminder_id = r.reminder_id
                WHERE r.owner_user_id = ?
                ORDER BY r.created_at DESC;
            `,
            [ownerUserId],
        );

    if (rows.length === 0) {
        return [];
    }

    const reminderIds =
        rows.map(
            (row) =>
                row.reminder_id,
        );

    const placeholders =
        reminderIds
            .map(() => '?')
            .join(', ');

    const [
        scheduleRows,
        weekdayRows,
        monthDayRows,
    ] = await Promise.all([
        database.getAllAsync<ScheduleRow>(
            `
                SELECT
                    schedule_id,
                    reminder_id,
                    dose_sequence,
                    local_time,
                    trigger_at_utc,
                    delivery_mode,
                    created_at
                FROM reminder_schedules
                WHERE reminder_id IN (${placeholders})
                ORDER BY
                    reminder_id,
                    dose_sequence;
            `,
            reminderIds,
        ),
        database.getAllAsync<WeekdayRow>(
            `
                SELECT
                    reminder_id,
                    weekday_code
                FROM medication_weekdays
                WHERE reminder_id IN (${placeholders})
                ORDER BY
                    reminder_id,
                    weekday_code;
            `,
            reminderIds,
        ),
        database.getAllAsync<MonthDayRow>(
            `
                SELECT
                    reminder_id,
                    month_day
                FROM medication_monthly
                WHERE reminder_id IN (${placeholders})
                ORDER BY
                    reminder_id,
                    month_day;
            `,
            reminderIds,
        ),
    ]);

    const schedulesByReminder =
        new Map<
            string,
            ReminderSchedule[]
        >();

    for (const row of scheduleRows) {
        const schedules =
            schedulesByReminder.get(
                row.reminder_id,
            ) ?? [];

        schedules.push(
            mapSchedule(row),
        );

        schedulesByReminder.set(
            row.reminder_id,
            schedules,
        );
    }

    const weekdaysByReminder =
        new Map<
            string,
            MedicationWeekdayCode[]
        >();

    for (const row of weekdayRows) {
        const weekdays =
            weekdaysByReminder.get(
                row.reminder_id,
            ) ?? [];

        weekdays.push(
            row.weekday_code,
        );

        weekdaysByReminder.set(
            row.reminder_id,
            weekdays,
        );
    }

    const monthDaysByReminder =
        new Map<string, number[]>();

    for (const row of monthDayRows) {
        const monthDays =
            monthDaysByReminder.get(
                row.reminder_id,
            ) ?? [];

        monthDays.push(
            row.month_day,
        );

        monthDaysByReminder.set(
            row.reminder_id,
            monthDays,
        );
    }

    return rows.map(
        (row): Reminder => {
            const base = {
                reminderId:
                    row.reminder_id,
                ownerUserId:
                    row.owner_user_id,
                title: row.title,
                isEnabled:
                    row.is_enabled === 1,
                createdAt:
                    row.created_at,
                schedules:
                    schedulesByReminder.get(
                        row.reminder_id,
                    ) ?? [],
            };

            if (
                row.reminder_type ===
                'MEDICATION'
            ) {
                if (
                    !row.duration_type ||
                    !row.start_date ||
                    !row.frequency_type
                ) {
                    throw new Error(
                        `Medication reminder ${row.reminder_id} is incomplete.`,
                    );
                }

                const reminder: MedicationReminder =
                    {
                        ...base,
                        reminderType:
                            'MEDICATION',
                        dosage:
                            row.dosage,
                        instructions:
                            row.instructions,
                        durationType:
                            row.duration_type,
                        startDate:
                            row.start_date,
                        endDate:
                            row.end_date,
                        frequencyType:
                            row.frequency_type,
                        weekdays:
                            weekdaysByReminder.get(
                                row.reminder_id,
                            ) ?? [],
                        monthDays:
                            monthDaysByReminder.get(
                                row.reminder_id,
                            ) ?? [],
                        mealRelation:
                            row.meal_relation,
                        mealName:
                            row.meal_name,
                    };

                return reminder;
            }

            if (
                row.reminder_type ===
                'APPOINTMENT'
            ) {
                if (
                    !row.appointment_date
                ) {
                    throw new Error(
                        `Appointment reminder ${row.reminder_id} is incomplete.`,
                    );
                }

                const reminder: AppointmentReminder =
                    {
                        ...base,
                        reminderType:
                            'APPOINTMENT',
                        appointmentDate:
                            row.appointment_date,
                        providerName:
                            row.provider_name,
                    };

                return reminder;
            }

            if (!row.due_date) {
                throw new Error(
                    `Lab test reminder ${row.reminder_id} is incomplete.`,
                );
            }

            const reminder: LabTestReminder =
                {
                    ...base,
                    reminderType:
                        'LAB_TEST',
                    dueDate:
                        row.due_date,
                    labName:
                        row.lab_name,
                };

            return reminder;
        },
    );
}

async function updateColumns(
    database: SQLiteDatabase,
    tableName: string,
    idColumn: string,
    reminderId: string,
    entries: Array<
        [
            string,
            | SqlValue
            | undefined,
        ]
    >,
): Promise<void> {
    const definedEntries =
        entries.filter(
            (entry) =>
                entry[1] !==
                undefined,
        ) as Array<
            [string, SqlValue]
        >;

    if (
        definedEntries.length ===
        0
    ) {
        return;
    }

    const assignments =
        definedEntries
            .map(
                ([column]) =>
                    `${column} = ?`,
            )
            .join(', ');

    const values =
        definedEntries.map(
            ([, value]) =>
                value,
        );

    await database.runAsync(
        `UPDATE ${tableName} SET ${assignments} WHERE ${idColumn} = ?;`,
        [
            ...values,
            reminderId,
        ],
    );
}

export async function updateReminder(
    input: UpdateReminderInput,
): Promise<void> {
    const database =
        await getDatabase();

    const currentReminder =
        await database.getFirstAsync<{
            reminder_type:
                ReminderType;
        }>(
            'SELECT reminder_type FROM reminders WHERE reminder_id = ?;',
            [input.reminderId],
        );

    if (!currentReminder) {
        throw new Error(
            'Reminder not found.',
        );
    }

    await database.withTransactionAsync(
        async () => {
            await updateColumns(
                database,
                'reminders',
                'reminder_id',
                input.reminderId,
                [
                    [
                        'title',
                        input.title ===
                        undefined
                            ? undefined
                            : normalizeTitle(
                                  input.title,
                              ),
                    ],
                    [
                        'is_enabled',
                        input.isEnabled ===
                        undefined
                            ? undefined
                            : input.isEnabled
                              ? 1
                              : 0,
                    ],
                ],
            );

            if (
                currentReminder.reminder_type ===
                    'MEDICATION' &&
                input.medication
            ) {
                const medication =
                    input.medication;

                await updateColumns(
                    database,
                    'medication_reminders',
                    'reminder_id',
                    input.reminderId,
                    [
                        [
                            'dosage',
                            medication.dosage ===
                            undefined
                                ? undefined
                                : normalizeOptionalText(
                                      medication.dosage,
                                  ),
                        ],
                        [
                            'instructions',
                            medication.instructions ===
                            undefined
                                ? undefined
                                : normalizeOptionalText(
                                      medication.instructions,
                                  ),
                        ],
                        [
                            'duration_type',
                            medication.durationType,
                        ],
                        [
                            'start_date',
                            medication.startDate,
                        ],
                        [
                            'end_date',
                            medication.durationType ===
                            'LIFELONG'
                                ? null
                                : medication.endDate,
                        ],
                        [
                            'frequency_type',
                            medication.frequencyType,
                        ],
                        [
                            'meal_relation',
                            medication.mealRelation,
                        ],
                        [
                            'meal_name',
                            medication.mealName,
                        ],
                    ],
                );

                if (
                    medication.weekdays !==
                    undefined
                ) {
                    await replaceMedicationWeekdays(
                        database,
                        input.reminderId,
                        medication.weekdays,
                    );
                }

                if (
                    medication.monthDays !==
                    undefined
                ) {
                    await replaceMedicationMonthDays(
                        database,
                        input.reminderId,
                        medication.monthDays,
                    );
                }

                if (
                    medication.frequencyType ===
                    'DAILY'
                ) {
                    await replaceMedicationWeekdays(
                        database,
                        input.reminderId,
                        [],
                    );

                    await replaceMedicationMonthDays(
                        database,
                        input.reminderId,
                        [],
                    );
                } else if (
                    medication.frequencyType ===
                    'WEEKLY'
                ) {
                    await replaceMedicationMonthDays(
                        database,
                        input.reminderId,
                        [],
                    );
                } else if (
                    medication.frequencyType ===
                    'MONTHLY'
                ) {
                    await replaceMedicationWeekdays(
                        database,
                        input.reminderId,
                        [],
                    );
                }
            }

            if (
                currentReminder.reminder_type ===
                    'APPOINTMENT' &&
                input.appointment
            ) {
                await updateColumns(
                    database,
                    'appointment_reminders',
                    'reminder_id',
                    input.reminderId,
                    [
                        [
                            'appointment_date',
                            input
                                .appointment
                                .appointmentDate,
                        ],
                        [
                            'provider_name',
                            input
                                .appointment
                                .providerName ===
                            undefined
                                ? undefined
                                : normalizeOptionalText(
                                      input
                                          .appointment
                                          .providerName,
                                  ),
                        ],
                    ],
                );
            }

            if (
                currentReminder.reminder_type ===
                    'LAB_TEST' &&
                input.labTest
            ) {
                await updateColumns(
                    database,
                    'lab_test_reminders',
                    'reminder_id',
                    input.reminderId,
                    [
                        [
                            'due_date',
                            input.labTest
                                .dueDate,
                        ],
                        [
                            'lab_name',
                            input.labTest
                                .labName ===
                            undefined
                                ? undefined
                                : normalizeOptionalText(
                                      input
                                          .labTest
                                          .labName,
                                  ),
                        ],
                    ],
                );
            }

            if (
                input.schedules !==
                undefined
            ) {
                if (
                    input.schedules
                        .length === 0
                ) {
                    throw new Error(
                        'At least one reminder time is required.',
                    );
                }

                await database.runAsync(
                    'DELETE FROM reminder_schedules WHERE reminder_id = ?;',
                    [
                        input.reminderId,
                    ],
                );

                await insertSchedules(
                    database,
                    input.reminderId,
                    input.schedules,
                    new Date().toISOString(),
                );
            }
        },
    );
}

export async function setReminderEnabled(
    reminderId: string,
    isEnabled: boolean,
): Promise<void> {
    const database =
        await getDatabase();

    const result =
        await database.runAsync(
            'UPDATE reminders SET is_enabled = ? WHERE reminder_id = ?;',
            [
                isEnabled ? 1 : 0,
                reminderId,
            ],
        );

    if (result.changes === 0) {
        throw new Error(
            'Reminder not found.',
        );
    }
}

export async function deleteReminder(
    reminderId: string,
): Promise<void> {
    const database =
        await getDatabase();

    const result =
        await database.runAsync(
            'DELETE FROM reminders WHERE reminder_id = ?;',
            [reminderId],
        );

    if (result.changes === 0) {
        throw new Error(
            'Reminder not found.',
        );
    }
}
