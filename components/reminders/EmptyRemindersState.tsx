import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { 
  AlarmClock, 
  Plus 
} from 'lucide-react-native';
import { colors } from '@/lib/theme';
import { Button } from '@/components/ui/Button';

interface EmptyRemindersStateProps {
  onAddReminder: () => void;
}

export function EmptyRemindersState({ onAddReminder }: EmptyRemindersStateProps) {
  const { t, i18n } = useTranslation('reminders');
  const isRTL = (i18n.language || '').startsWith('ar');

  return (
    <View className="px-4 py-12">
      <View className="rounded-3xl border border-dashed border-text2-50 bg-surface p-8 items-center justify-center">
        <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-primary-50">
          <AlarmClock
            size={54}
            color={colors.primary.DEFAULT}
            strokeWidth={1.8}
          />
        </View>

        <Text className={`text-center font-jakarta-bold text-[20px] text-text-900 mb-3 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('emptyTitle', { defaultValue: 'No reminders yet' })}
        </Text>

        <Text className="text-center font-inter-regular text-[14px] leading-6 text-text2-400 max-w-[320px] mb-6">
          {t('emptySubtitle', { defaultValue: 'Track your medications, doctor appointments, and lab tests effortlessly in one place.' })}
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
    </View>
  );
}
