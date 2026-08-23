import {
    Pressable,
    Text,
    View,
} from 'react-native';

import {
    useTranslation,
} from 'react-i18next';

import {
    ReminderInfoCard,
} from '@/components/reminders/ReminderInfoCard';

import { colors } from '@/lib/theme/colors';

interface MonthlyScheduleSelectorProps {
    value: readonly number[];
    onToggle: (
        value: number,
    ) => void;
}

const monthDays = Array.from(
    {
        length: 31,
    },
    (_, index) => index + 1,
);

const gridGap = 6;

export function MonthlyScheduleSelector({
    value,
    onToggle,
}: MonthlyScheduleSelectorProps) {
    const { t, i18n } = useTranslation('reminders');
    const isRTL = i18n.language === 'ar';

    const infoCardTitle =
        value.length === 0
            ? t('noDatesSelected')
            : t('datesSelected', { count: value.length });

    return (
        <View className="mb-5">
            <View className={`mb-3 flex-row items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Text className="font-jakarta-semibold text-[13px] text-text2-500">
                    {t('monthlySchedule')}
                </Text>
            </View>

            <View
                className="rounded-2xl border bg-surface p-3"
                style={{
                    borderColor: colors.text2[50],
                }}
            >
                <View
                    className={`flex-row flex-wrap ${isRTL ? 'flex-row-reverse' : ''}`}
                    style={{
                        columnGap: gridGap,
                        rowGap: gridGap,
                    }}
                >
                    {monthDays.map(
                        (monthDay) => {
                            const isSelected =
                                value.includes(
                                    monthDay,
                                );

                            return (
                                <Pressable
                                    key={monthDay}
                                    accessibilityLabel={`Day ${monthDay} ${isSelected
                                        ? 'selected'
                                        : 'not selected'
                                        }`}
                                    accessibilityRole="checkbox"
                                    accessibilityState={{
                                        checked:
                                            isSelected,
                                    }}
                                    className="h-7 w-9 overflow-hidden rounded-xl"
                                    hitSlop={3}
                                    onPress={() =>
                                        onToggle(
                                            monthDay,
                                        )
                                    }
                                    style={({
                                        pressed,
                                    }) => ({
                                        opacity:
                                            pressed
                                                ? 0.76
                                                : 1,
                                    })}
                                >
                                    <View
                                        className="h-full w-full items-center justify-center rounded-xl border"
                                        style={{
                                            backgroundColor:
                                                isSelected
                                                    ? colors
                                                        .primary
                                                        .DEFAULT
                                                    : colors
                                                        .surface
                                                        .DEFAULT,
                                            borderColor:
                                                isSelected
                                                    ? colors
                                                        .primary
                                                        .DEFAULT
                                                    : colors
                                                        .text2[100],
                                        }}
                                    >
                                        <Text
                                            className="font-jakarta-semibold text-[11px]"
                                            style={{
                                                color:
                                                    isSelected
                                                ? colors
                                                    .surface
                                                    .DEFAULT
                                                : colors
                                                    .text2[500],
                                            }}
                                        >
                                            {monthDay}
                                        </Text>
                                    </View>
                                </Pressable>
                            );
                        },
                    )}
                </View>
            </View>
            <ReminderInfoCard
                title={infoCardTitle}
                description={t('remindedMonthlyDesc')}
            />
        </View>
    );
}
