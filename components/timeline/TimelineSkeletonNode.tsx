import React from 'react';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface TimelineSkeletonNodeProps {
  isLast?: boolean;
}

export const TimelineSkeletonNode: React.FC<TimelineSkeletonNodeProps> = ({ isLast = false }) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <View className={cn('flex-row items-start mb-1 animate-pulse', isRTL && 'flex-row-reverse')}>
      {/* Left Vertical Track */}
      <View className={cn('items-center self-stretch', isRTL ? 'ml-3.5' : 'mr-3.5')}>
        {/* Node Circle Icon Placeholder */}
        <View className="w-10 h-10 rounded-full items-center justify-center z-10 bg-gray-200" />

        {/* Vertical Line Connector */}
        {!isLast ? (
          <View className="w-[2px] bg-gray-200 flex-1 my-1" />
        ) : null}
      </View>

      {/* Right Content Section */}
      <View className="flex-1 pb-4">
        {/* Card Skeleton */}
        <View className="bg-white rounded-[20px] p-4 border border-gray-100 shadow-sm">
          {/* Tag Placeholder */}
          <View className="flex-row justify-end mb-2">
            <View className="h-5 w-20 rounded-full bg-gray-200" />
          </View>

          {/* Title and Subtitle Placeholders */}
          <View className="mb-4">
            <View className="h-5 w-3/4 rounded-full bg-gray-200 mb-2" />
            <View className="h-4 w-1/2 rounded-full bg-gray-100" />
          </View>

          {/* Footer / Date Placeholder */}
          <View className="flex-row items-center border-t border-gray-50 mt-1 pt-3">
            <View className="h-4 w-24 rounded-full bg-gray-100" />
          </View>
        </View>

        {/* Date Label under card */}
        <View className={cn('mt-2.5 mb-1', isRTL ? 'items-end' : 'items-start')}>
          <View className="h-4 w-28 rounded-full bg-gray-200" />
        </View>
      </View>
    </View>
  );
};
