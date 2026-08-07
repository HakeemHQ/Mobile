import { create } from 'zustand';

import {
    getCurrentDeviceUser,
} from '@/database/device-users';

import {
    createReminder,
    createReminders,
    deleteReminder as deleteReminderFromDatabase,
    listReminders,
    setReminderEnabled,
    updateReminder as updateReminderInDatabase,
} from '@/database/reminders';

import {
    getErrorMessage,
} from '@/lib/reminder-utils';

import type {
    CreateAppointmentReminderFormInput,
    CreateLabTestReminderFormInput,
    CreateMedicationReminderFormInput,
    CreateReminderInput,
    DeviceUser,
    Reminder,
    ReminderLoadStatus,
    UpdateReminderInput,
} from '@/types/reminder';

interface ReminderStore {
    reminders: Reminder[];
    currentDeviceUser:
    DeviceUser | null;
    status:
    ReminderLoadStatus;
    error: string | null;
    isMutating: boolean;
    loadReminders: (
        force?: boolean,
    ) => Promise<void>;
    refreshReminders:
    () => Promise<void>;
    addMedication: (
        input:
            CreateMedicationReminderFormInput,
    ) => Promise<string>;
    addMedicationBatch: (
        inputs:
            CreateMedicationReminderFormInput[],
    ) => Promise<string[]>;
    addAppointment: (
        input:
            CreateAppointmentReminderFormInput,
    ) => Promise<string>;
    addLabTest: (
        input:
            CreateLabTestReminderFormInput,
    ) => Promise<string>;
    updateReminder: (
        input: UpdateReminderInput,
    ) => Promise<void>;
    toggleReminder: (
        reminderId: string,
        isEnabled: boolean,
    ) => Promise<void>;
    deleteReminder: (
        reminderId: string,
    ) => Promise<void>;
    clearError: () => void;
    resetReminders: () => void;
}

type CreateReminderFormInput =
    | CreateMedicationReminderFormInput
    | CreateAppointmentReminderFormInput
    | CreateLabTestReminderFormInput;

let activeLoad:
    Promise<void> | null = null;

let loadGeneration = 0;

async function requireDeviceUser(): Promise<DeviceUser> {
    const deviceUser =
        await getCurrentDeviceUser();

    if (!deviceUser) {
        throw new Error(
            'No logged-in device user was found. Save the authenticated user after login before adding reminders.',
        );
    }

    return deviceUser;
}

function attachOwnerUserId(
    input:
        CreateReminderFormInput,
    ownerUserId: string,
): CreateReminderInput {
    return {
        ...input,
        ownerUserId,
    } as CreateReminderInput;
}

function isSameDeviceUser(
    first: DeviceUser | null,
    second: DeviceUser | null,
): boolean {
    return (
        first?.userId ===
        second?.userId
    );
}

