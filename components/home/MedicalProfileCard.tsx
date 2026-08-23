import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';

interface MedicalProfileCardProps {
  documentsCount?: number;
  donePercentage?: number;
  description?: string;
  isRTL?: boolean;
}

export const MedicalProfileCard: React.FC<MedicalProfileCardProps> = ({
  documentsCount = 0,
  donePercentage = 73,
  description,
  isRTL = false,
}) => {
  const { t } = useTranslation('home');

  const countText = isRTL
    ? `${documentsCount} ${documentsCount === 1 ? 'مستند' : 'مستندات'}`
    : `${documentsCount} ${documentsCount === 1 ? 'document' : 'documents'}`;

  return (
    <View className="w-full bg-primary-700 rounded-3xl p-5 mb-6 shadow-sm">
      {/* Top Header Label */}
      <Text className={`text-[12px] font-jakarta-bold text-white/90 tracking-wider uppercase mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
        {t('profileTitle', { defaultValue: 'MEDICAL PROFILE' })}
      </Text>

      {/* Documents Count */}
      <View className={`w-full mb-4`}>
        <Text className={`text-[24px] font-jakarta-bold text-white ${isRTL ? 'text-right' : 'text-left'}`}>
          {countText}
        </Text>
      </View>

      {/* Description */}
      <Text className={`text-[13px] font-inter-regular text-[#DBEAFE] leading-5 ${isRTL ? 'text-right' : 'text-left'}`}>
        {description || t('profileDescription', { defaultValue: 'Complete your family history to ensure accurate diagnostic insights.' })}
      </Text>
    </View>
  );
};
