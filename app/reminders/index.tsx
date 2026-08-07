import {
    useEffect,
    useMemo,
} from 'react';

import {
    ActivityIndicator,
    Alert,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from 'react-native';

import {
    Plus,
} from 'lucide-react-native';

import {
    useRouter,
} from 'expo-router';

import {
    SafeAreaView,
} from 'react-native-safe-area-context';

import {
    ArrowLeft02Icon,
} from '@/components/icons/ArrowLeft02Icon';

import {
    ReminderListCard,
} from '@/components/reminders/ReminderListCard';

import {
    selectTodayMedicationReminders,
    selectUpcomingDatedReminders,
} from '@/lib/reminder-selectors';

import {
    colors,
} from '@/lib/theme/colors';

import {
    useReminderStore,
} from '@/store/useReminderStore';

export default function RemindersScreen() {
    const router =
        useRouter();

    const reminders =
        useReminderStore(
            (state) =>
                state.reminders,
        );

    const currentDeviceUser =
        useReminderStore(
            (state) =>
                state.currentDeviceUser,
        );

    const status =
        useReminderStore(
            (state) =>
                state.status,
        );

    const error =
        useReminderStore(
            (state) =>
                state.error,
        );

    const loadReminders =
        useReminderStore(
            (state) =>
                state.loadReminders,
        );

    const refreshReminders =
        useReminderStore(
            (state) =>
                state.refreshReminders,
        );

    const toggleReminder =
        useReminderStore(
            (state) =>
                state.toggleReminder,
        );

    const deleteReminder =
        useReminderStore(
            (state) =>
                state.deleteReminder,
        );

    useEffect(() => {
        void loadReminders();
    }, [loadReminders]);

    const todayReminders =
        useMemo(
            () =>
                selectTodayMedicationReminders(
                    reminders,
                ),
            [reminders],
        );

    const upcomingReminders =
        useMemo(
            () =>
                selectUpcomingDatedReminders(
                    reminders,
                ),
            [reminders],
        );

    const handleDelete = (
        reminderId: string,
        title: string,
    ) => {
        Alert.alert(
            'Delete reminder?',
            `This will remove “${title}” from this device.`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        void deleteReminder(
                            reminderId,
                        ).catch(
                            (
                                deleteError:
                                    unknown,
                            ) => {
                                const message =
                                    deleteError instanceof
                                        Error
                                        ? deleteError.message
                                        : 'The reminder could not be deleted.';

                                Alert.alert(
                                    'Unable to delete reminder',
                                    message,
                                );
                            },
                        );
                    },
                },
            ],
        );
    };

    return (
        <>
            <SafeAreaView
                className="flex-1 bg-bg"
                edges={['top']}
            >
                <View className="mb-6 mt-2 flex-row items-center px-6">
                    <Pressable
                        accessibilityLabel="Go back"
                        accessibilityRole="button"
                        className="mr-4 h-10 w-10 items-center justify-center rounded-full border border-bg-600 bg-surface"
                        hitSlop={8}
                        onPress={() =>
                            router.back()
                        }
                        style={({ pressed }: { pressed: boolean }) => ({
                            opacity:
                                pressed
                                    ? 0.7
                                    : 1,
                        })}
                    >
                        <ArrowLeft02Icon
                            size={20}
                            color={
                                colors.text[800]
                            }
                        />
                    </Pressable>

                    <Text className="flex-1 font-jakarta-bold text-[22px] text-primary-900">
                        Reminders
                    </Text>

                    <Pressable
                        accessibilityLabel="Add reminder"
                        accessibilityRole="button"
                        className="h-9 flex-row items-center justify-center rounded-full bg-primary px-3"
                        hitSlop={6}
                        onPress={() =>
                            router.push(
                                '/reminders/add',
                            )
                        }
                        style={({ pressed }: { pressed: boolean }) => ({
                            opacity:
                                pressed
                                    ? 0.75
                                    : 1,
                        })}
                    >
                        <Plus
                            size={17}
                            color={
                                colors.surface.DEFAULT
                            }
                            strokeWidth={2}
                        />

                        <Text className="ml-1 font-jakarta-semibold text-[13px] text-surface">
                            Add
                        </Text>
                    </Pressable>
                </View>

                <ScrollView
                    className="flex-1 px-6"
                    contentContainerStyle={{
                        paddingBottom:
                            36,
                    }}
                    showsVerticalScrollIndicator={
                        false
                    }
                    refreshControl={
                        <RefreshControl
                            refreshing={
                                status ===
                                'loading' &&
                                reminders.length >
                                0
                            }
                            onRefresh={() => {
                                void refreshReminders();
                            }}
                            tintColor={
                                colors.primary.DEFAULT
                            }
                            colors={[
                                colors.primary.DEFAULT,
                            ]}
                        />
                    }
                >
                    {status ===
                        'loading' &&
                        reminders.length ===
                        0 ? (
                        <View className="items-center py-20">
                            <ActivityIndicator
                                size="small"
                                color={
                                    colors.primary.DEFAULT
                                }
                            />
                        </View>
                    ) : null}

                    {error ? (
                        <Pressable
                            accessibilityLabel="Retry loading reminders"
                            accessibilityRole="button"
                            className="rounded-2xl border bg-surface p-4"
                            onPress={() => {
                                void refreshReminders();
                            }}
                            style={({ pressed }: { pressed: boolean }) => ({
                                borderColor:
                                    colors.text[900],
                                opacity:
                                    pressed
                                        ? 0.75
                                        : 1,
                            })}
                        >
                            <Text
                                className="font-jakarta-semibold text-[13px]"
                                style={{
                                    color:
                                        colors.text[900],
                                }}
                            >
                                {error}
                            </Text>

                            <Text className="mt-1 font-inter-regular text-[12px] text-text2-500">
                                Tap to try again.
                            </Text>
                        </Pressable>
                    ) : null}

                    {status ===
                        'success' &&
                        !currentDeviceUser ? (
                        <View
                            className="rounded-2xl border bg-surface p-4"
                            style={{
                                borderColor:
                                    colors.text2[100],
                            }}
                        >
                            <Text className="font-jakarta-semibold text-[14px] text-primary-900">
                                No device user is connected yet
                            </Text>

                            <Text className="mt-1 font-inter-regular text-[12px] leading-5 text-text2-500">
                                Save the authenticated user ID and email after login before creating reminders.
                            </Text>
                        </View>
                    ) : null}

                    <Text className="mb-3 mt-5 font-jakarta-semibold text-[13px] text-text2-500">
                        TODAY
                    </Text>

                    {todayReminders.length >
                        0 ? (
                        todayReminders.map(
                            (
                                reminder,
                            ) => (
                                <ReminderListCard
                                    key={
                                        reminder.reminderId
                                    }
                                    reminder={
                                        reminder
                                    }
                                    onToggleMedication={(
                                        isEnabled,
                                    ) => {
                                        void toggleReminder(
                                            reminder.reminderId,
                                            isEnabled,
                                        ).catch(
                                            (
                                                toggleError:
                                                    unknown,
                                            ) => {
                                                const message =
                                                    toggleError instanceof
                                                        Error
                                                        ? toggleError.message
                                                        : 'The reminder could not be updated.';

                                                Alert.alert(
                                                    'Unable to update reminder',
                                                    message,
                                                );
                                            },
                                        );
                                    }}
                                />
                            ),
                        )
                    ) : (
                        <Text className="mb-5 font-inter-regular text-[13px] text-text2-400">
                            No medication reminders are due today.
                        </Text>
                    )}

                    <Text className="mb-3 mt-1 font-jakarta-semibold text-[13px] text-text2-500">
                        UPCOMING
                    </Text>

                    {upcomingReminders.length >
                        0 ? (
                        upcomingReminders.map(
                            (
                                reminder,
                            ) => (
                                <ReminderListCard
                                    key={
                                        reminder.reminderId
                                    }
                                    reminder={
                                        reminder
                                    }
                                    onDelete={() =>
                                        handleDelete(
                                            reminder.reminderId,
                                            reminder.title,
                                        )
                                    }
                                />
                            ),
                        )
                    ) : (
                        <Text className="font-inter-regular text-[13px] text-text2-400">
                            No upcoming appointments or lab tests.
                        </Text>
                    )}
                </ScrollView>
            </SafeAreaView>
        </>
    );
}
