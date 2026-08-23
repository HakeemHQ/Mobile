import React from 'react';
import {
  Pressable,
  Text,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
  Share08Icon,
  Upload01Icon,
} from '@hugeicons/core-free-icons';

import { colors } from '@/lib/theme';
import { cn } from '@/lib/utils';

export interface MedicalCvHeaderProps {
  title?: string;
  onUploadPress?: () => void;
  onSharePress?: () => void;
  containerClassName?: string;
}

export const MedicalCvHeader: React.FC<
  MedicalCvHeaderProps
> = ({
  title,
  onUploadPress,
  onSharePress,
  containerClassName,
}) => {
    const { t, i18n } =
      useTranslation('medicalCv');

    const isRTL =
      i18n.language === 'ar';

    const displayTitle =
      title ||
      t(
        'title',
        'Medical CV',
      );

    const isUploadDisabled =
      !onUploadPress;

    const isShareDisabled =
      !onSharePress;

    return (
      <View
        className={cn(
          'mb-6 flex-row items-center justify-between',
          isRTL &&
          'flex-row-reverse',
          containerClassName,
        )}
      >
        <Text
          className={cn(
            'text-[26px] font-jakarta-bold text-primary-900',
            isRTL &&
            'text-right',
          )}
        >
          {displayTitle}
        </Text>

        <View
          className={cn(
            'flex-row items-center gap-3',
            isRTL &&
            'flex-row-reverse',
          )}
        >
          <Pressable
            accessibilityLabel={t(
              'upload',
              'Upload',
            )}
            accessibilityRole="button"
            accessibilityState={{
              disabled:
                isUploadDisabled,
            }}
            disabled={
              isUploadDisabled
            }
            onPress={
              onUploadPress
            }
            className="h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm"
            style={({
              pressed,
            }) => ({
              opacity:
                isUploadDisabled
                  ? 0.45
                  : pressed
                    ? 0.8
                    : 1,
            })}
          >
            <HugeiconsIcon
              icon={Upload01Icon}
              size={24}
              color={
                isUploadDisabled
                  ? colors
                    .text2[300]
                  : colors
                    .text[500]
              }
            />
          </Pressable>

          <Pressable
            accessibilityLabel={t(
              'share',
              'Share',
            )}
            accessibilityRole="button"
            accessibilityState={{
              disabled:
                isShareDisabled,
            }}
            disabled={
              isShareDisabled
            }
            onPress={
              onSharePress
            }
            className="h-11 flex-row items-center justify-center rounded-full bg-primary-900 px-5 shadow-sm"
            style={({
              pressed,
            }) => ({
              opacity:
                isShareDisabled
                  ? 0.45
                  : pressed
                    ? 0.9
                    : 1,
            })}
          >
            <View
              className={cn(
                'flex-row items-center gap-2',
                isRTL &&
                'flex-row-reverse',
              )}
            >
              <HugeiconsIcon
                icon={
                  Share08Icon
                }
                size={18}
                color={
                  colors.surface
                    .DEFAULT
                }
              />

              <Text className="font-jakarta-semibold text-[15px] text-white">
                {t(
                  'share',
                  'Share',
                )}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    );
  };