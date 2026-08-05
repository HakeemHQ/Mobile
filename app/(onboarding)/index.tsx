import { router } from 'expo-router';
import Onboarding from '../../components/ui/Onboarding';
import Onboarding1Svg from '../../assets/images/Onboarding1.svg';

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
      SvgComponent={Onboarding1Svg}
      currentIndex={0}
      totalSteps={3}
      themeColor="primary"
    />
  );
}
