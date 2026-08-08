import {
    Text,
    View,
} from 'react-native';

import {
    useTranslation,
} from 'react-i18next';

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
    const { t, i18n } = useTranslation('reminders');
    const isRTL = i18n.language === 'ar';

    const frequencyOptions: readonly ReminderSegmentOption<MedicationFrequencyType>[] = [
        {
            label: t('daily'),
            value: 'DAILY',
        },
        {
            label: t('weekly'),
            value: 'WEEKLY',
        },
        {
            label: t('monthly'),
            value: 'MONTHLY',
        },
    ];

    return (
        <>
            <View className="mb-5">
                <Text className={`mb-2 font-jakarta-semibold text-[13px] text-text2-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('frequency')}
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
                    <Text className={`mb-2 font-jakarta-semibold text-[13px] text-text2-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('timesPerDay')}
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
                        title={t('remindedDaily', { count: timesPerDay })}
                        description={t('remindedDailyDesc')}
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
                    className={`-mt-2 mb-4 font-inter-medium text-[12px] ${isRTL ? 'text-right' : 'text-left'}`}
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
