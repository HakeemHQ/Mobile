import {
    Pressable,
    Text,
    View,
} from 'react-native';

import {
    ChevronRight,
    Pill,
} from 'lucide-react-native';

import {
    colors,
} from '@/lib/theme/colors';

interface MedicationSummaryCardProps {
    title: string;
    frequencySummary: string;
    startDateLabel?: string;
    accent:
    | 'primary'
    | 'secondary'
    | 'tertiary';
    onPress?: () => void;
}

export function MedicationSummaryCard({
    title,
    frequencySummary,
    startDateLabel,
    accent,
    onPress,
}: MedicationSummaryCardProps) {
    const accentPalette =
        colors[accent];

    return (
        <Pressable
            accessibilityRole={
                onPress
                    ? 'button'
                    : undefined
            }
            disabled={!onPress}
            className="mb-4 min-h-[128px] flex-row items-center rounded-2xl border border-text2-50 bg-surface px-5 py-4"
            onPress={onPress}
            style={({ pressed }: { pressed: boolean }) => ({
                borderColor:
                    colors.text2[50],
                opacity:
                    pressed
                        ? 0.76
                        : 1,
            })}
        >
            <View
                className="h-14 w-14 items-center justify-center rounded-full border"
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
                        accentPalette.DEFAULT
                    }
                    strokeWidth={2}
                />
            </View>

            <View className="ml-4 flex-1">
                <Text
                    className="font-jakarta-bold text-[16px] text-primary-900"
                    numberOfLines={1}
                >
                    {title}
                </Text>

                <Text
                    className="mt-1 font-jakarta-semibold text-[14px]"
                    style={{
                        color:
                            accentPalette.DEFAULT,
                    }}
                >
                    {frequencySummary}
                </Text>

                {startDateLabel ? (
                    <Text className="mt-2 font-inter-semibold text-[13px] text-text2-300">
                        Starting{' '}
                        {startDateLabel}
                    </Text>
                ) : null}
            </View>

            {onPress ? (
                <ChevronRight
                    size={25}
                    color={
                        colors.primary[800]
                    }
                    strokeWidth={2}
                />
            ) : null}
        </Pressable>
    );
}
