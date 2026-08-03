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
  documentsCount = 12,
  donePercentage = 73,
  description,
  isRTL = false,
}) => {
  const { t } = useTranslation('home');

  return (
    <View className="w-full bg-[#0B3B95] rounded-3xl p-5 mb-6 shadow-sm">
      <View className={`w-full ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-start justify-between mb-3`}>
        <Text className="text-[12px] font-jakarta-bold text-[#93C5FD] tracking-wider uppercase">
          {t('profileTitle', { defaultValue: 'MEDICAL PROFILE' })}
        </Text>

        {/* Done % Badge */}
        <View className="w-14 h-14 rounded-full border-2 border-[#60A5FA] bg-[#1D4ED8]/60 items-center justify-center">
          <Text className="text-[15px] font-jakarta-bold text-white leading-4">{donePercentage}</Text>
          <Text className="text-[10px] font-jakarta-bold text-[#BFDBFE]">
            {t('donePercent', { defaultValue: '%done' })}
          </Text>
        </View>
      </View>

      <Text className={`text-[24px] font-jakarta-bold text-white mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
        {t('documentsCount', { defaultValue: `${documentsCount} documents` })}
      </Text>

      {/* Progress Bar */}
      <View className="w-full bg-[#1E40AF]/60 h-2.5 rounded-full overflow-hidden mb-4">
        <View className="bg-white h-full rounded-full" style={{ width: `${donePercentage}%` }} />
      </View>

      <Text className={`text-[13px] font-inter-regular text-[#DBEAFE] leading-5 ${isRTL ? 'text-right' : 'text-left'}`}>
        {description || t('profileDescription', { defaultValue: 'Complete your family history to ensure accurate diagnostic insights.' })}
      </Text>
    </View>
  );
};
