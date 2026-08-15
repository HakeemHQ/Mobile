import { useState, useEffect, useMemo, useCallback } from 'react';
import { ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useRouter, useFocusEffect } from 'expo-router';
import {
  MedicalProfileCard,
  UpcomingAppointmentCard,
  ReviewAlertBanner,
  QuickActionsGrid,
  RecentActivitySection,
} from '@/components/home';
import { useDocuments } from '@/hooks/useDocuments';
import { useReminderStore } from '@/store/useReminderStore';
import { getAccessRequests } from '@/lib/api/access-requests';
import type { AppointmentReminder } from '@/types/reminder';

export default function HomeScreen() {
  const { t, i18n } = useTranslation('home');
  const isRTL = i18n.language === 'ar';
  const router = useRouter();

  const { totalCount, documents } = useDocuments();
  const docsCount = totalCount || documents.length;

  const reminders = useReminderStore((state) => state.reminders);
  const loadReminders = useReminderStore((state) => state.loadReminders);

  const [pendingRequestsCount, setPendingRequestsCount] = useState<number>(0);

  const checkPendingRequests = useCallback(async () => {
    try {
      const res = await getAccessRequests('pending', 1, 10);
      if (res.success && res.data) {
        const count = res.data.totalCount ?? res.data.items?.length ?? 0;
        setPendingRequestsCount(count);
      } else {
        setPendingRequestsCount(0);
      }
    } catch {
      setPendingRequestsCount(0);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void checkPendingRequests();
      void loadReminders();
    }, [checkPendingRequests, loadReminders])
  );

  const upcomingAppointment = useMemo(() => {
    const now = new Date().toISOString();
    const upcoming = reminders
      .filter((r): r is AppointmentReminder => r.reminderType === 'APPOINTMENT' && r.appointmentDate > now)
      .sort((a, b) => a.appointmentDate.localeCompare(b.appointmentDate));
    return upcoming[0] || null;
  }, [reminders]);

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
          {upcomingAppointment && (
            <UpcomingAppointmentCard
              isRTL={isRTL}
              doctorName={upcomingAppointment.providerName || undefined}
              appointmentTime={new Date(upcomingAppointment.appointmentDate).toLocaleString(isRTL ? 'ar' : 'en', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            />
          )}

          {/* 3. Pending Access Request Review Alert Banner (only visible if pending requests exist) */}
          {pendingRequestsCount > 0 && (
            <ReviewAlertBanner
              isRTL={isRTL}
              title={
                pendingRequestsCount === 1
                  ? t('pendingDoctorRequestsTitle', { count: 1, defaultValue: '1 doctor access request pending' })
                  : t('pendingDoctorRequestsTitle_plural', { count: pendingRequestsCount, defaultValue: `${pendingRequestsCount} doctor access requests pending` })
              }
              subtitle={t('pendingDoctorRequestsSubtitle', { defaultValue: 'Tap to review and grant doctor access code' })}
              onPress={() => router.push('/access-requests' as any)}
            />
          )}

          {/* 4. Quick Actions Grid Component */}
          <QuickActionsGrid
            isRTL={isRTL}
            onDocumentsPress={() => router.push('/documents' as any)}
            onUploadPress={() => router.push('/documents' as any)}
            onAccessRequestsPress={() => router.push('/access-requests' as any)}
            onCvPress={() => router.push('/(tabs)/medical-cv')}
            onRemindersPress={() => router.push('/reminders')}
          />

          {/* 5. Recent Activity Section Component (Dynamic reminders from SQLite) */}
          <RecentActivitySection
            isRTL={isRTL}
            reminders={reminders}
            onViewAllPress={() => router.push('/reminders')}
            onReminderPress={() => router.push('/reminders')}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
