import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Image,
  Linking,
  Modal,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  File02Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  AlertCircleIcon,
  Link02Icon,
  Cancel01Icon,
  ViewIcon,
  Camera02Icon,
  FlaskConicalIcon,
  PillIcon,
  Stethoscope02Icon,
} from '@hugeicons/core-free-icons';

import BackButton from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { InfoBanner } from '@/components/ui/InfoBanner';
import { useDocumentDetail } from '@/hooks/useDocuments';
import { cn } from '@/lib/utils';
import { colors } from '@/lib/theme';

/** Status badge styles helper */
const getStatusStyle = (status: string, t: any) => {
  const lower = (status || '').toLowerCase();
  if (lower === 'completed' || lower === 'success') {
    return {
      bg: 'bg-secondary-50',
      text: 'text-secondary-700',
      icon: <HugeiconsIcon icon={CheckmarkCircle02Icon} size={14} color={colors.secondary[700]} />,
      label: t('statusCompleted'),
    };
  }
  if (lower === 'failed' || lower === 'error') {
    return {
      bg: 'bg-danger-50',
      text: 'text-danger-700',
      icon: <HugeiconsIcon icon={AlertCircleIcon} size={14} color={colors.danger[700]} />,
      label: t('statusFailed'),
    };
  }
  return {
    bg: 'bg-primary-50',
    text: 'text-primary-700',
    icon: <HugeiconsIcon icon={Clock01Icon} size={14} color={colors.primary[700]} />,
    label: t('statusPending'),
  };
};

