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

      const targetDate = this.calculateNextValidTriggerDate(reminder, schedule.localTime);

      // Step 2: If disabled or past end bounds, stop here
      if (!reminder.isEnabled || !targetDate) continue;

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
   * Helper to compute next valid Date object for a local HH:mm time based on recurrence rules
   */
  private static calculateNextValidTriggerDate(reminder: Reminder, localTime: string): Date | null {
    const parts = localTime.split(':').map(Number);
    const hours = parts[0] ?? 8;
    const minutes = parts[1] ?? 0;

    const now = new Date();

    if (reminder.reminderType === 'APPOINTMENT') {
      const target = new Date(reminder.appointmentDate);
      target.setHours(hours, minutes, 0, 0);
      return target.getTime() > now.getTime() ? target : null;
    }

    if (reminder.reminderType === 'LAB_TEST') {
      const target = new Date(reminder.dueDate);
      target.setHours(hours, minutes, 0, 0);
      return target.getTime() > now.getTime() ? target : null;
    }

    if (reminder.reminderType === 'MEDICATION') {
      let candidate = new Date();
      candidate.setHours(hours, minutes, 0, 0);

      if (candidate.getTime() <= now.getTime()) {
        candidate.setDate(candidate.getDate() + 1);
      }

      if (reminder.startDate) {
        const startDate = new Date(reminder.startDate);
        startDate.setHours(hours, minutes, 0, 0);
        if (candidate.getTime() < startDate.getTime()) {
          candidate = new Date(startDate);
          candidate.setHours(hours, minutes, 0, 0);
          if (candidate.getTime() <= now.getTime()) {
            candidate.setDate(candidate.getDate() + 1);
          }
        }
      }

      const freq = reminder.frequencyType ?? 'DAILY';
      for (let i = 0; i < 60; i++) {
        let isValidDay = false;
        if (freq === 'DAILY') {
          isValidDay = true;
        } else if (freq === 'WEEKLY' && reminder.weekdays && reminder.weekdays.length > 0) {
          const dayMap: Record<number, MedicationWeekdayCode> = {
            0: 'SUN', 1: 'MON', 2: 'TUE', 3: 'WED', 4: 'THU', 5: 'FRI', 6: 'SAT'
          };
          if (reminder.weekdays.includes(dayMap[candidate.getDay()])) {
            isValidDay = true;
          }
        } else if (freq === 'MONTHLY' && reminder.monthDays && reminder.monthDays.length > 0) {
          if (reminder.monthDays.includes(candidate.getDate())) {
            isValidDay = true;
          }
        } else {
          isValidDay = true;
        }

        if (isValidDay) {
          break;
        } else {
          candidate.setDate(candidate.getDate() + 1);
        }
      }

      if (reminder.endDate) {
        const endDate = new Date(reminder.endDate);
        endDate.setHours(23, 59, 59, 999);
        if (candidate.getTime() > endDate.getTime()) {
          return null;
        }
      }

      return candidate;
    }

    return null;
  }
}
