import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import type { MedicationWeekdayCode, ReminderDeliveryMode } from '@/types/reminder';
import { AlarmService } from '@/lib/alarm-service';

export interface ScheduleTriggerInput {
  scheduleId: string;
  reminderId: string;
  title: string;
  body: string;
  localTime: string; // "HH:mm"
  deliveryMode: ReminderDeliveryMode;
  isEnabled: boolean;
  frequencyType?: 'DAILY' | 'WEEKLY' | 'MONTHLY';
  weekdays?: MedicationWeekdayCode[];
  monthDays?: number[];
  startDate?: string;
  endDate?: string | null;
}

import { router } from 'expo-router';

// Global handler configuration for foreground notifications/alarms
Notifications.setNotificationHandler({
  handleNotification: async (notification) => {
    const data = notification.request.content.data;
    const isAlarm = data?.deliveryMode === 'ALARM';

    if (isAlarm && Platform.OS !== 'android') {
      setTimeout(() => {
        router.push({
          pathname: '/alarm-screen',
          params: {
            scheduleId: String(data?.scheduleId ?? ''),
            title: notification.request.content.title ?? 'Medication Alarm',
            body: notification.request.content.body ?? 'Time to take your medication',
          },
        });
      }, 100);
    }

    return {
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      priority: isAlarm
        ? Notifications.AndroidNotificationPriority.MAX
        : Notifications.AndroidNotificationPriority.HIGH,
    };
  },
});

// Listener for when user taps on a notification or taps an action button from lock screen/background
Notifications.addNotificationResponseReceivedListener(async (response) => {
  const data = response.notification.request.content.data;
  const actionId = response.actionIdentifier;

  if (actionId === 'CANCEL_ALARM_ACTION' || actionId === 'DISMISS_ACTION') {
    // Dismiss active notification on iOS/Android
    await Notifications.dismissNotificationAsync(response.notification.request.identifier);
    return;
  }

  if (data?.deliveryMode === 'ALARM' && actionId === Notifications.DEFAULT_ACTION_IDENTIFIER && Platform.OS !== 'android') {
    router.push({
      pathname: '/alarm-screen',
      params: {
        scheduleId: String(data?.scheduleId ?? ''),
        title: response.notification.request.content.title ?? 'Medication Alarm',
        body: response.notification.request.content.body ?? 'Time to take your medication',
      },
    });
  }
});

export class AlarmEngine {
  private static isInitialized = false;

