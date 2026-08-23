import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { StethoscopeIcon, Medicine02Icon, FlaskConicalIcon, Scissor01Icon } from '@hugeicons/core-free-icons';
import { TimelineCard, TimelineCardProps } from './TimelineCard';
import { cn } from '@/lib/utils';
import { colors } from '@/lib/theme';

export type TimelineNodeType = 'visit' | 'lab' | 'medication' | 'scan' | 'default';

export interface TimelineItemNodeProps {
  id: string;
  date: string;
  nodeType?: TimelineNodeType;
  nodeBgColor?: string;
  nodeIcon?: React.ReactNode;
  cardProps: TimelineCardProps;
  isLast?: boolean;
  containerClassName?: string;
}

const getDefaultNodeIcon = (type: TimelineNodeType = 'default') => {
  switch (type) {
    case 'visit':
      return <HugeiconsIcon icon={StethoscopeIcon} size={20} color={colors.secondary.DEFAULT} />;
    case 'lab':
      return <HugeiconsIcon icon={FlaskConicalIcon} size={20} color={colors.tertiary.DEFAULT} />;
    case 'medication':
      return <HugeiconsIcon icon={Medicine02Icon} size={20} color={colors.primary.DEFAULT} />;
    case 'scan':
      return <HugeiconsIcon icon={Scissor01Icon} size={20} color={colors.tertiary.DEFAULT} />;
    default:
      return <HugeiconsIcon icon={StethoscopeIcon} size={20} color={colors.primary.DEFAULT} />;
  }
};

const getDefaultNodeBg = (type: TimelineNodeType = 'default') => {
  switch (type) {
    case 'medication':
      return 'bg-primary-50'; 
    case 'visit':
      return 'bg-secondary-50'; 
    case 'lab':
    case 'scan':
      return 'bg-tertiary-50'; 
    default:
      return 'bg-primary-50';
  }
};

export const TimelineItemNode: React.FC<TimelineItemNodeProps> = ({
  date,
  nodeType = 'default',
  nodeBgColor,
  nodeIcon,
  cardProps,
  isLast = false,
  containerClassName,
}) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const icon = nodeIcon || getDefaultNodeIcon(nodeType);
  const bgColor = nodeBgColor || getDefaultNodeBg(nodeType);

  return (
    <View className={cn('flex-row items-start mb-1', isRTL && 'flex-row-reverse', containerClassName)}>
      {/* Left Vertical Track */}
      <View className={cn('items-center self-stretch', isRTL ? 'ml-3.5' : 'mr-3.5')}>
        {/* Node Circle Icon */}
        <View className={cn('w-10 h-10 rounded-full items-center justify-center z-10', bgColor)}>
          {icon}
        </View>

        {/* Vertical Line Connector */}
        {!isLast ? (
          <View className="w-[2px] bg-gray-300 flex-1 my-1" />
        ) : null}
      </View>

      {/* Right Content Section */}
      <View className="flex-1 pb-4">
        <TimelineCard {...cardProps} />

        {/* Date label under card */}
        {date ? (
          <Text className={cn('text-[14px] font-jakarta-bold text-gray-900 mt-2.5 mb-1', isRTL && 'text-right')}>
            {date}
          </Text>
        ) : null}
      </View>
    </View>
  );
};
