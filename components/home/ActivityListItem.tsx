import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { ArrowRight01Icon, ArrowLeft01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

export interface ActivityListItemProps {
  title: string;
  body?: string;
  tag?: string;
  tagBgColor?: string;
  tagTextColor?: string;
  date?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconBgColor?: string;
  containerClassName?: string;
  onPress?: () => void;
}

export const ActivityListItem: React.FC<ActivityListItemProps> = ({
  title,
  body,
  tag,
  tagBgColor = 'bg-[#ECFDF5]',
  tagTextColor = 'text-[#047857]',
  date,
  leftIcon,
  rightIcon,
  iconBgColor = 'bg-[#D1E2FF]',
  containerClassName,
  onPress,
}) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'flex-row items-center p-4 rounded-2xl bg-white border border-[#E5E7EB] mb-3',
        isRTL && 'flex-row-reverse',
        containerClassName
      )}
      style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}
    >
      {leftIcon && (
        <View className={cn('w-12 h-12 rounded-2xl items-center justify-center', isRTL ? 'ml-3.5' : 'mr-3.5', iconBgColor)}>
          {leftIcon}
        </View>
      )}

      <View className={cn('flex-1 justify-center', isRTL ? 'pl-2' : 'pr-2')}>
        <Text className={cn('text-[15px] font-jakarta-bold text-gray-900 mb-0.5', isRTL && 'text-right')}>
          {title}
        </Text>

        {body ? (
          <Text className={cn('text-[13px] font-inter-regular text-gray-500 leading-4 mb-2', isRTL && 'text-right')}>
            {body}
          </Text>
        ) : null}

        {(tag || date) && (
          <View className={cn('flex-row items-center mt-0.5', isRTL && 'flex-row-reverse')}>
            {tag ? (
              <View className={cn('px-2.5 py-0.5 rounded-md', tagBgColor, isRTL ? 'ml-2' : 'mr-2.5')}>
                <Text className={cn('text-[12px] font-jakarta-bold', tagTextColor)}>
                  {tag}
                </Text>
              </View>
            ) : null}

            {date ? (
              <Text className={cn('text-[12px] font-inter-regular text-gray-400', isRTL && 'text-right')}>
                {date}
              </Text>
            ) : null}
          </View>
        )}
      </View>

      <View className={isRTL ? 'mr-1' : 'ml-1'}>
        {rightIcon || <HugeiconsIcon icon={isRTL ? ArrowLeft01Icon : ArrowRight01Icon} size={20} color="#9CA3AF" />}
      </View>
    </Pressable>
  );
};
