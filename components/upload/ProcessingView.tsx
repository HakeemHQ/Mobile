import React, { useEffect, useState } from 'react';
import { View, Text, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Svg, { Path } from 'react-native-svg';
import { ProcessingStepItem } from './ProcessingStepItem';
import { useDocumentStore } from '@/store/useDocumentStore';
import { useRouter } from 'expo-router';
import { Button } from '@/components/ui/Button';

export const ProcessingView: React.FC = () => {
  const { t, i18n } = useTranslation('add');
  const isRTL = i18n.language === 'ar';
  const router = useRouter();

  const processingStep = useDocumentStore((state) => state.processingStep);
  const uploadStatus = useDocumentStore((state) => state.uploadStatus);
  const errorMessage = useDocumentStore((state) => state.errorMessage);
  const reset = useDocumentStore((state) => state.reset);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const steps = [
    t('processing.step1', { defaultValue: 'Uploading document' }),
    t('processing.step2', { defaultValue: 'Detecting document information' }),
    t('processing.step3', { defaultValue: 'Extracting medical information' }),
    t('processing.step4', { defaultValue: 'Verifying data quality' }),
    t('processing.step5', { defaultValue: 'Ready for review' }),
  ];

  const handleNavigateHome = () => {
    reset();
    router.replace('/(tabs)');
  };

  useEffect(() => {
    if (uploadStatus === 'success' && processingStep >= 4) {
      setShowSuccessModal(true);
    }
  }, [uploadStatus, processingStep]);

  const progressPercent = Math.min(100, Math.max(15, ((processingStep + 1) / steps.length) * 100));

  if (uploadStatus === 'error') {
    return (
      <SafeAreaView className="flex-1 bg-bg px-6 pt-10" edges={['top', 'left', 'right']}>
        <View className="flex-1 items-center justify-center p-4">
          <View className="w-16 h-16 rounded-full bg-red-100 items-center justify-center mb-6">
            <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
              <Path d="M18 6L6 18M6 6l12 12" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
          <Text className="text-[22px] font-jakarta-bold text-gray-900 text-center mb-2">
            Upload Failed
          </Text>
          <Text className="text-[15px] font-jakarta-medium text-gray-500 text-center mb-8 px-4">
            {errorMessage || 'Failed to upload and extract document. Please try again.'}
          </Text>
          <Button
            title="Go Back"
            variant="primary"
            className="w-full max-w-xs"
            onPress={() => router.back()}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg px-6 pt-10" edges={['top', 'left', 'right']}>
      <View className="flex-1 items-center justify-start pt-6">
        <View className="w-16 h-16 rounded-full bg-[#A7F3D0] items-center justify-center mb-6 shadow-sm">
          <Svg width={32} height={32} viewBox="0 0 24 24" fill="none">
            <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#065F46" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>

        <Text className="text-[24px] font-jakarta-bold text-[#06432E] text-center mb-2 px-2">
          {t('processing.title', { defaultValue: 'AI is reading your document' })}
        </Text>
        <Text className="text-[15px] font-jakarta-medium text-gray-500 text-center mb-8">
          {t('processing.subtitle', { defaultValue: 'this usually takes 10-20 seconds' })}
        </Text>

        <View className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden mb-8">
          <View
            className="bg-[#06432E] h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </View>

        <View className="w-full">
          {steps.map((stepLabel, index) => (
            <ProcessingStepItem
              key={index}
              label={stepLabel}
              stepIndex={index}
              currentStep={processingStep}
              isRTL={isRTL}
            />
          ))}
        </View>
      </View>

      {/* Success Modal Popup */}
      <Modal transparent visible={showSuccessModal} animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/60 px-5">
          <View className="bg-white rounded-3xl p-6 w-full max-w-sm items-center shadow-2xl">
            <View className="w-16 h-16 rounded-full bg-[#D1FAE5] items-center justify-center mb-4">
              <Svg width={36} height={36} viewBox="0 0 24 24" fill="none">
                <Path
                  d="M20 6L9 17l-5-5"
                  stroke="#059669"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </View>

            <Text className="text-[22px] font-jakarta-bold text-gray-900 mb-2 text-center">
              {t('processing.successTitle', { defaultValue: 'Completed Successfully!' })}
            </Text>

            <Text className="text-[14px] font-jakarta-medium text-gray-500 mb-6 text-center leading-5 px-2">
              {t('processing.successSubtitle', { defaultValue: 'Your document has been uploaded and processed.' })}
            </Text>

            <Button
              title={t('processing.goToHome', { defaultValue: 'Go to Home' })}
              variant="primary"
              className="w-full"
              onPress={handleNavigateHome}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
