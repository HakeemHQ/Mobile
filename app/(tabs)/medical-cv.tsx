import React, { useState } from 'react';
import { View, ScrollView, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Upload01Icon,
  Share08Icon,
  SecurityCheckIcon,
} from '@hugeicons/core-free-icons';

import {
  MedicalCvHeader,
  MedicalCvBanner,
  SetExpiryModal,
  ShareLinkModal,
} from '@/components/medical-cv';
import { InfoBanner } from '@/components/ui/InfoBanner';
import { FastAccessButton } from '@/components/ui/FastAccessButton';
import { cn } from '@/lib/utils';
import { colors } from '@/lib/theme';

export default function MedicalCVScreen() {
  const { t, i18n } = useTranslation('medicalCv');
  const isRTL = i18n.language === 'ar';

  const [isExpiryModalVisible, setIsExpiryModalVisible] = useState(false);
  const [isLinkModalVisible, setIsLinkModalVisible] = useState(false);
  const [selectedExpiry, setSelectedExpiry] = useState<'24h' | '7d' | '30d' | 'custom'>('24h');

  const handleShare = () => {
    setIsExpiryModalVisible(true);
  };

  const handleDownload = () => {
    Alert.alert(t('downloadPdf', 'Download PDF'), 'Downloading PDF version of Medical CV...');
  };

  const handleUpload = () => {
    Alert.alert('Upload', 'Uploading custom document or statements...');
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1 bg-[#F9FAFB]" edges={['top', 'left', 'right']}>
        <View className="flex-1 px-5 pt-3">
          {/* Reusable Header */}
          <MedicalCvHeader
            onSharePress={handleShare}
            onUploadPress={handleUpload}
          />

          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {/* Reusable Blue Share Banner */}
            <MedicalCvBanner onPress={handleShare} />

            {/* Reusable Sourced Alert InfoBanner */}
            <InfoBanner
              text={t('sourcedAlert', 'All statements are sourced. Tap any field to see the source document.')}
              icon={
                <HugeiconsIcon icon={SecurityCheckIcon} size={24} color={colors.primary[900]} />
              }
              bgColor={`${colors.primary.DEFAULT}80`}
              textColor={colors.primary[900]}
              borderColor="transparent"
              className="mb-6 border-0"
            />

            {/* Action Cards Row */}
            <View className={cn('flex-row gap-4 mb-6', isRTL && 'flex-row-reverse')}>
              {/* Download PDF Card */}
              <FastAccessButton
                title={t('downloadPdf', 'Download PDF')}
                icon={<HugeiconsIcon icon={Upload01Icon} size={24} color={colors.primary[700]} />}
                onPress={handleDownload}
                style={{ flex: 1 }}
              />

              {/* Share Card */}
              <FastAccessButton
                title={t('shareCard', 'Share')}
                icon={<HugeiconsIcon icon={Share08Icon} size={24} color={colors.primary[700]} />}
                onPress={handleShare}
                style={{ flex: 1 }}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>

      {/* Set Expiry Date Modal Component */}
      <SetExpiryModal
        visible={isExpiryModalVisible}
        onClose={() => setIsExpiryModalVisible(false)}
        onConfirm={() => {
          setIsExpiryModalVisible(false);
          setIsLinkModalVisible(true);
        }}
        selectedExpiry={selectedExpiry}
        onSelectExpiry={setSelectedExpiry}
      />

      {/* Share Link Generated Modal Component */}
      <ShareLinkModal
        visible={isLinkModalVisible}
        onClose={() => setIsLinkModalVisible(false)}
        selectedExpiry={selectedExpiry}
      />
    </>
  );
}
