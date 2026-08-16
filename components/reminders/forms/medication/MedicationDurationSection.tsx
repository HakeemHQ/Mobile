import {
    useState,
} from 'react';

import {
    Pressable,
    Text,
    View,
} from 'react-native';

import DateTimePicker, {
    type DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker';

import {
    useTranslation,
} from 'react-i18next';

import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
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

function CompactDateField({
    label,
    value,
    onPress,
}: {
    label: string;
    value: string;
    onPress: () => void;
}) {
    const { i18n } = useTranslation('reminders');
    const isRTL = i18n.language === 'ar';
    const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

    return (
        <View className="flex-1">
            <Text className={`mb-2 font-jakarta-semibold text-[12px] text-text2-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                {label}
            </Text>

            <Pressable
                accessibilityLabel={`${label}: ${value}`}
                accessibilityRole="button"
                className={`h-12 flex-row items-center rounded-xl border bg-surface px-3 ${isRTL ? 'flex-row-reverse' : ''}`}
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
                    className={`${isRTL ? 'mr-2 text-right' : 'ml-2 text-left'} flex-1 font-jakarta-semibold text-[13px] text-text2-500`}
                    numberOfLines={1}
                >
                    {value}
                </Text>

                <ChevronIcon
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
    const { t, i18n } = useTranslation('reminders');
    const isRTL = i18n.language === 'ar';

    const durationOptions: readonly ReminderSegmentOption<MedicationDurationType>[] = [
        {
            label: t('lifelong'),
            value: 'LIFELONG',
        },
        {
            label: t('setDuration'),
            value: 'FINITE',
        },
    ];

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

    const handlePickerValueChange = (
        _event:
            DateTimePickerChangeEvent,
        selectedValue: Date,
    ) => {
        if (!pickerTarget) {
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

        setPickerTarget(null);
    };

    const handlePickerDismiss = () => {
        setPickerTarget(null);
    };

    return (
        <View className="mb-5">
            <View className={`mb-2 flex-row items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Text className={`font-jakarta-semibold text-[13px] text-text2-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('treatmentDuration')}
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
                className={`mt-3 flex-row gap-3 rounded-2xl border bg-surface p-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                style={{
                    borderColor:
                        colors.text2[50],
                }}
            >
                <CompactDateField
                    label={t('startDate')}
                    value={formatDateForDisplay(
                        startDate,
                        i18n.language,
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
                        label={t('endDate')}
                        value={formatDateForDisplay(
                            endDate,
                            i18n.language,
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
                    onValueChange={
                        handlePickerValueChange
                    }
                />
            ) : null}
        </View>
    );
}
