import {
    useEffect,
    useMemo,
    useState,
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
    useTranslation,
} from 'react-i18next';

import {
    BellRing,
    CalendarDays,
    Pill,
    Plus,
} from 'lucide-react-native';

import { AlarmEngine } from '@/lib/alarm-engine';

import {
    useRouter,
} from 'expo-router';

import {
    SafeAreaView,
} from 'react-native-safe-area-context';

import BackButton from '@/components/ui/BackButton';

import {
    ArrowLeft02Icon,
} from '@/components/icons/ArrowLeft02Icon';

import {
    EmptyRemindersState,
} from '@/components/reminders/EmptyRemindersState';

import {
    SwipeableReminderCard,
} from '@/components/reminders/SwipeableReminderCard';

import {
    DeleteReminderModal,
} from '@/components/reminders/DeleteReminderModal';

import {
    EditReminderModal,
} from '@/components/reminders/EditReminderModal';

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

import type { Reminder } from '@/types/reminder';

export default function RemindersScreen() {
    const router =
        useRouter();

    const { t, i18n } =
        useTranslation('reminders');

    const isRTL =
        i18n.language === 'ar';

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

    const [deletingReminder, setDeletingReminder] = useState<Reminder | null>(null);
    const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

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

    const handleConfirmDelete = async () => {
        if (!deletingReminder) return;
        setIsDeleting(true);

        try {
            await deleteReminder(deletingReminder.reminderId);
            setIsDeleting(false);
            setDeletingReminder(null);
        } catch (deleteError: unknown) {
            setIsDeleting(false);
            const message =
                deleteError instanceof Error
                    ? deleteError.message
                    : 'The reminder could not be deleted.';

            Alert.alert(
                'Unable to delete reminder',
                message,
            );
        }
    };

    return (
        <>
            <SafeAreaView
                className="flex-1 bg-bg"
                edges={['top']}
            >
                <View className={`mb-6 mt-2 flex-row items-center justify-between px-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <View className={`flex-row items-center flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <BackButton />
                        <Text className={`mx-3 font-jakarta-bold text-[21px] text-primary-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t('title')}
                        </Text>
                    </View>

                    {/* <Pressable
                        accessibilityLabel="Test alerts"
                        accessibilityRole="button"
                        className={`h-9 flex-row items-center justify-center rounded-full bg-amber-500/15 border border-amber-500/30 px-3 ${isRTL ? 'ml-2' : 'mr-2'}`}
                        hitSlop={6}
                        onPress={() => {
                            void AlarmEngine.testNotificationAndAlarm();
                            Alert.alert(
                                t('testAlertsTitle'),
                                t('testAlertsMessage')
                            );
                        }}
                        style={({ pressed }: { pressed: boolean }) => ({
                            opacity: pressed ? 0.75 : 1,
                        })}
                    >
                        <BellRing size={15} color="#D97706" />
                        <Text className={`${isRTL ? 'mr-1.5' : 'ml-1.5'} font-jakarta-semibold text-[12px] text-amber-700`}>
                            {t('testAlerts')}
                        </Text>
                    </Pressable> */}

                    <Pressable
                        accessibilityLabel="Add reminder"
                        accessibilityRole="button"
                        className={`h-9 flex-row items-center justify-center rounded-full bg-primary px-3.5 ${isRTL ? 'flex-row-reverse' : ''}`}
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

                        <Text className={`${isRTL ? 'mr-1' : 'ml-1'} font-jakarta-semibold text-[13px] text-surface`}>
                            {t('add')}
                        </Text>
                    </Pressable>
                </View>

                <ScrollView
                    className="flex-1 px-6"
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingBottom: 36,
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
                                {t('noUserConnected')}
                            </Text>

                            <Text className="mt-1 font-inter-regular text-[12px] leading-5 text-text2-500">
                                {t('noUserConnectedDesc')}
                            </Text>
                        </View>
                    ) : null}

                    {reminders.length === 0 && status !== 'loading' ? (
                        <EmptyRemindersState
                            onAddReminder={() =>
                                router.push('/reminders/add')
                            }
                        />
                    ) : (
                        <>
                            <Text className={`mb-3 mt-5 font-jakarta-semibold text-[13px] text-text2-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                                {t('today')}
                            </Text>

                            {todayReminders.length > 0 ? (
                                todayReminders.map(
                                    (reminder) => (
                                        <SwipeableReminderCard
                                            key={reminder.reminderId}
                                            reminder={reminder}
                                            onToggleMedication={(isEnabled) => {
                                                void toggleReminder(
                                                    reminder.reminderId,
                                                    isEnabled,
                                                ).catch((toggleError: unknown) => {
                                                    const message =
                                                        toggleError instanceof Error
                                                            ? toggleError.message
                                                            : 'The reminder could not be updated.';

                                                    Alert.alert(
                                                        'Unable to update reminder',
                                                        message,
                                                    );
                                                });
                                            }}
                                            onPress={() => setEditingReminder(reminder)}
                                            onDelete={() => setDeletingReminder(reminder)}
                                        />
                                    ),
                                )
                            ) : (
                                <View className={`mb-5 flex-row items-center rounded-2xl border border-text2-50 bg-surface px-4 py-3.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <View className="h-9 w-9 items-center justify-center rounded-full bg-primary-50">
                                        <Pill size={18} color={colors.primary.DEFAULT} strokeWidth={2} />
                                    </View>
                                    <View className={`${isRTL ? 'mr-3' : 'ml-3'} flex-1`}>
                                        <Text className={`font-jakarta-semibold text-[13px] text-text-800 ${isRTL ? 'text-right' : 'text-left'}`}>
                                            {t('noTodayMedicationsTitle')}
                                        </Text>
                                        <Text className={`mt-0.5 font-inter-regular text-[11px] text-text2-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                                            {t('noTodayMedicationsDesc')}
                                        </Text>
                                    </View>
                                </View>
                            )}

                            <Text className={`mb-3 mt-1 font-jakarta-semibold text-[13px] text-text2-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                                {t('upcoming')}
                            </Text>

                            {upcomingReminders.length > 0 ? (
                                upcomingReminders.map(
                                    (reminder) => (
                                        <SwipeableReminderCard
                                            key={reminder.reminderId}
                                            reminder={reminder}
                                            onPress={() => setEditingReminder(reminder)}
                                            onDelete={() => setDeletingReminder(reminder)}
                                        />
                                    ),
                                )
                            ) : (
                                <View className={`flex-row items-center rounded-2xl border border-text2-50 bg-surface px-4 py-3.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <View className="h-9 w-9 items-center justify-center rounded-full bg-secondary-50">
                                        <CalendarDays size={18} color={colors.secondary.DEFAULT} strokeWidth={2} />
                                    </View>
                                    <View className={`${isRTL ? 'mr-3' : 'ml-3'} flex-1`}>
                                        <Text className={`font-jakarta-semibold text-[13px] text-text-800 ${isRTL ? 'text-right' : 'text-left'}`}>
                                            {t('noUpcomingTitle')}
                                        </Text>
                                        <Text className={`mt-0.5 font-inter-regular text-[11px] text-text2-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                                            {t('noUpcomingDesc')}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </>
                    )}
                </ScrollView>
            </SafeAreaView>

            {/* Delete Confirmation Popup Modal */}
            <DeleteReminderModal
                visible={Boolean(deletingReminder)}
                reminderTitle={deletingReminder?.title}
                isDeleting={isDeleting}
                onClose={() => setDeletingReminder(null)}
                onConfirm={handleConfirmDelete}
            />

            {/* Edit Reminder Modal */}
            <EditReminderModal
                visible={Boolean(editingReminder)}
                reminder={editingReminder}
                onClose={() => setEditingReminder(null)}
                onSaved={() => {
                    void refreshReminders();
                }}
            />
        </>
    );
}

