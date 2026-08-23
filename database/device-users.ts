import { getDatabase } from '@/database';
import type { DeviceUser } from '@/types/reminder';

interface DeviceUserRow {
    user_id: string;
    email: string;
    created_at: string;
    last_logged_in_at: string;
}

interface UpsertDeviceUserInput {
    userId: string;
    email: string;
    loggedInAt?: string;
}

function mapDeviceUser(row: DeviceUserRow): DeviceUser {
    return {
        userId: row.user_id,
        email: row.email,
        createdAt: row.created_at,
        lastLoggedInAt: row.last_logged_in_at,
    };
}

export async function upsertDeviceUser({
    userId,
    email,
    loggedInAt = new Date().toISOString(),
}: UpsertDeviceUserInput): Promise<DeviceUser> {
    const normalizedUserId = userId.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedUserId || !normalizedEmail) {
        throw new Error('A valid user ID and email are required.');
    }

    const database = await getDatabase();

    await database.runAsync(
        `
      INSERT INTO device_users (
        user_id,
        email,
        created_at,
        last_logged_in_at
      )
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        email = excluded.email,
        last_logged_in_at = excluded.last_logged_in_at;
    `,
        [normalizedUserId, normalizedEmail, loggedInAt, loggedInAt]
    );

    const savedUser = await database.getFirstAsync<DeviceUserRow>(
        `
      SELECT user_id, email, created_at, last_logged_in_at
      FROM device_users
      WHERE user_id = ?;
    `,
        [normalizedUserId]
    );

    if (!savedUser) {
        throw new Error('The device user could not be saved.');
    }

    return mapDeviceUser(savedUser);
}

export async function getCurrentDeviceUser(): Promise<DeviceUser | null> {
    const database = await getDatabase();
    const row = await database.getFirstAsync<DeviceUserRow>(
        `
      SELECT user_id, email, created_at, last_logged_in_at
      FROM device_users
      ORDER BY last_logged_in_at DESC
      LIMIT 1;
    `
    );

    return row ? mapDeviceUser(row) : null;
}

export async function removeDeviceUser(userId: string): Promise<void> {
    const database = await getDatabase();
    await database.runAsync('DELETE FROM device_users WHERE user_id = ?;', [
        userId,
    ]);
}