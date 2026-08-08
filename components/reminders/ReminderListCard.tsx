import {
    Pressable,
    Switch,
    Text,
    View,
} from 'react-native';

import {
    CalendarDays,
    FlaskConical,
    Pill,
} from 'lucide-react-native';

import { HugeiconsIcon } from '@hugeicons/react-native';
import { Delete02Icon } from '@hugeicons/core-free-icons';

import {
    colors,
} from '@/lib/theme';

import {
    formatLocalTime,
    formatReminderDate,
} from '@/lib/reminder-utils';

import { useTranslation } from 'react-i18next';

import type {
    MedicationReminder,
    Reminder,
} from '@/types/reminder';

interface ReminderListCardProps {
    reminder: Reminder;
    onToggleMedication?: (
        isEnabled: boolean,
    ) => void;
    onDelete?: () => void;
    onPress?: () => void;
    isSwipeable?: boolean;
}

const reminderCardThemes = {
    MEDICATION: {
        accentColor:
            colors.primary.DEFAULT,
        softBackgroundColor:
            colors.primary[50],
        badgeBackgroundColor:
            colors.primary[100],
        borderColor:
            colors.primary[50],
    },
    APPOINTMENT: {
        accentColor:
            colors.secondary.DEFAULT,
        softBackgroundColor:
            colors.secondary[50],
        badgeBackgroundColor:
            colors.secondary[100],
        borderColor:
            colors.secondary[50],
    },
    LAB_TEST: {
        accentColor:
            colors.tertiary.DEFAULT,
        softBackgroundColor:
            colors.tertiary[50],
        badgeBackgroundColor:
            colors.tertiary[100],
        borderColor:
            colors.tertiary[50],
    },
};

function getFirstTime(
    reminder: Reminder,
): string {
    return formatLocalTime(
        reminder.schedules[0]
            ?.localTime,
    );
}

function getMedicationDetailText(
    reminder: MedicationReminder,
    t?: (key: string) => string,
): string {
    const instructions =
        reminder.instructions?.trim();

    let mealTiming: string | null = null;
    if (reminder.mealRelation && reminder.mealName) {
        const relation = reminder.mealRelation === 'BEFORE'
            ? (t ? t('before') : 'Before')
            : (t ? t('after') : 'After');
        const mealKey = reminder.mealName.toLowerCase();
        const meal = (t ? t(mealKey) : null) || reminder.mealName;
        mealTiming = `${relation} ${meal}`;
    }

    return [
        reminder.dosage,
        instructions ||
        mealTiming,
    ]
        .filter(Boolean)
        .join(' – ');
}

