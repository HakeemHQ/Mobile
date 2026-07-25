import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import Onboarding from '../../components/ui/Onboarding';

export default function OnboardingStep3() {
  const { t } = useTranslation('onboarding3');

  const handleSkip = () => {
    // router.replace('/(auth)/register');
  };

  const renderFooter = (
    <View className="gap-4">
        <Pressable 
            className="bg-text-500 px-8 py-2 rounded-2xl items-center"
            onPress={() => {
              router.replace('/(auth)/register' as any)
            }}
        >
            <Text className="text-white font-jakarta-bold text-lg">{t('createAccount')}</Text>
        </Pressable>
        <Pressable 
            className="bg-transparent border border-text-500 px-8 py-2 rounded-2xl items-center"
            onPress={() => {
              router.replace('/(auth)/login' as any)
            }}
        >
            <Text className="text-text-500 font-jakarta-bold text-lg">{t('alreadyHaveAccount')}</Text>
        </Pressable>
    </View>
  );

  return (
    <Onboarding
      handleSkip={handleSkip}
      handleNext={() => {}} 
      translateKey="onboarding3"
      imageSource={require('../../assets/images/cards3.png')}
      currentIndex={2}
      totalSteps={3}
      themeColor="dark"
      renderFooter={renderFooter}
    />
  );
}
