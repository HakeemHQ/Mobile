import {
    useState,
} from 'react';

import {
    Alert,
    ScrollView,
    Text,
    View,
} from 'react-native';

import {
    useRouter,
} from 'expo-router';

import {
    SafeAreaView,
} from 'react-native-safe-area-context';

import {
    StatusBar,
} from 'expo-status-bar';

import {
    useTranslation,
} from 'react-i18next';

import {
    Sparkles,
} from 'lucide-react-native';

import {
    MedicationScheduleCard,
} from '@/components/reminders/MedicationScheduleCard';

import {
    ReminderScreenHeader,
} from '@/components/reminders/ReminderScreenHeader';

import {
    Button,
} from '@/components/ui/Button';

import {
    colors,
} from '@/lib/theme/colors';

import {
    formatDateForDisplay,
    formatMedicationFrequencySummary,
    getErrorMessage,
    parseDatabaseDate,
} from '@/lib/reminder-utils';

import {
    useMedicationDraftStore,
} from '@/store/useMedicationDraftStore';

import {
    useReminderStore,
} from '@/store/useReminderStore';

import type {
    ReminderDeliveryMode,
} from '@/types/reminder';

const medicationAccents = [
    'primary',
    'secondary',
    'tertiary',
] as const;

function getStartDateLabel(
    value: string,
    language?: string,
): string | undefined {
    const date =
        parseDatabaseDate(
            value,
        );

    return date
        ? formatDateForDisplay(
            date,
            language,
        )
        : undefined;
}

export default function MedicationScheduleScreen() {
    const router =
        useRouter();

    const { t, i18n } =
        useTranslation(['reminders', 'common']);
    const isRTL =
        (i18n.language || '').startsWith('ar');

    const drafts =
        useMedicationDraftStore(
            (state) =>
                state.drafts,
        );

    const setScheduleTime =
        useMedicationDraftStore(
            (state) =>
                state.setScheduleTime,
        );

    const setScheduleDeliveryMode =
        useMedicationDraftStore(
            (state) =>
                state.setScheduleDeliveryMode,
        );

    const buildCreateInputs =
        useMedicationDraftStore(
            (state) =>
                state.buildCreateInputs,
        );

    const completeBatch =
        useMedicationDraftStore(
            (state) =>
                state.completeBatch,
        );

    const addMedicationBatch =
        useReminderStore(
            (state) =>
                state.addMedicationBatch,
        );

    const isMutating =
        useReminderStore(
            (state) =>
                state.isMutating,
        );

    const [
        expandedDraftIds,
        setExpandedDraftIds,
    ] = useState<Set<string>>(
        () =>
            new Set(
                drafts.map(
                    (draft) =>
                        draft.draftId,
                ),
            ),
    );

    const toggleExpanded = (
        draftId: string,
    ) => {
        setExpandedDraftIds(
            (current) => {
                const next =
                    new Set(
                        current,
                    );

                if (
                    next.has(
                        draftId,
                    )
                ) {
                    next.delete(
                        draftId,
                    );
                } else {
                    next.add(
                        draftId,
                    );
                }

                return next;
            },
        );
    };

    const handleSave =
        async () => {
            if (
                drafts.length ===
                0
            ) {
                Alert.alert(
                    t('noMedications', { defaultValue: 'لا توجد أدوية' }),
                    t('addMedicationBeforeSaving', { defaultValue: 'أضف دواءً واحداً على الأقل قبل الحفظ.' }),
                );

                return;
            }

            try {
                await addMedicationBatch(
                    buildCreateInputs(),
                );

                completeBatch();

                router.replace(
                    '/reminders/success',
                );
            } catch (error) {
                Alert.alert(
                    t('unableToSave', { defaultValue: 'تعذر حفظ التذكيرات' }),
                    getErrorMessage(
                        error,
                    ),
                );
            }
        };

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/reminders/medications');
        }
    };

    return (
        <>
            <StatusBar style="dark" />

            <SafeAreaView
                className="flex-1 bg-bg"
                edges={[
                    'top',
                    'bottom',
                ]}
            >
                <ReminderScreenHeader
                    title={t('setReminderTimes', { defaultValue: 'تحديد أوقات التذكير' })}
                    onBack={handleBack}
                />

                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{
                        paddingHorizontal:
                            20,
                        paddingTop: 8,
                        paddingBottom:
                            24,
                    }}
                    showsVerticalScrollIndicator={
                        false
                    }
                >
                    {drafts.map(
                        (
                            draft,
                            index,
                        ) => (
                            <MedicationScheduleCard
                                key={
                                    draft.draftId
                                }
                                title={
                                    draft.title
                                }
                                frequencySummary={formatMedicationFrequencySummary(
                                    draft,
                                )}
                                startDateLabel={getStartDateLabel(
                                    draft.startDate,
                                    i18n.language,
                                )}
                                schedules={draft.schedules.map(
                                    (
                                        schedule,
                                        scheduleIndex,
                                    ) => ({
                                        doseSequence:
                                            schedule.doseSequence ??
                                            scheduleIndex +
                                            1,
                                        localTime:
                                            schedule.localTime,
                                        deliveryMode:
                                            schedule.deliveryMode ??
                                            'NOTIFICATION',
                                    }),
                                )}
                                accent={
                                    medicationAccents[
                                        index %
                                        medicationAccents.length
                                    ]
                                }
                                expanded={expandedDraftIds.has(
                                    draft.draftId,
                                )}
                                onToggleExpanded={() =>
                                    toggleExpanded(
                                        draft.draftId,
                                    )
                                }
                                onTimeChange={(
                                    doseSequence,
                                    localTime,
                                ) =>
                                    setScheduleTime(
                                        draft.draftId,
                                        doseSequence,
                                        localTime,
                                    )
                                }
                                onDeliveryModeChange={(
                                    doseSequence,
                                    deliveryMode:
                                        ReminderDeliveryMode,
                                ) =>
                                    setScheduleDeliveryMode(
                                        draft.draftId,
                                        doseSequence,
                                        deliveryMode,
                                    )
                                }
                            />
                        ),
                    )}

                    <View
                        className={`mt-3 flex-row items-center rounded-2xl border bg-surface px-4 py-4 ${isRTL ? 'flex-row-reverse' : ''}`}
                        style={{
                            borderColor:
                                colors
                                    .text2[50],
                        }}
                    >
                        <View
                            className="h-9 w-9 items-center justify-center rounded-full"
                            style={{
                                backgroundColor:
                                    colors
                                        .primary[50],
                            }}
                        >
                            <Sparkles
                                size={20}
                                color={
                                    colors
                                        .primary
                                        .DEFAULT
                                }
                                strokeWidth={
                                    2
                                }
                            />
                        </View>

                        <Text className={`${isRTL ? 'mr-3 text-right' : 'ml-3 text-left'} flex-1 font-inter-semibold text-[12px] leading-5 text-text2-400`}>
                            {t('scheduleNote', { defaultValue: 'يمكنك تعديل الأوقات المحفوظة لاحقاً من خلال قائمة التذكيرات.' })}
                        </Text>
                    </View>
                </ScrollView>

                <View className="px-5 pb-1 pt-2">
                    <Button
                        title={
                            isMutating
                                ? t('saving', { defaultValue: 'جاري الحفظ...' })
                                : t('saveAllReminders', { defaultValue: 'حفظ جميع التذكيرات' })
                        }
                        variant="primary"
                        className="h-14"
                        disabled={
                            isMutating ||
                            drafts.length ===
                            0
                        }
                        onPress={() =>
                            void handleSave()
                        }
                    />
                </View>
            </SafeAreaView>
        </>
    );
}