export function ReminderListCard({
    reminder,
    onToggleMedication,
    onDelete,
    onPress,
    isSwipeable = false,
}: ReminderListCardProps) {
    const { t, i18n } = useTranslation('reminders');
    const isRTL = i18n.language === 'ar';

    const isMedication =
        reminder.reminderType ===
        'MEDICATION';

    const isAppointment =
        reminder.reminderType ===
        'APPOINTMENT';

    const reminderCardTheme =
        reminderCardThemes[reminder.reminderType];

    const Icon = isMedication
        ? Pill
        : isAppointment
            ? CalendarDays
            : FlaskConical;

    const detailText =
        isMedication
            ? getMedicationDetailText(
                reminder,
                t,
            )
            : isAppointment
                ? reminder.providerName ??
                (t ? t('enterProviderOptional') : 'No provider added')
                : reminder.labName ??
                (t ? t('enterLabOptional') : 'No laboratory added');

    const reminderDate =
        isAppointment
            ? formatReminderDate(
                reminder.appointmentDate,
                i18n.language,
            )
            : reminder.reminderType ===
                'LAB_TEST'
                ? formatReminderDate(
                    reminder.dueDate,
                    i18n.language,
                )
                : null;

    const contentOpacity =
        isMedication &&
            !reminder.isEnabled
            ? 0.48
            : 1;

    const schedulesCount = reminder.schedules?.length || 0;

    return (
        <Pressable
            onPress={onPress}
            disabled={!onPress}
            className={`min-h-[98px] flex-row items-center rounded-2xl border bg-surface px-3 py-3 ${
                isRTL ? 'flex-row-reverse' : ''
            } ${
                isSwipeable ? '' : 'mb-4'
            }`}
            style={{
                borderColor:
                    reminderCardTheme.borderColor,
            }}
        >
            <View
                style={{
                    opacity:
                        contentOpacity,
                }}
            >
                <View
                    className="h-11 w-11 items-center justify-center rounded-full"
                    style={{
                        backgroundColor:
                            reminderCardTheme.softBackgroundColor,
                    }}
                >
                    <Icon
                        size={22}
                        color={
                            reminderCardTheme.accentColor
                        }
                        strokeWidth={2}
                    />
                </View>
            </View>

            <View
                className={`${isRTL ? 'mr-3' : 'ml-3'} flex-1`}
                style={{
                    opacity:
                        contentOpacity,
                }}
            >
                <Text
                    numberOfLines={1}
                    className={`font-jakarta-bold text-[14px] text-text-900 ${isRTL ? 'text-right' : 'text-left'}`}
                >
                    {reminder.title}
                </Text>

                <Text
                    numberOfLines={1}
                    className={`mt-0.5 font-inter-regular text-[12px] text-text2-400 ${isRTL ? 'text-right' : 'text-left'}`}
                >
                    {detailText ||
                        'No details added'}
                </Text>

                <View className={`mt-2 flex-row flex-wrap items-center gap-1.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {reminder.schedules?.slice(0, 3).map((schedule, index) => (
                        <View
                            key={`sched-${index}`}
                            className="rounded-lg px-2 py-0.5"
                            style={{
                                backgroundColor:
                                    reminderCardTheme.badgeBackgroundColor,
                            }}
                        >
                            <Text
                                className="font-jakarta-semibold text-[11px]"
                                style={{
                                    color:
                                        reminderCardTheme.accentColor,
                                }}
                            >
                                {formatLocalTime(
                                    schedule.localTime,
                                    i18n.language,
                                )}
                            </Text>
                        </View>
                    ))}

                    {schedulesCount > 3 ? (
                        <View
                            className="rounded-lg px-1.5 py-0.5 border"
                            style={{
                                backgroundColor:
                                    reminderCardTheme.softBackgroundColor,
                                borderColor:
                                    reminderCardTheme.accentColor,
                            }}
                        >
                            <Text
                                className="font-jakarta-bold text-[10px]"
                                style={{
                                    color:
                                        reminderCardTheme.accentColor,
                                }}
                            >
                                +{schedulesCount - 3}
                            </Text>
                        </View>
                    ) : null}

                    {reminderDate ? (
                        <View
                            className={`flex-row items-center rounded-full border px-2.5 py-0.5 ${
                                isRTL ? 'flex-row-reverse' : ''
                            }`}
                            style={{
                                backgroundColor: isAppointment
                                    ? colors.secondary[50]
                                    : colors.tertiary[50],
                                borderColor: isAppointment
                                    ? colors.secondary[100]
                                    : colors.tertiary[100],
                            }}
                        >
                            <CalendarDays
                                size={12}
                                color={
                                    isAppointment
                                        ? colors.secondary.DEFAULT
                                        : colors.tertiary.DEFAULT
                                }
                                strokeWidth={2.2}
                                style={{
                                    [isRTL ? 'marginLeft' : 'marginRight']: 4,
                                }}
                            />
                            <Text
                                className="font-jakarta-semibold text-[11px]"
                                style={{
                                    color: isAppointment
                                        ? colors.secondary.DEFAULT
                                        : colors.tertiary.DEFAULT,
                                }}
                            >
                                {reminderDate}
                            </Text>
                        </View>
                    ) : null}
                </View>
            </View>

            {isMedication &&
                onToggleMedication ? (
                <Switch
                    value={
                        reminder.isEnabled
                    }
                    onValueChange={
                        onToggleMedication
                    }
                    trackColor={{
                        false:
                            colors.text2[100],
                        true:
                            reminderCardTheme.accentColor,
                    }}
                    thumbColor={
                        colors.surface.DEFAULT
                    }
                    ios_backgroundColor={
                        colors.text2[100]
                    }
                    style={{
                        transform: [
                            {
                                scaleX: 0.82,
                            },
                            {
                                scaleY: 0.82,
                            },
                        ],
                    }}
                    accessibilityLabel={`${reminder.title} reminder`}
                />
            ) : onDelete && !isSwipeable ? (
                <Pressable
                    onPress={onDelete}
                    accessibilityRole="button"
                    accessibilityLabel={`Delete ${reminder.title}`}
                    className="h-11 w-11 items-center justify-center rounded-full active:opacity-70"
                    style={{
                        backgroundColor:
                            colors.danger[50],
                    }}
                >
                    <HugeiconsIcon
                        icon={Delete02Icon}
                        size={20}
                        color={
                            colors.danger[700]
                        }
                    />
                </Pressable>
            ) : null}
        </Pressable>
    );
}

