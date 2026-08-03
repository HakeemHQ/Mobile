import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';

import { colors } from '@/lib/theme/colors';
import { ArrowLeft02Icon } from '@/components/icons/ArrowLeft02Icon';
import { LockOpenIcon } from '@/components/icons/LockOpenIcon';
import { CheckCircleIcon } from '@/components/icons/CheckCircleIcon';
import { SecurityCheckIcon } from '@/components/icons/SecurityCheckIcon';
import { InfoCircleIcon } from '@/components/icons/InfoCircleIcon';
import { EyeOffIcon } from '@/components/icons/EyeOffIcon';
import { ViewIcon } from '@/components/icons/ViewIcon';
import { InputField } from '@/components/ui/InputField';

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-6 mt-2 mb-6">
        <Pressable 
          accessibilityLabel="Return to Privacy"
          accessibilityRole="button"
          className="w-10 h-10 rounded-full border border-bg-600 items-center justify-center mr-4 bg-surface"
          onPress={() => router.back()}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <ArrowLeft02Icon size={20} color={colors.text[800]} />
        </Pressable>
        <Text className="text-[22px] font-jakarta-bold text-primary-900">Change Password</Text>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Banner Card */}
        <View className="bg-primary-900 rounded-[28px] py-8 px-6 items-center justify-center mb-8">
          <View className="w-[52px] h-[52px] rounded-full bg-primary-800 items-center justify-center mb-4">
            <View className="w-10 h-10 rounded-full bg-surface items-center justify-center">
              <SecurityCheckIcon size={20} color={colors.primary[900]} />
            </View>
          </View>
          <Text className="text-[13px] font-inter-medium text-surface/90 text-center leading-5 px-4">
            Update your password to keep your medical data secure.
          </Text>
        </View>

        {/* Form Fields */}
        <InputField 
          label="Current Password"
          icon={LockOpenIcon} 
          placeholder="Enter current password" 
          secureTextEntry={!showCurrent}
          rightIcon={showCurrent ? ViewIcon : EyeOffIcon}
          onRightIconPress={() => setShowCurrent(!showCurrent)}
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />

        <InputField 
          label="New Password"
          icon={LockOpenIcon} 
          placeholder="Min. 8 characters" 
          secureTextEntry={!showNew}
          rightIcon={showNew ? ViewIcon : EyeOffIcon}
          onRightIconPress={() => setShowNew(!showNew)}
          value={newPassword}
          onChangeText={setNewPassword}
          containerClassName="mb-1"
        />

        {/* Password Strength */}
        <View className="flex-row items-center mt-2 mb-6 ml-2">
          <Text className="text-[11px] font-inter-regular text-text2-500 mr-2">Strength: None</Text>
          <View className="flex-1 flex-row">
            <View className="flex-1 h-[3px] bg-bg-600 rounded-full mr-1" />
            <View className="flex-1 h-[3px] bg-bg-600 rounded-full mr-1" />
            <View className="flex-1 h-[3px] bg-bg-600 rounded-full mr-1" />
            <View className="flex-1 h-[3px] bg-bg-600 rounded-full" />
          </View>
        </View>

        <InputField 
          label="Confirm New Password"
          icon={SecurityCheckIcon} 
          placeholder="Re-type new password" 
          secureTextEntry={!showNew}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        {/* Info Box */}
        <View className="bg-surface rounded-[20px] p-5 flex-row items-start mb-8 border border-bg-600 mt-2 shadow-sm">
          <View className="mr-3 mt-0.5">
            <InfoCircleIcon size={20} color={colors.text2[500]} />
          </View>
          <Text className="flex-1 text-[12px] font-inter-regular text-text2-500 leading-5">
            Ensure your new password uses a combination of letters, numbers, and symbols for maximum clinical-grade security.
          </Text>
        </View>

        {/* Update Button */}
        <Pressable 
          className="bg-primary-900 h-[56px] rounded-[28px] flex-row items-center justify-center mb-8 shadow-sm"
          onPress={() => router.back()}
          style={({ pressed }) => ({
            opacity: pressed ? 0.9 : 1,
          })}
        >
          <Text className="text-surface font-jakarta-bold text-[15px] mr-2">Update Password</Text>
          <CheckCircleIcon size={20} color={colors.surface.DEFAULT} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
