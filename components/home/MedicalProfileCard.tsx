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
    <View className="w-full bg-primary-700 rounded-3xl p-5 mb-6 shadow-sm">
      {/* Top Header Label */}
      <Text className={`text-[12px] font-jakarta-bold text-white/90 tracking-wider uppercase mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
        {t('profileTitle', { defaultValue: 'MEDICAL PROFILE' })}
      </Text>

      {/* Documents Count and %done Circle */}
      <View className={`w-full ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between mb-4`}>
        <Text className={`text-[24px] font-jakarta-bold text-white ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('documentsCount', { defaultValue: `${documentsCount} documents` })}
        </Text>

        {/* Done % Badge Column */}
        <View className="items-center">
          <View className="w-14 h-14 rounded-full border-2 border-primary-300 bg-primary-500 items-center justify-center">
            <Text className="text-[18px] font-jakarta-bold text-white">{donePercentage}</Text>
          </View>
          <Text className="text-[11px] font-jakarta-bold text-[#89A092] mt-1">
            {t('donePercent', { defaultValue: '%done' })}
          </Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="w-full bg-[#1E40AF]/60 h-2.5 rounded-full overflow-hidden mb-4">
        <View className="bg-white h-full rounded-full" style={{ width: `${donePercentage}%` }} />
      </View>

      {/* Description */}
      <Text className={`text-[13px] font-inter-regular text-[#DBEAFE] leading-5 ${isRTL ? 'text-right' : 'text-left'}`}>
        {description || t('profileDescription', { defaultValue: 'Complete your family history to ensure accurate diagnostic insights.' })}
      </Text>
    </View>
  );
};
