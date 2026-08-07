import {
    Text,
    View,
} from 'react-native';

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
    return (
        <View
            className="mt-4 flex-row rounded-2xl border bg-surface px-4 py-4"
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

            <View className="ml-3 flex-1">
                <Text className="font-jakarta-bold text-[13px] text-text-900">
                    {title}
                </Text>

                <Text className="mt-1 font-inter-regular text-[11px] leading-4 text-text2-400">
                    {description}
                </Text>
            </View>
        </View>
    );
}