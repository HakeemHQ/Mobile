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
import { useDocuments } from '@/hooks/useDocuments';

export default function HomeScreen() {
  const { i18n } = useTranslation('home');
  const isRTL = i18n.language === 'ar';
  const router = useRouter();

  const { totalCount, documents } = useDocuments();
  const docsCount = totalCount || documents.length;

  return (
    <>
      <StatusBar barStyle={'dark-content'} />
      <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top', 'left', 'right']}>
        <ScrollView
          className="flex-1 px-5 pt-3"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* 1. Medical Profile Card Component (dynamic documents count) */}
          <MedicalProfileCard isRTL={isRTL} documentsCount={docsCount} />

          {/* 2. Upcoming Appointment Card Component */}
          <UpcomingAppointmentCard isRTL={isRTL} />

          {/* 3. Review Alert Banner Component */}
          <ReviewAlertBanner isRTL={isRTL} />

          {/* 4. Quick Actions Grid Component (Documents button opens /documents) */}
          <QuickActionsGrid
            isRTL={isRTL}
            onDocumentsPress={() => router.push('/documents' as any)}
            onUploadPress={() => router.push('/documents' as any)}
            onTimelinePress={() => router.push('/(tabs)/timeline')}
            onCvPress={() => router.push('/(tabs)/medical-cv')}
            onRemindersPress={() => router.push('/reminders')}
          />

          {/* 5. Recent Activity Section Component */}
          <RecentActivitySection isRTL={isRTL} />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
