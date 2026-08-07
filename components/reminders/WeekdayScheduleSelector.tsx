import {
    Pressable,
    Text,
    View,
} from 'react-native';

import {
    ReminderInfoCard,
} from '@/components/reminders/ReminderInfoCard';

import { colors } from '@/lib/theme/colors';
import type { MedicationWeekdayCode } from '@/types/reminder';

interface WeekdayScheduleSelectorProps {
    value: readonly MedicationWeekdayCode[];
    onToggle: (
        value: MedicationWeekdayCode,
    ) => void;
}

interface WeekdayOption {
    code: MedicationWeekdayCode;
    shortLabel: string;
    fullLabel: string;
}

const weekdayOptions: readonly WeekdayOption[] = [
    {
        code: 'SAT',
        shortLabel: 'Sat',
        fullLabel: 'Saturday',
    },
    {
        code: 'SUN',
        shortLabel: 'Sun',
        fullLabel: 'Sunday',
    },
    {
        code: 'MON',
        shortLabel: 'Mon',
        fullLabel: 'Monday',
    },
    {
        code: 'TUE',
        shortLabel: 'Tue',
        fullLabel: 'Tuesday',
    },
    {
        code: 'WED',
        shortLabel: 'Wed',
        fullLabel: 'Wednesday',
    },
    {
        code: 'THU',
        shortLabel: 'Thu',
        fullLabel: 'Thursday',
    },
    {
        code: 'FRI',
        shortLabel: 'Fri',
        fullLabel: 'Friday',
    },
];

function formatSelectedWeekdays(
    values: readonly MedicationWeekdayCode[],
): string {
    const labels = weekdayOptions
        .filter(({ code }) =>
            values.includes(code),
        )
        .map(({ fullLabel }) =>
            fullLabel,
        );

    if (labels.length === 0) {
        return 'No days selected';
    }

    if (labels.length === 1) {
        return `Every ${labels[0]}`;
    }

    if (labels.length === 2) {
        return `Every ${labels.join(' and ')}`;
    }

    return `Every ${labels
        .slice(0, -1)
        .join(', ')}, and ${labels[labels.length - 1]}`;
}

export function WeekdayScheduleSelector({
    value,
    onToggle,
}: WeekdayScheduleSelectorProps) {
    const selectedSummary =
        formatSelectedWeekdays(value);

    return (
        <View className="mb-5">
            <View className="mb-3 flex-row items-center justify-between">
                <Text className="font-jakarta-semibold text-[13px] text-text2-500">
                    Days of Week
                </Text>
            </View>

            <View
                className="rounded-2xl border bg-surface p-3"
                style={{
                    borderColor: colors.text2[50],
                }}
            >
                <View className="flex-row gap-1.5">
                    {weekdayOptions.map(
                        ({
                            code,
                            shortLabel,
                            fullLabel,
                        }) => {
                            const isSelected =
                                value.includes(code);

                            return (
                                <Pressable
                                    key={code}
                                    accessibilityLabel={`${fullLabel} ${isSelected
                                            ? 'selected'
                                            : 'not selected'
                                        }`}
                                    accessibilityRole="checkbox"
                                    accessibilityState={{
                                        checked: isSelected,
                                    }}
                                    className="h-12 flex-1 overflow-hidden rounded-xl"
                                    hitSlop={2}
                                    onPress={() =>
                                        onToggle(code)
                                    }
                                    style={({ pressed }) => ({
                                        opacity: pressed
                                            ? 0.76
                                            : 1,
                                    })}
                                >
                                    <View
                                        className="h-full w-full items-center justify-center rounded-xl border"
                                        style={{
                                            backgroundColor:
                                                isSelected
                                                    ? colors.primary.DEFAULT
                                                    : colors.surface.DEFAULT,
                                            borderColor:
                                                isSelected
                                                    ? colors.primary.DEFAULT
                                                    : colors.text2[100],
                                        }}
                                    >
                                        <Text
                                            className="font-jakarta-semibold text-[11px]"
                                            style={{
                                                color: isSelected
                                                    ? colors.surface.DEFAULT
                                                    : colors.text2[500],
                                            }}
                                        >
                                            {shortLabel}
                                        </Text>
                                    </View>
                                </Pressable>
                            );
                        },
                    )}
                </View>
            </View>
            <ReminderInfoCard
                title={selectedSummary}
                description="The reminder repeats weekly on the selected days."
            />
        </View>
    );
}
