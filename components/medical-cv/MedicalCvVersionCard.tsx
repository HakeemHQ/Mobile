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
    Time02Icon,
} from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { colors } from '@/lib/theme';
import { cn } from '@/lib/utils';
import {
    formatMedicalCvDate,
    getMedicalCvStatusTone,
    getMedicalCvStatusTranslationKey,
} from '@/lib/medical-cv-utils';

import type {
    MedicalCvVersion,
} from '@/types/medical-cv';

interface MedicalCvVersionCardProps {
    version: MedicalCvVersion;
    isDownloading?: boolean;
    onDownload: () => void;
}

export function MedicalCvVersionCard({
    version,
    isDownloading = false,
    onDownload,
}: MedicalCvVersionCardProps) {
    const { t, i18n } =
        useTranslation('medicalCv');

    const isRTL =
        i18n.language === 'ar';

    const statusKey =
        getMedicalCvStatusTranslationKey(
            version.status,
        );

    const statusLabel =
        statusKey
            ? t(statusKey)
            : version.status;

    const statusTone =
        getMedicalCvStatusTone(
            version.status,
        );

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
        <View className="mb-4 rounded-[24px] border border-text2-50 bg-surface p-5 shadow-sm">
            <View
                className={cn(
                    'flex-row items-center justify-between',
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
                            'h-12 w-12 items-center justify-center rounded-full bg-primary-50',
                            isRTL
                                ? 'ml-4'
                                : 'mr-4',
                        )}
                    >
                        <Time02Icon
                            size={23}
                            color={
                                colors.primary[600]
                            }
                        />
                    </View>

                    <Text className="font-jakarta-bold text-[17px] text-text">
                        {t(
                            'versionNumber',
                            {
                                number:
                                    version.versionNumber,
                            },
                        )}
                    </Text>
                </View>

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
            </View>

            <View
                className={cn(
                    'mt-5 flex-row items-center border-t border-text2-50 pt-4',
                    isRTL &&
                    'flex-row-reverse',
                )}
            >
                <View
                    className={cn(
                        'h-9 w-9 items-center justify-center rounded-xl bg-primary-50',
                        isRTL
                            ? 'ml-3'
                            : 'mr-3',
                    )}
                >
                    <HugeiconsIcon
                        icon={
                            Calendar03Icon
                        }
                        size={18}
                        color={
                            colors.primary[600]
                        }
                    />
                </View>

                <Text
                    className={cn(
                        'font-inter-regular text-[14px] text-text2',
                        isRTL &&
                        'text-right',
                    )}
                >
                    {t(
                        'created',
                        'Created',
                    )}
                    :{' '}
                    <Text className="font-inter-semibold text-text">
                        {formatMedicalCvDate(
                            version.createdAt,
                            i18n.language,
                        )}
                    </Text>
                </Text>
            </View>

            <View
                className={cn(
                    'mt-4 flex-row items-center border-t border-text2-50 pt-4',
                    isRTL &&
                    'flex-row-reverse',
                )}
            >
                <View
                    className={cn(
                        'h-9 w-9 items-center justify-center rounded-xl bg-primary-50',
                        isRTL
                            ? 'ml-3'
                            : 'mr-3',
                    )}
                >
                    <File02Icon
                        size={18}
                        color={
                            colors.primary[600]
                        }
                    />
                </View>

                <Text className="font-inter-medium text-[14px] text-text">
                    {version.pdfAvailable
                        ? t(
                            'pdfAvailable',
                            'PDF available',
                        )
                        : t(
                            'pdfUnavailable',
                            'PDF unavailable',
                        )}
                </Text>
            </View>

            <Button
                title={
                    isDownloading
                        ? t(
                            'downloadingPdf',
                            'Downloading PDF...',
                        )
                        : t(
                            'downloadPdf',
                            'Download PDF',
                        )
                }
                variant="primary"
                className="mt-5"
                disabled={
                    !version.pdfAvailable ||
                    isDownloading
                }
                onPress={onDownload}
            />
        </View>
    );
}