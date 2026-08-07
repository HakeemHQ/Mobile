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
    Pill,
} from 'lucide-react-native';

import {
    SuccessIcon,
} from '@/components/ui/SuccessIcon';

import {
    colors,
} from '@/lib/theme/colors';

import {
    useMedicationDraftStore,
} from '@/store/useMedicationDraftStore';
import { Button } from '@/components/ui/Button';

export default function ReminderSuccessScreen() {
    const router =
        useRouter();

    const summary =
        useMedicationDraftStore(
            (state) =>
                state.lastSavedSummary,
        );

    const clearSummary =
        useMedicationDraftStore(
            (state) =>
                state.clearLastSavedSummary,
        );

    const goToReminderList = () => {
        clearSummary();

        router.replace(
            '/reminders',
        );
    };

    const addAnotherReminder =
        () => {
            clearSummary();

            router.replace(
                '/reminders/add',
            );
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
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{
                        alignItems:
                            'center',
                        paddingHorizontal:
                            28,
                        paddingTop: 70,
                        paddingBottom:
                            32,
                    }}
                    showsVerticalScrollIndicator={
                        false
                    }
                >
                    <SuccessIcon />

                    <Text className="mt-9 font-jakarta-bold text-[30px] text-text-900">
                        All Set!
                    </Text>

                    <Text className="mt-4 text-center font-inter-semibold text-[16px] leading-6 text-text2-400">
                        Your reminders have been saved successfully
                    </Text>

                    <View
                        className="mt-7 w-full rounded-2xl border bg-surface px-5 py-5"
                        style={{
                            borderColor:
                                colors.text2[100],
                        }}
                    >
                        <Text className="font-jakarta-semibold text-[15px] text-text2-400">
                            {summary.length}{' '}
                            {summary.length ===
                                1
                                ? 'Medication'
                                : 'Medications'}{' '}
                            Added
                        </Text>

                        <View className="mt-3">
                            {summary.map(
                                (
                                    item,
                                    index,
                                ) => {
                                    const accentPalette =
                                        index %
                                            2 ===
                                            1
                                            ? colors.secondary
                                            : colors.primary;

                                    return (
                                        <View
                                            key={
                                                item.draftId
                                            }
                                            className="mb-3 flex-row items-center"
                                        >
                                            <View
                                                className="h-8 w-8 items-center justify-center rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        accentPalette[50],
                                                }}
                                            >
                                                <Pill
                                                    size={17}
                                                    color={
                                                        accentPalette.DEFAULT
                                                    }
                                                    strokeWidth={2}
                                                />
                                            </View>

                                            <Text
                                                className="ml-3 flex-1 font-jakarta-bold text-[14px] text-text-900"
                                                numberOfLines={1}
                                            >
                                                {
                                                    item.title
                                                }
                                            </Text>

                                            <Text className="font-inter-semibold text-[13px] text-text2-400">
                                                {item.frequencyType ===
                                                    'DAILY'
                                                    ? `${item.scheduleCount} ${item.scheduleCount ===
                                                        1
                                                        ? 'time'
                                                        : 'times'
                                                    } / day`
                                                    : item.frequencyType ===
                                                        'WEEKLY'
                                                        ? `${item.scheduleCount} ${item.scheduleCount ===
                                                            1
                                                            ? 'time'
                                                            : 'times'
                                                        } on selected days`
                                                        : `${item.scheduleCount} ${item.scheduleCount ===
                                                            1
                                                            ? 'time'
                                                            : 'times'
                                                        } on selected dates`}
                                            </Text>
                                        </View>
                                    );
                                },
                            )}
                        </View>
                    </View>
                </ScrollView>

                <View className="gap-3 px-5 pb-2">
                    <Button
                        title="Go to Reminders List"
                        variant="primary"
                        className="h-14"
                        onPress={
                            goToReminderList
                        }
                    />

                    <Button
                        title="Add Another Reminder"
                        variant="outline"
                        className="h-14"
                        onPress={
                            addAnotherReminder
                        }
                    />
                </View>
            </SafeAreaView>
        </>
    );
}
