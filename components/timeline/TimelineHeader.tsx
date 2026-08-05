import React, { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Search02Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';

export interface TimelineHeaderProps {
  title?: string;
  searchQuery: string;
  onSearchChange: (text: string) => void;
  containerClassName?: string;
}

export const TimelineHeader: React.FC<TimelineHeaderProps> = ({
  title,
  searchQuery,
  onSearchChange,
  containerClassName,
}) => {
  const { t, i18n } = useTranslation('timeline');
  const isRTL = i18n.language === 'ar';
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const displayTitle = title || t('title', 'Time line');

  return (
    <View className={cn('mb-4', containerClassName)}>
      <View className={cn('flex-row items-center justify-between', isRTL && 'flex-row-reverse')}>
        {!isSearchOpen ? (
          <>
            <Text className={cn('text-[26px] font-jakarta-bold text-secondary-900', isRTL && 'text-right')}>
              {displayTitle}
            </Text>

            <Pressable
              onPress={() => setIsSearchOpen(true)}
              className="w-11 h-11 rounded-full border border-gray-200 bg-white items-center justify-center shadow-sm"
              style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
            >
              <HugeiconsIcon icon={Search02Icon} size={20} color="#374151" />
            </Pressable>
          </>
        ) : (
          <View className={cn('flex-1 flex-row items-center bg-white border border-gray-300 rounded-2xl px-3 py-2', isRTL && 'flex-row-reverse')}>
            <HugeiconsIcon icon={Search02Icon} size={18} color="#6B7280" />
            
            <TextInput
              value={searchQuery}
              onChangeText={onSearchChange}
              placeholder={t('searchPlaceholder', 'Search timeline...')}
              placeholderTextColor="#9CA3AF"
              className={cn(
                'flex-1 text-[14px] font-inter-regular text-gray-900 mx-2 py-0',
                isRTL && 'text-right'
              )}
              autoFocus
            />

            <Pressable
              onPress={() => {
                onSearchChange('');
                setIsSearchOpen(false);
              }}
              className="p-1"
            >
              <HugeiconsIcon icon={Cancel01Icon} size={18} color="#6B7280" />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};
