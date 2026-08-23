import React from 'react';
import {
    Text,
    View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import {
    Alert01Icon,
} from '@/components/icons';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface MedicalCvErrorStateProps {
    title: string;
    message: string;
    onRetry?: () => void;
    showRetry?: boolean;
}

export function MedicalCvErrorState({
    title,
    message,
    onRetry,
    showRetry = true,
}: MedicalCvErrorStateProps) {
    const { t, i18n } =
        useTranslation('medicalCv');

    const isRTL =
        i18n.language === 'ar';

    return (
        <View
            className="items-center rounded-[24px] border p-6"
            style={{
                backgroundColor:
                    '#FEE2E2',
                borderColor:
                    '#DC2626',
            }}
        >
            <View
                className="h-12 w-12 items-center justify-center rounded-full"
                style={{
                    backgroundColor:
                        '#FFFFFF',
                }}
            >
                <Alert01Icon
                    size={24}
                    color="#DC2626"
                />
            </View>

            <Text
                className={cn(
                    'mt-4 text-center font-jakarta-bold text-[17px] text-text',
                    isRTL &&
                    'text-right',
                )}
            >
                {title}
            </Text>

            <Text
                className={cn(
                    'mt-2 text-center font-inter-regular text-[13px] leading-5 text-text2',
                    isRTL &&
                    'text-right',
                )}
            >
                {message}
            </Text>

            {showRetry && onRetry ? (
                <View className="mt-5 w-32">
                    <Button
                        title={t(
                            'retry',
                            'Retry',
                        )}
                        variant="outline"
                        onPress={onRetry}
                    />
                </View>
            ) : null}
        </View>
    );
}