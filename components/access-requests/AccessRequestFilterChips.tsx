import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

export interface AccessRequestFilterChipsProps {
  selectedFilter: string;
  onSelectFilter: (filterId: string) => void;
  containerClassName?: string;
}

interface FilterChipOption {
  id: string;
  labelEn: string;
  labelAr: string;
  activeBg: string;
  activeBorder: string;
  dotColor: string;
}

const FILTER_OPTIONS: FilterChipOption[] = [
  {
    id: 'all',
    labelEn: 'All',
    labelAr: 'الكل',
    activeBg: '#1E3A5F',
    activeBorder: '#1E3A5F',
    dotColor: '#1E3A5F',
  },
  {
    id: 'pending',
    labelEn: 'Pending',
    labelAr: 'قيد الانتظار',
    activeBg: '#D97706',
    activeBorder: '#D97706',
    dotColor: '#D97706',
  },
  {
    id: 'active',
    labelEn: 'Active',
    labelAr: 'نشط',
    activeBg: '#059669',
    activeBorder: '#059669',
    dotColor: '#059669',
  },
  {
    id: 'revoked',
    labelEn: 'Revoked',
    labelAr: 'ملغي',
    activeBg: '#E11D48',
    activeBorder: '#E11D48',
    dotColor: '#E11D48',
  },
  {
    id: 'expired',
    labelEn: 'Expired',
    labelAr: 'منتهي',
    activeBg: '#475569',
    activeBorder: '#475569',
    dotColor: '#475569',
  },
];

export const AccessRequestFilterChips: React.FC<AccessRequestFilterChipsProps> = ({
  selectedFilter,
  onSelectFilter,
  containerClassName,
}) => {
  const { t, i18n } = useTranslation('accessRequests');
  const isRTL = i18n.language === 'ar';

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
        {FILTER_OPTIONS.map((opt) => {
          const isSelected = selectedFilter === opt.id;
          return (
            <Pressable
              key={opt.id}
              onPress={() => onSelectFilter(opt.id)}
              className={cn(
                'px-4 py-2 rounded-full border items-center justify-center flex-row',
                isRTL && 'flex-row-reverse'
              )}
              style={[
                {
                  backgroundColor: isSelected ? opt.activeBg : '#FFFFFF',
                  borderColor: isSelected ? opt.activeBorder : '#D1D5DB',
                },
              ]}
            >
              {/* Color dot indicator */}
              {!isSelected && opt.id !== 'all' && (
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: opt.dotColor,
                    marginRight: isRTL ? 0 : 6,
                    marginLeft: isRTL ? 6 : 0,
                  }}
                />
              )}
              <Text
                className="text-[13px] font-jakarta-semibold"
                style={{ color: isSelected ? '#FFFFFF' : '#374151' }}
              >
                {t(`filters.${opt.id}`, { defaultValue: isRTL ? opt.labelAr : opt.labelEn })}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
};
