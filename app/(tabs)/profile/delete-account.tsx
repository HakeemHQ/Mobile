import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';

import { colors } from '@/lib/theme/colors';
import { ArrowLeft02Icon } from '@/components/icons/ArrowLeft02Icon';
import { Alert01Icon } from '@/components/icons/Alert01Icon';
import { Delete02Icon } from '@/components/icons/Delete02Icon';
import { InfoCircleIcon } from '@/components/icons/InfoCircleIcon';
import { clearTokens } from '@/lib/api';

export default function DeleteAccountScreen() {
  const [understood, setUnderstood] = useState(false);

  const handleDelete = async () => {
    if (!understood) return;
    await clearTokens();
    router.replace('/(auth)/register');
  };

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-6 mt-2 mb-8">
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
        <Text className="text-[22px] font-jakarta-bold text-primary-900">Delete Account</Text>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Warning Icon and Title */}
        <View className="items-center mb-8">
          <View className="w-[60px] h-[60px] rounded-full bg-[#FFB5B5] items-center justify-center mb-6">
            <Alert01Icon size={28} color="#DC2626" />
          </View>
          <Text className="text-[26px] font-jakarta-bold text-primary-900">Are you absolutely sure?</Text>
        </View>

        {/* Checkbox Card */}
        <View className="bg-surface rounded-[28px] border border-bg-600 p-6 mb-6 shadow-sm">
          <Text className="text-[13px] font-inter-regular text-text2-500 leading-5 mb-6">
            Deleting your account permanently removes your medical profile and personal information. This action cannot be undone and you will lose access to all your clinical records stored on Hakeem.
          </Text>
          
          <View className="h-[1px] bg-bg-600/40 mb-6" />

          <Pressable 
            className="flex-row items-start"
            onPress={() => setUnderstood(!understood)}
          >
            <View className={`w-5 h-5 rounded-[4px] border-[1.5px] mr-4 items-center justify-center mt-0.5 ${understood ? 'bg-primary-900 border-primary-900' : 'bg-surface border-bg-600'}`}>
              {understood && <Text className="text-surface text-[10px] font-bold">✓</Text>}
            </View>
            <Text className="flex-1 text-[13px] font-inter-medium text-text2-500 leading-5">
              I understand this action is permanent and my clinical data will be irrecoverable.
            </Text>
          </Pressable>
        </View>

        {/* Info Card */}
        <View className="bg-surface rounded-[20px] p-5 flex-row items-start mb-8 border border-bg-600 shadow-sm">
          <View className="mr-3 mt-0.5">
            <InfoCircleIcon size={20} color={colors.text2[500]} />
          </View>
          <Text className="flex-1 text-[13px] font-inter-regular text-text2-500 leading-5">
            In compliance with HIPAA and local medical record regulations, some transactional logs may be retained for auditing purposes in a secure, non-identifiable state.
          </Text>
        </View>

        {/* Action Buttons */}
        <Pressable 
          className={`flex-row h-14 rounded-3xl items-center justify-center mb-4 ${understood ? 'bg-[#FEE2E2]' : 'bg-[#FEE2E2] opacity-50'}`}
          onPress={handleDelete}
          disabled={!understood}
          style={({ pressed }) => ({
            opacity: understood && pressed ? 0.8 : understood ? 1 : 0.5,
          })}
        >
          <Delete02Icon size={20} color="#DC2626" className="mr-2" />
          <Text className="font-jakarta-bold text-[15px] text-[#DC2626]">Delete Account</Text>
        </Pressable>

        <Pressable 
          className="bg-bg-600 h-14 rounded-3xl items-center justify-center mb-8"
          onPress={() => router.back()}
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <Text className="text-primary-900 font-jakarta-bold text-[15px]">Cancel</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
