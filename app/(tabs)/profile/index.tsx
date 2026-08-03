import { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

import { useProfileStore } from '@/store/useProfileStore';
import { ProfileSummaryCard } from '@/components/personal-info/ProfileSummaryCard';
import { logoutApi, clearTokens } from '@/lib/api';
import { colors } from '@/lib/theme/colors';

import { User02Icon } from '@/components/icons/User02Icon';
import { SecurityCheckIcon } from '@/components/icons/SecurityCheckIcon';
import { Notification01Icon } from '@/components/icons/Notification01Icon';
import { File02Icon } from '@/components/icons/File02Icon';
import { Stethoscope02Icon } from '@/components/icons/Stethoscope02Icon';
import { ChevronRightIcon } from '@/components/icons/ChevronRightIcon';

export default function ProfileScreen() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const profile = useProfileStore((state) => state.profile);
  const fetchStatus = useProfileStore((state) => state.fetchStatus);
  const fetchError = useProfileStore((state) => state.fetchError);
  const fetchProfile = useProfileStore((state) => state.fetchProfile);

  useEffect(() => {
    void fetchProfile();
  }, [fetchProfile]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutApi();
    } finally {
      await clearTokens();
      router.replace('/(auth)/login');
    }
  };

  const menuItems = [
    { title: 'Personal Information', icon: User02Icon, route: '/profile/personal-info' },
    { title: 'Privacy & Security', icon: SecurityCheckIcon, route: '/profile/privacy' },
    { title: 'Notifications', icon: Notification01Icon, route: null },
    { title: 'Data & Storage', icon: File02Icon, route: null },
    { title: 'Help & Support', icon: Stethoscope02Icon, route: '/profile/help' },
  ];

  const isLoading = fetchStatus === 'loading' && !profile;

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        <Text className="text-[28px] font-jakarta-bold text-primary-900 mt-2 mb-6">Profile</Text>

        {/* User Card */}
        {isLoading ? (
          <View className="bg-primary-900 rounded-[28px] p-6 mb-6 items-center justify-center min-h-[110px]">
            <ActivityIndicator size="small" color={colors.surface.DEFAULT} />
            <Text className="text-surface/80 text-[12px] font-inter-regular mt-2">
              Loading profile details...
            </Text>
          </View>
        ) : profile ? (
          <ProfileSummaryCard profile={profile} />
        ) : (
          <View className="bg-primary-900 rounded-[28px] p-5 flex-row items-center mb-6">
            <View className="bg-primary-800 rounded-[20px] w-[68px] h-[68px] items-center justify-center mr-4">
              <Text className="text-surface text-2xl font-jakarta-bold">HK</Text>
            </View>
            <View className="flex-1">
              <Text className="text-surface text-[17px] font-jakarta-bold">Hakeem User</Text>
              <Text className="text-surface/70 text-[11px] font-inter-regular mt-1">
                {fetchError || 'Unable to load profile details'}
              </Text>
            </View>
          </View>
        )}

        {/* Menu Items */}
        <View className="bg-surface rounded-[28px] border border-bg-600 overflow-hidden mb-6 shadow-sm">
          {menuItems.map((item, index) => (
            <Pressable
              key={item.title}
              onPress={() => item.route && router.push(item.route as any)}
              className={`flex-row items-center px-5 py-[18px] ${
                index !== menuItems.length - 1 ? 'border-b border-bg-600/40' : ''
              }`}
              style={({ pressed }) => ({
                backgroundColor: pressed ? colors.bg[100] : colors.surface.DEFAULT,
              })}
            >
              <View className="w-[42px] h-[42px] rounded-full bg-bg-600/30 items-center justify-center mr-4">
                <item.icon size={20} color={colors.primary[900]} />
              </View>
              <Text className="flex-1 text-[15px] font-jakarta-semibold text-primary-900">
                {item.title}
              </Text>
              <ChevronRightIcon size={20} color={colors.text2[500]} />
            </Pressable>
          ))}
        </View>

        {/* Sign Out Button */}
        <Pressable
          className={`bg-surface border border-bg-600 h-[56px] rounded-[28px] items-center justify-center mb-6 shadow-sm ${
            isLoggingOut ? 'opacity-70' : ''
          }`}
          onPress={handleLogout}
          disabled={isLoggingOut}
          style={({ pressed }) => ({
            backgroundColor: pressed ? colors.bg[100] : colors.surface.DEFAULT,
          })}
        >
          {isLoggingOut ? (
            <ActivityIndicator color={colors.primary[900]} />
          ) : (
            <Text className="text-primary-900 font-jakarta-semibold text-[15px]">Sign out</Text>
          )}
        </Pressable>

        <Text className="text-center text-[11px] font-inter-regular text-text2-500 mb-8">
          Hakeem v1.0.0 • HIPAA-compliant Security
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
