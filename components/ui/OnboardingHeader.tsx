import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';

interface OnboardingHeaderProps {
    isRTL: boolean;
    handleSkip: () => void;
    bgClass: string;
    children: React.ReactNode;
}

export default function OnboardingHeader({ isRTL, handleSkip, bgClass, children }: OnboardingHeaderProps) {
    const { t } = useTranslation('common');
    return (
        <View className={`w-full ${bgClass} items-center justify-center relative pt-10 pb-4`}>
            <View className="absolute top-2 left-0 right-0 h-12 z-10 px-6 flex-row items-center justify-between">
                <View />
                <Pressable
                    onPress={handleSkip}
                    className="bg-white/90 active:bg-white px-5 py-2 rounded-3xl shadow-sm"
                    hitSlop={14}
                >
                    <Text className="font-jakarta-bold text-[15px] text-text-500">{t('skip', 'Skip')}</Text>
                </Pressable>
            </View>

            {children}
        </View>
    );
}
