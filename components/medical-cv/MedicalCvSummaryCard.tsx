import React from 'react';
import {
    Text,
    View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
    Calendar03Icon,
} from '@hugeicons/core-free-icons';

import {
    File02Icon,
} from '@/components/icons';
import { colors } from '@/lib/theme';
import { cn } from '@/lib/utils';
import {
    formatMedicalCvDate,
    getMedicalCvScopeTranslationKey,
} from '@/lib/medical-cv-utils';

import type {
    MedicalCvDetails,
} from '@/types/medical-cv';

interface MedicalCvSummaryCardProps {
    medicalCv: MedicalCvDetails;
}

export function MedicalCvSummaryCard({
    medicalCv,
}: MedicalCvSummaryCardProps) {
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

    return (
        <>
            <View className="rounded-[24px] border border-text2-50 bg-surface p-5 shadow-sm">
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
                                        colors
                                            .primary[50],
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
                </View>

                {medicalCv.focus ? (
                    <View className="mt-5 border-t border-text2-50 pt-4">
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
            </View>

            <View
                className={cn(
                    'mt-5 flex-row items-center',
                    isRTL &&
                    'flex-row-reverse',
                )}
            >
                <View
                    className={cn(
                        'flex-1 flex-row items-center',
                        isRTL &&
                        'flex-row-reverse',
                    )}
                >
                    <View
                        className={cn(
                            'h-10 w-10 items-center justify-center rounded-xl bg-primary-50',
                            isRTL
                                ? 'ml-3'
                                : 'mr-3',
                        )}
                    >
                        <HugeiconsIcon
                            icon={
                                Calendar03Icon
                            }
                            size={20}
                            color={
                                colors.primary[900]
                            }
                        />
                    </View>

                    <View>
                        <Text className="font-inter-medium text-[12px] text-text2">
                            {t(
                                'created',
                                'Created',
                            )}
                        </Text>

                        <Text className="mt-0.5 font-jakarta-semibold text-[13px] text-text">
                            {formatMedicalCvDate(
                                medicalCv.createdAt,
                                i18n.language,
                            )}
                        </Text>
                    </View>
                </View>

                <View className="mx-4 h-10 w-px bg-text2-50" />

                <View
                    className={cn(
                        'flex-1 flex-row items-center',
                        isRTL &&
                        'flex-row-reverse',
                    )}
                >
                    <View
                        className={cn(
                            'h-10 w-10 items-center justify-center rounded-xl bg-primary-50',
                            isRTL
                                ? 'ml-3'
                                : 'mr-3',
                        )}
                    >
                        <HugeiconsIcon
                            icon={
                                Calendar03Icon
                            }
                            size={20}
                            color={
                                colors.primary[900]
                            }
                        />
                    </View>

                    <View>
                        <Text className="font-inter-medium text-[12px] text-text2">
                            {t(
                                'updated',
                                'Updated',
                            )}
                        </Text>

                        <Text className="mt-0.5 font-jakarta-semibold text-[13px] text-text">
                            {formatMedicalCvDate(
                                medicalCv.updatedAt,
                                i18n.language,
                            )}
                        </Text>
                    </View>
                </View>
            </View>
        </>
    );
}