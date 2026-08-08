import { Pressable } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft02Icon, ArrowRight02Icon } from '@hugeicons/core-free-icons';
import { useTranslation } from 'react-i18next';

interface BackButtonProps {
  onPress?: () => void;
}

export default function BackButton({ onPress }: BackButtonProps = {}) {
  const router = useRouter();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={isRTL ? 'رجوع' : 'Back'}
      className="w-10 h-10 rounded-full bg-white items-center justify-center"
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.25,
        shadowRadius: 2,
        elevation: 8,
        backgroundColor: '#FFFFFF',
      })}
    >
      <HugeiconsIcon icon={isRTL ? ArrowRight02Icon : ArrowLeft02Icon} />
    </Pressable>
  );
}