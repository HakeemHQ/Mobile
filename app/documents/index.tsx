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
  Keyboard,
  ScrollView,
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
  PillIcon,
  FlaskConicalIcon,
  Stethoscope02Icon,
} from '@hugeicons/core-free-icons';

import BackButton from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { InfoBanner } from '@/components/ui/InfoBanner';
import { TimelineItemNode } from '@/components/timeline/TimelineItemNode';
import { TimelineSkeletonNode } from '@/components/timeline';
import { useDocuments } from '@/hooks/useDocuments';
import { cn } from '@/lib/utils';
import { colors } from '@/lib/theme';
import type { DocumentItem } from '@/types/document';
import { useProfileStore } from '@/store/useProfileStore';

/** Status badge styles helper */
const getStatusBadge = (status: string, t: any) => {
  const lower = (status || '').toLowerCase();
  if (lower === 'completed' || lower === 'success') {
    return {
      bg: 'bg-secondary-50',
      border: 'border-secondary-100',
      text: 'text-secondary-700',
      icon: <HugeiconsIcon icon={CheckmarkCircle02Icon} size={13} color={colors.secondary[700]} />,
      label: t('statusCompleted'),
    };
  }
  if (lower === 'failed' || lower === 'error') {
    return {
      bg: 'bg-danger-50',
      border: 'border-danger-100',
      text: 'text-danger-700',
      icon: <HugeiconsIcon icon={AlertCircleIcon} size={13} color={colors.danger[700]} />,
      label: t('statusFailed'),
    };
  }
  return {
    bg: 'bg-primary-50',
    border: 'border-primary-100',
    text: 'text-primary-700',
    icon: <HugeiconsIcon icon={Clock01Icon} size={13} color={colors.primary[700]} />,
    label: t('statusProcessing'),
  };
};

const YearHeader = React.memo(({ year, isRTL }: { year: string; isRTL: boolean }) => (
  <View className={cn('flex-row items-center mb-4 mt-2', isRTL && 'flex-row-reverse')}>
    <Text className="text-[15px] font-jakarta-bold text-gray-500">
      {year}
    </Text>
    <View className={cn('flex-1 h-[1px] bg-gray-300', isRTL ? 'mr-3' : 'ml-3')} />
  </View>
));

type FlatListItem = 
  | { type: 'year-header'; year: string; key: string } 
  | { type: 'document'; item: DocumentItem; isLast: boolean; key: string };

