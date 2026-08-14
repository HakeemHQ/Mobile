import { View, Text, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';

interface EmptyRemindersStateProps {
  onAddReminder: () => void;
}

export function EmptyRemindersState({ onAddReminder }: EmptyRemindersStateProps) {
  const { t, i18n } = useTranslation('reminders');
  const isRTL = (i18n.language || '').startsWith('ar');

  return (
    <View className="flex-1 items-center justify-center px-4 py-8">
      <Image
        source={require('@/assets/images/remindersEmptyList.png')}
        style={{ width: 250, height: 250 }}
        resizeMode="contain"
        className="mb-4"
      />

      <Text className="text-center font-jakarta-bold text-[20px] text-text-900 mb-2">
        {t('emptyTitle', { defaultValue: 'No reminders yet' })}
      </Text>

      <Text className="text-center font-inter-regular text-[14px] leading-6 text-text2-400 max-w-[320px] mb-6">
        {t('emptySubtitle', {
          defaultValue:
            'Track your medications, doctor appointments, and lab tests effortlessly in one place.',
        })}
      </Text>

      <View className="w-full max-w-[300px]">
        <Button
          title={t('addNewReminder', { defaultValue: 'Add New Reminder' })}
          onPress={onAddReminder}
          variant="primary"
          leftIcon={<Plus size={20} color="#FFFFFF" strokeWidth={2.5} />}
          className="h-14 w-full rounded-2xl shadow-sm"
        />
      </View>
    </View>
  );
}
