import { create } from 'zustand';

import type {
    CreateMedicationReminderFormInput,
    MedicationDraft,
    MedicationDraftInput,
    ReminderDeliveryMode,
    ReminderScheduleInput,
    SavedMedicationSummary,
} from '@/types/reminder';

import {
    createMedicationDoseTimes,
    createMedicationTriggerAtUtc,
} from '@/lib/reminder-utils';

interface MedicationDraftStore {
    drafts: MedicationDraft[];
    lastSavedSummary:
    SavedMedicationSummary[];
    addDraft: (
        input: MedicationDraftInput,
    ) => string;
    updateDraft: (
        draftId: string,
        input: MedicationDraftInput,
    ) => void;
    removeDraft: (
        draftId: string,
    ) => void;
    setScheduleTime: (
        draftId: string,
        doseSequence: number,
        localTime: string,
    ) => void;
    setScheduleDeliveryMode: (
        draftId: string,
        doseSequence: number,
        deliveryMode:
            ReminderDeliveryMode,
    ) => void;
    buildCreateInputs: () =>
        CreateMedicationReminderFormInput[];
    completeBatch: () => void;
    clearDrafts: () => void;
    clearLastSavedSummary: () => void;
    resetWorkflow: () => void;
}

function createLocalId(): string {
    return [
        Date.now().toString(36),
        Math.random()
            .toString(36)
            .slice(2, 10),
    ].join('-');
}

function getRequiredScheduleCount(
    input: MedicationDraftInput,
): number {
    return input.frequencyType ===
        'DAILY'
        ? input.timesPerDay
        : 1;
}

function createDefaultSchedules(
    input: MedicationDraftInput,
): ReminderScheduleInput[] {
    const count =
        getRequiredScheduleCount(
            input,
        );

    const defaultTimes =
        createMedicationDoseTimes(
            input.firstDoseTime,
            count,
        );

    return Array.from(
        {
            length: count,
        },
        (_, index) => ({
            doseSequence:
                index + 1,
            localTime:
                defaultTimes[index] ??
                input.firstDoseTime,
            triggerAtUtc: null,
            deliveryMode:
                'NOTIFICATION',
        }),
    );
}

function reconcileSchedules(
    input: MedicationDraftInput,
    existingDraft:
        MedicationDraft,
): ReminderScheduleInput[] {
    const defaults =
        createDefaultSchedules(
            input,
        );

    const scheduleDefinitionChanged =
        input.firstDoseTime !==
        existingDraft.firstDoseTime ||
        input.timesPerDay !==
        existingDraft.timesPerDay ||
        input.frequencyType !==
        existingDraft.frequencyType;

    return defaults.map(
        (defaultSchedule, index) => {
            const existing =
                existingDraft.schedules[index];

            return {
                doseSequence:
                    index + 1,
                localTime:
                    scheduleDefinitionChanged
                        ? defaultSchedule.localTime
                        : existing?.localTime ?? defaultSchedule.localTime,
                triggerAtUtc: null,
                deliveryMode:
                    existing?.deliveryMode ??
                    'NOTIFICATION',
            };
        },
    );
}

function updateSchedule(
    drafts: MedicationDraft[],
    draftId: string,
    doseSequence: number,
    update: (
        schedule:
            ReminderScheduleInput,
    ) => ReminderScheduleInput,
): MedicationDraft[] {
    return drafts.map((draft) => {
        if (
            draft.draftId !== draftId
        ) {
            return draft;
        }

        return {
            ...draft,
            schedules:
                draft.schedules.map(
                    (schedule) =>
                        schedule.doseSequence ===
                            doseSequence
                            ? update(
                                schedule,
                            )
                            : schedule,
                ),
        };
    });
}

