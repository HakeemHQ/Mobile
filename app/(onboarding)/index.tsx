import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/LanguageSwitcher';
export default function OnboardingStep1() {
  const { t, i18n } = useTranslation('onboarding');
  const isRTL = i18n.language === 'ar';

  const handleNext = () => {
  //  router.push('/(onboarding)/step2');
  };

  const handleSkip = () => {
  //  router.replace('/(auth)/register');
  };

  return (
    <SafeAreaView className="flex-1 bg-primary-300" edges={['top']}>
      {/* Top Section */}
      <View className="w-full h-[436px] bg-primary-300 items-center justify-center rounded-b-3xl relative">
        <View className="absolute top-4 left-0 right-0 h-12 z-10">
          <View className={`absolute top-0 ${isRTL ? 'right-6' : 'left-6'}`}>
            <LanguageSwitcher />
          </View>
          <View className={`absolute top-0 ${isRTL ? 'left-6' : 'right-6'}`}>
            <Pressable 
              onPress={handleSkip} 
              className="bg-white px-5 py-2 rounded-full shadow-sm"
            >
              <Text className="font-inter-semibold text-primary-900">{t('skip')}</Text>
            </Pressable>
          </View>
        </View>

        <View 
          className="w-[295px] h-[295px] bg-white rounded-[24px] border border-[#C2C7D1] p-6"
          style={styles.imageShadow}
        >
          <Image 
            source={require('../../assets/images/Layered Cards.png')} 
            style={{ width: '100%', height: '100%' }} 
            resizeMode="contain" 
          />
        </View>
      </View>

      {/* Bottom Section */}
      <View className="flex-1 px-6 pt-10 pb-6 justify-between bg-white">
        <View>
          {/* Pagination */}
          <View className={`flex-row items-center gap-2 mb-8 ${isRTL ? 'justify-end' : 'justify-start'}`}>
            <View className= {`h-2 ${!isRTL ? 'w-8 bg-primary-800' : 'w-2 bg-[#D1D5DB]'} rounded-full` }/>
            <View className={`h-2  w-2 bg-[#D1D5DB] rounded-full`} />
            <View className={`h-2 ${isRTL ? 'w-8 bg-primary-800' : 'w-2 bg-[#D1D5DB]'} rounded-full`} />
          </View>

          <Text className={`text-[32px] leading-[40px] font-jakarta-bold text-primary-900 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('title')}
          </Text>
          
          <Text className={`text-base font-inter-regular text-text2 leading-6 px-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            {t('description')}
          </Text>
        </View>

        <View className="flex-row justify-end">
          <Pressable 
            className="bg-primary-800 px-8 py-4 rounded-xl items-center"
            onPress={handleNext}
          >
            <Text className="text-white font-inter-semibold text-lg">{t('next')}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
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
