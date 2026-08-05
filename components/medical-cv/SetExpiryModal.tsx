import React from 'react';
import { Modal, Pressable, View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Cancel01Icon, CheckmarkCircle01Icon, Clock01Icon } from '@hugeicons/core-free-icons';
import { InfoBanner } from '@/components/ui/InfoBanner';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { colors } from '@/lib/theme';

export interface SetExpiryModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedExpiry: '24h' | '7d' | '30d' | 'custom';
  onSelectExpiry: (type: '24h' | '7d' | '30d' | 'custom') => void;
}

export function SetExpiryModal({
  visible,
  onClose,
  onConfirm,
  selectedExpiry,
  onSelectExpiry,
}: SetExpiryModalProps) {
  const { t, i18n } = useTranslation('medicalCv');
  const isRTL = i18n.language === 'ar';

  const renderOptionCard = (type: '24h' | '7d' | '30d' | 'custom', title: string, subtitle: string) => {
    const isActive = selectedExpiry === type;
    return (
      <TouchableOpacity
        onPress={() => onSelectExpiry(type)}
        className={cn(
          "flex-1 border rounded-2xl p-4 min-h-[92px] justify-between",
          isActive 
            ? "border-primary-500 bg-[#EEF2F6]"
            : "border-[#E5E7EB] bg-white"
        )}
        style={isActive ? { borderColor: colors.primary[500], backgroundColor: `${colors.primary.DEFAULT}10` } : {}}
        activeOpacity={0.8}
      >
        <View className="flex-1">
          <View className={cn("flex-row items-start justify-between w-full", isRTL && "flex-row-reverse")}>
            <Text className={cn("text-[14px] font-jakarta-bold", isActive ? "text-primary-600" : "text-[#1F2937]")} style={isActive ? { color: colors.primary[600] } : {}}>
              {title}
            </Text>
            {isActive && (
              <HugeiconsIcon icon={CheckmarkCircle01Icon} size={18} color={colors.primary[600]} />
            )}
          </View>
          <Text className={cn("text-[11px] font-jakarta-regular text-[#6B7280] mt-1.5", isRTL ? "text-right" : "text-left")}>
            {subtitle}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable 
        className="flex-1 justify-end bg-black/50" 
        onPress={onClose}
      >
        <Pressable 
          className="bg-white rounded-t-[32px] px-6 pt-6 pb-8 w-full shadow-2xl"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className={cn("flex-row items-center justify-between mb-6", isRTL && "flex-row-reverse")}>
            <Text className="text-[20px] font-jakarta-bold text-[#1F2937]">
              {t('setExpiryDate')}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <HugeiconsIcon icon={Cancel01Icon} size={24} color="#4B5563" />
            </TouchableOpacity>
          </View>

          {/* Description */}
          <Text className={cn("text-[14px] font-jakarta-regular text-[#4B5563] mb-6 leading-5", isRTL ? "text-right" : "text-left")}>
            {t('expiryDescription')}
          </Text>

          {/* Presets Grid */}
          <View className={cn("flex-row gap-4 mb-4", isRTL && "flex-row-reverse")}>
            {renderOptionCard('24h', t('twentyFourHours'), t('emergencyView'))}
            {renderOptionCard('7d', t('sevenDays'), t('standardReferral'))}
          </View>
          <View className={cn("flex-row gap-4 mb-6", isRTL && "flex-row-reverse")}>
            {renderOptionCard('30d', t('thirtyDays'), t('extendedReview'))}
            {renderOptionCard('custom', t('custom'), t('pickDate'))}
          </View>

          {/* Info Warning Banner */}
          <InfoBanner
            text={t('expiryWarning')}
            icon={<HugeiconsIcon icon={Clock01Icon} size={20} color={colors.primary[600]} />}
            bgColor={`${colors.primary.DEFAULT}12`}
            textColor={colors.primary[800]}
            borderColor="transparent"
            className="mb-6 border-0"
          />

          {/* Action Buttons */}
          <Button
            title={t('setDate')}
            variant="primary"
            onPress={onConfirm}
          />

          <Button
            title={t('cancel')}
            variant="outline"
            className="mt-3"
            onPress={onClose}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
