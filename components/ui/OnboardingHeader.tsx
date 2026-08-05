import { View, Text, Pressable } from 'react-native';
import LanguageSwitcher from '../LanguageSwitcher';
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
        <View className={`w-full h-[436px] ${bgClass} items-center justify-center relative`}>
            <View className="absolute top-4 left-0 right-0 h-12 z-10">
                <View className={`absolute top-0 ${isRTL ? 'right-6' : 'left-6'}`}>
                </View>
                <View className={`absolute top-0 ${isRTL ? 'left-6' : 'right-6'}`}>
                    <Pressable
                        onPress={handleSkip}
                        className="bg-bg-500 px-6 py-2 rounded-3xl shadow-sm"
                    >
                        <Text className="font-jakarta-bold font-size-[16px] text-text-500">{t('skip', 'Skip')}</Text>
                    </Pressable>
                </View>
            </View>

            {children}
        </View>
    );
}
