import React from 'react';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
    SecurityCheckIcon,
} from '@hugeicons/core-free-icons';

import { InfoBanner } from '@/components/ui/InfoBanner';
import { colors } from '@/lib/theme';

export function MedicalCvInfoBanner() {
    const { t } =
        useTranslation('medicalCv');

    return (
        <InfoBanner
            text={t(
                'cvVersionsInfo',
                'Tap a CV to view its versions. All statements are sourced and backed by documents.',
            )}
            icon={
                <HugeiconsIcon
                    icon={
                        SecurityCheckIcon
                    }
                    size={24}
                    color={
                        colors.primary[900]
                    }
                />
            }
            bgColor={
                colors.primary[50]
            }
            textColor={
                colors.primary[900]
            }
            borderColor="transparent"
            className="mb-6 border-0"
        />
    );
}