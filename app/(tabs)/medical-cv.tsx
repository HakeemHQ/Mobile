import React, {
  useCallback,
  useState,
} from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StatusBar,
  View,
} from 'react-native';
import {
  router,
  useFocusEffect,
} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Share08Icon,
  Upload01Icon,
} from '@hugeicons/core-free-icons';

import {
  MedicalCvBanner,
  MedicalCvHeader,
  MedicalCvStatusBanner,
  SetExpiryModal,
  ShareLinkModal,
} from '@/components/medical-cv';
import { FastAccessButton } from '@/components/ui/FastAccessButton';

import {
  createMedicalCvPreviewLink,
  getLatestMedicalCvVersionId,
} from '@/lib/api';
import { colors } from '@/lib/theme';
import { cn } from '@/lib/utils';

import type {
  ExpiryType,
  MedicalCvLoadStatus,
} from '@/types/medical-cv';

function getErrorMessage(
  error: unknown,
  fallback: string,
): string {
  return error instanceof Error &&
    error.message.trim()
    ? error.message
    : fallback;
}

export default function MedicalCVScreen() {
  const { t, i18n } =
    useTranslation('medicalCv');

  const isRTL =
    i18n.language === 'ar';

  const [
    cvStatus,
    setCvStatus,
  ] =
    useState<MedicalCvLoadStatus>(
      'loading',
    );

  const [
    cvError,
    setCvError,
  ] = useState('');

  const [
    latestVersionId,
    setLatestVersionId,
  ] =
    useState<string | null>(null);

  const [
    isExpiryModalVisible,
    setIsExpiryModalVisible,
  ] = useState(false);

  const [
    isLinkModalVisible,
    setIsLinkModalVisible,
  ] = useState(false);

  const [
    selectedExpiry,
    setSelectedExpiry,
  ] =
    useState<ExpiryType>('24h');

  const [
    previewUrl,
    setPreviewUrl,
  ] = useState('');

  const [
    previewExpiresAt,
    setPreviewExpiresAt,
  ] =
    useState<string | null>(null);

  const [
    isCreatingPreviewLink,
    setIsCreatingPreviewLink,
  ] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadMedicalCv =
        async () => {
          setCvStatus('loading');
          setCvError('');

          try {
            const versionId =
              await getLatestMedicalCvVersionId();

            if (!isActive) {
              return;
            }

            setLatestVersionId(
              versionId,
            );

            setCvStatus('success');
          } catch (
          error: unknown
          ) {
            if (!isActive) {
              return;
            }

            setLatestVersionId(
              null,
            );

            setCvStatus('error');

            setCvError(
              getErrorMessage(
                error,
                'Unable to load your Medical CV.',
              ),
            );
          }
        };

      void loadMedicalCv();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const hasMedicalCv =
    cvStatus === 'success' &&
    latestVersionId !== null;

  const actionsDisabled =
    !hasMedicalCv ||
    isCreatingPreviewLink;

  const handleShare = () => {
    if (!hasMedicalCv) {
      return;
    }

    setIsExpiryModalVisible(
      true,
    );
  };

  const handleConfirmShare =
    async () => {
      if (
        !latestVersionId ||
        isCreatingPreviewLink
      ) {
        return;
      }

      setIsCreatingPreviewLink(
        true,
      );

      try {
        const preview =
          await createMedicalCvPreviewLink(
            latestVersionId,
          );

        setPreviewUrl(
          preview.pdfUrl,
        );

        setPreviewExpiresAt(
          preview.previewExpiresAt,
        );

        setIsExpiryModalVisible(
          false,
        );

        setIsLinkModalVisible(
          true,
        );
      } catch (
      error: unknown
      ) {
        Alert.alert(
          t(
            'share',
            'Share',
          ),
          getErrorMessage(
            error,
            'Unable to create a sharing link. Please try again.',
          ),
        );
      } finally {
        setIsCreatingPreviewLink(
          false,
        );
      }
    };

  const handleDownload =
    async () => {
      if (
        !latestVersionId ||
        isCreatingPreviewLink
      ) {
        return;
      }

      setIsCreatingPreviewLink(
        true,
      );

      try {
        const preview =
          await createMedicalCvPreviewLink(
            latestVersionId,
          );

        const canOpen =
          await Linking.canOpenURL(
            preview.pdfUrl,
          );

        if (!canOpen) {
          throw new Error(
            'The PDF preview could not be opened on this device.',
          );
        }

        await Linking.openURL(
          preview.pdfUrl,
        );
      } catch (
      error: unknown
      ) {
        Alert.alert(
          t(
            'downloadPdf',
            'Download PDF',
          ),
          getErrorMessage(
            error,
            'Unable to open the Medical CV PDF. Please try again.',
          ),
        );
      } finally {
        setIsCreatingPreviewLink(
          false,
        );
      }
    };

  const handleUpload = () => {
    router.push('/add');
  };

  return (
    <>
      <StatusBar
        barStyle="dark-content"
      />

      <SafeAreaView
        className="flex-1 bg-bg"
        edges={[
          'top',
          'left',
          'right',
        ]}
      >
        <View className="flex-1 px-5 pt-3">
          <MedicalCvHeader
            onUploadPress={
              handleUpload
            }
            onSharePress={
              actionsDisabled
                ? undefined
                : handleShare
            }
          />

          <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={
              false
            }
            contentContainerStyle={{
              paddingBottom: 100,
            }}
          >
            <MedicalCvBanner
              onPress={
                actionsDisabled
                  ? undefined
                  : handleShare
              }
              containerClassName={
                actionsDisabled
                  ? 'opacity-40'
                  : undefined
              }
            />

            <MedicalCvStatusBanner
              status={cvStatus}
              hasMedicalCv={
                hasMedicalCv
              }
              error={cvError}
            />

            <View
              className={cn(
                'mb-6 flex-row gap-4',
                isRTL &&
                'flex-row-reverse',
              )}
            >
              <FastAccessButton
                title={t(
                  'downloadPdf',
                  'Download PDF',
                )}
                icon={
                  <HugeiconsIcon
                    icon={
                      Upload01Icon
                    }
                    size={24}
                    color={
                      actionsDisabled
                        ? colors
                          .text2[300]
                        : colors
                          .primary[900]
                    }
                  />
                }
                disabled={
                  actionsDisabled
                }
                onPress={() => {
                  void handleDownload();
                }}
                accessibilityLabel={t(
                  'downloadPdf',
                  'Download PDF',
                )}
                accessibilityState={{
                  disabled:
                    actionsDisabled,
                }}
                style={{
                  flex: 1,
                  opacity:
                    actionsDisabled
                      ? 0.45
                      : 1,
                }}
              />

              <FastAccessButton
                title={t(
                  'shareCard',
                  'Share',
                )}
                icon={
                  <HugeiconsIcon
                    icon={
                      Share08Icon
                    }
                    size={24}
                    color={
                      actionsDisabled
                        ? colors
                          .text2[300]
                        : colors
                          .primary[900]
                    }
                  />
                }
                disabled={
                  actionsDisabled
                }
                onPress={
                  handleShare
                }
                accessibilityLabel={t(
                  'shareCard',
                  'Share',
                )}
                accessibilityState={{
                  disabled:
                    actionsDisabled,
                }}
                style={{
                  flex: 1,
                  opacity:
                    actionsDisabled
                      ? 0.45
                      : 1,
                }}
              />
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>

      <SetExpiryModal
        visible={
          isExpiryModalVisible
        }
        onClose={() =>
          setIsExpiryModalVisible(
            false,
          )
        }
        onConfirm={() => {
          void handleConfirmShare();
        }}
        selectedExpiry={
          selectedExpiry
        }
        onSelectExpiry={
          setSelectedExpiry
        }
      />

      <ShareLinkModal
        visible={
          isLinkModalVisible
        }
        onClose={() =>
          setIsLinkModalVisible(
            false,
          )
        }
        selectedExpiry={
          selectedExpiry
        }
        shareUrl={
          previewUrl
        }
        expiresAt={
          previewExpiresAt
        }
      />
    </>
  );
}