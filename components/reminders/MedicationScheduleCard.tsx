import {
    useState,
} from 'react';

import {
    Platform,
    Pressable,
    Text,
    View,
} from 'react-native';

import DateTimePicker, {
    type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import {
    AlarmClock,
    Bell,
    ChevronDown,
    ChevronRight,
    Pill,
} from 'lucide-react-native';

import {
    colors,
} from '@/lib/theme/colors';

import {
    formatLocalTime,
    formatLocalTimeValue,
    localTimeToDate,
} from '@/lib/reminder-utils';

import type {
    ReminderDeliveryMode,
} from '@/types/reminder';

export interface MedicationScheduleCardSchedule {
    doseSequence: number;
    localTime: string;
    deliveryMode:
    ReminderDeliveryMode;
}

interface MedicationScheduleCardProps {
    title: string;
    frequencySummary: string;
    startDateLabel?: string;
    schedules:
    MedicationScheduleCardSchedule[];
    accent:
    | 'primary'
    | 'secondary'
    | 'tertiary';
    expanded: boolean;
    onToggleExpanded: () => void;
    onTimeChange?: (
        doseSequence: number,
        localTime: string,
    ) => void;
    onDeliveryModeChange?: (
        doseSequence: number,
        deliveryMode:
            ReminderDeliveryMode,
    ) => void;
}

function DeliveryModeButton({
    mode,
    selected,
    onPress,
}: {
    mode: ReminderDeliveryMode;
    selected: boolean;
    onPress?: () => void;
}) {
    const isNotification =
        mode === 'NOTIFICATION';

    const Icon =
        isNotification
            ? Bell
            : AlarmClock;

    const label =
        isNotification
            ? 'Notifications'
            : 'Alarm';

    const activeColor =
        isNotification
            ? colors.primary[500]
            : colors.text2[400];

    const buttonClassName =
        selected
            ? isNotification
                ? 'h-9 flex-row items-center justify-center rounded-xl border border-primary-500 bg-primary-500 px-2.5'
                : 'h-9 flex-row items-center justify-center rounded-xl border border-text2-400 bg-text2-400 px-2.5'
            : 'h-9 flex-row items-center justify-center rounded-xl border border-text2-100 bg-surface px-2.5';

    const textClassName =
        selected
            ? 'ml-1 font-jakarta-bold text-[11px] text-surface'
            : isNotification
                ? 'ml-1 font-jakarta-bold text-[11px] text-primary-500'
                : 'ml-1 font-jakarta-bold text-[11px] text-text2-400';

    return (
        <Pressable
            accessibilityRole="radio"
            accessibilityState={{
                checked: selected,
            }}
            disabled={!onPress}
            onPress={onPress}
            className={
                buttonClassName
            }
            style={({
                pressed,
            }: {
                pressed: boolean;
            }) => ({
                opacity:
                    pressed
                        ? 0.75
                        : 1,
            })}
        >
            <Icon
                size={16}
                strokeWidth={2}
                color={
                    selected
                        ? colors.surface.DEFAULT
                        : activeColor
                }
            />

            <Text
                className={
                    textClassName
                }
                numberOfLines={1}
            >
                {label}
            </Text>
        </Pressable>
    );
}

export function MedicationScheduleCard({
    title,
    frequencySummary,
    startDateLabel,
    schedules,
    accent,
    expanded,
    onToggleExpanded,
    onTimeChange,
    onDeliveryModeChange,
}: MedicationScheduleCardProps) {
    const [
        editingDoseSequence,
        setEditingDoseSequence,
    ] = useState<number | null>(
        null,
    );

    const accentPalette =
        colors[accent];

    const editingSchedule =
        editingDoseSequence == null
            ? undefined
            : schedules.find(
                (schedule) =>
                    schedule.doseSequence ===
                    editingDoseSequence,
            );

    const subtitle = [
        frequencySummary,
        startDateLabel
            ? `Starting ${startDateLabel}`
            : undefined,
    ]
        .filter(Boolean)
        .join(' ');

    const handlePickerChange = (
        event: DateTimePickerEvent,
        selectedValue?: Date,
    ) => {
        const wasDismissed =
            event.type ===
            'dismissed';

        if (
            Platform.OS ===
            'android' ||
            wasDismissed
        ) {
            setEditingDoseSequence(
                null,
            );
        }

        if (
            !selectedValue ||
            editingDoseSequence ==
            null ||
            wasDismissed
        ) {
            return;
        }

        onTimeChange?.(
            editingDoseSequence,
            formatLocalTimeValue(
                selectedValue,
            ),
        );

        if (
            Platform.OS === 'ios'
        ) {
            setEditingDoseSequence(
                null,
            );
        }
    };

    return (
        <View
            className="mb-4 overflow-hidden rounded-2xl border bg-surface"
            style={{
                borderColor:
                    colors.text2[50],
            }}
        >
            <Pressable
                accessibilityRole="button"
                accessibilityState={{
                    expanded,
                }}
                className="flex-row items-center px-5 py-5"
                onPress={
                    onToggleExpanded
                }
                style={({
                    pressed,
                }: {
                    pressed: boolean;
                }) => ({
                    opacity:
                        pressed
                            ? 0.76
                            : 1,
                })}
            >
                <View
                    className="h-12 w-12 items-center justify-center rounded-full border"
                    style={{
                        backgroundColor:
                            accentPalette[50],
                        borderColor:
                            accentPalette[50],
                    }}
                >
                    <Pill
                        size={28}
                        color={
                            accentPalette
                                .DEFAULT
                        }
                        strokeWidth={2}
                    />
                </View>

                <View className="ml-4 flex-1">
                    <Text
                        className="font-jakarta-bold text-[16px] color-primary-900"
                        numberOfLines={1}
                    >
                        {title}
                    </Text>

                    <Text className="mt-1 font-inter-semibold text-[12px] leading-5 text-text2-400">
                        {subtitle}
                    </Text>
                </View>

                {expanded ? (
                    <ChevronDown
                        size={24}
                        color={
                            colors.text[800]
                        }
                        strokeWidth={2}
                    />
                ) : (
                    <ChevronRight
                        size={24}
                        color={
                            colors.text[800]
                        }
                        strokeWidth={2}
                    />
                )}
            </Pressable>

            {expanded ? (
                <View className="px-5 pb-5">
                    {schedules.map(
                        (
                            schedule,
                            index,
                        ) => (
                            <View
                                key={
                                    schedule.doseSequence
                                }
                                className={
                                    index ===
                                        schedules.length - 1
                                        ? ''
                                        : 'mb-3'
                                }
                            >
                                <View className="flex-row items-center">
                                    <View
                                        className="h-7 w-7 items-center justify-center rounded-full"
                                        style={{
                                            backgroundColor:
                                                colors.primary[50],
                                        }}
                                    >
                                        <Text
                                            className="font-jakarta-bold text-[12px]"
                                            style={{
                                                color:
                                                    colors.primary.DEFAULT,
                                            }}
                                        >
                                            {schedule.doseSequence}
                                        </Text>
                                    </View>

                                    <Pressable
                                        accessibilityLabel={`Change dose ${schedule.doseSequence} time`}
                                        accessibilityRole="button"
                                        disabled={
                                            !onTimeChange
                                        }
                                        className="ml-2 w-[76px] justify-center"
                                        onPress={() =>
                                            setEditingDoseSequence(
                                                schedule.doseSequence,
                                            )
                                        }
                                        style={({
                                            pressed,
                                        }: {
                                            pressed: boolean;
                                        }) => ({
                                            opacity:
                                                pressed
                                                    ? 0.7
                                                    : 1,
                                        })}
                                    >
                                        <Text
                                            className="font-jakarta-bold text-[14px]"
                                            style={{
                                                color:
                                                    colors.primary[900],
                                            }}
                                            numberOfLines={1}
                                        >
                                            {formatLocalTime(
                                                schedule.localTime,
                                            )}
                                        </Text>
                                    </Pressable>

                                    <View className="ml-1 flex-1 flex-row items-center gap-1.5">
                                        <DeliveryModeButton
                                            mode="NOTIFICATION"
                                            selected={
                                                schedule.deliveryMode ===
                                                'NOTIFICATION'
                                            }
                                            onPress={
                                                onDeliveryModeChange
                                                    ? () =>
                                                        onDeliveryModeChange(
                                                            schedule.doseSequence,
                                                            'NOTIFICATION',
                                                        )
                                                    : undefined
                                            }
                                        />

                                        <DeliveryModeButton
                                            mode="ALARM"
                                            selected={
                                                schedule.deliveryMode ===
                                                'ALARM'
                                            }
                                            onPress={
                                                onDeliveryModeChange
                                                    ? () =>
                                                        onDeliveryModeChange(
                                                            schedule.doseSequence,
                                                            'ALARM',
                                                        )
                                                    : undefined
                                            }
                                        />
                                    </View>
                                </View>
                            </View>
                        ),
                    )}
                </View>
            ) : null}

            {editingSchedule &&
                onTimeChange ? (
                <DateTimePicker
                    value={localTimeToDate(
                        editingSchedule.localTime,
                    )}
                    mode="time"
                    display="default"
                    onChange={
                        handlePickerChange
                    }
                />
            ) : null}
        </View>
    );
}