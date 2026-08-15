import React from 'react';
import { View, Text } from 'react-native';
import { useTranslation } from 'react-i18next';
import { colors } from '@/lib/theme/colors';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Calendar03Icon, Clock01Icon, Location01Icon } from '@hugeicons/core-free-icons';

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
      className={`w-full bg-[#EFF5FF] rounded-2xl p-4 mb-6 ${isRTL ? 'border-r-4 border-r-primary-500' : ' border-l-4 border-l-primary-500'
        } ${isRTL ? 'flex-row-reverse' : 'flex-row'} items-center`}
    >
      <View className={`w-11 h-11 rounded-xl bg-primary-500 items-center justify-center ${isRTL ? 'ml-3.5' : 'mr-3.5'}`}>
        <HugeiconsIcon icon={Calendar03Icon} size={22} color="#FFFFFF" />
      </View>

      <View className="flex-1">
        <Text className={`text-[13px] font-jakarta-bold text-bg-800 tracking-wider mb-1 uppercase ${isRTL ? 'text-right' : 'text-left'}`}>
          {t('upcomingAppointment', { defaultValue: 'UPCOMING APPOINTMENT' })}
        </Text>

        <Text className={`text-[20px] font-jakarta-bold text-primary-900 mb-2.5 ${isRTL ? 'text-right' : 'text-left'}`}>
          {doctorName || t('doctorName', { defaultValue: 'Dr. Sarah Jenkins • Cardiology' })}
        </Text>


        <View className={`flex items-center flex-wrap gap-x-5 gap-y-1.5 ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
          <View className={`flex-row items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
            <HugeiconsIcon icon={Clock01Icon} size={14} color={colors.text2[500]} />
            <Text className={`text-[13px] font-inter-regular text-gray-600 ${isRTL ? 'mr-1.5' : 'ml-1.5'}`}>
              {appointmentTime || t('appointmentTime', { defaultValue: 'Tomorrow, 10:30 AM' })}
            </Text>
          </View>

          {appointmentLocation ? (
            <View className={`flex-row items-center ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
              <HugeiconsIcon icon={Location01Icon} size={14} color={colors.text2[500]} />
              <Text className={`text-[13px] font-inter-regular text-gray-600 ${isRTL ? 'mr-1.5' : 'ml-1.5'}`}>
                {appointmentLocation}
              </Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
};