export const useReminderStore =
    create<ReminderStore>(
        (set, get) => {
            const runMutation =
                async <T>(
                    operation:
                        () => Promise<T>,
                ): Promise<T> => {
                    set({
                        isMutating:
                            true,
                        error: null,
                    });

                    try {
                        return await operation();
                    } catch (error) {
                        const message =
                            getErrorMessage(
                                error,
                                'Something went wrong while working with reminders.',
                            );

                        set({
                            error: message,
                        });

                        throw new Error(
                            message,
                        );
                    } finally {
                        set({
                            isMutating:
                                false,
                        });
                    }
                };

            const addSingleReminder =
                async (
                    input:
                        CreateReminderFormInput,
                ): Promise<string> =>
                    runMutation(
                        async () => {
                            const deviceUser =
                                await requireDeviceUser();

                            const reminderId =
                                await createReminder(
                                    attachOwnerUserId(
                                        input,
                                        deviceUser.userId,
                                    ),
                                );

                            await get().loadReminders(
                                true,
                            );

                            return reminderId;
                        },
                    );

            return {
                reminders: [],
                currentDeviceUser:
                    null,
                status: 'idle',
                error: null,
                isMutating: false,

                loadReminders:
                    async (
                        force = false,
                    ) => {
                        if (
                            !force &&
                            activeLoad
                        ) {
                            return activeLoad;
                        }

                        const generation =
                            ++loadGeneration;

                        const load =
                            (async () => {
                                try {
                                    const deviceUser =
                                        await getCurrentDeviceUser();

                                    if (
                                        generation !==
                                        loadGeneration
                                    ) {
                                        return;
                                    }

                                    const currentState =
                                        get();

                                    if (
                                        !force &&
                                        currentState.status ===
                                        'success' &&
                                        isSameDeviceUser(
                                            currentState.currentDeviceUser,
                                            deviceUser,
                                        )
                                    ) {
                                        return;
                                    }

                                    set({
                                        status:
                                            'loading',
                                        error: null,
                                    });

                                    const reminders =
                                        deviceUser
                                            ? await listReminders(
                                                deviceUser.userId,
                                            )
                                            : [];

                                    if (
                                        generation !==
                                        loadGeneration
                                    ) {
                                        return;
                                    }

                                    set({
                                        reminders,
                                        currentDeviceUser:
                                            deviceUser,
                                        status:
                                            'success',
                                        error: null,
                                    });
                                } catch (error) {
                                    if (
                                        generation !==
                                        loadGeneration
                                    ) {
                                        return;
                                    }

                                    set({
                                        status:
                                            'error',
                                        error: getErrorMessage(
                                            error,
                                            'The reminders could not be loaded.',
                                        ),
                                    });
                                } finally {
                                    if (
                                        generation ===
                                        loadGeneration
                                    ) {
                                        activeLoad =
                                            null;
                                    }
                                }
                            })();

                        activeLoad = load;

                        return load;
                    },

                refreshReminders:
                    async () => {
                        await get().loadReminders(
                            true,
                        );
                    },

                addMedication: (
                    input,
                ) =>
                    addSingleReminder(
                        input,
                    ),

                addMedicationBatch:
                    async (
                        inputs,
                    ) =>
                        runMutation(
                            async () => {
                                if (
                                    inputs.length ===
                                    0
                                ) {
                                    throw new Error(
                                        'Add at least one medication before saving.',
                                    );
                                }

                                const deviceUser =
                                    await requireDeviceUser();

                                const reminderIds =
                                    await createReminders(
                                        inputs.map(
                                            (
                                                input,
                                            ) =>
                                                attachOwnerUserId(
                                                    input,
                                                    deviceUser.userId,
                                                ),
                                        ),
                                    );

                                await get().loadReminders(
                                    true,
                                );

                                return reminderIds;
                            },
                        ),

                addAppointment: (
                    input,
                ) =>
                    addSingleReminder(
                        input,
                    ),

                addLabTest: (
                    input,
                ) =>
                    addSingleReminder(
                        input,
                    ),

                updateReminder:
                    async (
                        input,
                    ) =>
                        runMutation(
                            async () => {
                                await updateReminderInDatabase(
                                    input,
                                );

                                await get().loadReminders(
                                    true,
                                );
                            },
                        ),

                toggleReminder:
                    async (
                        reminderId,
                        isEnabled,
                    ) => {
                        const previousReminders =
                            get().reminders;

                        set({
                            reminders:
                                previousReminders.map(
                                    (
                                        reminder,
                                    ) =>
                                        reminder.reminderId ===
                                            reminderId
                                            ? {
                                                ...reminder,
                                                isEnabled,
                                            }
                                            : reminder,
                                ),
                            error: null,
                        });

                        try {
                            await setReminderEnabled(
                                reminderId,
                                isEnabled,
                            );
                        } catch (error) {
                            const message =
                                getErrorMessage(
                                    error,
                                    'The reminder could not be updated.',
                                );

                            set({
                                reminders:
                                    previousReminders,
                                error: message,
                            });

                            throw new Error(
                                message,
                            );
                        }
                    },

                deleteReminder:
                    async (
                        reminderId,
                    ) => {
                        const previousReminders =
                            get().reminders;

                        set({
                            reminders:
                                previousReminders.filter(
                                    (
                                        reminder,
                                    ) =>
                                        reminder.reminderId !==
                                        reminderId,
                                ),
                            error: null,
                        });

                        try {
                            await deleteReminderFromDatabase(
                                reminderId,
                            );
                        } catch (error) {
                            const message =
                                getErrorMessage(
                                    error,
                                    'The reminder could not be deleted.',
                                );

                            set({
                                reminders:
                                    previousReminders,
                                error: message,
                            });

                            throw new Error(
                                message,
                            );
                        }
                    },

                clearError: () => {
                    set({
                        error: null,
                    });
                },

                resetReminders:
                    () => {
                        loadGeneration +=
                            1;

                        activeLoad = null;

                        set({
                            reminders: [],
                            currentDeviceUser:
                                null,
                            status: 'idle',
                            error: null,
                            isMutating:
                                false,
                        });
                    },
            };
        },
    );
