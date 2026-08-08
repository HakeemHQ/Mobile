import {
    useState,
} from 'react';

import {
    Platform,
    Pressable,
    Text,
    View,
} from 'react-native';

import {
    useTranslation,
} from 'react-i18next';

import DateTimePicker, {
    type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import {
    AlarmClock,
    Bell,
    ChevronDown,
    ChevronLeft,
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
    const { t, i18n } = useTranslation('reminders');
    const isRTL = (i18n.language || '').startsWith('ar');
    const isNotification =
        mode === 'NOTIFICATION';

    const Icon =
        isNotification
            ? Bell
            : AlarmClock;

    const label =
        isNotification
            ? t('notifications')
            : t('alarm');

    const activeColor =
        isNotification
            ? colors.primary[500]
            : colors.text2[400];

    const containerClassName =
        selected
            ? isNotification
                ? 'border-primary-500 bg-primary-500 flex-1'
                : 'border-text2-400 bg-text2-400 flex-1'
            : 'border-text2-100 bg-surface flex-1';

    const textClassName =
        selected
            ? 'font-jakarta-bold text-[11px] text-surface'
            : isNotification
                ? 'font-jakarta-bold text-[11px] text-primary-500'
                : 'font-jakarta-bold text-[11px] text-text2-400';

    return (
        <Pressable
            accessibilityLabel={`${label} ${selected
                ? 'selected'
                : 'not selected'
                }`}
            accessibilityRole="radio"
            accessibilityState={{
                checked: selected,
            }}
            className={`h-9 flex-row items-center justify-center rounded-xl border px-2.5 ${isRTL ? 'flex-row-reverse' : ''} ${containerClassName}`}
            onPress={onPress}
            style={({
                pressed,
            }: {
                pressed: boolean;
            }) => ({
                opacity:
                    pressed
                        ? 0.8
                        : 1,
            })}
        >
            <Icon
                size={14}
                color={
                    selected
                        ? colors.surface.DEFAULT
                        : activeColor
                }
            />

            <Text
                className={`${isRTL ? 'mr-1.5' : 'ml-1.5'} ${textClassName}`}
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
    const { t, i18n } = useTranslation('reminders');
    const isRTL = (i18n.language || '').startsWith('ar');
    const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

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
            ? `${t('starting')} ${startDateLabel}`
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
                className={`flex-row items-center px-5 py-5 ${isRTL ? 'flex-row-reverse' : ''}`}
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

                <View className={`${isRTL ? 'mr-4 text-right' : 'ml-4 text-left'} flex-1`}>
                    <Text
                        className={`font-jakarta-bold text-[16px] color-primary-900 ${isRTL ? 'text-right' : 'text-left'}`}
                        numberOfLines={1}
                    >
                        {title}
                    </Text>

                    <Text className={`mt-1 font-inter-semibold text-[12px] leading-5 text-text2-400 ${isRTL ? 'text-right' : 'text-left'}`}>
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
                    <ChevronIcon
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
                                <View className={`flex-row items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
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
                                        className={`${isRTL ? 'mr-2' : 'ml-2'} min-w-[82px] px-1 justify-center`}
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
                                            className={`font-jakarta-bold text-[14px] ${isRTL ? 'text-right' : 'text-left'}`}
                                            style={{
                                                color:
                                                    colors.primary[900],
                                            }}
                                            numberOfLines={1}
                                        >
                                            {formatLocalTime(
                                                schedule.localTime,
                                                i18n.language,
                                            )}
                                        </Text>
                                    </Pressable>

                                    <View className={`${isRTL ? 'mr-1 flex-row-reverse' : 'ml-1'} flex-1 flex-row items-center gap-1.5`}>
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