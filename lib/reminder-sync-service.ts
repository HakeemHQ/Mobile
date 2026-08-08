import { Platform } from 'react-native';
import { AlarmEngine } from '@/lib/alarm-engine';
import { AlarmService } from '@/lib/alarm-service';
import i18n from '@/localization/i18n';
import type { MedicationWeekdayCode, Reminder } from '@/types/reminder';

export class ReminderSyncService {
  /**
   * Synchronizes all schedules of a reminder object across DB and native alarm systems
   */
  static async syncReminder(reminder: Reminder): Promise<void> {
    if (!reminder || !reminder.schedules) return;

    for (const schedule of reminder.schedules) {
      const requestCode = schedule.nativeAlarmId ?? AlarmService.generateRequestCode(schedule.scheduleId);

      // Step 1: Always clear previous native alarms & expo notifications for this schedule
      await AlarmService.cancelAlarm(requestCode);
      await AlarmEngine.cancelSchedule(schedule.scheduleId);

      // Step 2: If disabled, stop here
      if (!reminder.isEnabled) continue;

      const deliveryMode = schedule.deliveryMode ?? 'NOTIFICATION';
      const notifTitle = reminder.reminderType === 'MEDICATION'
        ? i18n.t('reminders:medicationReminderTitle', { defaultValue: 'Medication Reminder' })
        : reminder.reminderType === 'APPOINTMENT'
          ? i18n.t('reminders:appointmentReminderTitle', { defaultValue: 'Appointment Reminder' })
          : i18n.t('reminders:labTestReminderTitle', { defaultValue: 'Lab Test Reminder' });
      const notifBody = reminder.title;

      if (deliveryMode === 'NOTIFICATION') {
        // Route to expo-notifications
        let frequencyType: 'DAILY' | 'WEEKLY' | 'MONTHLY' = 'DAILY';
        let weekdays: MedicationWeekdayCode[] | undefined = undefined;
        let monthDays: number[] | undefined = undefined;

        if (reminder.reminderType === 'MEDICATION') {
          frequencyType = reminder.frequencyType ?? 'DAILY';
          weekdays = reminder.weekdays;
          monthDays = reminder.monthDays;
        }

        await AlarmEngine.syncSchedule({
          scheduleId: schedule.scheduleId,
          reminderId: reminder.reminderId,
          title: notifTitle,
          body: notifBody,
          localTime: schedule.localTime,
          deliveryMode: 'NOTIFICATION',
          isEnabled: reminder.isEnabled,
          frequencyType,
          weekdays,
          monthDays,
        });
      } else if (deliveryMode === 'ALARM') {
        // Route to Native Android setAlarmClock (or fallback on iOS)
        if (Platform.OS === 'android') {
          const targetDate = this.calculateNextTriggerDate(schedule.localTime);

          await AlarmService.scheduleAlarm(
            requestCode,
            targetDate,
            schedule.scheduleId,
            notifTitle,
            notifBody
          );
        } else {
          // iOS fallback to Critical Notifications
          await AlarmEngine.syncSchedule({
            scheduleId: schedule.scheduleId,
            reminderId: reminder.reminderId,
            title: notifTitle,
            body: notifBody,
            localTime: schedule.localTime,
            deliveryMode: 'ALARM',
            isEnabled: reminder.isEnabled,
          });
        }
      }
    }
  }

  /**
   * Cancels all scheduled triggers for a reminder object
   */
  static async cancelReminder(reminder: Reminder): Promise<void> {
    if (!reminder || !reminder.schedules) return;

    for (const schedule of reminder.schedules) {
      const requestCode = schedule.nativeAlarmId ?? AlarmService.generateRequestCode(schedule.scheduleId);
      await AlarmService.cancelAlarm(requestCode);
      await AlarmEngine.cancelSchedule(schedule.scheduleId);
    }
  }

  /**
   * Helper to compute next Date object for a local HH:mm time
   */
  private static calculateNextTriggerDate(localTime: string): Date {
    const parts = localTime.split(':').map(Number);
    const hours = parts[0] ?? 8;
    const minutes = parts[1] ?? 0;

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    if (date.getTime() <= Date.now()) {
      date.setDate(date.getDate() + 1);
    }

    return date;
  }
}
