import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, BackHandler, Vibration } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { BellRing, Clock, Pill } from 'lucide-react-native';
import { Button } from '@/components/ui/Button';
import { AlarmEngine } from '@/lib/alarm-engine';
import { colors } from '@/lib/theme/colors';

export default function AlarmScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    scheduleId?: string;
    title?: string;
    body?: string;
  }>();

  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // 1. Continuous looping vibration pattern until dismissed/snoozed
    const vibrationPattern = [0, 800, 400, 800, 400];
    Vibration.vibrate(vibrationPattern, true);

    // 2. Block Android hardware back button so the user MUST take action (Dismiss or Snooze)
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true; // Prevents back navigation
    });

    // 3. Update clock every second
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => {
      Vibration.cancel();
      backHandler.remove();
      clearInterval(interval);
    };
  }, []);

  const handleDismiss = () => {
    Vibration.cancel();
    router.replace('/(tabs)');
  };

  const handleSnooze = async () => {
    Vibration.cancel();
    if (params.scheduleId) {
      await AlarmEngine.snoozeAlarm(
        params.scheduleId,
        params.title ?? 'Medication Reminder',
        params.body ?? 'Time to take your medication',
        10
      );
    }
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-950 justify-between items-center px-6 py-10">
      <StatusBar style="light" />

      {/* Top Section: Digital Clock & Alarm Icon */}
      <View className="items-center mt-12">
        <View className="w-20 h-20 bg-rose-500/20 rounded-full items-center justify-center mb-6 border border-rose-500/30">
          <BellRing size={40} color="#F43F5E" />
        </View>

        <Text className="text-6xl font-bold text-white tracking-widest font-mono">
          {currentTime || '08:00 AM'}
        </Text>
        <Text className="text-xl text-slate-400 mt-2 font-medium">
          {params.title ?? 'Medication Alarm'}
        </Text>
      </View>

      {/* Center Card: Medication / Reminder Info */}
      <View className="w-full bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-2xl my-auto">
        <View className="flex-row items-center mb-3">
          <Pill size={22} color={colors.primary.DEFAULT} className="mr-3" />
          <Text className="text-white text-lg font-semibold flex-1">
            {params.title ?? 'Take prescribed dose'}
          </Text>
        </View>

        <Text className="text-slate-300 text-sm leading-relaxed pl-8">
          {params.body ?? 'Please check your medication dosage and take it with water.'}
        </Text>
      </View>

      {/* Bottom Actions: Snooze & Dismiss */}
      <View className="w-full gap-4 mb-4">
        <Button
          title="Snooze (10 minutes)"
          variant="outline"
          leftIcon={<Clock size={20} color="#F59E0B" />}
          onPress={handleSnooze}
          className="border-amber-500/40 py-4"
        />

        <Button
          title="Dismiss Alarm"
          variant="primary"
          onPress={handleDismiss}
          className="py-4 bg-rose-600 active:bg-rose-700"
        />
      </View>
    </SafeAreaView>
  );
}
