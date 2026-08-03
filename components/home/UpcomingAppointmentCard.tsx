import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Calendar, Clock, MapPin } from 'lucide-react-native';

interface UpcomingAppointmentCardProps {
  doctorName?: string;
  appointmentTime?: string;
  appointmentLocation?: string;
  isRTL?: boolean;
}

export const UpcomingAppointmentCard: React.FC<UpcomingAppointmentCardProps> = ({
  doctorName,
  appointmentTime,
  appointmentLocation,
  isRTL = false,
}) => {
  const { t } = useTranslation('home');

  return (
    <View
      className={`w-full bg-[#EFF5FF] rounded-2xl p-4.5 mb-6 ${
        isRTL ? 'border-r-4 border-r-[#1A56DB]' : 'border-l-4 border-l-[#1A56DB]'
      } ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-start`}
    >
      <View className={`w-11 h-11 rounded-xl bg-[#1A56DB] items-center justify-center ${isRTL ? 'ml-3.5' : 'mr-3.5'}`}>
        <Calendar size={22} color="#FFFFFF" />
      </View>

      <View className="flex-1">
        <Text className={`text-[11px] font-jakarta-bold text-gray-500 tracking-wider mb-1 uppercase ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('upcomingAppointment', { defaultValue: 'UPCOMING APPOINTMENT' })}
        </Text>

        <Text className={`text-[16px] font-jakarta-bold text-gray-900 mb-2.5 ${isRTL ? 'text-right' : 'text-left'}`}>
          {doctorName || t('doctorName', { defaultValue: 'Dr. Sarah Jenkins • Cardiology' })}
        </Text>

        <View className={`flex-row items-center flex-wrap gap-x-5 gap-y-1.5 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <View className={`flex-row items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <Clock size={14} color="#6B7280" />
            <Text className={`text-[13px] font-inter-regular text-gray-600 ${isRTL ? 'mr-1.5' : 'ml-1.5'}`}>
              {appointmentTime || t('appointmentTime', { defaultValue: 'Tomorrow, 10:30 AM' })}
            </Text>
          </View>

          <View className={`flex-row items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <MapPin size={14} color="#6B7280" />
            <Text className={`text-[13px] font-inter-regular text-gray-600 ${isRTL ? 'mr-1.5' : 'ml-1.5'}`}>
              {appointmentLocation || t('appointmentLocation', { defaultValue: 'Main Wing, Room 402' })}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