export const useMedicationDraftStore =
    create<MedicationDraftStore>(
        (set, get) => ({
            drafts: [],
            lastSavedSummary: [],

            addDraft: (input) => {
                const draftId =
                    createLocalId();

                const draft: MedicationDraft =
                {
                    ...input,
                    draftId,
                    createdAt:
                        new Date().toISOString(),
                    schedules:
                        createDefaultSchedules(
                            input,
                        ),
                };

                set((state) => ({
                    drafts: [
                        ...state.drafts,
                        draft,
                    ],
                    lastSavedSummary: [],
                }));

                return draftId;
            },

            updateDraft: (
                draftId,
                input,
            ) => {
                set((state) => ({
                    drafts:
                        state.drafts.map(
                            (draft) =>
                                draft.draftId ===
                                    draftId
                                    ? {
                                        ...draft,
                                        ...input,
                                        schedules:
                                            reconcileSchedules(
                                                input,
                                                draft,
                                            ),
                                    }
                                    : draft,
                        ),
                }));
            },

            removeDraft: (
                draftId,
            ) => {
                set((state) => ({
                    drafts:
                        state.drafts.filter(
                            (draft) =>
                                draft.draftId !==
                                draftId,
                        ),
                }));
            },

            setScheduleTime: (
                draftId,
                doseSequence,
                localTime,
            ) => {
                set((state) => ({
                    drafts:
                        updateSchedule(
                            state.drafts,
                            draftId,
                            doseSequence,
                            (schedule) => ({
                                ...schedule,
                                localTime,
                            }),
                        ),
                }));
            },

            setScheduleDeliveryMode:
                (
                    draftId,
                    doseSequence,
                    deliveryMode,
                ) => {
                    set((state) => ({
                        drafts:
                            updateSchedule(
                                state.drafts,
                                draftId,
                                doseSequence,
                                (
                                    schedule,
                                ) => ({
                                    ...schedule,
                                    deliveryMode,
                                }),
                            ),
                    }));
                },

            buildCreateInputs: () =>
                get().drafts.map(
                    (
                        draft,
                    ): CreateMedicationReminderFormInput => ({
                        reminderType:
                            'MEDICATION',
                        title:
                            draft.title,
                        dosage:
                            draft.dosage,
                        instructions:
                            draft.instructions,
                        durationType:
                            draft.durationType,
                        startDate:
                            draft.startDate,
                        endDate:
                            draft.endDate,
                        frequencyType:
                            draft.frequencyType,
                        weekdays:
                            draft.frequencyType ===
                                'WEEKLY'
                                ? draft.weekdays
                                : [],
                        monthDays:
                            draft.frequencyType ===
                                'MONTHLY'
                                ? draft.monthDays
                                : [],
                        mealRelation:
                            draft.mealRelation,
                        mealName:
                            draft.mealName,
                        schedules:
                            draft.schedules.map(
                                (
                                    schedule,
                                    index,
                                ) => ({
                                    doseSequence:
                                        index +
                                        1,
                                    localTime:
                                        schedule.localTime,
                                    triggerAtUtc:
                                        createMedicationTriggerAtUtc(
                                            draft.startDate,
                                            schedule.localTime,
                                        ),
                                    deliveryMode:
                                        schedule.deliveryMode ??
                                        'NOTIFICATION',
                                }),
                            ),
                    }),
                ),

            completeBatch: () => {
                const summary =
                    get().drafts.map(
                        (draft) => ({
                            draftId:
                                draft.draftId,
                            title:
                                draft.title,
                            scheduleCount:
                                draft.schedules
                                    .length,
                            frequencyType:
                                draft.frequencyType,
                        }),
                    );

                set({
                    drafts: [],
                    lastSavedSummary:
                        summary,
                });
            },

            clearDrafts: () => {
                set({
                    drafts: [],
                });
            },

            clearLastSavedSummary:
                () => {
                    set({
                        lastSavedSummary:
                            [],
                    });
                },

            resetWorkflow: () => {
                set({
                    drafts: [],
                    lastSavedSummary:
                        [],
                });
            },
        }),
    );
