import React from 'react';
import { View, Text, ScrollView, StatusBar, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { File02Icon, CheckmarkCircle02Icon } from '@hugeicons/core-free-icons';

import BackButton from '@/components/ui/BackButton';
import { ListItem } from '@/components/ui/ListItem';
import { Button } from '@/components/ui/Button';
import { getRecordTypeConfig, parseDisplayName } from '@/components/timeline/RecordTypeConfig';
import { useMedicalRecordDetail } from '@/hooks/useMedicalRecordDetail';
import { cn } from '@/lib/utils';
import { colors } from '@/lib/theme';

/**
 * Format an ISO date string to a human-readable format.
 */
const formatDate = (dateStr: string): string => {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

/**
 * Get status badge styling based on status string.
 */
const getStatusStyle = (status: string) => {
  const lower = status.toLowerCase();
  if (lower === 'confirmed') {
    return {
      bg: 'bg-secondary-50',
      text: 'text-secondary-700',
      icon: <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} color={colors.secondary[700]} />,
    };
  }
  return {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    icon: null,
  };
};

export default function RecordDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t, i18n } = useTranslation('timeline');
  const isRTL = i18n.language === 'ar';

  const { record, loading, error, retry } = useMedicalRecordDetail(id);

  // Loading state
  if (loading) {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView className="flex-1 bg-[#F9FAFB]" edges={['top', 'left', 'right']}>
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
            <Text className="text-[14px] font-inter-regular text-gray-400 mt-3">
              {t('detail.loading', 'Loading record...')}
            </Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  // Error state
  if (error || !record) {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView className="flex-1 bg-[#F9FAFB]" edges={['top', 'left', 'right']}>
          <View className="px-5 pt-4">
            <BackButton />
          </View>
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-[16px] font-jakarta-bold text-gray-700 mb-2">
              {t('detail.error', 'Failed to load record')}
            </Text>
            <Text className="text-[14px] font-inter-regular text-gray-400 mb-4 text-center">
              {error || ''}
            </Text>
            <Button
              title={t('detail.retry', 'Retry')}
              variant="primary"
              onPress={retry}
            />
          </View>
        </SafeAreaView>
      </>
    );
  }

  const config = getRecordTypeConfig(record.recordType);
  const { primaryName } = parseDisplayName(record.displayName, record.recordType);
  const statusStyle = getStatusStyle(record.status);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1 bg-[#F9FAFB]" edges={['top', 'left', 'right']}>
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
        >
          {/* Header with BackButton and record type tag */}
          <View className={cn('flex-row items-center justify-between px-5 pt-4 pb-2', isRTL && 'flex-row-reverse')}>
            <BackButton />
            <View className={cn('px-3 py-1.5 rounded-full', config.bgColor)}>
              <Text
                className={cn(
                  'text-[12px] font-jakarta-bold',
                  config.tagVariant === 'medication' ? 'text-primary-700' :
                    config.tagVariant === 'labs' ? 'text-tertiary-700' :
                      config.tagVariant === 'visits' ? 'text-secondary-700' :
                        'text-gray-700'
                )}
              >
                {t(`recordTypes.${config.labelKey}`, record.recordType)}
              </Text>
            </View>
          </View>

          {/* Main Info Card */}
          <View className="mx-5 mt-4 bg-white rounded-2xl border border-[#E5E7EB] p-5">
            {/* Icon + Title */}
            <View className={cn('flex-row items-center mb-4', isRTL && 'flex-row-reverse')}>
              <View className={cn('w-12 h-12 rounded-2xl items-center justify-center', isRTL ? 'ml-3' : 'mr-3', config.bgColor)}>
                {config.icon}
              </View>
              <View className="flex-1">
                <Text
                  className={cn(
                    'text-[20px] font-jakarta-bold text-gray-900 leading-6',
                    isRTL && 'text-right'
                  )}
                  numberOfLines={2}
                >
                  {primaryName}
                </Text>
              </View>
            </View>

            {/* Status + Date Row */}
            <View className={cn('flex-row items-center gap-3 mb-1', isRTL && 'flex-row-reverse')}>
              {/* Status Badge */}
              <View className={cn('flex-row items-center gap-1.5 px-3 py-1.5 rounded-full', statusStyle.bg, isRTL && 'flex-row-reverse')}>
                {statusStyle.icon}
                <Text className={cn('text-[12px] font-jakarta-semibold', statusStyle.text)}>
                  {record.status}
                </Text>
              </View>

              {/* Date */}
              <Text className={cn('text-[13px] font-inter-regular text-gray-500', isRTL && 'text-right')}>
                {formatDate(record.clinicalDate)}
              </Text>
            </View>
          </View>

          {/* Details Section */}
          {record.fields && record.fields.length > 0 && (
            <View className="mx-5 mt-5">
              <Text className={cn('text-[16px] font-jakarta-bold text-gray-900 mb-3', isRTL && 'text-right')}>
                {t('detail.details', 'Details')}
              </Text>

              <View className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
                {record.fields.map((field, index) => (
                  <View key={field.id}>
                    <View className={cn('flex-row items-center justify-between px-4 py-3.5', isRTL && 'flex-row-reverse')}>
                      <Text className={cn('text-[13px] font-inter-medium text-gray-500 flex-1', isRTL && 'text-right')}>
                        {t(`fieldNames.${field.fieldName}`, field.fieldName)}
                      </Text>
                      <Text
                        className={cn(
                          'text-[14px] font-jakarta-semibold text-gray-900 flex-1',
                          isRTL ? 'text-left' : 'text-right'
                        )}
                        numberOfLines={2}
                      >
                        {field.fieldValue}
                      </Text>
                    </View>
                    {/* Divider between rows */}
                    {index < record.fields.length - 1 && (
                      <View className="h-[1px] bg-gray-100 mx-4" />
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Source Documents Section */}
          {record.sources && record.sources.length > 0 && (
            <View className="mx-5 mt-5">
              <Text className={cn('text-[16px] font-jakarta-bold text-gray-900 mb-3', isRTL && 'text-right')}>
                {t('detail.sourceDocuments', 'Source Documents')}
              </Text>

              {record.sources.map((source) => (
                <ListItem
                  key={source.documentId}
                  title={source.documentTitle}
                  body={`${t('detail.page', 'Page')} ${source.pageReference}`}
                  leftIcon={
                    <HugeiconsIcon icon={File02Icon} size={20} color={colors.primary.DEFAULT} />
                  }
                  iconBgColor="bg-primary-50"
                  showRightIcon={true}
                  onPress={() => router.push(`/documents/${source.documentId}` as any)}
                />
              ))}
            </View>
          )}

          {/* Empty State Section */}
          {(!record.fields || record.fields.length === 0) && (!record.sources || record.sources.length === 0) && (
            <View className="flex-1 items-center justify-center px-5">
              <Image
                source={require('@/assets/images/record-detailEmptyState.png')}
                style={{ width: 220, height: 220 }}
                resizeMode="contain"
                className="mb-4"
              />
              <Text className="text-[16px] font-jakarta-bold text-gray-900 mb-2 text-center">
                {t('detail.emptyTitle', 'No Details Available')}
              </Text>
              <Text className="text-[14px] font-inter-regular text-gray-500 text-center leading-5">
                {t('detail.emptySubtitle', 'This record has no details or source documents.')}
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