  /**
   * Initialize Android channels & iOS notification categories
   */
  static async init(): Promise<void> {
    if (this.isInitialized) return;

    // Request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowCriticalAlerts: true,
        },
      });
      finalStatus = status;
    }

    if (Platform.OS === 'android') {
      // 1. Standard Notifications Channel
      await Notifications.setNotificationChannelAsync('default-notifications', {
        name: 'Reminders & Notifications',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#1A56DB',
      });

      // 2. Critical Alarms Channel (Bypasses DND, max importance)
      await Notifications.setNotificationChannelAsync('critical-alarms', {
        name: 'Critical Medication Alarms',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 500, 500, 500, 500, 500],
        lightColor: '#EF4444',
        bypassDnd: true,
        lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      });
    }

    // Delete category definition to ensure no action buttons are attached
    try {
      await Notifications.deleteNotificationCategoryAsync('CRITICAL_ALARM_CATEGORY');
    } catch {
      // Ignore if category didn't exist
    }

    this.isInitialized = true;
  }

  /**
   * Synchronize schedule based on user's choice: NOTIFICATION vs ALARM
   */
  static async syncSchedule(schedule: ScheduleTriggerInput): Promise<void> {
    await this.init();

    // Step 1: Always clear any previous trigger for this schedule ID first
    await this.cancelSchedule(schedule.scheduleId);

    // Step 2: If disabled, stop here
    if (!schedule.isEnabled) return;

    // Step 3: Compute target time components
    const [hours, minutes] = schedule.localTime.split(':').map(Number);
    const channelId = schedule.deliveryMode === 'ALARM' ? 'critical-alarms' : 'default-notifications';
    const soundName = 'default';

    // Step 4: Schedule trigger
    try {
      if (schedule.frequencyType === 'WEEKLY' && schedule.weekdays && schedule.weekdays.length > 0) {
        // Schedule weekly triggers for each selected weekday
        const weekdayMap: Record<MedicationWeekdayCode, number> = {
          SUN: 1, MON: 2, TUE: 3, WED: 4, THU: 5, FRI: 6, SAT: 7,
        };

        for (const dayCode of schedule.weekdays) {
          const weekdayNum = weekdayMap[dayCode];
          const subId = `${schedule.scheduleId}_${dayCode}`;
          await Notifications.cancelScheduledNotificationAsync(subId);

          await Notifications.scheduleNotificationAsync({
            identifier: subId,
            content: {
              title: schedule.title,
              body: schedule.body,
              sound: soundName,
              data: {
                scheduleId: schedule.scheduleId,
                reminderId: schedule.reminderId,
                deliveryMode: schedule.deliveryMode,
                localTime: schedule.localTime,
              },
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
              weekday: weekdayNum,
              hour: hours,
              minute: minutes,
              channelId,
            },
          });
        }
      } else if (schedule.frequencyType === 'MONTHLY' && schedule.monthDays && schedule.monthDays.length > 0) {
        // Schedule monthly triggers
        for (const dayNum of schedule.monthDays) {
          const subId = `${schedule.scheduleId}_m${dayNum}`;
          await Notifications.cancelScheduledNotificationAsync(subId);

          await Notifications.scheduleNotificationAsync({
            identifier: subId,
            content: {
              title: schedule.title,
              body: schedule.body,
              sound: soundName,
              data: {
                scheduleId: schedule.scheduleId,
                reminderId: schedule.reminderId,
                deliveryMode: schedule.deliveryMode,
                localTime: schedule.localTime,
              },
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.MONTHLY,
              day: dayNum,
              hour: hours,
              minute: minutes,
              channelId,
            },
          });
        }
      } else {
        // Default Daily recurrence trigger
        await Notifications.scheduleNotificationAsync({
          identifier: schedule.scheduleId,
          content: {
            title: schedule.title,
            body: schedule.body,
            sound: soundName,
            data: {
              scheduleId: schedule.scheduleId,
              reminderId: schedule.reminderId,
              deliveryMode: schedule.deliveryMode,
              localTime: schedule.localTime,
            },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour: hours,
            minute: minutes,
            channelId,
          },
        });
      }
    } catch (error) {
      console.warn(`Failed to schedule trigger for ${schedule.scheduleId}:`, error);
    }
  }

  /**
   * Cancel single schedule alert by ID
   */
  static async cancelSchedule(scheduleId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(scheduleId);
      await Notifications.dismissNotificationAsync(scheduleId);

      // Also clean up potential weekday sub-ids
      const weekdays: MedicationWeekdayCode[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
      for (const dayCode of weekdays) {
        await Notifications.cancelScheduledNotificationAsync(`${scheduleId}_${dayCode}`);
        await Notifications.dismissNotificationAsync(`${scheduleId}_${dayCode}`);
      }

      // Also clean up potential monthly sub-ids (1-31)
      for (let day = 1; day <= 31; day++) {
        await Notifications.cancelScheduledNotificationAsync(`${scheduleId}_m${day}`);
        await Notifications.dismissNotificationAsync(`${scheduleId}_m${day}`);
      }
    } catch (error) {
      console.warn(`Error cancelling schedule ${scheduleId}:`, error);
    }
  }

  /**
   * Snooze an alarm for X minutes into the future
   */
  static async snoozeAlarm(scheduleId: string, title: string, body: string, snoozeMinutes = 10): Promise<void> {
    await this.init();
    const snoozeId = `${scheduleId}_snooze_${Date.now()}`;

    await Notifications.scheduleNotificationAsync({
      identifier: snoozeId,
      content: {
        title: `[Snoozed] ${title}`,
        body,
        sound: 'default',
        data: {
          scheduleId,
          deliveryMode: 'ALARM',
          isSnoozed: true,
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: snoozeMinutes * 60,
        repeats: false,
        channelId: 'critical-alarms',
      },
    });
  }

  /**
   * Cancel all scheduled notifications and alarms
   */
  static async cancelAll(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Sync all triggers for a full Reminder object
   */
  static async syncReminderTriggers(reminder: any): Promise<void> {
    if (!reminder || !reminder.schedules) return;

    for (const schedule of reminder.schedules) {
      let frequencyType: 'DAILY' | 'WEEKLY' | 'MONTHLY' = 'DAILY';
      let weekdays: MedicationWeekdayCode[] | undefined = undefined;
      let monthDays: number[] | undefined = undefined;

      if (reminder.reminderType === 'MEDICATION') {
        frequencyType = reminder.frequencyType ?? 'DAILY';
        weekdays = reminder.weekdays;
        monthDays = reminder.monthDays;
      }

      await this.syncSchedule({
        scheduleId: schedule.scheduleId,
        reminderId: reminder.reminderId,
        title: reminder.title,
        body: reminder.reminderType === 'MEDICATION' && reminder.dosage
          ? `Take ${reminder.dosage}`
          : `Scheduled ${reminder.reminderType.toLowerCase()} reminder`,
        localTime: schedule.localTime,
        deliveryMode: schedule.deliveryMode ?? 'NOTIFICATION',
        isEnabled: reminder.isEnabled,
        frequencyType,
        weekdays,
        monthDays,
      });
    }
  }

  /**
   * Cancel all triggers for a full Reminder object
   */
  static async cancelReminderTriggers(reminder: any): Promise<void> {
    if (!reminder || !reminder.schedules) return;

    for (const schedule of reminder.schedules) {
      await this.cancelSchedule(schedule.scheduleId);
    }
  }

  /**
   * Test Method: Schedules a notification in 3 seconds and a real native alarm in 10 seconds.
   */
  static async testNotificationAndAlarm(): Promise<void> {
    await this.init();

    // 1. Notification in 3s (via expo-notifications)
    await Notifications.scheduleNotificationAsync({
      identifier: `test_notif_${Date.now()}`,
      content: {
        title: 'Test Notification (3s)',
        body: 'Standard non-intrusive alert banner.',
        data: { deliveryMode: 'NOTIFICATION' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 3,
        repeats: false,
        channelId: 'default-notifications',
      },
    });

    // 2. Real Native Alarm in 10s (via Native Android setAlarmClock / AlarmService)
    if (Platform.OS === 'android') {
      const targetDate = new Date(Date.now() + 10000);
      const requestCode = Math.floor(Math.random() * 100000) + 100;
      await AlarmService.scheduleAlarm(
        requestCode,
        targetDate,
        `test_sched_${Date.now()}`,
        'Vitamin D 1000IU',
        'Time to take your Vitamin D supplement as scheduled.'
      );
    } else {
      // iOS fallback
      await Notifications.scheduleNotificationAsync({
        identifier: `test_alarm_${Date.now()}`,
        content: {
          title: 'Vitamin D 1000IU',
          body: 'Time to take your Vitamin D supplement as scheduled.',
          data: {
            deliveryMode: 'ALARM',
            scheduleId: `test_sched_${Date.now()}`,
          },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 10,
          repeats: false,
          channelId: 'critical-alarms',
        },
      });
    }
  }
}
