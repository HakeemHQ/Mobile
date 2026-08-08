import {
    Pressable,
    Text,
    View,
} from 'react-native';
import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Clock3,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { colors } from '@/lib/theme';

interface DateTimeFieldProps {
    label: string;
    value: string;
    mode: 'date' | 'time';
    onPress: () => void;
    containerClassName?: string;
}

export function DateTimeField({
    label,
    value,
    mode,
    onPress,
    containerClassName = 'mb-5',
}: DateTimeFieldProps) {
    const { i18n } = useTranslation('reminders');
    const isRTL = i18n.language === 'ar';
    const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

    const LeadingIcon =
        mode === 'date'
            ? CalendarDays
            : Clock3;

    return (
        <View
            className={
                containerClassName
            }
        >
            <Text className={`mb-2 font-jakarta-semibold text-[13px] text-text2-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                {label}
            </Text>

            <Pressable
                accessibilityLabel={`${label}: ${value}`}
                accessibilityRole="button"
                className={`h-14 flex-row items-center rounded-2xl border bg-surface px-4 ${isRTL ? 'flex-row-reverse' : ''}`}
                onPress={onPress}
                style={({ pressed }: { pressed: boolean }) => ({
                    borderColor:
                        colors.text2[200],
                    opacity: pressed
                        ? 0.8
                        : 1,
                })}
            >
                <LeadingIcon
                    size={21}
                    color={
                        colors.text2[400]
                    }
                    strokeWidth={2}
                />

                <Text className={`${isRTL ? 'mr-3 text-right' : 'ml-3 text-left'} flex-1 font-jakarta-semibold text-[15px] text-text2-500`}>
                    {value}
                </Text>

                <ChevronIcon
                    size={21}
                    color={
                        colors.text2[400]
                    }
                    strokeWidth={2}
                />
            </Pressable>
        </View>
    );
}