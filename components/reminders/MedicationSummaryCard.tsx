import {
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import {
    useTranslation,
} from 'react-i18next';

import {
    HugeiconsIcon,
} from '@hugeicons/react-native';
import {
    Delete02Icon,
} from '@hugeicons/core-free-icons';

import {
    ChevronLeft,
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
    onDelete?: () => void;
}

export function MedicationSummaryCard({
    title,
    frequencySummary,
    startDateLabel,
    accent,
    onPress,
    onDelete,
}: MedicationSummaryCardProps) {
    const { t, i18n } = useTranslation('reminders');
    const isRTL = i18n.language === 'ar';
    const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

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
            className={`mb-4 min-h-[128px] flex-row items-center rounded-2xl border border-text2-50 bg-surface px-5 py-4 ${isRTL ? 'flex-row-reverse' : ''}`}
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

            <View className={`${isRTL ? 'mr-4 text-right' : 'ml-4 text-left'} flex-1`}>
                <Text
                    className={`font-jakarta-bold text-[16px] text-primary-900 ${isRTL ? 'text-right' : 'text-left'}`}
                    numberOfLines={1}
                >
                    {title}
                </Text>

                <Text
                    className={`mt-1 font-jakarta-semibold text-[14px] ${isRTL ? 'text-right' : 'text-left'}`}
                    style={{
                        color:
                            accentPalette.DEFAULT,
                    }}
                >
                    {frequencySummary}
                </Text>

                {startDateLabel ? (
                    <Text className={`mt-2 font-inter-semibold text-[13px] text-text2-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('starting')}{' '}
                        {startDateLabel}
                    </Text>
                ) : null}
            </View>

            {onDelete ? (
                <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={
                        t('deleteMedication', {
                            defaultValue:
                                'Delete medication',
                        })
                    }
                    className={`${isRTL ? 'mr-3' : 'ml-3'} items-center justify-center rounded-full p-2`}
                    onPress={(event) => {
                        event.stopPropagation?.();
                        onDelete?.();
                    }}
                    activeOpacity={0.7}
                >
                    <HugeiconsIcon
                        icon={Delete02Icon}
                        size={18}
                        color={colors.danger.DEFAULT}
                    />
                </TouchableOpacity>
            ) : null}

            {onPress ? (
                <ChevronIcon
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
