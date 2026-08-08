import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export interface FilterOption {
  id: string;
  label: string;
}

export interface TimelineFilterChipsProps {
  selectedFilter: string;
  onSelectFilter: (filterId: string) => void;
  filters?: FilterOption[];
  containerClassName?: string;
}

export const TimelineFilterChips: React.FC<TimelineFilterChipsProps> = ({
  selectedFilter,
  onSelectFilter,
  filters,
  containerClassName,
}) => {
  const { t, i18n } = useTranslation('timeline');
  const isRTL = i18n.language === 'ar';

  const defaultFilters: FilterOption[] = [
    { id: 'all', label: t('filters.all', 'Approve') },
    { id: 'visits', label: t('filters.visits', 'Visits') },
    { id: 'labs', label: t('filters.labs', 'Labs') },
    { id: 'medications', label: t('filters.medications', 'Medications') },
    { id: 'scans', label: t('filters.scans', 'Scans') },
  ];

  const categories = filters || defaultFilters;

  return (
    <View className={cn('mb-4', containerClassName)}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 4,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          gap: 8,
        }}
      >
        {categories.map((category) => {
          const isSelected = selectedFilter === category.id;
          return (
            <Pressable
              key={category.id}
              onPress={() => onSelectFilter(category.id)}
              className={cn(
                'px-4 py-2 rounded-full border items-center justify-center',
                isSelected
                  ? 'bg-primary-900 border-primary-900'
                  : 'bg-white border-bg-700'
              )}
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            >
              <Text
                className={cn(
                  'text-[13px] font-jakarta-semibold',
                  isSelected ? 'text-bg-500' : 'text-bg-800'
                )}
              >
                {category.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};
