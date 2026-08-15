import { router } from 'expo-router';
import Onboarding from '../../components/ui/Onboarding';
import Onbording2Svg from '../../assets/images/Onbording2.svg';

export default function OnboardingStep2() {
  const handleNext = () => {
     router.push('/(onboarding)/step3');
  };

  const handleSkip = () => {
    router.replace('/(auth)/login');
  };

  return (
    <Onboarding
      handleSkip={handleSkip}
      handleNext={handleNext}
      translateKey="onboarding2"
      SvgComponent={Onbording2Svg}
      currentIndex={1}
      totalSteps={3}
      themeColor="secondary"
    />
  );
}
