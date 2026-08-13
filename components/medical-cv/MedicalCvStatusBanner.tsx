import {
    ActivityIndicator,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react-native';
import {
    SecurityCheckIcon,
} from '@hugeicons/core-free-icons';

import { Alert01Icon } from '@/components/icons/Alert01Icon';
import { InfoBanner } from '@/components/ui/InfoBanner';
import { colors } from '@/lib/theme';

import type {
    MedicalCvLoadStatus,
} from '@/types/medical-cv';

interface MedicalCvStatusBannerProps {
    status: MedicalCvLoadStatus;
    hasMedicalCv: boolean;
    error?: string;
}

export function MedicalCvStatusBanner({
    status,
    hasMedicalCv,
    error,
}: MedicalCvStatusBannerProps) {
    const { t } =
        useTranslation('medicalCv');

    if (status === 'loading') {
        return (
            <InfoBanner
                text={t(
                    'loadingMedicalCv',
                    'Checking your Medical CV...',
                )}
                icon={
                    <ActivityIndicator
                        size="small"
                        color={colors.primary[900]}
                    />
                }
                bgColor={colors.primary[100]}
                textColor={colors.primary[900]}
                borderColor="transparent"
                className="mb-6 border-0"
            />
        );
    }

    if (status === 'error') {
        return (
            <InfoBanner
                text={
                    error ||
                    t(
                        'medicalCvLoadError',
                        'Unable to load your Medical CV. Please try again.',
                    )
                }
                icon={
                    <Alert01Icon
                        size={24}
                        color={colors.danger.DEFAULT}
                    />
                }
                bgColor={colors.danger[50]}
                textColor={colors.danger.DEFAULT}
                borderColor={colors.danger.DEFAULT}
                className="mb-6"
            />
        );
    }

    if (!hasMedicalCv) {
        return (
            <InfoBanner
                text={t(
                    'medicalCvUnavailable',
                    'No reviewed medical documents are available yet. Upload your medical documents and have them reviewed by a doctor before sharing or downloading your Medical CV.',
                )}
                icon={
                    <Alert01Icon
                        size={24}
                        color={colors.danger.DEFAULT}
                    />
                }
                bgColor={colors.danger[50]}
                textColor={colors.danger.DEFAULT}
                borderColor={colors.danger.DEFAULT}
                className="mb-6"
            />
        );
    }

    return (
        <InfoBanner
            text={t(
                'sourcedAlert',
                'All statements are sourced. Tap any field to see the source document.',
            )}
            icon={
                <HugeiconsIcon
                    icon={SecurityCheckIcon}
                    size={24}
                    color={colors.primary[900]}
                />
            }
            bgColor={colors.primary[100]}
            textColor={colors.primary[900]}
            borderColor="transparent"
            className="mb-6 border-0"
        />
    );
}