import React from 'react';
import {
    Image,
    Text,
    View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

type MedicalCvEmptyStateVariant =
    | 'cvs'
    | 'versions';

interface MedicalCvEmptyStateProps {
    variant: MedicalCvEmptyStateVariant;
}

export function MedicalCvEmptyState({
    variant,
}: MedicalCvEmptyStateProps) {
    const { t, i18n } =
        useTranslation('medicalCv');

    const isRTL =
        i18n.language === 'ar';

    const isVersions =
        variant === 'versions';

    const imageSource =
        isVersions
            ? require('../../assets/images/medical-cv-versions-empty.png')
            : require('../../assets/images/medical-cv-empty.png');

    return (
        <View className="items-center px-6 py-6">
            <Image
                source={imageSource}
                resizeMode="contain"
                className="h-56 w-56"
            />

            <Text
                className={cn(
                    'mt-4 text-center font-jakarta-bold text-[18px] text-text',
                    isRTL &&
                    'text-right',
                )}
            >
                {isVersions
                    ? t(
                        'emptyVersionsTitle',
                        'No versions yet',
                    )
                    : t(
                        'emptyCvsTitle',
                        'No medical CVs yet',
                    )}
            </Text>

            <Text
                className={cn(
                    'mt-2 max-w-[300px] text-center font-inter-regular text-[14px] leading-6 text-text2',
                    isRTL &&
                    'text-right',
                )}
            >
                {isVersions
                    ? t(
                        'emptyVersionsDescription',
                        "This CV doesn't have any versions yet. Once a new version is available, it will appear here.",
                    )
                    : t(
                        'emptyCvsDescription',
                        "You don't have any medical CVs yet. Once available, they will appear here.",
                    )}
            </Text>
        </View>
    );
}