import React, { useRef, useEffect } from 'react';
import { View, Text, Image, Pressable, StyleSheet, StatusBar, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import OnboardingHeader from './OnboardingHeader';

type ThemeColor = 'primary' | 'secondary' | 'dark';

interface OnboardingProps {
    handleSkip: () => void;
    handleNext: () => void;
    translateKey: string;
    imageSource?: any;
    SvgComponent?: React.ComponentType<{ width?: number | string; height?: number | string }>;
    currentIndex: number;
    totalSteps?: number;
    themeColor?: ThemeColor;
    renderFooter?: React.ReactNode;
}

/** Simple animated pagination dot using built-in RN Animated API */
const AnimatedDot = ({
    isActive,
    activeColor,
}: {
    isActive: boolean;
    activeColor: string;
}) => {
    const widthAnim = useRef(new Animated.Value(isActive ? 32 : 8)).current;
    const opacityAnim = useRef(new Animated.Value(isActive ? 1 : 0.4)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(widthAnim, {
                toValue: isActive ? 32 : 8,
                duration: 300,
                useNativeDriver: false,
            }),
            Animated.timing(opacityAnim, {
                toValue: isActive ? 1 : 0.4,
                duration: 300,
                useNativeDriver: false,
            }),
        ]).start();
    }, [isActive]);

    return (
        <Animated.View
            style={{
                height: 8,
                borderRadius: 4,
                width: widthAnim,
                backgroundColor: activeColor,
                opacity: opacityAnim,
            }}
        />
    );
};

export default function Onboarding({
    handleSkip,
    handleNext,
    translateKey,
    imageSource,
    SvgComponent,
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

    const dotActiveColor = themeColor === 'secondary' ? '#086043' : themeColor === 'dark' ? '#1F2937' : '#0E2D72';

    return (
        <>
            <StatusBar barStyle={themeColor === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={statusBarBg} />
            <SafeAreaView className={`flex-1 ${bgClass}`} edges={['top']}>
                {/* Top Section */}
                <OnboardingHeader isRTL={isRTL} handleSkip={handleSkip} bgClass={bgClass}>

                    <View className="w-[354px] h-[295px] items-center justify-center">
                        {SvgComponent ? (
                            <SvgComponent width={354} height={295} />
                        ) : (
                            <Image
                                source={imageSource}
                                style={{ width: 354, height: 295 }}
                                resizeMode="contain"
                            />
                        )}
                    </View>
                </OnboardingHeader>

                {/* Bottom Section */}
                <View className="flex-1 px-6 pt-10 pb-6 justify-between bg-white">
                    <View>
                        {/* Animated Pagination Dots */}
                        <View
                            className="flex-row items-center gap-2 mb-8 justify-start"
                            style={{ direction: 'ltr' }}
                        >
                            {Array.from({ length: totalSteps }).map((_, index) => (
                                <AnimatedDot
                                    key={index}
                                    isActive={index === currentIndex}
                                    activeColor={dotActiveColor}
                                />
                            ))}
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