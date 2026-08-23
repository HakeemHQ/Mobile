import type {
    ReactNode,
} from 'react';

import {
    Text,
    View,
} from 'react-native';

import { useTranslation } from 'react-i18next';
import BackButton from '@/components/ui/BackButton';

interface ReminderScreenHeaderProps {
    title: string;
    onBack: () => void;
    rightContent?: ReactNode;
}

export function ReminderScreenHeader({
    title,
    onBack,
    rightContent,
}: ReminderScreenHeaderProps) {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    return (
        <View className={`mb-5 mt-1 flex-row items-center px-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <BackButton onPress={onBack} />

            <Text
                className="mx-3 flex-1 text-center font-jakarta-bold text-[21px] color-primary-900"
                numberOfLines={1}
            >
                {title}
            </Text>

            <View className="h-10 w-10 items-center justify-center">
                {rightContent}
            </View>
        </View>
    );
}
