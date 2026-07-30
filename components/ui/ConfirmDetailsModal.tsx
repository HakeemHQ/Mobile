import  { useState } from 'react';
import { View, Text, Modal, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  CheckmarkCircle01Icon,
  Camera02Icon,
  File01Icon,
  Cancel01Icon,
} from '@hugeicons/core-free-icons';
import { Button } from './Button';
import { ConfirmDetailsModalProps } from '@/types/ui';

export function ConfirmDetailsModal({
  visible,
  imageUri,
  fileName,
  documentTitle,
  documentDate,
  onConfirm,
  onBackToEdit,
}: ConfirmDetailsModalProps) {
  const { t, i18n } = useTranslation('add');
  const isRTL = i18n.language === 'ar';
  const [showFullImage, setShowFullImage] = useState(false);

  if (!visible) return null;

  const isPdf =
    imageUri?.toLowerCase().includes('.pdf') ||
    fileName?.toLowerCase().endsWith('.pdf') ||
    fileName?.toLowerCase().includes('.pdf');

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onBackToEdit}>
      <View className="flex-1 justify-center items-center bg-black/50 px-5">
        <View className="bg-white rounded-3xl p-6 w-full max-w-sm items-center shadow-xl">
          <View className="w-12 h-12 rounded-full bg-[#DBEAFE] items-center justify-center mb-3">
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={26} color="#1A56DB" />
          </View>

          <Text className="text-[20px] font-jakarta-bold text-text-500 mb-1 text-center">
            {t('confirmModal.title')}
          </Text>
          <Text className="text-[14px] font-jakarta-regular text-text2-500 mb-5 text-center px-1 leading-5">
            {t('confirmModal.subtitle')}
          </Text>

          {isPdf ? (
            <View className={`w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center mb-4`}>
              <View className={`w-12 h-12 rounded-xl bg-red-100 items-center justify-center ${isRTL ? 'ml-3' : 'mr-3'}`}>
                <HugeiconsIcon icon={File01Icon} size={24} color="#DC2626" />
              </View>
              <View className={`flex-1 ${isRTL ? 'pl-2' : 'pr-2'}`}>
                <Text className={`text-[14px] font-jakarta-bold text-text-500 ${isRTL ? 'text-right' : 'text-left'}`} numberOfLines={1}>
                  {fileName || 'document.pdf'}
                </Text>
                <Text className={`text-[12px] font-jakarta-regular text-text2-400 mt-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t('confirmModal.pdfDocument')}
                </Text>
              </View>
            </View>
          ) : imageUri ? (
            <Pressable
              onPress={() => setShowFullImage(true)}
              className="w-full h-36 rounded-2xl overflow-hidden bg-gray-100 mb-4 relative border border-gray-200 active:opacity-90"
            >
              <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
              <View className={`absolute bottom-2.5 ${isRTL ? 'right-2.5' : 'left-2.5'} w-8 h-8 rounded-full bg-[#1F2937]/80 items-center justify-center`}>
                <HugeiconsIcon icon={Camera02Icon} size={16} color="#FFFFFF" />
              </View>
            </Pressable>
          ) : null}

          <View className="w-full bg-[#DBEAFE] rounded-xl p-3.5 mb-3">
            <Text className={`text-[13px] font-jakarta-bold text-[#1E3A8A] mb-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('confirmModal.documentTitle')}
            </Text>
            <Text className={`text-[14px] font-jakarta-regular text-[#1E3A8A] ${isRTL ? 'text-right' : 'text-left'}`}>
              {documentTitle}
            </Text>
          </View>

          <View className="w-full bg-[#DBEAFE] rounded-xl p-3.5 mb-5">
            <Text className={`text-[13px] font-jakarta-bold text-[#1E3A8A] mb-0.5 ${isRTL ? 'text-right' : 'text-left'}`}>
              {t('confirmModal.documentDate')}
            </Text>
            <Text className={`text-[14px] font-jakarta-regular text-[#1E3A8A] ${isRTL ? 'text-right' : 'text-left'}`}>
              {documentDate}
            </Text>
          </View>

          <Button
            title={t('confirmModal.confirm')}
            variant="primary"
            className="w-full mb-3"
            onPress={onConfirm}
          />

          <Button
            title={t('confirmModal.backToEdit')}
            variant="outline"
            className="w-full"
            onPress={onBackToEdit}
          />
        </View>

        {showFullImage && !isPdf && imageUri && (
          <Modal transparent animationType="fade" visible={showFullImage} onRequestClose={() => setShowFullImage(false)}>
            <View className="flex-1 bg-black/95 justify-between items-center p-5">
              <SafeAreaView className="w-full h-full justify-between items-center">
                <View className={`w-full ${isRTL ? 'flex-row-reverse' : 'flex-row'} justify-between items-center pt-2`}>
                  <Text className="text-white text-base font-jakarta-bold">
                    {t('confirmModal.imagePreview')}
                  </Text>
                  <Pressable
                    onPress={() => setShowFullImage(false)}
                    className="w-10 h-10 rounded-full bg-white/20 items-center justify-center"
                    hitSlop={10}
                  >
                    <HugeiconsIcon icon={Cancel01Icon} size={22} color="#FFFFFF" />
                  </Pressable>
                </View>

                <View className="flex-1 w-full justify-center items-center my-4">
                  <Image
                    source={{ uri: imageUri }}
                    className="w-full h-full"
                    resizeMode="contain"
                  />
                </View>

                <Button
                  title={t('confirmModal.close')}
                  variant="outline"
                  className="w-full bg-white/10 border-white/30 text-white"
                  onPress={() => setShowFullImage(false)}
                />
              </SafeAreaView>
            </View>
          </Modal>
        )}
      </View>
    </Modal>
  );
}
