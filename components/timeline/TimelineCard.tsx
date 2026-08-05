import React from 'react';
import { View, Text, Pressable, ViewStyle, StyleProp } from 'react-native';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { File02Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

export type TagVariant = 'labs' | 'medication' | 'normal' | 'visits' | 'scans' | 'default';

export interface TimelineCardProps {
  title: string;
  body?: string;
  subtitle?: string;
  subtitleClassName?: string;
  tag?: string;
  tagVariant?: TagVariant;
  footerText?: string;
  footerIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onPress?: () => void;
  containerClassName?: string;
  style?: StyleProp<ViewStyle>;
}

const getTagStyles = (variant: TagVariant = 'default', tagText?: string): { bg: string; text: string } => {
  const lowerTag = (tagText || variant).toLowerCase();
  
  if (lowerTag.includes('lab')) {
    return { bg: 'bg-[#DBEAFE]', text: 'text-[#2563EB]' }; // Soft Blue
  }
  if (lowerTag.includes('medication') || lowerTag.includes('normal')) {
    return { bg: 'bg-[#D1FAE5]', text: 'text-[#059669]' }; // Soft Green
  }
  if (lowerTag.includes('visit') || lowerTag.includes('doctor')) {
    return { bg: 'bg-[#F3E8FF]', text: 'text-[#9333EA]' }; // Soft Purple
  }
  if (lowerTag.includes('scan') || lowerTag.includes('x-ray')) {
    return { bg: 'bg-[#FEF3C7]', text: 'text-[#D97706]' }; // Soft Yellow
  }
  return { bg: 'bg-gray-100', text: 'text-gray-700' };
};

export const TimelineCard: React.FC<TimelineCardProps> = ({
  title,
  body,
  subtitle,
  subtitleClassName,
  tag,
  tagVariant = 'default',
  footerText,
  footerIcon,
  leftIcon,
  rightIcon,
  onPress,
  containerClassName,
  style,
}) => {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const tagStyles = getTagStyles(tagVariant, tag);

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className={cn(
        'bg-white rounded-[16px] p-4 border border-[#C2C7D1] shadow-sm',
        isRTL && 'text-right',
        containerClassName
      )}
      style={({ pressed }) => [
        { opacity: onPress && pressed ? 0.9 : 1 },
        style,
      ]}
    >
      <View className={cn('flex-row items-start justify-between gap-2', isRTL && 'flex-row-reverse')}>
        {leftIcon ? (
          <View className={cn('w-10 h-10 rounded-full items-center justify-center bg-gray-50', isRTL ? 'ml-2' : 'mr-2')}>
            {leftIcon}
          </View>
        ) : null}

        <View className="flex-1">
          <View className={cn('flex-row items-center justify-between gap-2', isRTL && 'flex-row-reverse')}>
            <Text
              className={cn(
                'text-[15px] font-jakarta-bold text-gray-900 flex-1 leading-5',
                isRTL && 'text-right'
              )}
              numberOfLines={2}
            >
              {title}
            </Text>

            {tag ? (
              <View className={cn('px-2.5 py-1 rounded-full', tagStyles.bg)}>
                <Text className={cn('text-[11px] font-jakarta-bold', tagStyles.text)}>
                  {tag}
                </Text>
              </View>
            ) : null}
          </View>

          {subtitle ? (
            <Text className={cn('text-[13px] font-inter-medium text-gray-500 mt-0.5', subtitleClassName, isRTL && 'text-right')}>
              {subtitle}
            </Text>
          ) : null}

          {body ? (
            <Text className={cn('text-[13px] font-inter-regular text-gray-600 mt-1 leading-4', isRTL && 'text-right')}>
              {body}
            </Text>
          ) : null}
        </View>

        {rightIcon ? (
          <View className={isRTL ? 'mr-2' : 'ml-2'}>
            {rightIcon}
          </View>
        ) : null}
      </View>

      {footerText ? (
        <>
          {/* Inner card divider */}
          <View className="h-[1px] bg-gray-200 my-3" />

          {/* Footer file info */}
          <View className={cn('flex-row items-center gap-2', isRTL && 'flex-row-reverse')}>
            {footerIcon || (
              <HugeiconsIcon icon={File02Icon} size={16} color="#6B7280" />
            )}
            <Text className={cn('text-[12px] font-inter-regular text-gray-500', isRTL && 'text-right')}>
              {footerText}
            </Text>
          </View>
        </>
      ) : null}
    </Pressable>
  );
};
