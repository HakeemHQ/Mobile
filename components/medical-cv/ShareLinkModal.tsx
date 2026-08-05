import React, { useState } from 'react';
import { Modal, Pressable, View, Text, TouchableOpacity, Platform, Clipboard } from 'react-native';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Calendar03Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { colors } from '@/lib/theme';

export interface ShareLinkModalProps {
  visible: boolean;
  onClose: () => void;
  selectedExpiry: '24h' | '7d' | '30d' | 'custom';
}

export function ShareLinkModal({
  visible,
  onClose,
  selectedExpiry,
}: ShareLinkModalProps) {
  const { t, i18n } = useTranslation('medicalCv');
  const isRTL = i18n.language === 'ar';
  const [copied, setCopied] = useState(false);

  const getExpiryDateString = (expiryType: '24h' | '7d' | '30d' | 'custom') => {
    const date = new Date();
    if (expiryType === '24h') {
      date.setDate(date.getDate() + 1);
    } else if (expiryType === '7d') {
      date.setDate(date.getDate() + 7);
    } else if (expiryType === '30d') {
      date.setDate(date.getDate() + 30);
    } else {
      date.setDate(date.getDate() + 15);
    }

    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    const locale = i18n.language === 'ar' ? 'ar-EG' : 'en-US';
    return date.toLocaleDateString(locale, options);
  };

  const handleCopy = () => {
    const linkText = 'healthcv.io/share/s9f2k7a9';
    if (Platform.OS === 'web') {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(linkText);
      }
    } else {
      try {
        Clipboard.setString(linkText);
      } catch (e) {}
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable 
        className="flex-1 justify-center items-center bg-black/50 px-6" 
        onPress={onClose}
      >
        <Pressable 
          className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl items-center"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Title */}
          <Text className="text-[20px] font-jakarta-bold text-[#1F2937] text-center mb-1">
            {t('shareLinkGenerated')}
          </Text>

          {/* Subtitle */}
          <Text className="text-[13px] font-jakarta-regular text-[#6B7280] text-center mb-6 leading-5">
            {t('linkReady')}
          </Text>

          {/* Link Box */}
          <View className="border border-[#E5E7EB] rounded-2xl p-4 bg-white flex-row items-center justify-between w-full mb-6">
            <Text className="text-[13px] font-jakarta-medium text-[#1F2937] flex-1 mr-3 text-left" numberOfLines={1}>
              healthcv.io/share/s9f2k7a9
            </Text>
            <TouchableOpacity 
              onPress={handleCopy}
              activeOpacity={0.7}
            >
              <Text className="font-jakarta-bold text-[14px]" style={{ color: colors.primary[500] }}>
                {copied ? t('copied') : t('copy')}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Calendar Expiry Notice */}
          <View className={cn("flex-row items-center justify-center gap-2 mb-8", isRTL && "flex-row-reverse")}>
            <HugeiconsIcon icon={Calendar03Icon} size={18} color="#4B5563" />
            <Text className="text-[13px] font-jakarta-medium text-[#4B5563]">
              {t('linkWillExpire')} {getExpiryDateString(selectedExpiry)}
            </Text>
          </View>

          {/* Close Button */}
          <Button
            title={t('close')}
            variant="primary"
            onPress={onClose}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}
