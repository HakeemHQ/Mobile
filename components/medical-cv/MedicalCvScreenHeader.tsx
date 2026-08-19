import React from 'react';
import {
    Pressable,
    Text,
    View,
} from 'react-native';
import { useTranslation } from 'react-i18next';

import {
    ArrowLeft02Icon,
} from '@/components/icons';
import { colors } from '@/lib/theme';
import { cn } from '@/lib/utils';

interface MedicalCvScreenHeaderProps {
    title: string;
    subtitle?: string;
    showBack?: boolean;
    onBack?: () => void;
}

export function MedicalCvScreenHeader({
    title,
    subtitle,
    showBack = false,
    onBack,
}: MedicalCvScreenHeaderProps) {
    const { t, i18n } =
        useTranslation('medicalCv');

    const isRTL =
        i18n.language === 'ar';

    return (
        <View
            className={cn(
                'mb-6 flex-row items-start',
                isRTL &&
                'flex-row-reverse',
            )}
        >
            {showBack && (
                <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={t(
                        'back',
                        'Back',
                    )}
                    onPress={onBack}
                    className={cn(
                        'h-11 w-11 items-center justify-center rounded-full border border-text2-50 bg-surface',
                        isRTL
                            ? 'ml-4'
                            : 'mr-4',
                    )}
                    style={({
                        pressed,
                    }) => ({
                        opacity:
                            pressed ? 0.75 : 1,
                    })}
                >
                    <View
                        style={{
                            transform: [
                                {
                                    rotate:
                                        isRTL
                                            ? '180deg'
                                            : '0deg',
                                },
                            ],
                        }}
                    >
                        <ArrowLeft02Icon
                            size={24}
                            color={
                                colors.text.DEFAULT
                            }
                        />
                    </View>
                </Pressable>
            )}

            <View className="flex-1">
                <Text
                    className={cn(
                        'font-jakarta-bold text-[28px] text-primary-900',
                        isRTL &&
                        'text-right',
                    )}
                >
                    {title}
                </Text>

                {subtitle ? (
                    <Text
                        className={cn(
                            'mt-2 font-inter-medium text-[14px] text-text2',
                            isRTL &&
                            'text-right',
                        )}
                    >
                        {subtitle}
                    </Text>
                ) : null}
            </View>
        </View>
    );
}