import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, FlatList, StatusBar, ActivityIndicator, Pressable, RefreshControl, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react-native';

import BackButton from '@/components/ui/BackButton';
import { AccessRequestCard } from '@/components/access-requests/AccessRequestCard';
import { AccessRequestFilterChips } from '@/components/access-requests/AccessRequestFilterChips';
import { cn } from '@/lib/utils';
import { colors } from '@/lib/theme';
import {
  getAccessRequests,
  approveAccessRequest,
  rejectAccessRequest,
  AccessRequestItem
} from '@/lib/api/access-requests';
import { saveApprovedCode, getApprovedCodes } from '@/lib/access-codes-storage';

const PAGE_SIZE = 15;

// ---------- Flat list item types ----------

interface MonthHeaderItem {
  type: 'month-header';
  key: string;
  label: string;
}

interface RequestRowItem {
  type: 'request';
  key: string;
  data: AccessRequestItem;
  isLast: boolean;
}

type FlatListItem = MonthHeaderItem | RequestRowItem;

// ---------- Month Header ----------

const MonthHeader = React.memo(({ label, isRTL }: { label: string; isRTL: boolean }) => (
  <View className={cn('flex-row items-center mb-4 mt-2', isRTL && 'flex-row-reverse')}>
    <Text className="text-[15px] font-jakarta-bold text-gray-500">
      {label}
    </Text>
    <View className={cn('flex-1 h-[1px] bg-gray-300', isRTL ? 'mr-3' : 'ml-3')} />
  </View>
));

