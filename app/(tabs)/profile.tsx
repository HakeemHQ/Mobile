import { View, Text, Pressable, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';
import { apiFetch, clearTokens } from '../../lib/api';
import { User02Icon } from '../../components/icons/User02Icon';
import { SecurityCheckIcon } from '../../components/icons/SecurityCheckIcon';
import { Notification01Icon } from '../../components/icons/Notification01Icon';
import { File02Icon } from '../../components/icons/File02Icon';
import { Stethoscope02Icon } from '../../components/icons/Stethoscope02Icon';
import { ChevronRightIcon } from '../../components/icons/ChevronRightIcon';

export default function ProfileScreen() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await apiFetch('/auth/logout', { method: 'POST' }).catch((err) => {
        console.log('Server logout failed:', err);
      });
    } finally {
      await clearTokens();
      router.replace('/(auth)/login');
    }
  };

  const menuItems = [
    { title: 'Personal Information', icon: User02Icon, route: '/personal-info' },
    { title: 'Privacy & Security', icon: SecurityCheckIcon, route: '/privacy' },
    { title: 'Notifications', icon: Notification01Icon, route: '/notifications' },
    { title: 'Data & Storage', icon: File02Icon, route: '/data-storage' },
    { title: 'Help & Support', icon: Stethoscope02Icon, route: '/help' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]" edges={['top']}>
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <Text className="text-[28px] font-jakarta-bold text-secondary-900 mt-2 mb-6">Profile</Text>

        {/* User Card */}
        <View className="bg-[#0A4D33] rounded-[28px] p-5 flex-row items-center mb-6">
          <View className="bg-[#073A25] rounded-[20px] w-[68px] h-[68px] items-center justify-center mr-4">
            <Text className="text-white text-2xl font-jakarta-bold">YT</Text>
          </View>
          <View>
            <Text className="text-white text-[17px] font-jakarta-bold">Youssef Tarek</Text>
            <Text className="text-white/70 text-[11px] font-inter-regular mt-1 mb-1">DOB : Mar 15, 1985</Text>
            <Text className="text-white/70 text-[11px] font-inter-regular">HAK-2025-00847</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="bg-white rounded-[28px] border border-gray-100 overflow-hidden mb-6">
          {menuItems.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => item.route && router.push(item.route as any)}
              className={`flex-row items-center px-5 py-[18px] ${index !== menuItems.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              <View className="w-[42px] h-[42px] rounded-full bg-[#E5F5ED] items-center justify-center mr-4">
                <item.icon size={20} color="#0A4D33" />
              </View>
              <Text className="flex-1 text-[15px] font-jakarta-semibold text-secondary-900">{item.title}</Text>
              <ChevronRightIcon size={20} color="#9CA3AF" />
            </Pressable>
          ))}
        </View>

        {/* Sign Out Button */}
        <Pressable 
          className={`bg-white border border-gray-100 h-[56px] rounded-[28px] items-center justify-center mb-8 ${isLoggingOut ? 'opacity-70' : ''}`}
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <ActivityIndicator color="#111827" />
          ) : (
            <Text className="text-[#111827] font-jakarta-semibold text-[15px]">Sign out</Text>
          )}
        </Pressable>

        <Text className="text-center text-[11px] font-inter-regular text-gray-400 mb-8">
          Hakeem v1.0.0 - HIPAA-compliant
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
