import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  ArrowRight,
  ArrowLeft,
  FlaskConical,
  Pill,
  CalendarDays,
  BellRing,
} from 'lucide-react-native';
import { ActivityListItem } from './ActivityListItem';
import type { Reminder } from '@/types/reminder';
import { colors } from '@/lib/theme';

interface RecentActivitySectionProps {
  reminders?: Reminder[];
  onViewAllPress?: () => void;
  onReminderPress?: (reminder: Reminder) => void;
  isRTL?: boolean;
}

export const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({
  reminders = [],
  onViewAllPress,
  onReminderPress,
  isRTL = false,
}) => {
  const { t } = useTranslation('home');

  const topReminders = reminders.slice(0, 3);

  const renderReminderItem = (reminder: Reminder) => {
    switch (reminder.reminderType) {
      case 'MEDICATION': {
        const scheduleTime = reminder.schedules?.[0]?.localTime;
        const subParts: string[] = [];
        if (reminder.dosage) subParts.push(reminder.dosage);
        if (scheduleTime) subParts.push(scheduleTime);
        if (reminder.instructions) subParts.push(reminder.instructions);

        return (
          <ActivityListItem
            key={reminder.reminderId}
            title={reminder.title}
            body={subParts.join(' • ') || undefined}
            tag={t('medication', { defaultValue: 'Medication' })}
            tagBgColor="bg-primary-50"
            tagTextColor="text-primary-700"
            leftIcon={<Pill size={22} color={colors.primary.DEFAULT} />}
            iconBgColor="bg-primary-50"
            containerClassName="mb-3"
            onPress={() => onReminderPress?.(reminder)}
          />
        );
      }
      case 'APPOINTMENT': {
        const appointmentFormatted = reminder.appointmentDate
          ? new Date(reminder.appointmentDate).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
              month: 'short',
              day: 'numeric',
            })
          : undefined;

        return (
          <ActivityListItem
            key={reminder.reminderId}
            title={reminder.title}
            body={reminder.providerName || undefined}
            tag={t('appointment', { defaultValue: 'Appointment' })}
            tagBgColor="bg-secondary-50"
            tagTextColor="text-secondary-700"
            date={appointmentFormatted}
            leftIcon={<CalendarDays size={22} color={colors.secondary.DEFAULT} />}
            iconBgColor="bg-secondary-50"
            containerClassName="mb-3"
            onPress={() => onReminderPress?.(reminder)}
          />
        );
      }
      case 'LAB_TEST': {
        const dueFormatted = reminder.dueDate
          ? new Date(reminder.dueDate).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
              month: 'short',
              day: 'numeric',
            })
          : undefined;

        return (
          <ActivityListItem
            key={reminder.reminderId}
            title={reminder.title}
            body={reminder.labName || undefined}
            tag={t('labTest', { defaultValue: 'Lab Test' })}
            tagBgColor="bg-tertiary-50"
            tagTextColor="text-tertiary-700"
            date={dueFormatted}
            leftIcon={<FlaskConical size={22} color={colors.tertiary.DEFAULT} />}
            iconBgColor="bg-tertiary-50"
            containerClassName="mb-3"
            onPress={() => onReminderPress?.(reminder)}
          />
        );
      }
      default:
        return null;
    }
  };

  return (
    <View className="w-full mb-6">
      <View className={`w-full ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between mb-4`}>
        <Text className="text-[20px] font-jakarta-bold text-gray-900">
          {t('recentActivity', { defaultValue: 'Upcoming & Recent Reminders' })}
        </Text>

        <Pressable onPress={onViewAllPress} className={`flex-row items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <Text className={`text-[14px] font-jakarta-bold text-primary-600 ${isRTL ? 'ml-1' : 'mr-1'}`}>
            {t('viewAll', { defaultValue: 'View All' })}
          </Text>
          {isRTL ? <ArrowLeft size={16} color={colors.primary.DEFAULT} /> : <ArrowRight size={16} color={colors.primary.DEFAULT} />}
        </Pressable>
      </View>

      {topReminders.length > 0 ? (
        topReminders.map(renderReminderItem)
      ) : (
        <View className="w-full bg-white rounded-2xl p-5 border border-gray-100 items-center justify-center mb-3">
          <View className="w-12 h-12 rounded-full bg-gray-50 items-center justify-center mb-2">
            <BellRing size={22} color="#9CA3AF" />
          </View>
          <Text className="text-[14px] font-inter-medium text-gray-400 text-center">
            {t('noRemindersRecent', { defaultValue: 'No reminders scheduled.' })}
          </Text>
        </View>
      )}
    </View>
  );
};