export default function AccessRequestsScreen() {
  const { t, i18n } = useTranslation('accessRequests');
  const isRTL = i18n.language === 'ar';

  const [requests, setRequests] = useState<AccessRequestItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [error, setError] = useState<string | null>(null);

  const [processingId, setProcessingId] = useState<string | null>(null);
  const [now, setNow] = useState(Date.now());

  // Approval Modal State
  const [approvalModalData, setApprovalModalData] = useState<{
    doctorName: string;
    oneTimeCode: string;
    codeExpiresAt: string;
  } | null>(null);

  // 1-second ticker for countdown
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ---------- Fetch ----------

  const fetchRequests = useCallback(
    async (filterId: string, page = 1, isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else if (page === 1) setLoading(true);
      else setLoadingMore(true);
      setError(null);

      try {
        const queryStatus = filterId === 'all' ? undefined : filterId;
        const [res, localCodes] = await Promise.all([
          getAccessRequests(queryStatus, page, PAGE_SIZE),
          getApprovedCodes(),
        ]);

        if (res.success && res.data) {
          const rawItems = res.data.items || [];
          const mergedItems = rawItems.map((item) => {
            const stored = localCodes[item.requestId];
            if (stored) {
              return { ...item, oneTimeCode: stored.oneTimeCode, codeExpiresAt: stored.codeExpiresAt };
            }
            return item;
          });

          if (page === 1) setRequests(mergedItems);
          else setRequests((prev) => [...prev, ...mergedItems]);

          setPageNumber(page);
          setHasMore(rawItems.length >= PAGE_SIZE);
        } else {
          setError(res.message || t('failedToFetch', 'Failed to fetch access requests'));
        }
      } catch (err: any) {
        const errorData = err?.response?.data;
        const validationMsg =
          errorData?.errors?.Status?.[0] ||
          errorData?.errors?.[Object.keys(errorData?.errors || {})[0]]?.[0] ||
          errorData?.errorList?.[0]?.message ||
          errorData?.message ||
          err.message ||
          t('failedToFetch', 'Failed to fetch access requests');
        setError(validationMsg);
      } finally {
        if (isRefresh) setRefreshing(false);
        else if (page === 1) setLoading(false);
        else setLoadingMore(false);
      }
    },
    [t]
  );

  useEffect(() => {
    fetchRequests(selectedFilter, 1);
  }, [selectedFilter, fetchRequests]);

  const handleFilterChange = (filterId: string) => setSelectedFilter(filterId);
  const handleRefresh = () => fetchRequests(selectedFilter, 1, true);
  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !loading && !refreshing) {
      fetchRequests(selectedFilter, pageNumber + 1);
    }
  };

  // ---------- Actions ----------

  const handleApprove = async (requestId: string, doctorName: string) => {
    setProcessingId(requestId);
    try {
      const res = await approveAccessRequest(requestId);
      if (res.success && res.data) {
        await saveApprovedCode(requestId, res.data.oneTimeCode, res.data.codeExpiresAt);
        setApprovalModalData({
          doctorName: doctorName || t('unknownDoctor', 'Doctor'),
          oneTimeCode: res.data.oneTimeCode,
          codeExpiresAt: res.data.codeExpiresAt,
        });
        setRequests((prev) =>
          prev.map((r) =>
            r.requestId === requestId
              ? { ...r, status: res.data.status || 'approved', oneTimeCode: res.data.oneTimeCode, codeExpiresAt: res.data.codeExpiresAt }
              : r
          )
        );
      } else {
        setError(res.message || t('failedToApprove', 'Failed to approve request'));
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || t('failedToApprove', 'Failed to approve request'));
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      const res = await rejectAccessRequest(requestId);
      if (res.success) {
        setRequests((prev) =>
          prev.map((r) => (r.requestId === requestId ? { ...r, status: res.data.status || 'rejected' } : r))
        );
      } else {
        setError(res.message || t('failedToReject', 'Failed to reject request'));
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err.message || t('failedToReject', 'Failed to reject request'));
    } finally {
      setProcessingId(null);
    }
  };

  // ---------- Flatten into month-grouped list ----------

  const flatData = useMemo((): FlatListItem[] => {
    if (requests.length === 0) return [];

    const result: FlatListItem[] = [];
    let currentMonthKey = '';

    requests.forEach((item, idx) => {
      const date = new Date(item.requestedAt);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;

      if (monthKey !== currentMonthKey) {
        currentMonthKey = monthKey;
        const label = date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', { month: 'long', year: 'numeric' });
        result.push({ type: 'month-header', key: `header-${monthKey}`, label });
      }

      // An item is "last" if it's the final item in the whole list
      const isLast = idx === requests.length - 1;
      result.push({ type: 'request', key: item.requestId, data: item, isLast });
    });

    return result;
  }, [requests, isRTL]);

  // ---------- Render ----------

  const renderItem = useCallback(
    ({ item }: { item: FlatListItem }) => {
      if (item.type === 'month-header') {
        return <MonthHeader label={item.label} isRTL={isRTL} />;
      }
      return (
        <AccessRequestCard
          item={item.data}
          isRTL={isRTL}
          now={now}
          isProcessing={processingId === item.data.requestId}
          isLast={item.isLast}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      );
    },
    [isRTL, processingId, now, t]
  );

  const keyExtractor = useCallback((item: FlatListItem) => item.key, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1 bg-[#F9FAFB]" edges={['top', 'left', 'right']}>
        <View className="flex-1 px-5 pt-3">
          {/* Header */}
          <View className={cn('flex-row items-center mb-4', isRTL && 'flex-row-reverse')}>
            <BackButton />
            <Text className={cn('text-[24px] font-jakarta-bold text-primary-900', isRTL ? 'mr-3' : 'ml-3')}>
              {t('title', 'Access Requests')}
            </Text>
          </View>

          {/* Filter Chips */}
          <AccessRequestFilterChips selectedFilter={selectedFilter} onSelectFilter={handleFilterChange} />

          {/* Content */}
          {loading && !refreshing ? (
            <View className="flex-1 items-center justify-center">
              <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
              <Text className="text-[14px] font-inter-regular text-gray-400 mt-3">
                {t('loading', 'Loading requests...')}
              </Text>
            </View>
          ) : error && !loading ? (
            <View className="flex-1 items-center justify-center">
              <Text className="text-[14px] font-inter-regular text-danger-500 text-center mb-4">{error}</Text>
              <Pressable onPress={handleRefresh} className="px-6 py-2 bg-primary-600 rounded-full">
                <Text className="text-white font-jakarta-semibold">{t('retry', 'Retry')}</Text>
              </Pressable>
            </View>
          ) : (
            <FlatList
              data={flatData}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100 }}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.4}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[colors.primary.DEFAULT]} />
              }
              ListFooterComponent={
                loadingMore ? (
                  <View className="py-4 items-center">
                    <ActivityIndicator size="small" color={colors.primary.DEFAULT} />
                  </View>
                ) : null
              }
              ListEmptyComponent={
                <View className="py-16 items-center justify-center">
                  <Text className={cn('text-[14px] font-inter-regular text-gray-400', isRTL && 'text-right')}>
                    {t('noRequests', 'No access requests.')}
                  </Text>
                </View>
              }
              removeClippedSubviews
              maxToRenderPerBatch={10}
              windowSize={7}
              initialNumToRender={15}
            />
          )}
        </View>
      </SafeAreaView>

      {/* Approval Success Modal Popup */}
      <Modal
        visible={!!approvalModalData}
        transparent
        animationType="fade"
        onRequestClose={() => setApprovalModalData(null)}
      >
        <View className="flex-1 justify-center items-center bg-black/50 px-6">
          <View className="w-full bg-white rounded-3xl p-6 items-center shadow-2xl border border-gray-100">
            <View className="w-16 h-16 rounded-full bg-secondary-100 items-center justify-center mb-4 border border-secondary-200">
              <Check size={32} color={colors.secondary[700]} strokeWidth={3} />
            </View>

            <Text className="text-[20px] font-jakarta-bold text-gray-900 mb-1 text-center">
              {t('modal.title', 'Access Request Approved!')}
            </Text>

            <Text className="text-[13px] font-inter-regular text-gray-500 mb-5 text-center px-2">
              {t('modal.subtitle', { name: approvalModalData?.doctorName, defaultValue: `Provide this one-time code to Dr. ${approvalModalData?.doctorName}:` })}
            </Text>

            <View className="w-full bg-primary-50 border border-primary-200 rounded-2xl p-4 items-center justify-center mb-4">
              <Text className="text-[32px] font-jakarta-bold text-primary-900 tracking-[8px]">
                {approvalModalData?.oneTimeCode}
              </Text>
            </View>

            <Text className="text-[12px] font-inter-regular text-gray-400 mb-6 text-center">
              {t('modal.expiresAt', {
                time: new Date(approvalModalData?.codeExpiresAt || '').toLocaleTimeString(isRTL ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
                defaultValue: `Code expires at: ${new Date(approvalModalData?.codeExpiresAt || '').toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
              })}
            </Text>

            <Pressable
              onPress={() => setApprovalModalData(null)}
              className="w-full h-[50px] bg-primary-600 rounded-2xl items-center justify-center shadow-sm"
              style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
            >
              <Text className="text-white font-jakarta-bold text-[16px]">
                {t('modal.done', 'Done')}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
