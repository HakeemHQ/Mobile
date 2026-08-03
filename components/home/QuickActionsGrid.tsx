import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Upload, Clock, FileText, Bell } from 'lucide-react-native';
import { FastAccessButton } from '@/components/ui/FastAccessButton';

interface QuickActionsGridProps {
  onUploadPress?: () => void;
  onTimelinePress?: () => void;
  onCvPress?: () => void;
  onRemaindersPress?: () => void;
  isRTL?: boolean;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({
  onUploadPress,
  onTimelinePress,
  onCvPress,
  onRemaindersPress,
  isRTL = false,
}) => {
  const { t } = useTranslation('home');

  return (
    <View className="w-full mb-8">
      <Text className={`text-[20px] font-jakarta-bold text-gray-900 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
        {t('quickActions', { defaultValue: 'Quick Actions' })}
      </Text>

      <View className="flex-row flex-wrap justify-between gap-y-4">
        {/* Upload Record */}
        <FastAccessButton
          title={t('uploadRecord', { defaultValue: 'Upload Record' })}
          icon={<Upload size={22} color="#1A56DB" />}
          active={false}
          inactiveCircleColor="bg-[#D1E2FF]"
          inactiveTextColor="text-gray-900"
          style={{ width: '48%' }}
          onPress={onUploadPress}
        />

        {/* Time line */}
        <FastAccessButton
          title={t('timeline', { defaultValue: 'Time line' })}
          icon={<Clock size={22} color="#1A56DB" />}
          active={false}
          inactiveCircleColor="bg-[#D1E2FF]"
          inactiveTextColor="text-gray-900"
          style={{ width: '48%' }}
          onPress={onTimelinePress}
        />

        {/* CV */}
        <FastAccessButton
          title={t('cv', { defaultValue: 'CV' })}
          icon={<FileText size={22} color="#1A56DB" />}
          active={false}
          inactiveCircleColor="bg-[#D1E2FF]"
          inactiveTextColor="text-gray-900"
          style={{ width: '48%' }}
          onPress={onCvPress}
        />

        {/* Remainders */}
        <FastAccessButton
          title={t('remainders', { defaultValue: 'Remainders' })}
          icon={<Bell size={22} color="#1A56DB" />}
          active={false}
          inactiveCircleColor="bg-[#D1E2FF]"
          inactiveTextColor="text-gray-900"
          style={{ width: '48%' }}
          onPress={onRemaindersPress}
        />
      </View>
    </View>
  );
};
