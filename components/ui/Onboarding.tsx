import { View, Text, Image, Pressable, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import OnboardingHeader from './OnboardingHeader';

type ThemeColor = 'primary' | 'secondary' | 'dark';

interface OnboardingProps {
    handleSkip: () => void;
    handleNext: () => void;
    translateKey: string;
    imageSource: any;
    currentIndex: number;
    totalSteps?: number;
    themeColor?: ThemeColor;
    renderFooter?: React.ReactNode;
}

export default function Onboarding({ 
    handleSkip, 
    handleNext, 
    translateKey, 
    imageSource, 
    currentIndex,
    totalSteps = 3,
    themeColor = 'primary',
    renderFooter
}: OnboardingProps) {
    const { t, i18n } = useTranslation(translateKey);
    const isRTL = i18n.language === 'ar';
    
    const bgClass = themeColor === 'secondary' ? 'bg-secondary-300' : themeColor === 'dark' ? 'bg-[#212E3B]' : 'bg-primary-300';
    const buttonBgClass = themeColor === 'secondary' ? 'bg-secondary-800' : themeColor === 'dark' ? 'bg-text-500' : 'bg-primary-800';
    const titleTextClass = themeColor === 'secondary' ? 'text-secondary-800' : themeColor === 'dark' ? 'text-text-600' : 'text-primary-900';

    const statusBarBg = themeColor === 'secondary' ? '#5CCFA9' : themeColor === 'dark' ? '#212E3B' : '#638CE7';

    return (
        <>
            <StatusBar barStyle={themeColor === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={statusBarBg} />
            <SafeAreaView className={`flex-1 ${bgClass}`} edges={['top']}>
                {/* Top Section */}
                <OnboardingHeader isRTL={isRTL} handleSkip={handleSkip} bgClass={bgClass}>

                    <View
                        className="w-[295px] h-[295px] bg-white rounded-3xl border border-[#C2C7D1] p-6"
                        style={styles.imageShadow}
                    >
                        <Image
                            source={imageSource}
                            style={{ width: '100%', height: '100%' }}
                            resizeMode="contain"
                        />
                    </View>
                </OnboardingHeader>

                {/* Bottom Section */}
                <View className="flex-1 px-6 pt-10 pb-6 justify-between bg-white">
                    <View>
                        {/* Pagination */}
                        <View 
                            className="flex-row items-center gap-2 mb-8 justify-start"
                            style={{ direction: 'ltr' }}
                        >
                            {Array.from({ length: totalSteps }).map((_, index) => {
                                const isActive = index === currentIndex;
                                return (
                                    <View 
                                        key={index}
                                        className={`h-2 rounded-full ${isActive ? `w-8 ${buttonBgClass}` : 'w-2 bg-[#D1D5DB]'}`}
                                    />
                                );
                            })}
                        </View>

                        <Text className={`text-[28px] leading-[40px] font-jakarta-bold ${titleTextClass} mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t('title')}
                        </Text>

                        <Text className={`text-base font-inter-regular text-text-500 leading-6  ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t('description')}
                        </Text>
                    </View>

                    {renderFooter ? renderFooter : (
                        <View className="flex-row justify-end">
                            <Pressable
                                className={`${buttonBgClass} px-8 py-4 rounded-xl items-center`}
                                onPress={handleNext}
                            >
                                <Text className="text-white font-inter-semibold text-lg">{t('next')}</Text>
                            </Pressable>
                        </View>
                    )}
                </View>
            </SafeAreaView>

            <SafeAreaView
                edges={['bottom']}
                className="bg-white"
            />
        </>
    );
}

const styles = StyleSheet.create({
    imageShadow: {
        shadowColor: '#0F4C81',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 4,
    },
});