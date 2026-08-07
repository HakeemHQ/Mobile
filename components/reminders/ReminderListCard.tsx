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
    Trash2,
} from 'lucide-react-native';

import {
    colors,
} from '@/lib/theme';

import {
    formatLocalTime,
    formatReminderDate,
} from '@/lib/reminder-utils';

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
): string {
    const instructions =
        reminder.instructions?.trim();

    const mealTiming =
        reminder.mealRelation &&
            reminder.mealName
            ? `${reminder.mealRelation ===
                'BEFORE'
                ? 'Before'
                : 'After'
            } ${reminder.mealName}`
            : null;

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
}: ReminderListCardProps) {
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
            )
            : isAppointment
                ? reminder.providerName ??
                'No provider added'
                : reminder.labName ??
                'No laboratory added';

    const reminderDate =
        isAppointment
            ? formatReminderDate(
                reminder.appointmentDate,
            )
            : reminder.reminderType ===
                'LAB_TEST'
                ? formatReminderDate(
                    reminder.dueDate,
                )
                : null;

    const contentOpacity =
        isMedication &&
            !reminder.isEnabled
            ? 0.48
            : 1;

    return (
        <View
            className="mb-4 min-h-[98px] flex-row items-center rounded-2xl border bg-surface px-3 py-3"
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
                className="ml-3 flex-1"
                style={{
                    opacity:
                        contentOpacity,
                }}
            >
                <Text
                    numberOfLines={1}
                    className="font-jakarta-bold text-[14px] text-text-900"
                >
                    {reminder.title}
                </Text>

                <Text
                    numberOfLines={1}
                    className="mt-0.5 font-inter-regular text-[12px] text-text2-400"
                >
                    {detailText ||
                        'No details added'}
                </Text>

                <View className="mt-2 flex-row items-center">
                    <View
                        className="rounded-lg px-2 py-1"
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
                            {getFirstTime(
                                reminder,
                            )}
                        </Text>
                    </View>

                    {reminderDate ? (
                        <Text className="ml-3 font-inter-regular text-[11px] text-text2-300">
                            {
                                reminderDate
                            }
                        </Text>
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
            ) : onDelete ? (
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
                    <Trash2
                        size={21}
                        color={
                            colors.danger[700]
                        }
                        strokeWidth={2}
                    />
                </Pressable>
            ) : null}
        </View>
    );
}
