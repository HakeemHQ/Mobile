import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Share08Icon, Upload01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';
import { colors } from '@/lib/theme';
export interface MedicalCvHeaderProps {
  title?: string;
  onUploadPress?: () => void;
  onSharePress?: () => void;
  containerClassName?: string;
}

export const MedicalCvHeader: React.FC<MedicalCvHeaderProps> = ({
  title,
  onUploadPress,
  onSharePress,
  containerClassName,
}) => {
  const { t, i18n } = useTranslation('medicalCv');
  const isRTL = i18n.language === 'ar';

  const displayTitle = title || t('title', 'Medical CV');

  return (
    <View className={cn('flex-row items-center justify-between mb-6', isRTL && 'flex-row-reverse', containerClassName)}>
      {/* Title */}
      <Text className={cn('text-[26px] font-jakarta-bold text-primary-900', isRTL && 'text-right')}>
        {displayTitle}
      </Text>

      {/* Buttons container */}
      <View className={cn('flex-row items-center gap-3', isRTL && 'flex-row-reverse')}>
        {/* Upload Circle Button */}
        <Pressable
          onPress={onUploadPress}
          className="w-11 h-11 rounded-full border border-gray-200 bg-white items-center justify-center shadow-sm"
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
        >
          <HugeiconsIcon icon={Upload01Icon} size={24} color= {colors.text[500]} />
        </Pressable>

        {/* Primary Share Capsule Button */}
        <Pressable
          onPress={onSharePress}
          className="bg-primary-900 flex-row items-center justify-center h-11 px-5 rounded-full shadow-sm"
          style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
        >
          <View className={cn('flex-row items-center gap-2', isRTL && 'flex-row-reverse')}>
            <HugeiconsIcon icon={Share08Icon} size={18} color="#FFFFFF" />
            <Text className="text-white font-jakarta-semibold text-[15px]">
              {t('share', 'Share')}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};
