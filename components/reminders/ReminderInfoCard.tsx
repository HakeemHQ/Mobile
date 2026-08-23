import {
    Text,
    View,
} from 'react-native';

import {
    useTranslation,
} from 'react-i18next';

import {
    Clock3,
} from 'lucide-react-native';

import {
    colors,
} from '@/lib/theme/colors';

export interface ReminderInfoCardProps {
    title: string;
    description: string;
}

export function ReminderInfoCard({
    title,
    description,
}: ReminderInfoCardProps) {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    return (
        <View
            className={`mt-4 flex-row items-start rounded-2xl border bg-surface px-4 py-4 ${isRTL ? 'flex-row-reverse' : ''}`}
            style={{
                borderColor:
                    colors.text2[50],
            }}
        >
            <View
                className="h-7 w-7 items-center justify-center rounded-full"
                style={{
                    backgroundColor:
                        colors.primary[50],
                }}
            >
                <Clock3
                    size={17}
                    color={
                        colors.primary
                            .DEFAULT
                    }
                    strokeWidth={2}
                />
            </View>

            <View className={`${isRTL ? 'mr-3 text-right' : 'ml-3 text-left'} flex-1`}>
                <Text className={`font-jakarta-bold text-[13px] text-text-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {title}
                </Text>

                <Text className={`mt-1 font-inter-regular text-[11px] leading-4 text-text2-400 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {description}
                </Text>
            </View>
        </View>
    );
}