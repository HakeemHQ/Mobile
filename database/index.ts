import * as SQLite from 'expo-sqlite';
import { migrateDatabase } from '@/database/migrations';

const DATABASE_NAME = 'hakeem.db';

let databasePromise: Promise<SQLite.SQLiteDatabase> | null = null;

export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
    if (databasePromise) {
        return databasePromise;
    }

    databasePromise = SQLite.openDatabaseAsync(DATABASE_NAME).then(
        async (database) => {
            await migrateDatabase(database);
            return database;
        }
    );

    return databasePromise;
}

export async function initializeDatabase(): Promise<void> {
    await getDatabase();
}