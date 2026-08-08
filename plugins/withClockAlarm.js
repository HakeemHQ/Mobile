const { withAndroidManifest, withInfoPlist } = require('@expo/config-plugins');

/**
 * Expo Config Plugin to enable Clock/Watch App style Alarm capabilities.
 * Registers permissions (RECEIVE_BOOT_COMPLETED, USE_FULL_SCREEN_INTENT, SCHEDULE_EXACT_ALARM),
 * AlarmReceiver, BootReceiver, and AlarmActivity in AndroidManifest.xml.
 */
const withClockAlarm = (config) => {
  // 1. Configure Android Manifest
  config = withAndroidManifest(config, (config) => {
    const androidManifest = config.modResults;

    if (!androidManifest.manifest['uses-permission']) {
      androidManifest.manifest['uses-permission'] = [];
    }

    const requiredPermissions = [
      'android.permission.POST_NOTIFICATIONS',
      'android.permission.SCHEDULE_EXACT_ALARM',
      'android.permission.USE_EXACT_ALARM',
      'android.permission.USE_FULL_SCREEN_INTENT',
      'android.permission.WAKE_LOCK',
      'android.permission.DISABLE_KEYGUARD',
      'android.permission.VIBRATE',
      'android.permission.RECEIVE_BOOT_COMPLETED',
    ];

    requiredPermissions.forEach((permissionName) => {
      const exists = androidManifest.manifest['uses-permission'].some(
        (item) => item.$['android:name'] === permissionName
      );
      if (!exists) {
        androidManifest.manifest['uses-permission'].push({
          $: { 'android:name': permissionName },
        });
      }
    });

    const mainApplication = androidManifest.manifest.application?.[0];
    if (mainApplication) {
      if (!mainApplication.activity) {
        mainApplication.activity = [];
      }
      if (!mainApplication.receiver) {
        mainApplication.receiver = [];
      }

      // 1. Register MainActivity showWhenLocked
      const mainActivity = mainApplication.activity.find(
        (act) => act.$['android:name'] === '.MainActivity'
      );
      if (mainActivity) {
        mainActivity.$['android:showWhenLocked'] = 'true';
        mainActivity.$['android:turnScreenOn'] = 'true';
      }

      // 2. Register native AlarmActivity
      const alarmActivityExists = mainApplication.activity.some(
        (act) => act.$['android:name'] === '.alarm.AlarmActivity'
      );
      if (!alarmActivityExists) {
        mainApplication.activity.push({
          $: {
            'android:name': '.alarm.AlarmActivity',
            'android:exported': 'false',
            'android:showWhenLocked': 'true',
            'android:turnScreenOn': 'true',
            'android:excludeFromRecents': 'true',
            'android:noHistory': 'true',
            'android:launchMode': 'singleTop',
            'android:theme': '@android:style/Theme.DeviceDefault.NoActionBar.Fullscreen',
          },
        });
      }

      // 3. Register AlarmReceiver
      const alarmReceiverExists = mainApplication.receiver.some(
        (rec) => rec.$['android:name'] === '.alarm.AlarmReceiver'
      );
      if (!alarmReceiverExists) {
        mainApplication.receiver.push({
          $: {
            'android:name': '.alarm.AlarmReceiver',
            'android:exported': 'false',
          },
        });
      }

      // 4. Register BootReceiver for BOOT_COMPLETED
      const bootReceiverExists = mainApplication.receiver.some(
        (rec) => rec.$['android:name'] === '.alarm.BootReceiver'
      );
      if (!bootReceiverExists) {
        mainApplication.receiver.push({
          $: {
            'android:name': '.alarm.BootReceiver',
            'android:exported': 'true',
          },
          'intent-filter': [
            {
              action: [
                { $: { 'android:name': 'android.intent.action.BOOT_COMPLETED' } },
                { $: { 'android:name': 'android.intent.action.QUICKBOOT_POWERON' } },
              ],
            },
          ],
        });
      }
    }

    return config;
  });

  // 2. Configure iOS Info.plist
  config = withInfoPlist(config, (config) => {
    if (!config.modResults.UIBackgroundModes) {
      config.modResults.UIBackgroundModes = [];
    }
    if (!config.modResults.UIBackgroundModes.includes('audio')) {
      config.modResults.UIBackgroundModes.push('audio');
    }
    return config;
  });

  return config;
};

module.exports = withClockAlarm;
