import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export function ReminderCardSkeleton() {
    const { i18n } = useTranslation();
    const isRTL = i18n.language === 'ar';

    return (
        <View
            className={cn(
                'min-h-[98px] flex-row items-center rounded-2xl border border-gray-100 bg-white px-3 py-3 mb-4 animate-pulse shadow-sm',
                isRTL && 'flex-row-reverse'
            )}
        >
            {/* Left Circle Icon Placeholder */}
            <View className="h-11 w-11 items-center justify-center rounded-full bg-gray-200" />

            {/* Center Content Placeholder */}
            <View className={cn('flex-1', isRTL ? 'mr-3' : 'ml-3')}>
                <View className="h-4 w-1/2 rounded-full bg-gray-200 mb-2" />
                <View className="h-3 w-3/4 rounded-full bg-gray-100" />
                
                {/* Small Badges */}
                <View className={cn('mt-3 flex-row flex-wrap gap-1.5', isRTL && 'flex-row-reverse')}>
                    <View className="h-5 w-12 rounded-lg bg-gray-100" />
                    <View className="h-5 w-12 rounded-lg bg-gray-100" />
                </View>
            </View>

            {/* Right Switch Placeholder */}
            <View className="h-7 w-12 rounded-full bg-gray-100" />
        </View>
    );
}
