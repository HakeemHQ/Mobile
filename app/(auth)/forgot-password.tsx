import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ArrowLeft02Icon } from '../../components/icons/ArrowLeft02Icon';

export default function ForgotPasswordScreen() {
  const { t, i18n } = useTranslation('auth');
  const isRTL = i18n.language === 'ar';

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
      <View className="flex-1 px-6 pt-2">
        {/* Back Button */}
        <Pressable 
          accessibilityLabel={t('goBack')}
          accessibilityRole="button"
          className="w-10 h-10 rounded-full border border-bg-600 items-center justify-center mb-6"
          onPress={() => router.back()}
        >
          <ArrowLeft02Icon size={20} color="primary.900" />
        </Pressable>

        <Text className={`text-[28px] font-jakarta-bold text-primary-900 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('forgotPasswordTitle')}
        </Text>
      </View>
    </SafeAreaView>
  );
}