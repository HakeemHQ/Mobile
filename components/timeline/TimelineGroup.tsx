import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { TimelineItemNode, TimelineItemNodeProps } from './TimelineItemNode';
import { cn } from '@/lib/utils';

export interface TimelineGroupProps {
  year: string;
  items: TimelineItemNodeProps[];
  isLastGroup?: boolean;
}

export const TimelineGroup: React.FC<TimelineGroupProps> = ({
  year,
  items,
  isLastGroup = false,
}) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  if (!items || items.length === 0) return null;

  return (
    <View className="mb-4">
      {/* Year Section Header */}
      <View className={cn('flex-row items-center mb-4', isRTL && 'flex-row-reverse')}>
        <Text className="text-[15px] font-jakarta-bold text-gray-500">
          {year}
        </Text>
        <View className={cn('flex-1 h-[1px] bg-gray-300', isRTL ? 'mr-3' : 'ml-3')} />
      </View>

      {/* Timeline Items */}
      {items.map((item, index) => {
        const isItemLast = isLastGroup && index === items.length - 1;
        return (
          <TimelineItemNode
            key={item.id || index.toString()}
            {...item}
            isLast={isItemLast || item.isLast}
          />
        );
      })}
    </View>
  );
};
