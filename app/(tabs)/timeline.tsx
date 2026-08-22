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
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';

import { useProfileStore } from '@/store/useProfileStore';

import {
  TimelineHeader,
  TimelineFilterChips,
  getRecordTypeConfig,
  parseDisplayName,
  TimelineSkeletonNode,
} from '@/components/timeline';
import { TimelineItemNode, type TimelineItemNodeProps } from '@/components/timeline/TimelineItemNode';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { colors } from '@/lib/theme';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import type { MedicalRecordType, MedicalRecordItem } from '@/types/medical-record';

// ---------- Flattened list item types for FlatList ----------

/** Year header row */
interface YearHeaderItem {
  type: 'year-header';
  key: string;
  year: string;
}

/** Timeline record row */
interface RecordItem {
  type: 'record';
  key: string;
  props: TimelineItemNodeProps;
}

type FlatListItem = YearHeaderItem | RecordItem;

// ---------- Helpers ----------

/**
 * Map a MedicalRecordItem from the API into TimelineItemNode props.
 */
const mapRecordToNodeProps = (
  item: MedicalRecordItem,
  router: ReturnType<typeof useRouter>,
  t: TFunction<'timeline'>
): TimelineItemNodeProps => {
  const config = getRecordTypeConfig(item.recordType);
  const { primaryName, subtitle } = parseDisplayName(item.displayName, item.recordType);

  const formattedDate = new Date(item.clinicalDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return {
    id: item.medicalRecordId,
    date: formattedDate,
    nodeType: config.nodeType,
    nodeBgColor: config.bgColor,
    nodeIcon: config.icon,
    cardProps: {
      title: primaryName,
      subtitle: subtitle || undefined,
      tag: t(`recordTypes.${config.labelKey}`, item.recordType),
      tagVariant: config.tagVariant,
      footerText: formattedDate,
      onPress: () => router.push(`/record-detail/${item.medicalRecordId}` as any),
    },
  };
};

/**
 * Flatten grouped records into a flat array of headers + items for FlatList.
 */
const flattenGroups = (
  groups: { year: string; items: MedicalRecordItem[] }[],
  router: ReturnType<typeof useRouter>,
  t: TFunction<'timeline'>,
  totalGroupCount: number
): FlatListItem[] => {
  const result: FlatListItem[] = [];

  groups.forEach((group, groupIdx) => {
    // Year header
    result.push({
      type: 'year-header',
      key: `header-${group.year}`,
      year: group.year,
    });

    // Items
    const isLastGroup = groupIdx === totalGroupCount - 1;
    group.items.forEach((item, itemIdx) => {
      const isLastItem = isLastGroup && itemIdx === group.items.length - 1;
      const props = mapRecordToNodeProps(item, router, t);
      result.push({
        type: 'record',
        key: item.medicalRecordId,
        props: { ...props, isLast: isLastItem },
      });
    });
  });

  return result;
};

// ---------- Year Header Component ----------

const YearHeader = React.memo(({ year, isRTL }: { year: string; isRTL: boolean }) => (
  <View className={cn('flex-row items-center mb-4 mt-2', isRTL && 'flex-row-reverse')}>
    <Text className="text-[15px] font-jakarta-bold text-gray-500">
      {year}
    </Text>
    <View className={cn('flex-1 h-[1px] bg-gray-300', isRTL ? 'mr-3' : 'ml-3')} />
  </View>
));

// ---------- Pagination Footer ----------

const ListFooter = React.memo(({
  loadingMore,
  hasMore,
  isSearchActive,
}: {
  loadingMore: boolean;
  hasMore: boolean;
  isSearchActive: boolean;
}) => {
  if (isSearchActive || !hasMore) return null;
  if (!loadingMore) return <View style={{ height: 40 }} />;

  return (
    <View className="py-4 items-center">
      <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
    </View>
  );
});

// ---------- Screen ----------

export default function TimelineScreen() {
  const { t, i18n } = useTranslation('timeline');
  const isRTL = i18n.language === 'ar';
  const router = useRouter();

  const profile = useProfileStore((state) => state.profile);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);

  React.useEffect(() => {
    if (!profile) {
      void fetchProfile();
    }
  }, [profile, fetchProfile]);

  const [selectedFilter, setSelectedFilter] = useState('all');

  const {
    groupedRecords,
    loading,
    error,
    refreshing,
    loadingMore,
    hasMore,
    searching,
    searchQuery,
    isSearchActive,
    refresh,
    fetchRecords,
    loadMore,
    handleSearch,
  } = useMedicalRecords();

  const isPending = profile?.identityVerificationStatus?.toLowerCase() === 'pending' || !!(error && String(error).includes('403'));

  // When filter changes, re-fetch from API with recordType param
  const handleFilterChange = useCallback(
    (filterId: string) => {
      setSelectedFilter(filterId);
      const recordType = filterId === 'all' ? undefined : (filterId as MedicalRecordType);
      fetchRecords(recordType);
    },
    [fetchRecords]
  );

  // Handle pull-to-refresh
  const handleRefresh = useCallback(() => {
    const recordType =
      selectedFilter === 'all' ? undefined : (selectedFilter as MedicalRecordType);
    refresh(recordType);
  }, [refresh, selectedFilter]);

  // Flatten grouped data for FlatList
  const flatData = useMemo(
    () => flattenGroups(groupedRecords, router, t, groupedRecords.length),
    [groupedRecords, router, t]
  );

  // FlatList renderItem
  const renderItem = useCallback(
    ({ item }: { item: FlatListItem }) => {
      if (item.type === 'year-header') {
        return <YearHeader year={item.year} isRTL={isRTL} />;
      }
      return <TimelineItemNode {...item.props} />;
    },
    [isRTL]
  );

  // FlatList keyExtractor
  const keyExtractor = useCallback((item: FlatListItem) => item.key, []);

  // FlatList onEndReached
  const handleEndReached = useCallback(() => {
    if (!isSearchActive) {
      loadMore();
    }
  }, [loadMore, isSearchActive]);

  // Loading state (initial load only)
  if (loading && !refreshing && !isPending) {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView className="flex-1 bg-[#F9FAFB]" edges={['top', 'left', 'right']}>
          <View className="flex-1 px-5 pt-3">
            <TimelineHeader searchQuery={searchQuery} onSearchChange={handleSearch} />
            <TimelineFilterChips
              selectedFilter={selectedFilter}
              onSelectFilter={handleFilterChange}
            />
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1 mt-4">
              {[1, 2, 3, 4, 5].map((item, idx) => (
                <TimelineSkeletonNode key={item} isLast={idx === 4} />
              ))}
            </ScrollView>
          </View>
        </SafeAreaView>
      </>
    );
  }

  // Error state
  if (error && !loading && !isPending) {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView className="flex-1 bg-[#F9FAFB]" edges={['top', 'left', 'right']}>
          <View className="flex-1 px-5 pt-3">
            <TimelineHeader searchQuery={searchQuery} onSearchChange={handleSearch} />
            <TimelineFilterChips
              selectedFilter={selectedFilter}
              onSelectFilter={handleFilterChange}
            />
            <View className="flex-1 items-center justify-center px-6">
              <Text className="text-[16px] font-jakarta-bold text-gray-700 mb-2">
                {t('error', 'Failed to load records')}
              </Text>
              <Text className="text-[14px] font-inter-regular text-gray-400 mb-4 text-center">
                {error}
              </Text>
              <Button
                title={t('retry', 'Retry')}
                variant="primary"
                onPress={handleRefresh}
              />
            </View>
          </View>
        </SafeAreaView>
      </>
    );
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1 bg-[#F9FAFB]" edges={['top', 'left', 'right']}>
        <View className="flex-1 px-5 pt-3">
          {/* Header Component */}
          <TimelineHeader
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
          />

          {/* Reusable Category Filter Pills */}
          {!isPending && (
            <TimelineFilterChips
              selectedFilter={selectedFilter}
              onSelectFilter={handleFilterChange}
            />
          )}

          {isPending ? (
          <ScrollView
            contentContainerStyle={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => {
                  void fetchProfile(true);
                  refresh();
                }}
                colors={[colors.primary[900]]}
                tintColor={colors.primary[900]}
              />
            }
          >
            <Image
              source={require('@/assets/images/Pending.webp')}
              style={{ width: 250, height: 180 }}
              resizeMode="contain"
              className="mb-4"
            />
            <Text className="text-[18px] font-jakarta-bold text-gray-900 mb-2 text-center">
              {t('pendingDoctorReviewTitle', { defaultValue: 'Pending Doctor Review' })}
            </Text>
            <Text className="text-[14px] font-inter-regular text-gray-500 text-center leading-5">
              {t('pendingDoctorReviewSubtitle', { defaultValue: 'Please wait while the doctor reviews your profile.' })}
            </Text>
          </ScrollView>
        ) : (
            <>
              {/* Searching indicator */}
              {searching && (
                <View className="py-2 items-center">
                  <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
                </View>
              )}

              {/* Timeline FlatList */}
              <FlatList
                data={flatData}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
                onEndReached={handleEndReached}
                onEndReachedThreshold={0.4}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    colors={[colors.primary.DEFAULT]}
                    tintColor={colors.primary.DEFAULT}
                  />
                }
                ListFooterComponent={
                  <ListFooter
                    loadingMore={loadingMore}
                    hasMore={hasMore}
                    isSearchActive={isSearchActive}
                  />
                }
                ListEmptyComponent={
                  !searching ? (
                    <View className="flex-1 items-center justify-center px-4 py-8">
                      <Image
                        source={require('@/assets/images/emptyList.png')}
                        style={{ width: 220, height: 220 }}
                        resizeMode="contain"
                        className="mb-4"
                      />
                      {searchQuery.trim() ? (
                        <>
                          <Text className={cn('text-center font-jakarta-bold text-[18px] text-gray-900 mb-2', isRTL && 'text-right')}>
                            {t('noRecordsFound', { defaultValue: 'No records found' })}
                          </Text>
                          <Text className={cn('text-center font-inter-regular text-[14px] text-gray-500 max-w-[300px]', isRTL && 'text-right')}>
                            {t('noRecordsFoundSubtitle', {
                              defaultValue: `We couldn't find any records matching "${searchQuery}".`,
                              query: searchQuery,
                            })}
                          </Text>
                        </>
                      ) : (
                        <>
                          <Text className={cn('text-center font-jakarta-bold text-[20px] text-gray-900 mb-2', isRTL && 'text-right')}>
                            {t('emptyTitle', { defaultValue: 'No timeline records yet' })}
                          </Text>
                          <Text className={cn('text-center font-inter-regular text-[14px] text-gray-500 max-w-[320px]', isRTL && 'text-right')}>
                            {t('emptySubtitle')}
                          </Text>
                        </>
                      )}
                    </View>
                  ) : null
                }
                // Performance optimizations
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                windowSize={7}
                initialNumToRender={15}
                updateCellsBatchingPeriod={50}
              />
            </>
          )}
        </View>
      </SafeAreaView>
    </>
  );
}
