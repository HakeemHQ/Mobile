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
import { ListItem } from '@/components/ui/ListItem';

interface RecentActivityItem {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  tagBgColor: string;
  tagTextColor: string;
  date: string;
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
        <View key={activity.id} className="mb-4">
          <ListItem
            title={activity.title}
            body={activity.subtitle}
            showLeftIcon
            iconBgColor="bg-[#D1E2FF]"
            leftIcon={activity.icon}
            rightIcon={<ChevronRight size={20} color="#9CA3AF" style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />}
            containerClassName="mb-1"
          />
          <View className={`px-4 ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center`}>
            <View className={`px-2.5 py-0.5 rounded-md ${activity.tagBgColor} ${isRTL ? 'ml-2' : 'mr-2'}`}>
              <Text className={`text-[12px] font-jakarta-bold ${activity.tagTextColor}`}>
                {activity.tag}
              </Text>
            </View>
            <Text className="text-[12px] font-inter-regular text-gray-400">
              {activity.date}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};
