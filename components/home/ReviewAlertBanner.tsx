import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, ChevronRight } from 'lucide-react-native';

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
      className={`w-full bg-[#FFFBEB] border border-[#FDE68A] rounded-2xl p-4.5 mb-7 ${
        isRTL ? 'flex-row-reverse' : 'flex-row'
      } items-center justify-between active:opacity-90`}
    >
      <View className={`w-10 h-10 rounded-full bg-[#FEF3C7] items-center justify-center ${isRTL ? 'ml-3.5' : 'mr-3.5'}`}>
        <AlertTriangle size={20} color="#D97706" />
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
        <ChevronRight size={20} color="#D97706" style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
      </View>
    </Pressable>
  );
};