export default function DocumentsScreen() {
  const { t, i18n } = useTranslation('home');
  const isRTL = i18n.language === 'ar';
  const router = useRouter();

  const profile = useProfileStore((state) => state.profile);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);

  React.useEffect(() => {
    if (!profile) {
      void fetchProfile();
    }
  }, [profile, fetchProfile]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');

  const { documents, loading, error, refreshing, refresh } = useDocuments();

  const isPending = profile?.identityVerificationStatus?.toLowerCase() === 'pending' || !!(error && String(error).includes('403'));

  // Search and category filtering
  const filteredDocuments = useMemo(() => {
    // 1. Filter by category first
    let docs = documents;
    if (selectedFilter === 'prescription') {
      docs = documents.filter((doc) => {
        const type = (doc.documentType || '').toLowerCase();
        return type.includes('prescription') || type.includes('medication') || type.includes('drug');
      });
    } else if (selectedFilter === 'lab_report') {
      docs = documents.filter((doc) => {
        const type = (doc.documentType || '').toLowerCase();
        return type.includes('lab') || type.includes('test') || type.includes('result');
      });
    } else if (selectedFilter === 'medical_visit') {
      docs = documents.filter((doc) => {
        const type = (doc.documentType || '').toLowerCase();
        return type.includes('visit') || type.includes('note') || type.includes('doctor');
      });
    }

    // 2. Filter by search query
    const query = searchQuery.trim().toLowerCase();
    if (!query) return docs;
    return docs.filter(
      (doc) =>
        doc.title.toLowerCase().includes(query) ||
        doc.documentType.toLowerCase().includes(query) ||
        doc.documentDate.toLowerCase().includes(query)
    );
  }, [documents, searchQuery, selectedFilter]);

  const flatData = useMemo(() => {
    // Group by year
    const groups: { [year: string]: DocumentItem[] } = {};
    filteredDocuments.forEach((doc) => {
      const year = new Date(doc.documentDate).getFullYear().toString();
      if (!groups[year]) groups[year] = [];
      groups[year].push(doc);
    });

    // Sort years descending
    const sortedYears = Object.keys(groups).sort((a, b) => Number(b) - Number(a));
    
    const flat: FlatListItem[] = [];
    sortedYears.forEach((year) => {
      flat.push({ type: 'year-header', year, key: `year-${year}` });
      const docs = groups[year];
      docs.forEach((doc, idx) => {
        const isLast = idx === docs.length - 1;
        flat.push({ type: 'document', item: doc, isLast, key: `doc-${doc.documentId}` });
      });
    });
    return flat;
  }, [filteredDocuments]);

  const renderItem = useCallback(
    ({ item: flatItem }: { item: FlatListItem }) => {
      if (flatItem.type === 'year-header') {
        return <YearHeader year={flatItem.year} isRTL={isRTL} />;
      }
      
      const { item, isLast } = flatItem;
      const badge = getStatusBadge(item.extractionStatus, t);
      const formattedDate = new Date(item.documentDate).toLocaleDateString(
        isRTL ? 'ar-EG' : 'en-US',
        { month: 'short', day: 'numeric', year: 'numeric' }
      );

      const lowerType = (item.documentType || '').toLowerCase();
      const isPrescription = lowerType.includes('prescription') || lowerType.includes('medication') || lowerType.includes('drug');
      const isLabReport = lowerType.includes('lab') || lowerType.includes('test') || lowerType.includes('result');
      const isMedicalVisit = lowerType.includes('visit') || lowerType.includes('note') || lowerType.includes('doctor');

      let nodeBg = 'bg-primary-50';
      let iconColor: string = colors.primary.DEFAULT;
      let CategoryIcon = File02Icon;

      if (isPrescription) {
        nodeBg = 'bg-primary-50';
        iconColor = colors.primary.DEFAULT;
        CategoryIcon = PillIcon;
      } else if (isLabReport) {
        nodeBg = 'bg-tertiary-50';
        iconColor = colors.tertiary.DEFAULT;
        CategoryIcon = FlaskConicalIcon;
      } else if (isMedicalVisit) {
        nodeBg = 'bg-secondary-50';
        iconColor = colors.secondary.DEFAULT;
        CategoryIcon = Stethoscope02Icon;
      }

      return (
        <TimelineItemNode
          id={item.documentId}
          date={formattedDate}
          nodeType={isPrescription ? 'medication' : isLabReport ? 'lab' : isMedicalVisit ? 'visit' : 'default'}
          nodeBgColor={nodeBg}
          nodeIcon={<HugeiconsIcon icon={CategoryIcon} size={24} color={iconColor} />}
          isLast={isLast}
          cardProps={{
            title: t(item.title, { defaultValue: item.title }),
            subtitle: t(item.documentType, { defaultValue: item.documentType }),
            tag: badge.label,
            onPress: () => router.push(`/documents/${item.documentId}` as any),
          }}
        />
      );
    },
    [isRTL, router, filteredDocuments]
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
                    {t('documents', { defaultValue: 'Documents' })}
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
                  placeholder={t('searchDocuments')}
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

          {/* Filter Chips */}
          {!isPending && (
            <View className="mb-4">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  paddingHorizontal: 4,
                  flexDirection: isRTL ? 'row-reverse' : 'row',
                  gap: 8,
                }}
              >
                {[
                  { id: 'all', labelKey: 'filterAll' },
                  { id: 'prescription', labelKey: 'filterPrescription' },
                  { id: 'lab_report', labelKey: 'filterLabReport' },
                  { id: 'medical_visit', labelKey: 'filterMedicalVisit' },
                ].map((opt) => {
                  const isSelected = selectedFilter === opt.id;
                  return (
                    <Pressable
                      key={opt.id}
                      onPress={() => setSelectedFilter(opt.id)}
                      className={cn(
                        'px-4 py-2 rounded-full border items-center justify-center',
                        isSelected
                          ? 'bg-primary-900 border-primary-900'
                          : 'bg-white border-gray-200'
                      )}
                      style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
                    >
                      <Text
                        className={cn(
                          'text-[13px] font-jakarta-semibold',
                          isSelected ? 'text-white' : 'text-gray-700'
                        )}
                      >
                        {t(opt.labelKey)}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          )}

          {/* Content */}
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
          ) : loading && !refreshing ? (
            <ScrollView showsVerticalScrollIndicator={false} className="flex-1 mt-4">
              {[1, 2, 3, 4, 5].map((item, idx) => (
                <TimelineSkeletonNode key={item} isLast={idx === 4} />
              ))}
            </ScrollView>
          ) : error && !loading ? (
            <View className="flex-1 items-center justify-center px-6">
              <Text className="text-[16px] font-jakarta-bold text-gray-700 mb-2">
                {t('failedToLoadDocuments')}
              </Text>
              <Text className="text-[14px] font-inter-regular text-gray-400 mb-4 text-center">
                {error}
              </Text>
              <Button
                title={t('retry')}
                variant="primary"
                onPress={refresh}
              />
            </View>
          ) : (
            <FlatList
              data={flatData}
              renderItem={renderItem}
              keyExtractor={(item) => item.key}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={refresh}
                  colors={[colors.primary.DEFAULT]}
                  tintColor={colors.primary.DEFAULT}
                />
              }
              ListEmptyComponent={
                <View className="flex-1 items-center justify-center px-4 py-8">
                  <Image
                    source={require('@/assets/images/documentEmptyList.png')}
                    style={{ width: 220, height: 220 }}
                    resizeMode="contain"
                    className="mb-4"
                  />
                  {searchQuery.trim() ? (
                    <>
                      <Text className={cn('text-center font-jakarta-bold text-[18px] text-gray-900 mb-2', isRTL && 'text-right')}>
                        {t('emptyDocumentsSearch', { defaultValue: 'No documents found' })}
                      </Text>
                      <Text className={cn('text-center font-inter-regular text-[14px] text-gray-500 max-w-[300px]', isRTL && 'text-right')}>
                        {t('emptyDocumentsSearchSubtitle', {
                          defaultValue: `We couldn't find any documents matching "${searchQuery}".`,
                          query: searchQuery,
                        })}
                      </Text>
                    </>
                  ) : (
                    <>
                      <Text className={cn('text-center font-jakarta-bold text-[20px] text-gray-900 mb-2', isRTL && 'text-right')}>
                        {t('emptyDocumentsTitle', { defaultValue: 'No documents yet' })}
                      </Text>
                      <Text className={cn('text-center font-inter-regular text-[14px] text-gray-500 max-w-[320px] mb-6', isRTL && 'text-right')}>
                        {t('emptyDocumentsSubtitle', { defaultValue: 'Keep track of your health documents and medical files in one place.' })}
                      </Text>
                      <InfoBanner
                        text={t('onlyDocCanUpload', { defaultValue: 'NOTE: ONLY DOCTORS CAN UPLOAD DOCUMENTS' })}
                        icon={<HugeiconsIcon icon={AlertCircleIcon} size={20} color={colors.primary.DEFAULT} />}
                        bgColor="bg-primary-50"
                        textColor="text-primary-900"
                        borderColor="border-primary-100"
                        className="w-full max-w-[320px]"
                      />
                    </>
                  )}
                </View>
              }
            />
          )}
        </View>
      </SafeAreaView>
    </>
  );
}
