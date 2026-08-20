import React from 'react';
import {
    Pressable,
    Text,
    View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import {
    File02Icon,
    Time02Icon,
} from '@/components/icons';
import { colors } from '@/lib/theme';
import { cn } from '@/lib/utils';
import {
    getMedicalCvScopeTranslationKey,
    getMedicalCvStatusTone,
    getMedicalCvStatusTranslationKey,
} from '@/lib/medical-cv-utils';

import type {
    MedicalCvItem,
} from '@/types/medical-cv';

interface MedicalCvCardProps {
    medicalCv: MedicalCvItem;
    onPress: () => void;
}

export function MedicalCvCard({
    medicalCv,
    onPress,
}: MedicalCvCardProps) {
    const { t, i18n } =
        useTranslation('medicalCv');

    const isRTL =
        i18n.language === 'ar';

    const scopeKey =
        getMedicalCvScopeTranslationKey(
            medicalCv.scopeType,
        );

    const scopeLabel =
        scopeKey
            ? t(scopeKey)
            : medicalCv.scopeType;

    const statusKey =
        medicalCv.latestVersion
            ? getMedicalCvStatusTranslationKey(
                medicalCv.latestVersion
                    .status,
            )
            : null;

    const statusLabel =
        medicalCv.latestVersion
            ? statusKey
                ? t(statusKey)
                : medicalCv.latestVersion
                    .status
            : '';

    const statusTone =
        medicalCv.latestVersion
            ? getMedicalCvStatusTone(
                medicalCv.latestVersion
                    .status,
            )
            : 'default';

    const statusColors =
        statusTone === 'approved'
            ? {
                backgroundColor:
                    colors.secondary[50],
                color:
                    colors.secondary[800],
            }
            : statusTone === 'draft'
                ? {
                    backgroundColor:
                        colors.primary[50],
                    color:
                        colors.primary[600],
                }
                : {
                    backgroundColor:
                        colors.text2[50],
                    color:
                        colors.text2[700],
                };

    return (
        <Pressable
            accessibilityRole="button"
            onPress={onPress}
            className="mb-4 overflow-hidden rounded-[24px] border border-text2-50 bg-surface p-5 shadow-sm"
            style={({
                pressed,
            }) => ({
                opacity:
                    pressed ? 0.88 : 1,
            })}
        >
            <View
                className={cn(
                    'flex-row items-start',
                    isRTL &&
                    'flex-row-reverse',
                )}
            >
                <View
                    className={cn(
                        'h-14 w-14 items-center justify-center rounded-full bg-primary-50',
                        isRTL
                            ? 'ml-4'
                            : 'mr-4',
                    )}
                >
                    <File02Icon
                        size={28}
                        color={
                            colors.primary[600]
                        }
                        variant="solid"
                    />
                </View>

                <View className="flex-1">
                    <Text
                        className={cn(
                            'font-jakarta-bold text-[17px] leading-6 text-text',
                            isRTL &&
                            'text-right',
                        )}
                    >
                        {medicalCv.title}
                    </Text>

                    <View
                        className={cn(
                            'mt-2 flex-row',
                            isRTL &&
                            'flex-row-reverse',
                        )}
                    >
                        <View
                            className="rounded-full px-3 py-1.5"
                            style={{
                                backgroundColor:
                                    colors.primary[50],
                            }}
                        >
                            <Text
                                className="font-jakarta-semibold text-[12px]"
                                style={{
                                    color:
                                        colors
                                            .primary[600],
                                }}
                            >
                                {scopeLabel}
                            </Text>
                        </View>
                    </View>
                </View>

                <Text
                    className={cn(
                        'font-inter-regular text-[30px] leading-8 text-text',
                        isRTL
                            ? 'mr-2'
                            : 'ml-2',
                    )}
                >
                    {isRTL
                        ? '‹'
                        : '›'}
                </Text>
            </View>

            {medicalCv.focus ? (
                <View className="mt-5">
                    <Text
                        className={cn(
                            'font-inter-medium text-[13px] text-text2',
                            isRTL &&
                            'text-right',
                        )}
                    >
                        {t(
                            'focus',
                            'Focus',
                        )}
                    </Text>

                    <Text
                        className={cn(
                            'mt-1 font-inter-medium text-[15px] leading-6 text-text',
                            isRTL &&
                            'text-right',
                        )}
                    >
                        {medicalCv.focus}
                    </Text>
                </View>
            ) : null}

            <View
                className={cn(
                    'mt-5 flex-row items-center justify-between border-t border-text2-50 pt-4',
                    isRTL &&
                    'flex-row-reverse',
                )}
            >
                <View
                    className={cn(
                        'flex-row items-center',
                        isRTL &&
                        'flex-row-reverse',
                    )}
                >
                    <View
                        className={cn(
                            'h-9 w-9 items-center justify-center rounded-full bg-primary-50',
                            isRTL
                                ? 'ml-3'
                                : 'mr-3',
                        )}
                    >
                        <Time02Icon
                            size={19}
                            color={
                                colors.primary[600]
                            }
                        />
                    </View>

                    <Text className="font-jakarta-semibold text-[14px] text-text">
                        {medicalCv.latestVersion
                            ? t(
                                'versionNumber',
                                {
                                    number:
                                        medicalCv
                                            .latestVersion
                                            .versionNumber,
                                },
                            )
                            : t(
                                'noVersions',
                                'No versions yet',
                            )}
                    </Text>
                </View>

                {medicalCv.latestVersion ? (
                    <View
                        className="rounded-full px-3 py-1.5"
                        style={{
                            backgroundColor:
                                statusColors.backgroundColor,
                        }}
                    >
                        <Text
                            className="font-jakarta-semibold text-[12px]"
                            style={{
                                color:
                                    statusColors.color,
                            }}
                        >
                            {statusLabel}
                        </Text>
                    </View>
                ) : null}
            </View>
        </Pressable>
    );
}