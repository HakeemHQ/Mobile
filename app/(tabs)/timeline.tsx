import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Stethoscope02Icon,
  PillIcon,
  FlaskConicalIcon,
  Delete02Icon,
  ArrowRight01Icon,
  ArrowLeft01Icon,
} from '@hugeicons/core-free-icons';

import {
  TimelineHeader,
  TimelineFilterChips,
  TimelineGroup,
  TimelineItemNodeProps,
} from '@/components/timeline';
import { cn } from '@/lib/utils';

export default function TimelineScreen() {
  const { t, i18n } = useTranslation('timeline');
  const isRTL = i18n.language === 'ar';

  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data structured by year matching design mockups & Figma specifications
  const rawTimelineData: { year: string; items: (TimelineItemNodeProps & { category: string })[] }[] = useMemo(() => [
    {
      year: '2025',
      items: [
        {
          id: 'item-1',
          date: 'Feb 3, 2025',
          category: 'labs',
          nodeType: 'lab',
          nodeBgColor: 'bg-[#BFD0F5]',
          nodeIcon: <HugeiconsIcon icon={Stethoscope02Icon} size={20} color="#1648B8" />,
          cardProps: {
            title: 'Comprehensive Metabolic Panel',
            tag: t('tags.labs', 'Labs'),
            tagVariant: 'labs',
            body: 'Lab results are ready for your review.',
            footerText: 'clinic report #8PC-0203',
          },
        },
        {
          id: 'item-2',
          date: 'Feb 3, 2025',
          category: 'labs',
          nodeType: 'lab',
          nodeBgColor: 'bg-[#BFD0F5]',
          nodeIcon: <HugeiconsIcon icon={Stethoscope02Icon} size={20} color="#1648B8" />,
          cardProps: {
            title: 'Comprehensive Metabolic Panel',
            tag: t('tags.labs', 'Labs'),
            tagVariant: 'labs',
            body: 'Lab results are ready for your review.',
            footerText: 'clinic report #8PC-0203',
          },
        },
        {
          id: 'item-3',
          date: 'Aug 15, 2025',
          category: 'visits',
          nodeType: 'visit',
          nodeBgColor: 'bg-[#F3E8FF]',
          nodeIcon: <HugeiconsIcon icon={FlaskConicalIcon} size={20} color="#9333EA" />,
          cardProps: {
            title: 'Cardiology Follow-up',
            subtitle: 'Dr. Ibrahim Khalil',
            tag: '10:30 PM',
            tagVariant: 'visits',
            footerText: 'Aug 15, 2025',
            rightIcon: (
              <View className="w-8 h-8 rounded-full bg-red-50 items-center justify-center">
                <HugeiconsIcon icon={Delete02Icon} size={16} color="#EF4444" />
              </View>
            ),
          },
        },
      ],
    },
    {
      year: '2024',
      items: [
        {
          id: 'item-4',
          date: 'Mar 3, 2024',
          category: 'medications',
          nodeType: 'medication',
          nodeBgColor: 'bg-[#A9E6D2]',
          nodeIcon: <HugeiconsIcon icon={PillIcon} size={20} color="#0D9B6C" />,
          cardProps: {
            title: 'Comprehensive Metabolic Panel',
            tag: t('tags.medication', 'Medication'),
            tagVariant: 'medication',
            body: 'Lab results are ready for your review.',
            footerText: 'clinic report #8PC-0203',
          },
        },
        {
          id: 'item-5',
          date: 'Starting Aug 10, 2024',
          category: 'medications',
          nodeType: 'medication',
          nodeBgColor: 'bg-[#E0E7FF]',
          nodeIcon: <HugeiconsIcon icon={PillIcon} size={20} color="#4338CA" />,
          cardProps: {
            title: 'Metformin 500mg',
            subtitle: '3 times every day',
            subtitleClassName: 'text-[#1A56DB] font-jakarta-semibold',
            footerText: 'Starting Aug 10, 2024',
            rightIcon: (
              <HugeiconsIcon
                icon={isRTL ? ArrowLeft01Icon : ArrowRight01Icon}
                size={20}
                color="#6B7280"
              />
            ),
          },
        },
      ],
    },
  ], [t, isRTL]);

  // Filtered timeline data according to selected category and search query
  const filteredGroups = useMemo(() => {
    return rawTimelineData
      .map((group) => {
        const filteredItems = group.items.filter((item) => {
          // Category match
          const matchesCategory =
            selectedFilter === 'all' || item.category === selectedFilter;

          // Search match
          const query = searchQuery.trim().toLowerCase();
          const matchesSearch =
            !query ||
            item.cardProps.title.toLowerCase().includes(query) ||
            (item.cardProps.body && item.cardProps.body.toLowerCase().includes(query)) ||
            (item.cardProps.subtitle && item.cardProps.subtitle.toLowerCase().includes(query)) ||
            (item.cardProps.footerText && item.cardProps.footerText.toLowerCase().includes(query)) ||
            item.date.toLowerCase().includes(query);

          return matchesCategory && matchesSearch;
        });

        return {
          ...group,
          items: filteredItems,
        };
      })
      .filter((group) => group.items.length > 0);
  }, [rawTimelineData, selectedFilter, searchQuery]);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1 bg-[#F9FAFB]" edges={['top', 'left', 'right']}>
        <View className="flex-1 px-5 pt-3">
          {/* Header Component */}
          <TimelineHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          {/* Reusable Category Filter Pills */}
          <TimelineFilterChips
            selectedFilter={selectedFilter}
            onSelectFilter={setSelectedFilter}
          />

          {/* Timeline List Content */}
          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {filteredGroups.length > 0 ? (
              filteredGroups.map((group, groupIdx) => (
                <TimelineGroup
                  key={group.year}
                  year={group.year}
                  items={group.items}
                  isLastGroup={groupIdx === filteredGroups.length - 1}
                />
              ))
            ) : (
              <View className="py-12 items-center justify-center">
                <Text className={cn('text-[14px] font-inter-regular text-gray-400', isRTL && 'text-right')}>
                  {t('noResults', 'No timeline records found.')}
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
}
