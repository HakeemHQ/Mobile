import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  FlaskConical,
  HeartPulse,
  ClipboardList,
} from 'lucide-react-native';
import { ActivityListItem } from './ActivityListItem';

interface RecentActivityItem {
  id: string;
  title: string;
  subtitle: string;
  tag?: string;
  tagBgColor?: string;
  tagTextColor?: string;
  date?: string;
  icon: React.ReactNode;
}

interface RecentActivitySectionProps {
  onViewAllPress?: () => void;
  isRTL?: boolean;
}

export const RecentActivitySection: React.FC<RecentActivitySectionProps> = ({
  onViewAllPress,
  isRTL = false,
}) => {
  const { t } = useTranslation('home');

  const defaultActivities: RecentActivityItem[] = [
    {
      id: '1',
      title: t('activity1Title', { defaultValue: 'Comprehensive Metabolic Panel' }),
      subtitle: t('activity1Subtitle', { defaultValue: 'Lab results are ready for your review.' }),
      tag: t('activity1Tag', { defaultValue: 'Normal' }),
      tagBgColor: 'bg-[#ECFDF5]',
      tagTextColor: 'text-[#047857]',
      date: t('activity1Date', { defaultValue: 'Oct 24, 2023' }),
      icon: <FlaskConical size={22} color="#1A56DB" />,
    },
    {
      id: '2',
      title: t('activity2Title', { defaultValue: 'Prescription Renewed' }),
      subtitle: t('activity2Subtitle', { defaultValue: 'Lisinopril 10mg - 30 day supply.' }),
      tag: t('activity2Tag', { defaultValue: 'Pharmacy' }),
      tagBgColor: 'bg-[#EFF6FF]',
      tagTextColor: 'text-[#1D4ED8]',
      date: t('activity2Date', { defaultValue: 'Oct 22, 2023' }),
      icon: <HeartPulse size={22} color="#1A56DB" />,
    },
    {
      id: '3',
      title: t('activity3Title', { defaultValue: 'Clinical Note Added' }),
      subtitle: t('activity3Subtitle', { defaultValue: 'Dr. Jenkins updated your cardiology file.' }),
      tag: t('activity3Tag', { defaultValue: 'Normal' }),
      tagBgColor: 'bg-[#ECFDF5]',
      tagTextColor: 'text-[#047857]',
      date: t('activity3Date', { defaultValue: 'Oct 24, 2023' }),
      icon: <ClipboardList size={22} color="#1A56DB" />,
    },
  ];

  return (
    <View className="w-full mb-6">
      <View className={`w-full ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center justify-between mb-4`}>
        <Text className="text-[20px] font-jakarta-bold text-gray-900">
          {t('recentActivity', { defaultValue: 'Recent Activity' })}
        </Text>

        <Pressable onPress={onViewAllPress} className={`flex-row items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <Text className={`text-[14px] font-jakarta-bold text-[#1A56DB] ${isRTL ? 'ml-1' : 'mr-1'}`}>
            {t('viewAll', { defaultValue: 'View All' })}
          </Text>
          {isRTL ? <ArrowLeft size={16} color="#1A56DB" /> : <ArrowRight size={16} color="#1A56DB" />}
        </Pressable>
      </View>

      {defaultActivities.map((activity) => (
        <ActivityListItem
          key={activity.id}
          title={activity.title}
          body={activity.subtitle}
          tag={activity.tag}
          tagBgColor={activity.tagBgColor}
          tagTextColor={activity.tagTextColor}
          date={activity.date}
          leftIcon={activity.icon}
          iconBgColor="bg-[#D1E2FF]"
          containerClassName="mb-3"
        />
      ))}
    </View>
  );
};
