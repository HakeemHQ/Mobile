import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Share08Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

export interface MedicalCvBannerProps {
  onPress?: () => void;
  containerClassName?: string;
}

export const MedicalCvBanner: React.FC<MedicalCvBannerProps> = ({
  onPress,
  containerClassName,
}) => {
  const { t, i18n } = useTranslation('medicalCv');
  const isRTL = i18n.language === 'ar';

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      className={cn(
        'bg-primary-500 rounded-2xl p-6 flex-row items-center gap-5 shadow-sm mb-6',
        isRTL && 'flex-row-reverse',
        containerClassName
      )}
      style={({ pressed }) => [{ opacity: onPress && pressed ? 0.95 : 1 }]}
    >
      {/* Share Icon wrapper */}
      <View className="">
        <HugeiconsIcon icon={Share08Icon} size={28} color="#FFFFFF" />
      </View>

      {/* Texts container */}
      <View className="flex-1">
        <Text className={cn('text-white font-jakarta-bold text-[18px] mb-1.5', isRTL && 'text-right')}>
          {t('shareMedicalCvTitle', 'Share Medical CV')}
        </Text>
        <Text className={cn('text-white/80 font-inter-regular text-[13px] leading-5', isRTL && 'text-right')}>
          {t('shareMedicalCvSubtitle', 'Securely share your medical profile with doctors or healthcare providers.')}
        </Text>
      </View>
    </Pressable>
  );
};
