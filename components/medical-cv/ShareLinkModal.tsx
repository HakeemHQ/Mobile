import React, {
  useState,
} from 'react';
import {
  Modal,
  Platform,
  Pressable,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Calendar03Icon } from '@hugeicons/core-free-icons';

import { Button } from '@/components/ui/Button';
import { colors } from '@/lib/theme';
import { cn } from '@/lib/utils';

export interface ShareLinkModalProps {
  visible: boolean;
  onClose: () => void;
  selectedExpiry:
  | '24h'
  | '7d'
  | '30d'
  | 'custom';
  shareUrl: string;
  expiresAt?: string | null;
}

export function ShareLinkModal({
  visible,
  onClose,
  selectedExpiry,
  shareUrl,
  expiresAt,
}: ShareLinkModalProps) {
  const { t, i18n } =
    useTranslation('medicalCv');

  const isRTL =
    i18n.language === 'ar';

  const [
    copied,
    setCopied,
  ] = useState(false);

  const getExpiryDateString =
    () => {
      const locale =
        i18n.language === 'ar'
          ? 'ar-EG'
          : 'en-US';

      const options: Intl.DateTimeFormatOptions =
      {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      };

      if (expiresAt) {
        const apiExpiryDate =
          new Date(expiresAt);

        if (
          !Number.isNaN(
            apiExpiryDate.getTime(),
          )
        ) {
          return apiExpiryDate.toLocaleDateString(
            locale,
            options,
          );
        }
      }

      const fallbackDate =
        new Date();

      if (
        selectedExpiry ===
        '24h'
      ) {
        fallbackDate.setDate(
          fallbackDate.getDate() +
          1,
        );
      } else if (
        selectedExpiry ===
        '7d'
      ) {
        fallbackDate.setDate(
          fallbackDate.getDate() +
          7,
        );
      } else if (
        selectedExpiry ===
        '30d'
      ) {
        fallbackDate.setDate(
          fallbackDate.getDate() +
          30,
        );
      } else {
        fallbackDate.setDate(
          fallbackDate.getDate() +
          15,
        );
      }

      return fallbackDate.toLocaleDateString(
        locale,
        options,
      );
    };

  const handleLinkAction =
    async () => {
      if (!shareUrl) {
        return;
      }

      if (
        Platform.OS ===
        'web'
      ) {
        try {
          if (
            typeof navigator !==
            'undefined' &&
            navigator.clipboard
          ) {
            await navigator.clipboard.writeText(
              shareUrl,
            );

            setCopied(true);

            setTimeout(
              () =>
                setCopied(
                  false,
                ),
              2000,
            );
          }
        } catch {
          // Keep the modal open if
          // browser clipboard access
          // is unavailable.
        }

        return;
      }

      try {
        await Share.share({
          message: shareUrl,
        });
      } catch {
        // Closing/cancelling the
        // native share sheet does not
        // require an error message.
      }
    };

  const actionLabel =
    Platform.OS === 'web'
      ? copied
        ? t(
          'copied',
          'Copied',
        )
        : t(
          'copy',
          'Copy',
        )
      : t(
        'share',
        'Share',
      );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={
        onClose
      }
    >
      <Pressable
        className="flex-1 items-center justify-center bg-black/50 px-6"
        onPress={
          onClose
        }
      >
        <Pressable
          className="w-full max-w-sm items-center rounded-3xl bg-white p-6 shadow-2xl"
          onPress={(
            event,
          ) =>
            event.stopPropagation()
          }
        >
          <Text className="mb-1 text-center font-jakarta-bold text-[20px] text-text">
            {t(
              'shareLinkGenerated',
              'Share Link Generated',
            )}
          </Text>

          <Text className="mb-6 text-center font-jakarta-regular text-[13px] leading-5 text-text2">
            {t(
              'linkReady',
              'Your secure Medical CV link is ready.',
            )}
          </Text>

          <View
            className={cn(
              'mb-6 w-full flex-row items-center justify-between rounded-2xl border bg-white p-4',
              isRTL &&
              'flex-row-reverse',
            )}
            style={{
              borderColor:
                colors.text2[50],
            }}
          >
            <Text
              className={cn(
                'flex-1 font-jakarta-medium text-[13px] text-text',
                isRTL
                  ? 'ml-3 text-right'
                  : 'mr-3 text-left',
              )}
              numberOfLines={1}
              selectable
            >
              {shareUrl ||
                t(
                  'linkUnavailable',
                  'Link unavailable',
                )}
            </Text>

            <TouchableOpacity
              accessibilityRole="button"
              disabled={
                !shareUrl
              }
              onPress={() => {
                void handleLinkAction();
              }}
              activeOpacity={
                0.7
              }
              style={{
                opacity:
                  shareUrl
                    ? 1
                    : 0.4,
              }}
            >
              <Text
                className="font-jakarta-bold text-[14px]"
                style={{
                  color:
                    colors
                      .primary[500],
                }}
              >
                {actionLabel}
              </Text>
            </TouchableOpacity>
          </View>

          <View
            className={cn(
              'mb-8 flex-row items-center justify-center gap-2',
              isRTL &&
              'flex-row-reverse',
            )}
          >
            <HugeiconsIcon
              icon={
                Calendar03Icon
              }
              size={18}
              color={
                colors
                  .text2[600]
              }
            />

            <Text className="font-jakarta-medium text-[13px] text-text2-600">
              {t(
                'linkWillExpire',
                'Link will expire',
              )}{' '}
              {getExpiryDateString()}
            </Text>
          </View>

          <Button
            title={t(
              'close',
              'Close',
            )}
            variant="primary"
            onPress={
              onClose
            }
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}