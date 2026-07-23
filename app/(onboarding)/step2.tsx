import { router } from 'expo-router';
import Onboarding from '../../components/ui/Onboarding';

export default function OnboardingStep2() {
  const handleNext = () => {
     router.push('/(onboarding)/step3');
  };

  const handleSkip = () => {
    // router.replace('/(auth)/register');
  };

  return (
    <Onboarding
      handleSkip={handleSkip}
      handleNext={handleNext}
      translateKey="onboarding2"
      imageSource={require('../../assets/images/cards2.png')}
      currentIndex={1}
      totalSteps={3}
      themeColor="secondary"
    />
  );
}
