import React from 'react';
import { View, Text, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import {
  MedicalProfileCard,
  UpcomingAppointmentCard,
  ReviewAlertBanner,
  QuickActionsGrid,
  RecentActivitySection,
} from '@/components/home';

export default function HomeScreen() {
  const { i18n } = useTranslation('home');
  const isRTL = i18n.language === 'ar';
  const router = useRouter();

  return (
    <>
    <StatusBar  barStyle={'dark-content'} />
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top', 'left', 'right']}>
      <ScrollView
        className="flex-1 px-5 pt-3"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >


        {/* 1. Medical Profile Card Component */}
        <MedicalProfileCard isRTL={isRTL} />

        {/* 2. Upcoming Appointment Card Component */}
        <UpcomingAppointmentCard isRTL={isRTL} />

        {/* 3. Review Alert Banner Component */}
        <ReviewAlertBanner isRTL={isRTL} />

        {/* 4. Quick Actions Grid Component */}
        <QuickActionsGrid
          isRTL={isRTL}
          onUploadPress={() => router.push('/add')}
          onTimelinePress={() => router.push('/(tabs)/timeline')}
          onCvPress={() => router.push('/(tabs)/medical-cv')}
        />

        {/* 5. Recent Activity Section Component */}
        <RecentActivitySection isRTL={isRTL} />
      </ScrollView>
    </SafeAreaView>
    </>
  );
}
