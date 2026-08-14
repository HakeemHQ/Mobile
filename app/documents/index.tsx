import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  File02Icon,
  Search02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  AlertCircleIcon,
} from '@hugeicons/core-free-icons';

import BackButton from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { useDocuments } from '@/hooks/useDocuments';
import { cn } from '@/lib/utils';
import { colors } from '@/lib/theme';
import type { DocumentItem } from '@/types/document';

/** Status badge styles helper */
const getStatusBadge = (status: string) => {
  const lower = (status || '').toLowerCase();
  if (lower === 'completed' || lower === 'success') {
    return {
      bg: 'bg-secondary-50',
      text: 'text-secondary-700',
      icon: <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} color={colors.secondary[700]} />,
      label: 'Completed',
    };
  }
  if (lower === 'failed' || lower === 'error') {
    return {
      bg: 'bg-danger-50',
      text: 'text-danger-700',
      icon: <HugeiconsIcon icon={AlertCircleIcon} size={13} color={colors.danger[700]} />,
      label: 'Failed',
    };
  }
  return {
    bg: 'bg-primary-50',
    text: 'text-primary-700',
    icon: <HugeiconsIcon icon={Clock01Icon} size={13} color={colors.primary[700]} />,
    label: 'Processing',
  };
};

export default function DocumentsScreen() {
  const { t, i18n } = useTranslation('home');
  const isRTL = i18n.language === 'ar';
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const { documents, loading, error, refreshing, refresh } = useDocuments();

  // Search filtering
  const filteredDocuments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return documents;
    return documents.filter(
      (doc) =>
        doc.title.toLowerCase().includes(query) ||
        doc.documentType.toLowerCase().includes(query) ||
        doc.documentDate.toLowerCase().includes(query)
    );
  }, [documents, searchQuery]);

  const renderItem = useCallback(
    ({ item }: { item: DocumentItem }) => {
      const badge = getStatusBadge(item.extractionStatus);
      const formattedDate = new Date(item.documentDate).toLocaleDateString(
        isRTL ? 'ar-EG' : 'en-US',
        { month: 'short', day: 'numeric', year: 'numeric' }
      );

      return (
        <Pressable
          onPress={() => router.push(`/documents/${item.documentId}` as any)}
          className={cn(
            'bg-white rounded-2xl p-4 border border-[#E5E7EB] mb-3 flex-row items-center justify-between shadow-sm',
            isRTL && 'flex-row-reverse'
          )}
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
        >
          {/* Left Icon */}
          <View
            className={cn(
              'w-11 h-11 rounded-2xl bg-primary-50 items-center justify-center',
              isRTL ? 'ml-3' : 'mr-3'
            )}
          >
            <HugeiconsIcon icon={File02Icon} size={22} color={colors.primary.DEFAULT} />
          </View>

          {/* Details */}
          <View className="flex-1">
            <View className={cn('flex-row items-center justify-between gap-2 mb-1', isRTL && 'flex-row-reverse')}>
              <Text
                className={cn('text-[15px] font-jakarta-bold text-gray-900 flex-1', isRTL && 'text-right')}
                numberOfLines={1}
              >
                {item.title}
              </Text>

              {/* Status Badge */}
              <View className={cn('flex-row items-center gap-1 px-2.5 py-1 rounded-full', badge.bg, isRTL && 'flex-row-reverse')}>
                {badge.icon}
                <Text className={cn('text-[11px] font-jakarta-semibold', badge.text)}>
                  {badge.label}
                </Text>
              </View>
            </View>

            <View className={cn('flex-row items-center justify-between', isRTL && 'flex-row-reverse')}>
              <Text className={cn('text-[13px] font-inter-medium text-gray-500', isRTL && 'text-right')}>
                {item.documentType}
              </Text>
              <Text className={cn('text-[12px] font-inter-regular text-gray-400', isRTL && 'text-right')}>
                {formattedDate}
              </Text>
            </View>
          </View>
        </Pressable>
      );
    },
    [isRTL, router]
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top', 'left', 'right']}>
        <View className="flex-1 px-5 pt-3">
          {/* Header */}
          <View className={cn('flex-row items-center justify-between mb-4', isRTL && 'flex-row-reverse')}>
            {!isSearchOpen ? (
              <>
                <View className={cn('flex-row items-center gap-3', isRTL && 'flex-row-reverse')}>
                  <BackButton />
                  <Text className="text-[24px] font-jakarta-bold text-primary-900">
                    {isRTL ? 'المستندات' : 'Documents'}
                  </Text>
                </View>

                <Pressable
                  onPress={() => setIsSearchOpen(true)}
                  className="w-10 h-10 rounded-full border border-gray-200 bg-white items-center justify-center shadow-sm"
                  style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                >
                  <HugeiconsIcon icon={Search02Icon} size={20} color={colors.primary[900]} />
                </Pressable>
              </>
            ) : (
              <View className={cn('flex-1 flex-row items-center bg-white border border-gray-300 rounded-2xl px-3 py-2', isRTL && 'flex-row-reverse')}>
                <HugeiconsIcon icon={Search02Icon} size={18} color={colors.text2[500]} />
                <TextInput
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder={isRTL ? 'البحث في المستندات...' : 'Search documents...'}
                  placeholderTextColor={colors.text2[500]}
                  className={cn(
                    'flex-1 text-[14px] font-inter-regular text-gray-900 mx-2 py-0',
                    isRTL && 'text-right'
                  )}
                  autoFocus
                />
                <Pressable
                  onPress={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="p-1"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={18} color={colors.text2[500]} />
                </Pressable>
              </View>
            )}
          </View>

          {/* Content */}
          {loading && !refreshing ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
              <Text className="text-[14px] font-inter-regular text-gray-400 mt-3">
                {isRTL ? 'جاري تحميل المستندات...' : 'Loading documents...'}
              </Text>
            </View>
          ) : error && !loading ? (
            <View className="flex-1 items-center justify-center px-6">
              <Text className="text-[16px] font-jakarta-bold text-gray-700 mb-2">
                {isRTL ? 'فشل تحميل المستندات' : 'Failed to load documents'}
              </Text>
              <Text className="text-[14px] font-inter-regular text-gray-400 mb-4 text-center">
                {error}
              </Text>
              <Button
                title={isRTL ? 'إعادة المحاولة' : 'Retry'}
                variant="primary"
                onPress={refresh}
              />
            </View>
          ) : (
            <FlatList
              data={filteredDocuments}
              renderItem={renderItem}
              keyExtractor={(item) => item.documentId}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={refresh}
                  colors={[colors.primary.DEFAULT]}
                  tintColor={colors.primary.DEFAULT}
                />
              }
              ListEmptyComponent={
                <View className="py-16 items-center justify-center">
                  <Text className={cn('text-[14px] font-inter-regular text-gray-400', isRTL && 'text-right')}>
                    {isRTL ? 'لم يتم العثور على مستندات.' : 'No documents found.'}
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
}
