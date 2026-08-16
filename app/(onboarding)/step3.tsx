import { View, Text, Pressable } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Onboarding from '../../components/ui/Onboarding';
import Onboarding3Svg from '../../assets/images/Onboarding3.svg';

export default function OnboardingStep3() {
  const { t } = useTranslation('onboarding3');

  useEffect(() => {
    // Mark onboarding as completed once reaching the final step
    AsyncStorage.setItem('hasLaunched', 'true').catch(() => {});
  }, []);

  const handleFinish = async (targetRoute: string) => {
    await AsyncStorage.setItem('hasLaunched', 'true');
    router.replace(targetRoute as any);
  };

  const renderFooter = (
    <View className="gap-4">
        <Pressable 
            className="bg-text-500 px-8 py-2 rounded-2xl items-center"
            onPress={() => handleFinish('/(auth)/register')}
        >
            <Text className="text-white font-jakarta-bold text-lg">{t('createAccount')}</Text>
        </Pressable>
        <Pressable 
            className="bg-transparent border border-text-500 px-8 py-2 rounded-2xl items-center"
            onPress={() => handleFinish('/(auth)/login')}
        >
            <Text className="text-text-500 font-jakarta-bold text-lg">{t('alreadyHaveAccount')}</Text>
        </Pressable>
    </View>
  );

  return (
    <Onboarding
      handleSkip={() => handleFinish('/(auth)/login')}
      handleNext={() => {}} 
      translateKey="onboarding3"
      SvgComponent={Onboarding3Svg}
      currentIndex={2}
      totalSteps={3}
      themeColor="dark"
      renderFooter={renderFooter}
    />
  );
}
