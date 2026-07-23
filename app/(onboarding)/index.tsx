import { router } from 'expo-router';
import Onboarding from '../../components/ui/Onboarding';

export default function OnboardingStep1() {
  const handleNext = () => {
     router.push('/(onboarding)/step2');
  };

  const handleSkip = () => {
    // router.replace('/(auth)/register');
  };

  return (
    <Onboarding
      handleSkip={handleSkip}
      handleNext={handleNext}
      translateKey="onboarding"
      imageSource={require('../../assets/images/cards1.png')}
      currentIndex={0}
      totalSteps={3}
      themeColor="primary"
    />
  );
}
