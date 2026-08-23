import { NativeModules, Platform } from 'react-native';

const { AndroidAlarmModule } = NativeModules;

export class AlarmService {
  /**
   * Schedules a native Android setAlarmClock exact alarm
   */
  static async scheduleAlarm(
    requestCode: number,
    triggerDate: Date,
    scheduleId: string,
    title: string,
    body: string
  ): Promise<boolean> {
    if (Platform.OS !== 'android' || !AndroidAlarmModule) {
      console.warn('AndroidAlarmModule is only available on native Android.');
      return false;
    }

    try {
      const timestampMs = triggerDate.getTime();
      return await AndroidAlarmModule.scheduleAlarm(
        requestCode,
        timestampMs,
        scheduleId,
        title,
        body
      );
    } catch (error) {
      console.error('Error scheduling native Android alarm:', error);
      return false;
    }
  }

  /**
   * Cancels a scheduled native Android alarm by request code
   */
  static async cancelAlarm(requestCode: number): Promise<boolean> {
    if (Platform.OS !== 'android' || !AndroidAlarmModule) {
      return false;
    }

    try {
      return await AndroidAlarmModule.cancelAlarm(requestCode);
    } catch (error) {
      console.error('Error cancelling native Android alarm:', error);
      return false;
    }
  }

  /**
   * Stops any currently playing native alarm sound/vibration and clears its notification
   */
  static async stopActiveAlarm(): Promise<boolean> {
    if (Platform.OS !== 'android' || !AndroidAlarmModule) {
      return false;
    }

    try {
      return await AndroidAlarmModule.stopActiveAlarm();
    } catch (error) {
      console.error('Error stopping native Android alarm:', error);
      return false;
    }
  }

  /**
   * Checks if Android exact alarm permission is granted
   */
  static async checkExactAlarmPermission(): Promise<boolean> {
    if (Platform.OS !== 'android' || !AndroidAlarmModule) {
      return true;
    }

    try {
      return await AndroidAlarmModule.canScheduleExactAlarms();
    } catch (error) {
      return true;
    }
  }

  /**
   * Utility to generate a stable 32-bit positive integer request code from a string ID
   */
  static generateRequestCode(id: string): number {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = (hash << 5) - hash + id.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }
}
