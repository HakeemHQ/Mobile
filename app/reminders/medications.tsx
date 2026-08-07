import {
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
    MedicationSummaryCard,
} from '@/components/reminders/MedicationSummaryCard';

import {
    ReminderScreenHeader,
} from '@/components/reminders/ReminderScreenHeader';

import {
    colors,
} from '@/lib/theme/colors';

import {
    formatDateForDisplay,
    formatMedicationFrequencySummary,
    parseDatabaseDate,
} from '@/lib/reminder-utils';

import {
    useMedicationDraftStore,
} from '@/store/useMedicationDraftStore';
import { Button } from '@/components/ui/Button';

const medicationAccents = [
    'primary',
    'secondary',
    'tertiary',
] as const;

export default function MedicationReviewScreen() {
    const router =
        useRouter();

    const drafts =
        useMedicationDraftStore(
            (state) =>
                state.drafts,
        );

    const openAddMedication =
        () => {
            router.push({
                pathname:
                    '/reminders/add',
                params: {
                    batch: '1',
                    type: 'MEDICATION',
                },
            });
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
                    title="Review Medications"
                    onBack={() =>
                        router.back()
                    }
                />

                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{
                        paddingHorizontal:
                            20,
                        paddingBottom:
                            28,
                    }}
                    showsVerticalScrollIndicator={
                        false
                    }
                >
                    <Text className="mb-5 font-jakarta-bold text-[19px] text-text2-300">
                        Your Medications
                    </Text>

                    {drafts.length >
                        0 ? (
                        drafts.map(
                            (
                                draft,
                                index,
                            ) => {
                                const startDate =
                                    parseDatabaseDate(
                                        draft.startDate,
                                    );

                                return (
                                    <MedicationSummaryCard
                                        key={
                                            draft.draftId
                                        }
                                        title={
                                            draft.title
                                        }
                                        frequencySummary={formatMedicationFrequencySummary(
                                            draft,
                                        )}
                                        startDateLabel={
                                            startDate
                                                ? formatDateForDisplay(
                                                    startDate,
                                                )
                                                : undefined
                                        }
                                        accent={
                                            medicationAccents[
                                                index % medicationAccents.length
                                            ]

                                        }
                                        onPress={() =>
                                            router.push(
                                                {
                                                    pathname:
                                                        '/reminders/add',
                                                    params: {
                                                        batch: '1',
                                                        draftId:
                                                            draft.draftId,
                                                    },
                                                },
                                            )
                                        }
                                    />
                                );
                            },
                        )
                    ) : (
                        <View
                            className="mb-5 rounded-2xl border bg-surface p-5"
                            style={{
                                borderColor:
                                    colors.text2[50],
                            }}
                        >
                            <Text className="font-jakarta-semibold text-[14px] text-text-900">
                                No medications added yet
                            </Text>

                            <Text className="mt-1 font-inter-regular text-[12px] leading-5 text-text2-400">
                                Add a medication, then return here to continue.
                            </Text>
                        </View>
                    )}

                    <Button
                        title="Add Another Medication"
                        variant="outline"
                        className="h-14"
                        onPress={
                            openAddMedication
                        }
                    />
                </ScrollView>

                <View className="px-5 pb-1 pt-2">
                    <Button
                        title="Continue"
                        variant="primary"
                        className="h-14"
                        disabled={
                            drafts.length === 0
                        }
                        onPress={() =>
                            router.push(
                                '/reminders/schedule',
                            )
                        }
                    />
                </View>
            </SafeAreaView>
        </>
    );
}
