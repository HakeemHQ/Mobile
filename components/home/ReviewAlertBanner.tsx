import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Alert02Icon, ArrowRight01Icon, ArrowLeft01Icon } from '@hugeicons/core-free-icons';

interface ReviewAlertBannerProps {
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  isRTL?: boolean;
}

export const ReviewAlertBanner: React.FC<ReviewAlertBannerProps> = ({
  title,
  subtitle,
  onPress,
  isRTL = false,
}) => {
  const { t } = useTranslation('home');

  return (
    <Pressable
      onPress={onPress}
      className={`w-full bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl mb-7 p-3 ${
        isRTL ? 'flex-row-reverse' : 'flex-row'
      } items-center justify-between active:opacity-90`}
    >
      <View className={`w-10 h-10 rounded-full bg-[#FEF3C7] items-center justify-center ${isRTL ? 'ml-3.5' : 'mr-3.5'}`}>
        <HugeiconsIcon icon={Alert02Icon} size={20} color="#D97706" />
      </View>

      <View className="flex-1">
        <Text className={`text-[15px] font-jakarta-bold text-[#92400E] mb-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
          {title || t('reviewAlertTitle', { defaultValue: '2 items need your review' })}
        </Text>
        <Text className={`text-[13px] font-inter-regular text-[#B45309] ${isRTL ? 'text-right' : 'text-left'}`}>
          {subtitle || t('reviewAlertSubtitle', { defaultValue: 'AI extracted data with low confidence. Tap to review' })}
        </Text>
      </View>

      <View className={isRTL ? 'mr-2' : 'ml-2'}>
        <HugeiconsIcon icon={isRTL ? ArrowLeft01Icon : ArrowRight01Icon} size={20} color="#D97706" />
      </View>
    </Pressable>
  );
};