/** Format an ISO date string to a human-readable format. */
const formatDate = (dateStr: string, isRTL: boolean): string => {
  try {
    return new Date(dateStr).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
};

/** Determine if document is an image vs file */
const checkIsImage = (path?: string | null): boolean => {
  if (!path) return false;
  const lower = path.toLowerCase();
  if (lower.endsWith('.pdf')) return false;
  return (
    /\.(jpg|jpeg|png|webp|gif|bmp|heic)$/i.test(lower) ||
    lower.includes('/image/') ||
    !lower.includes('.')
  );
};

const getDocumentTypeConfig = (docType: string) => {
  const lower = (docType || '').toLowerCase();
  if (lower.includes('lab') || lower.includes('test') || lower.includes('result')) {
    return {
      nodeBg: 'bg-tertiary-50',
      textColor: 'text-tertiary-700',
      icon: <HugeiconsIcon icon={FlaskConicalIcon} size={24} color={colors.tertiary.DEFAULT} />,
    };
  }
  if (lower.includes('medication') || lower.includes('prescription') || lower.includes('drug')) {
    return {
      nodeBg: 'bg-primary-50',
      textColor: 'text-primary-700',
      icon: <HugeiconsIcon icon={PillIcon} size={24} color={colors.primary.DEFAULT} />,
    };
  }
  if (lower.includes('visit') || lower.includes('note') || lower.includes('doctor')) {
    return {
      nodeBg: 'bg-secondary-50',
      textColor: 'text-secondary-700',
      icon: <HugeiconsIcon icon={Stethoscope02Icon} size={24} color={colors.secondary.DEFAULT} />,
    };
  }
  return {
    nodeBg: 'bg-primary-50',
    textColor: 'text-primary-700',
    icon: <HugeiconsIcon icon={File02Icon} size={24} color={colors.primary.DEFAULT} />,
  };
};

export default function DocumentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, i18n } = useTranslation('home');
  const isRTL = i18n.language === 'ar';
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const { document, loading, error, retry } = useDocumentDetail(id);
  const [showFullImage, setShowFullImage] = useState(false);

  const handleOpenBrowser = () => {
    if (document?.documentPath) {
      Linking.openURL(document.documentPath).catch(() => {
        // Fallback
      });
    }
  };

  if (loading) {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView className="flex-1 bg-[#F9FAFB]" edges={['top', 'left', 'right']}>
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
            <Text className="text-[14px] font-inter-regular text-gray-400 mt-3">
              {t('loadingDocumentDetails')}
            </Text>
          </View>
        </SafeAreaView>
      </>
    );
  }

  if (error || !document) {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView className="flex-1 bg-[#F9FAFB]" edges={['top', 'left', 'right']}>
          <View className="px-5 pt-4">
            <BackButton />
          </View>
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-[16px] font-jakarta-bold text-gray-700 mb-2">
              {t('failedToLoadDocument')}
            </Text>
            <Text className="text-[14px] font-inter-regular text-gray-400 mb-4 text-center">
              {error || ''}
            </Text>
            <Button
              title={t('retry')}
              variant="primary"
              onPress={retry}
            />
          </View>
        </SafeAreaView>
      </>
    );
  }

  const statusStyle = getStatusStyle(document.extractionStatus, t);
  const formattedDate = formatDate(document.documentDate, isRTL);
  const isImage = checkIsImage(document.documentPath);
  const docConfig = getDocumentTypeConfig(document.documentType);
  const secureImageUri = document?.documentPath?.replace(/^http:\/\//i, 'https://');

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1 bg-[#F9FAFB]" edges={['top', 'left', 'right']}>
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Header */}
          <View className={cn('flex-row items-center justify-between px-5 pt-4 pb-2', isRTL && 'flex-row-reverse')}>
            <BackButton />
            <View className={cn('px-3 py-1.5 rounded-full', docConfig.nodeBg)}>
              <Text className={cn('text-[12px] font-jakarta-bold', docConfig.textColor)}>
                {document.documentType}
              </Text>
            </View>
          </View>

          {/* Main Info Card */}
          <View className="mx-5 mt-4 bg-white rounded-2xl border border-[#E5E7EB] p-5 shadow-sm">
            <View className={cn('flex-row items-center mb-4', isRTL && 'flex-row-reverse')}>
              <View className={cn('w-12 h-12 rounded-2xl items-center justify-center', docConfig.nodeBg, isRTL ? 'ml-3' : 'mr-3')}>
                {docConfig.icon}
              </View>
              <View className="flex-1">
                <Text className={cn('text-[20px] font-jakarta-bold text-gray-900 leading-6', isRTL && 'text-right')}>
                  {document.title}
                </Text>
              </View>
            </View>

            {/* Status & Date */}
            <View className={cn('flex-row items-center gap-3 mb-1', isRTL && 'flex-row-reverse')}>
              <View className={cn('flex-row items-center gap-1.5 px-3 py-1.5 rounded-full', statusStyle.bg, isRTL && 'flex-row-reverse')}>
                {statusStyle.icon}
                <Text className={cn('text-[12px] font-jakarta-semibold', statusStyle.text)}>
                  {statusStyle.label}
                </Text>
              </View>
              <Text className={cn('text-[13px] font-inter-regular text-gray-500', isRTL && 'text-right')}>
                {formattedDate}
              </Text>
            </View>
          </View>

          {/* Failure Alert */}
          {document.failureCode && (
            <View className="mx-5 mt-4">
              <InfoBanner
                text={`${t('failureCode')}${document.failureCode}`}
                bgColor={colors.danger[50]}
                textColor={colors.danger[700]}
                borderColor="transparent"
              />
            </View>
          )}

          {/* Document Content Section */}
          <View className="mx-5 mt-6">
            <Text className={cn('text-[16px] font-jakarta-bold text-gray-900 mb-3', isRTL && 'text-right')}>
              {t('documentContent')}
            </Text>

            {document.documentPath ? (
              <View className="w-full">
                <View className="bg-white rounded-2xl border border-[#E5E7EB] p-2 shadow-sm mb-5">
                  {isImage ? (
                    /* Image Document Thumbnail */
                    <Pressable
                      onPress={() => setShowFullImage(true)}
                      className="w-full h-44 rounded-xl overflow-hidden bg-gray-100 relative border border-gray-100 active:opacity-90"
                    >
                      <Image
                        source={{ uri: secureImageUri }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                      <View className={cn('absolute bottom-3 w-10 h-10 rounded-full bg-[#1F2937]/80 items-center justify-center shadow-lg', isRTL ? 'right-3' : 'left-3')}>
                        <HugeiconsIcon icon={Camera02Icon} size={20} color="#FFFFFF" />
                      </View>
                    </Pressable>
                  ) : (
                    /* Non-Image Document Thumbnail */
                    <View className="items-center py-6 px-4">
                      <View className="w-16 h-16 bg-primary-50 rounded-2xl items-center justify-center mb-4">
                        <HugeiconsIcon icon={File02Icon} size={36} color={colors.primary.DEFAULT} />
                      </View>
                      <Text className="text-[15px] font-jakarta-bold text-gray-900 text-center mb-1">
                        {document.title}
                      </Text>
                      <Text className="text-[13px] font-inter-regular text-gray-500 text-center mb-2 px-4 leading-5">
                        {t('pdfHelperText')}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Full Width Buttons outside the card */}
                {isImage && (
                  <Button
                    title={t('viewDocument')}
                    leftIcon={<HugeiconsIcon icon={ViewIcon} size={18} color="#FFFFFF" />}
                    variant="primary"
                    className="w-full mb-3"
                    onPress={() => setShowFullImage(true)}
                  />
                )}

                <Button
                  title={t('openInBrowser')}
                  leftIcon={<HugeiconsIcon icon={Link02Icon} size={18} color={isImage ? colors.primary.DEFAULT : '#FFFFFF'} />}
                  variant={isImage ? "outline" : "primary"}
                  className="w-full"
                  onPress={handleOpenBrowser}
                />
              </View>
            ) : (
              <View className="bg-white rounded-2xl border border-[#E5E7EB] p-6 items-center justify-center">
                <Text className="text-[14px] font-inter-regular text-gray-400">
                  {t('noDocumentPath')}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Fullscreen Image Modal with true Zoom support */}
      {showFullImage && isImage && document?.documentPath && (
        <Modal
          visible={showFullImage}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowFullImage(false)}
        >
          <View className="flex-1 bg-black/95">
            <View className="flex-1 flex-col justify-between relative">
              {/* Top Header Overlay */}
              <View
                className="absolute w-full z-50 flex-row items-center justify-between px-5"
                style={{ top: Math.max(insets.top, 24) + 10 }}
              >
                <Text className={cn("text-white text-[16px] font-jakarta-bold flex-1", isRTL && "text-right")} numberOfLines={1}>
                  {document.title}
                </Text>
                <Pressable
                  onPress={() => setShowFullImage(false)}
                  className="w-10 h-10 rounded-full bg-white/20 items-center justify-center ml-4"
                  hitSlop={15}
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={22} color="#FFFFFF" />
                </Pressable>
              </View>

              {/* Interactive Zoomable Image */}
              <View className="flex-1 w-full justify-center items-center">
                <ScrollView
                  maximumZoomScale={4}
                  minimumZoomScale={1}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
                  style={{ width: '100%', height: '100%' }}
                >
                  <Image
                    source={{ uri: secureImageUri }}
                    style={{ width: width, height: height * 0.7 }}
                    resizeMode="contain"
                  />
                </ScrollView>
              </View>

              {/* Bottom Close Button Overlay */}
              <View
                className="absolute w-full px-5 z-50"
                style={{ bottom: Math.max(insets.bottom, 24) + 10 }}
              >
                <Button
                  title={t('close')}
                  variant="outline"
                  className="w-full bg-white/10 border-white/30 text-white shadow-lg"
                  onPress={() => setShowFullImage(false)}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}
