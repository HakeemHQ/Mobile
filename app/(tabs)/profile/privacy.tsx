import { View, Text, Pressable, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';

import { colors } from '@/lib/theme/colors';
import { ArrowLeft02Icon } from '@/components/icons/ArrowLeft02Icon';
import { LockIcon } from '@/components/icons/LockIcon';
import { FaceIdIcon } from '@/components/icons/FaceIdIcon';
import { SecurityCheckIcon } from '@/components/icons/SecurityCheckIcon';
import { LaptopIcon } from '@/components/icons/LaptopIcon';
import { ChevronRightIcon } from '@/components/icons/ChevronRightIcon';
import { ShieldIcon } from '@/components/icons/ShieldIcon';
import { Delete02Icon } from '@/components/icons/Delete02Icon';
import { Alert01Icon } from '@/components/icons/Alert01Icon';

export default function PrivacyScreen() {
  const [faceIdEnabled, setFaceIdEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-6 mt-2 mb-6">
        <Pressable 
          accessibilityLabel="Return to Profile"
          accessibilityRole="button"
          className="w-10 h-10 rounded-full border border-bg-600 items-center justify-center mr-4 bg-surface"
          onPress={() => router.back()}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <ArrowLeft02Icon size={20} color={colors.text[800]} />
        </Pressable>
        <Text className="text-[22px] font-jakarta-bold text-primary-900">Privacy & Security</Text>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* PASSWORD */}
        <Text className="text-xs font-jakarta-bold text-text2-500 mb-3 ml-2 uppercase tracking-wider">Password</Text>
        <Pressable 
          onPress={() => router.push('/profile/change-password')}
          className="bg-surface rounded-[28px] border border-bg-600 flex-row items-center px-5 py-[18px] mb-8 shadow-sm"
          style={({ pressed }) => ({
            backgroundColor: pressed ? colors.bg[100] : colors.surface.DEFAULT,
          })}
        >
          <View className="w-12 h-12 rounded-[18px] bg-primary-50 items-center justify-center mr-4">
            <LockIcon size={22} color={colors.primary[900]} />
          </View>
          <View className="flex-1">
            <Text className="text-[15px] font-jakarta-semibold text-primary-900">Change Password</Text>
            <Text className="text-[12px] font-inter-regular text-text2-500 mt-1">Last changed 3 months ago</Text>
          </View>
          <ChevronRightIcon size={20} color={colors.text2[500]} />
        </Pressable>

        {/* AUTHENTICATION */}
        <Text className="text-xs font-jakarta-bold text-text2-500 mb-3 ml-2 uppercase tracking-wider">Authentication</Text>
        <View className="bg-surface rounded-[28px] border border-bg-600 overflow-hidden mb-8 shadow-sm">
          <View className="flex-row items-center px-5 py-[18px] border-b border-bg-600/40">
            <View className="w-12 h-12 rounded-[18px] bg-primary-50 items-center justify-center mr-4">
              <FaceIdIcon size={22} color={colors.primary[900]} />
            </View>
            <Text className="flex-1 text-[15px] font-jakarta-semibold text-primary-900">Enable Face ID / Biometrics</Text>
            <Switch 
              value={faceIdEnabled} 
              onValueChange={setFaceIdEnabled}
              trackColor={{ false: colors.bg[600], true: colors.primary[900] }}
              thumbColor={colors.surface.DEFAULT}
            />
          </View>
          <View className="flex-row items-center px-5 py-[18px]">
            <View className="w-12 h-12 rounded-[18px] bg-primary-50 items-center justify-center mr-4">
              <SecurityCheckIcon size={22} color={colors.primary[900]} />
            </View>
            <View className="flex-1">
              <Text className="text-[15px] font-jakarta-semibold text-primary-900">Two-Factor Authentication</Text>
              <Text className="text-[12px] font-inter-regular text-text2-500 mt-1">Secure your account via SMS/Email</Text>
            </View>
            <Switch 
              value={twoFactorEnabled} 
              onValueChange={setTwoFactorEnabled}
              trackColor={{ false: colors.bg[600], true: colors.primary[900] }}
              thumbColor={colors.surface.DEFAULT}
            />
          </View>
        </View>

        {/* SESSION */}
        <Text className="text-xs font-jakarta-bold text-text2-500 mb-3 ml-2 uppercase tracking-wider">Session</Text>
        <Pressable 
          className="bg-surface rounded-[28px] border border-bg-600 flex-row items-center px-5 py-[18px] mb-8 shadow-sm"
          style={({ pressed }) => ({
            backgroundColor: pressed ? colors.bg[100] : colors.surface.DEFAULT,
          })}
        >
          <View className="w-12 h-12 rounded-[18px] bg-primary-50 items-center justify-center mr-4">
            <LaptopIcon size={22} color={colors.primary[900]} />
          </View>
          <View className="flex-1">
            <Text className="text-[15px] font-jakarta-semibold text-primary-900">Manage Logged-in Devices</Text>
            <Text className="text-[12px] font-inter-regular text-text2-500 mt-1">3 active sessions</Text>
          </View>
          <ChevronRightIcon size={20} color={colors.text2[500]} />
        </Pressable>

        {/* HIPAA Compliance Card */}
        <View className="bg-surface rounded-[32px] border border-bg-600 items-center p-8 mb-8 shadow-sm">
          <View className="w-16 h-16 rounded-full bg-primary-900 items-center justify-center mb-4">
            <ShieldIcon size={28} color={colors.surface.DEFAULT} />
          </View>
          <Text className="text-[17px] font-jakarta-bold text-primary-900 mb-2 text-center">Your data is HIPAA compliant</Text>
          <Text className="text-[13px] font-inter-regular text-text2-500 text-center leading-5">
            Hakeem uses end-to-end encryption for all medical records and private communications.
          </Text>
        </View>

        {/* Delete Account */}
        <Pressable 
          onPress={() => router.push('/profile/delete-account')}
          className="bg-danger-50 rounded-[28px] border border-danger-200 flex-row items-center px-5 py-5 mb-8"
          style={({ pressed }) => ({
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <View className="w-12 h-12 rounded-[18px] bg-danger-100 items-center justify-center mr-4">
            <Delete02Icon size={22} color={colors.danger.DEFAULT} />
          </View>
          <View className="flex-1">
            <Text className="text-[15px] font-jakarta-bold text-danger">Delete Account</Text>
            <Text className="text-[12px] font-inter-regular text-gray-500 mt-1">Permanently remove all your data</Text>
          </View>
          <Alert01Icon size={22} color={colors.danger.DEFAULT} />
        </Pressable>

        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
