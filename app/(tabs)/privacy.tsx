import { View, Text, Pressable, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { ArrowLeft02Icon } from '../../components/icons/ArrowLeft02Icon';
import { LockIcon } from '../../components/icons/LockIcon';
import { FaceIdIcon } from '../../components/icons/FaceIdIcon';
import { SecurityCheckIcon } from '../../components/icons/SecurityCheckIcon';
import { LaptopIcon } from '../../components/icons/LaptopIcon';
import { ChevronRightIcon } from '../../components/icons/ChevronRightIcon';
import { ShieldIcon } from '../../components/icons/ShieldIcon';
import { Delete02Icon } from '../../components/icons/Delete02Icon';
import { Alert01Icon } from '../../components/icons/Alert01Icon';

export default function PrivacyScreen() {
  const [faceIdEnabled, setFaceIdEnabled] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-6 mt-2 mb-6">
        <Pressable 
          className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center mr-4 bg-white"
          onPress={() => router.back()}
        >
          <ArrowLeft02Icon size={20} color="#111827" />
        </Pressable>
        <Text className="text-[22px] font-jakarta-bold text-secondary-900">Privacy & Security</Text>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* PASSWORD */}
        <Text className="text-xs font-jakarta-bold text-gray-400 mb-3 ml-2 uppercase tracking-wider">Password</Text>
        <Pressable 
          onPress={() => router.push('/change-password')}
          className="bg-white rounded-[28px] border border-gray-100 flex-row items-center px-5 py-[18px] mb-8"
        >
          <View className="w-12 h-12 rounded-[18px] bg-[#E5F5ED] items-center justify-center mr-4">
            <LockIcon size={22} color="#0A4D33" />
          </View>
          <View className="flex-1">
            <Text className="text-[15px] font-jakarta-semibold text-secondary-900">Change Password</Text>
            <Text className="text-[12px] font-inter-regular text-gray-400 mt-1">Last changed 3 months ago</Text>
          </View>
          <ChevronRightIcon size={20} color="#9CA3AF" />
        </Pressable>

        {/* AUTHENTICATION */}
        <Text className="text-xs font-jakarta-bold text-gray-400 mb-3 ml-2 uppercase tracking-wider">Authentication</Text>
        <View className="bg-white rounded-[28px] border border-gray-100 overflow-hidden mb-8">
          <View className="flex-row items-center px-5 py-[18px] border-b border-gray-50">
            <View className="w-12 h-12 rounded-[18px] bg-[#E5F5ED] items-center justify-center mr-4">
              <FaceIdIcon size={22} color="#0A4D33" />
            </View>
            <Text className="flex-1 text-[15px] font-jakarta-semibold text-secondary-900">Enable Face ID / Biometrics</Text>
            <Switch 
              value={faceIdEnabled} 
              onValueChange={setFaceIdEnabled}
              trackColor={{ false: '#E5E7EB', true: '#0A4D33' }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View className="flex-row items-center px-5 py-[18px]">
            <View className="w-12 h-12 rounded-[18px] bg-[#E5F5ED] items-center justify-center mr-4">
              <SecurityCheckIcon size={22} color="#0A4D33" />
            </View>
            <View className="flex-1">
              <Text className="text-[15px] font-jakarta-semibold text-secondary-900">Two-Factor Authentication</Text>
              <Text className="text-[12px] font-inter-regular text-gray-400 mt-1">Secure your account via SMS/Email</Text>
            </View>
            <Switch 
              value={twoFactorEnabled} 
              onValueChange={setTwoFactorEnabled}
              trackColor={{ false: '#E5E7EB', true: '#0A4D33' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* SESSION */}
        <Text className="text-xs font-jakarta-bold text-gray-400 mb-3 ml-2 uppercase tracking-wider">Session</Text>
        <Pressable className="bg-white rounded-[28px] border border-gray-100 flex-row items-center px-5 py-[18px] mb-8">
          <View className="w-12 h-12 rounded-[18px] bg-[#E5F5ED] items-center justify-center mr-4">
            <LaptopIcon size={22} color="#0A4D33" />
          </View>
          <View className="flex-1">
            <Text className="text-[15px] font-jakarta-semibold text-secondary-900">Manage Logged-in Devices</Text>
            <Text className="text-[12px] font-inter-regular text-gray-400 mt-1">3 active sessions</Text>
          </View>
          <ChevronRightIcon size={20} color="#9CA3AF" />
        </Pressable>

        {/* HIPAA Compliance */}
        <View className="bg-white rounded-[32px] border border-gray-100 items-center p-8 mb-8">
          <View className="w-16 h-16 rounded-full bg-[#0A4D33] items-center justify-center mb-4">
            <ShieldIcon size={28} color="#FFFFFF" />
          </View>
          <Text className="text-[17px] font-jakarta-bold text-[#0A4D33] mb-2 text-center">Your data is HIPAA compliant</Text>
          <Text className="text-[13px] font-inter-regular text-gray-400 text-center leading-5">
            Hakeem uses end-to-end encryption for all medical records and private communications.
          </Text>
        </View>

        {/* Delete Account */}
        <Pressable 
          onPress={() => router.push('/delete-account')}
          className="bg-[#FEF2F2] rounded-[28px] border border-[#FECACA] flex-row items-center px-5 py-5 mb-8"
        >
          <View className="w-12 h-12 rounded-[18px] bg-[#FEE2E2] items-center justify-center mr-4">
            <Delete02Icon size={22} color="#DC2626" />
          </View>
          <View className="flex-1">
            <Text className="text-[15px] font-jakarta-bold text-[#DC2626]">Delete Account</Text>
            <Text className="text-[12px] font-inter-regular text-gray-500 mt-1">Permanently remove all your data</Text>
          </View>
          <Alert01Icon size={22} color="#DC2626" />
        </Pressable>

        {/* Spacer for bottom tab padding */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
