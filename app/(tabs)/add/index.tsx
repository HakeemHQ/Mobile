import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { FastAccessButton } from '@/components/ui/FastAccessButton';
import BackButton from '@/components/ui/BackButton';
import { Button } from '@/components/ui/Button';
import { InfoBanner } from '@/components/ui/InfoBanner';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Clock01Icon, ScanIcon, Stethoscope02Icon } from '@hugeicons/core-free-icons';
import { colors } from '@/lib/theme/colors';
import { useDocumentStore } from '@/store/useDocumentStore';

export default function AddCategoryScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation('add');
  const isRTL = i18n.language === 'ar';
  const categoryId = useDocumentStore((state) => state.categoryId);
  const setCategoryId = useDocumentStore((state) => state.setCategoryId);
  const reset = useDocumentStore((state) => state.reset);

  useEffect(() => {
    reset();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-bg px-6 pt-4" edges={['top', 'left', 'right']}>
      <View className="flex-1">
        <View className={`flex-row ${isRTL ? 'justify-end' : 'justify-start'} mb-6`}>
          <BackButton />
        </View>

        <Text className={`text-[24px] font-jakarta-bold text-primary-900 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('category.title')}
        </Text>
        <Text className={`text-[14px] font-jakarta-regular text-bg-800 mb-8 leading-5 ${isRTL ? 'text-right pl-4' : 'text-left pr-4'}`}>
          {t('category.subtitle')}
        </Text>

        <View className={`${isRTL ? 'flex-row-reverse' : 'flex-row'} gap-8 mb-8 w-full justify-center`}>
          <FastAccessButton
            title={t('category.medicalTests')}
            icon={
              <HugeiconsIcon
                icon={Stethoscope02Icon}
                color={categoryId === 1 ? colors.primary[900] : colors.primary.DEFAULT}
                size={24}
              />
            }
            active={categoryId === 1}
            width={165}
            height={107}
            onPress={() => setCategoryId(1)}
          />
          <FastAccessButton
            title={t('category.medicalRadiation')}
            icon={
              <HugeiconsIcon
                icon={ScanIcon}
                color={categoryId === 2 ? colors.secondary[900] : colors.secondary.DEFAULT}
                size={24}
              />
            }
            active={categoryId === 2}
            width={165}
            height={107}
            activeBgColor="bg-secondary-100"
            activeBorderColor="border-secondary border-[1px]"
            activeCircleColor="bg-secondary-200"
            activeTextColor="text-secondary-900"
            inactiveCircleColor="bg-secondary-50"
            inactiveTextColor="text-secondary-900"
            onPress={() => setCategoryId(2)}
          />
        </View>

        <InfoBanner
          text={t('category.infoBanner')}
          icon={<HugeiconsIcon icon={Clock01Icon} size={24} color={colors.secondary.DEFAULT} />}
        />

        <View className="mt-auto pb-8">
          <Button title={t('category.continue')} variant="primary" onPress={() => router.push('/add/details')} />
        </View>
      </View>
    </SafeAreaView>
  );
}
