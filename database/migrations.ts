import type {
    SQLiteDatabase,
} from 'expo-sqlite';

const DATABASE_VERSION = 2;

interface TableInfoRow {
    name: string;
}

async function hasColumn(
    database: SQLiteDatabase,
    tableName: string,
    columnName: string,
): Promise<boolean> {
    const rows =
        await database.getAllAsync<TableInfoRow>(
            `PRAGMA table_info(${tableName});`,
        );

    return rows.some(
        (row) =>
            row.name === columnName,
    );
}

export async function migrateDatabase(
    database: SQLiteDatabase,
): Promise<void> {
    await database.execAsync(
        'PRAGMA foreign_keys = ON;',
    );

    await database.execAsync(
        'PRAGMA journal_mode = WAL;',
    );

    const versionRow =
        await database.getFirstAsync<{
            user_version: number;
        }>(
            'PRAGMA user_version;',
        );

    const currentVersion =
        versionRow?.user_version ??
        0;

    if (
        currentVersion >=
        DATABASE_VERSION
    ) {
        return;
    }

    if (currentVersion === 0) {
        await database.execAsync(`
            CREATE TABLE IF NOT EXISTS device_users (
                user_id TEXT PRIMARY KEY NOT NULL,
                email TEXT NOT NULL COLLATE NOCASE,
                created_at TEXT NOT NULL,
                last_logged_in_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS reminders (
                reminder_id TEXT PRIMARY KEY NOT NULL,
                owner_user_id TEXT NOT NULL,
                reminder_type TEXT NOT NULL
                    CHECK (
                        reminder_type IN (
                            'MEDICATION',
                            'APPOINTMENT',
                            'LAB_TEST'
                        )
                    ),
                title TEXT NOT NULL
                    CHECK (
                        length(trim(title)) > 0
                    ),
                is_enabled INTEGER NOT NULL DEFAULT 1
                    CHECK (
                        is_enabled IN (0, 1)
                    ),
                created_at TEXT NOT NULL,
                FOREIGN KEY (
                    owner_user_id
                )
                    REFERENCES device_users(
                        user_id
                    )
                    ON UPDATE CASCADE
                    ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS medication_reminders (
                reminder_id TEXT PRIMARY KEY NOT NULL,
                dosage TEXT,
                instructions TEXT,
                duration_type TEXT NOT NULL
                    CHECK (
                        duration_type IN (
                            'FINITE',
                            'LIFELONG'
                        )
                    ),
                start_date TEXT NOT NULL,
                end_date TEXT,
                frequency_type TEXT NOT NULL
                    CHECK (
                        frequency_type IN (
                            'DAILY',
                            'WEEKLY',
                            'MONTHLY'
                        )
                    ),
                meal_relation TEXT
                    CHECK (
                        meal_relation IS NULL
                        OR meal_relation IN (
                            'BEFORE',
                            'AFTER'
                        )
                    ),
                meal_name TEXT
                    CHECK (
                        meal_name IS NULL
                        OR meal_name IN (
                            'Breakfast',
                            'Lunch',
                            'Dinner',
                            'Snack'
                        )
                    ),
                CHECK (
                    (
                        duration_type = 'LIFELONG'
                        AND end_date IS NULL
                    )
                    OR
                    (
                        duration_type = 'FINITE'
                        AND end_date IS NOT NULL
                    )
                ),
                FOREIGN KEY (
                    reminder_id
                )
                    REFERENCES reminders(
                        reminder_id
                    )
                    ON UPDATE CASCADE
                    ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS appointment_reminders (
                reminder_id TEXT PRIMARY KEY NOT NULL,
                appointment_date TEXT NOT NULL,
                provider_name TEXT,
                FOREIGN KEY (
                    reminder_id
                )
                    REFERENCES reminders(
                        reminder_id
                    )
                    ON UPDATE CASCADE
                    ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS lab_test_reminders (
                reminder_id TEXT PRIMARY KEY NOT NULL,
                due_date TEXT NOT NULL,
                lab_name TEXT,
                FOREIGN KEY (
                    reminder_id
                )
                    REFERENCES reminders(
                        reminder_id
                    )
                    ON UPDATE CASCADE
                    ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS reminder_schedules (
                schedule_id TEXT PRIMARY KEY NOT NULL,
                reminder_id TEXT NOT NULL,
                dose_sequence INTEGER NOT NULL
                    CHECK (
                        dose_sequence > 0
                    ),
                local_time TEXT NOT NULL,
                trigger_at_utc TEXT,
                delivery_mode TEXT NOT NULL
                    DEFAULT 'NOTIFICATION'
                    CHECK (
                        delivery_mode IN (
                            'NOTIFICATION',
                            'ALARM'
                        )
                    ),
                created_at TEXT NOT NULL,
                UNIQUE (
                    reminder_id,
                    dose_sequence
                ),
                FOREIGN KEY (
                    reminder_id
                )
                    REFERENCES reminders(
                        reminder_id
                    )
                    ON UPDATE CASCADE
                    ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS medication_weekdays (
                reminder_id TEXT NOT NULL,
                weekday_code TEXT NOT NULL
                    CHECK (
                        weekday_code IN (
                            'SUN',
                            'MON',
                            'TUE',
                            'WED',
                            'THU',
                            'FRI',
                            'SAT'
                        )
                    ),
                PRIMARY KEY (
                    reminder_id,
                    weekday_code
                ),
                FOREIGN KEY (
                    reminder_id
                )
                    REFERENCES medication_reminders(
                        reminder_id
                    )
                    ON UPDATE CASCADE
                    ON DELETE CASCADE
            );

            CREATE TABLE IF NOT EXISTS medication_monthly (
                reminder_id TEXT NOT NULL,
                month_day INTEGER NOT NULL
                    CHECK (
                        month_day BETWEEN 1 AND 31
                    ),
                PRIMARY KEY (
                    reminder_id,
                    month_day
                ),
                FOREIGN KEY (
                    reminder_id
                )
                    REFERENCES medication_reminders(
                        reminder_id
                    )
                    ON UPDATE CASCADE
                    ON DELETE CASCADE
            );

            CREATE INDEX IF NOT EXISTS idx_device_users_email
                ON device_users(email);

            CREATE INDEX IF NOT EXISTS idx_device_users_last_login
                ON device_users(
                    last_logged_in_at DESC
                );

            CREATE INDEX IF NOT EXISTS idx_reminders_owner_type
                ON reminders(
                    owner_user_id,
                    reminder_type
                );

            CREATE INDEX IF NOT EXISTS idx_reminders_owner_enabled
                ON reminders(
                    owner_user_id,
                    is_enabled
                );

            CREATE INDEX IF NOT EXISTS idx_schedules_reminder_time
                ON reminder_schedules(
                    reminder_id,
                    local_time
                );

            CREATE INDEX IF NOT EXISTS idx_appointments_date
                ON appointment_reminders(
                    appointment_date
                );

            CREATE INDEX IF NOT EXISTS idx_lab_tests_due_date
                ON lab_test_reminders(
                    due_date
                );

            CREATE INDEX IF NOT EXISTS idx_medication_dates
                ON medication_reminders(
                    start_date,
                    end_date
                );
        `);
    }

    if (
        currentVersion < 2
    ) {
        const hasMealRelation =
            await hasColumn(
                database,
                'medication_reminders',
                'meal_relation',
            );

        if (!hasMealRelation) {
            await database.execAsync(`
                ALTER TABLE medication_reminders
                ADD COLUMN meal_relation TEXT
                    CHECK (
                        meal_relation IS NULL
                        OR meal_relation IN (
                            'BEFORE',
                            'AFTER'
                        )
                    );
            `);
        }

        const hasMealName =
            await hasColumn(
                database,
                'medication_reminders',
                'meal_name',
            );

        if (!hasMealName) {
            await database.execAsync(`
                ALTER TABLE medication_reminders
                ADD COLUMN meal_name TEXT
                    CHECK (
                        meal_name IS NULL
                        OR meal_name IN (
                            'Breakfast',
                            'Lunch',
                            'Dinner',
                            'Snack'
                        )
                    );
            `);
        }
    }

    await database.execAsync(
        `PRAGMA user_version = ${DATABASE_VERSION};`,
    );
}
