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
    CalendarDays,
    ChevronRight,
    Info,
} from 'lucide-react-native';

import {
    ReminderSegmentedControl,
    type ReminderSegmentOption,
} from '@/components/reminders/ReminderSegmentedControl';

import {
    colors,
} from '@/lib/theme/colors';

import {
    formatDateForDisplay,
} from '@/lib/reminder-utils';

import type {
    MedicationDurationType,
} from '@/types/reminder';

type PickerTarget =
    | 'startDate'
    | 'endDate';

interface MedicationDurationSectionProps {
    durationType:
    MedicationDurationType;
    startDate: Date;
    endDate: Date;
    onDurationTypeChange: (
        value:
            MedicationDurationType,
    ) => void;
    onStartDateChange: (
        value: Date,
    ) => void;
    onEndDateChange: (
        value: Date,
    ) => void;
}

const durationOptions: readonly ReminderSegmentOption<MedicationDurationType>[] =
    [
        {
            label: 'Lifelong',
            value: 'LIFELONG',
        },
        {
            label: 'Set Duration',
            value: 'FINITE',
        },
    ];

function CompactDateField({
    label,
    value,
    onPress,
}: {
    label: string;
    value: string;
    onPress: () => void;
}) {
    return (
        <View className="flex-1">
            <Text className="mb-2 font-jakarta-semibold text-[12px] text-text2-500">
                {label}
            </Text>

            <Pressable
                accessibilityLabel={`${label}: ${value}`}
                accessibilityRole="button"
                className="h-12 flex-row items-center rounded-xl border bg-surface px-3"
                onPress={onPress}
                style={({ pressed }: { pressed: boolean }) => ({
                    borderColor:
                        colors.text2[100],
                    opacity:
                        pressed
                            ? 0.78
                            : 1,
                })}
            >
                <CalendarDays
                    size={20}
                    color={
                        colors.text2[400]
                    }
                    strokeWidth={2}
                />

                <Text
                    className="ml-2 flex-1 font-jakarta-semibold text-[13px] text-text2-500"
                    numberOfLines={1}
                >
                    {value}
                </Text>

                <ChevronRight
                    size={19}
                    color={
                        colors.text2[400]
                    }
                    strokeWidth={2}
                />
            </Pressable>
        </View>
    );
}

export function MedicationDurationSection({
    durationType,
    startDate,
    endDate,
    onDurationTypeChange,
    onStartDateChange,
    onEndDateChange,
}: MedicationDurationSectionProps) {
    const [
        pickerTarget,
        setPickerTarget,
    ] =
        useState<PickerTarget | null>(
            null,
        );

    const pickerValue =
        pickerTarget ===
            'endDate'
            ? endDate
            : startDate;

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
            setPickerTarget(null);
        }

        if (
            !pickerTarget ||
            !selectedValue ||
            wasDismissed
        ) {
            return;
        }

        if (
            pickerTarget ===
            'startDate'
        ) {
            onStartDateChange(
                selectedValue,
            );
        } else {
            onEndDateChange(
                selectedValue,
            );
        }

        if (
            Platform.OS === 'ios'
        ) {
            setPickerTarget(null);
        }
    };

    return (
        <View className="mb-5">
            <View className="mb-2 flex-row items-center">
                <Text className="font-jakarta-semibold text-[13px] text-text2-500">
                    Treatment Duration
                </Text>
            </View>

            <ReminderSegmentedControl
                accessibilityLabel="Treatment duration"
                options={
                    durationOptions
                }
                value={durationType}
                onChange={
                    onDurationTypeChange
                }
            />

            <View
                className="mt-3 flex-row gap-3 rounded-2xl border bg-surface p-3"
                style={{
                    borderColor:
                        colors.text2[50],
                }}
            >
                <CompactDateField
                    label="Start Date"
                    value={formatDateForDisplay(
                        startDate,
                    )}
                    onPress={() =>
                        setPickerTarget(
                            'startDate',
                        )
                    }
                />

                {durationType ===
                    'FINITE' ? (
                    <CompactDateField
                        label="End Date"
                        value={formatDateForDisplay(
                            endDate,
                        )}
                        onPress={() =>
                            setPickerTarget(
                                'endDate',
                            )
                        }
                    />
                ) : null}
            </View>

            {pickerTarget ? (
                <DateTimePicker
                    value={
                        pickerValue
                    }
                    mode="date"
                    display="default"
                    minimumDate={
                        pickerTarget ===
                            'startDate'
                            ? new Date()
                            : startDate
                    }
                    onChange={
                        handlePickerChange
                    }
                />
            ) : null}
        </View>
    );
}
