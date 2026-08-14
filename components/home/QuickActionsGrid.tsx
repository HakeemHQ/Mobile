import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { File02Icon, TransactionHistoryIcon, Notification01Icon } from '@hugeicons/core-free-icons';
import { SecurityCheckIcon } from '@/components/icons/SecurityCheckIcon';
import { FastAccessButton } from '@/components/ui/FastAccessButton';
import { colors } from '@/lib/theme';

interface QuickActionsGridProps {
  onDocumentsPress?: () => void;
  onUploadPress?: () => void;
  onAccessRequestsPress?: () => void;
  onCvPress?: () => void;
  onRemindersPress?: () => void;
  isRTL?: boolean;
}

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({
  onDocumentsPress,
  onUploadPress,
  onAccessRequestsPress,
  onCvPress,
  onRemindersPress,
  isRTL = false,
}) => {
  const { t } = useTranslation('home');

  const handleDocumentsAction = onDocumentsPress || onUploadPress;

  return (
    <View className="w-full mb-8">
      <Text className={`text-[20px] font-jakarta-bold text-gray-900 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
        {t('quickActions', { defaultValue: 'Quick Actions' })}
      </Text>

      <View className="flex-row flex-wrap justify-between gap-y-4">
        {/* Documents (replaces Upload Record) */}
        <FastAccessButton
          title={t('documents', { defaultValue: 'Documents' })}
          icon={<HugeiconsIcon icon={File02Icon} size={22} color={colors.primary[800]} />}
          active={false}
          inactiveCircleColor="bg-primary-100"
          inactiveTextColor="text-gray-900"
          style={{ width: '48%' }}
          onPress={handleDocumentsAction}
        />

        {/* Access Requests */}
        <FastAccessButton
          title={t('accessRequests', { defaultValue: 'Access Requests' })}
          icon={<SecurityCheckIcon size={22} color={colors.primary[800]} />}
          active={false}
          inactiveCircleColor="bg-primary-100"
          inactiveTextColor="text-gray-900"
          style={{ width: '48%' }}
          onPress={onAccessRequestsPress}
        />

        {/* CV */}
        <FastAccessButton
          title={t('cv', { defaultValue: 'CV' })}
          icon={<HugeiconsIcon icon={TransactionHistoryIcon} size={22} color={colors.primary[800]} />}
          active={false}
          inactiveCircleColor="bg-primary-100"
          inactiveTextColor="text-gray-900"
          style={{ width: '48%' }}
          onPress={onCvPress}
        />

        {/* Reminders */}
        <FastAccessButton
          title={t('reminders', { defaultValue: 'Reminders' })}
          icon={<HugeiconsIcon icon={Notification01Icon} size={22} color={colors.primary[800]} />}
          active={false}
          inactiveCircleColor="bg-primary-100"
          inactiveTextColor="text-gray-900"
          style={{ width: '48%' }}
          onPress={onRemindersPress}
        />
      </View>
    </View>
  );
};
