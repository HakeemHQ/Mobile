import {
    Text,
    View,
} from 'react-native';

import {
    MonthlyScheduleSelector,
} from '@/components/reminders/MonthlyScheduleSelector';

import {
    ReminderInfoCard,
} from '@/components/reminders/ReminderInfoCard';

import {
    ReminderSegmentedControl,
    type ReminderSegmentOption,
} from '@/components/reminders/ReminderSegmentedControl';

import {
    WeekdayScheduleSelector,
} from '@/components/reminders/WeekdayScheduleSelector';

import {
    colors,
} from '@/lib/theme/colors';

import type {
    MedicationFrequencyType,
    MedicationWeekdayCode,
} from '@/types/reminder';

interface MedicationFrequencySectionProps {
    frequencyType:
    MedicationFrequencyType;
    timesPerDay: number;
    weekdays:
    MedicationWeekdayCode[];
    monthDays: number[];
    scheduleError?: string;
    onFrequencyTypeChange: (
        value:
            MedicationFrequencyType,
    ) => void;
    onTimesPerDayChange: (
        value: number,
    ) => void;
    onToggleWeekday: (
        value:
            MedicationWeekdayCode,
    ) => void;
    onToggleMonthDay: (
        value: number,
    ) => void;
}

const frequencyOptions: readonly ReminderSegmentOption<MedicationFrequencyType>[] =
    [
        {
            label: 'Daily',
            value: 'DAILY',
        },
        {
            label: 'Weekly',
            value: 'WEEKLY',
        },
        {
            label: 'Monthly',
            value: 'MONTHLY',
        },
    ];

const timesPerDayOptions: readonly ReminderSegmentOption<number>[] =
    [
        {
            label: '1',
            value: 1,
        },
        {
            label: '2',
            value: 2,
        },
        {
            label: '3',
            value: 3,
        },
        {
            label: '4',
            value: 4,
        },
    ];

export function MedicationFrequencySection({
    frequencyType,
    timesPerDay,
    weekdays,
    monthDays,
    scheduleError,
    onFrequencyTypeChange,
    onTimesPerDayChange,
    onToggleWeekday,
    onToggleMonthDay,
}: MedicationFrequencySectionProps) {
    return (
        <>
            <View className="mb-5">
                <Text className="mb-2 font-jakarta-semibold text-[13px] text-text2-500">
                    Frequency
                </Text>

                <ReminderSegmentedControl
                    accessibilityLabel="Medication frequency"
                    options={
                        frequencyOptions
                    }
                    value={
                        frequencyType
                    }
                    onChange={
                        onFrequencyTypeChange
                    }
                />
            </View>

            {frequencyType ===
                'DAILY' ? (
                <View className="mb-5">
                    <Text className="mb-2 font-jakarta-semibold text-[13px] text-text2-500">
                        Times Per Day
                    </Text>

                    <ReminderSegmentedControl
                        accessibilityLabel="Times per day"
                        options={
                            timesPerDayOptions
                        }
                        value={
                            timesPerDay
                        }
                        onChange={
                            onTimesPerDayChange
                        }
                        height={44}
                    />

                    <ReminderInfoCard
                        title={`You'll be reminded ${timesPerDay} ${timesPerDay ===
                            1
                            ? 'time'
                            : 'times'
                            } every day`}
                        description="You'll set the exact time and choose notification or alarm on the next step."
                    />
                </View>
            ) : null}

            {frequencyType ===
                'WEEKLY' ? (
                <WeekdayScheduleSelector
                    value={weekdays}
                    onToggle={
                        onToggleWeekday
                    }
                />
            ) : null}

            {frequencyType ===
                'MONTHLY' ? (
                <MonthlyScheduleSelector
                    value={
                        monthDays
                    }
                    onToggle={
                        onToggleMonthDay
                    }
                />
            ) : null}

            {scheduleError ? (
                <Text
                    className="-mt-2 mb-4 font-inter-medium text-[12px]"
                    style={{
                        color:
                            colors.primary[700],
                    }}
                >
                    {scheduleError}
                </Text>
            ) : null}
        </>
    );
}
