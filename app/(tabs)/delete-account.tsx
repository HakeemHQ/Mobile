import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { ArrowLeft02Icon } from '../../components/icons/ArrowLeft02Icon';
import { Alert01Icon } from '../../components/icons/Alert01Icon';
import { Delete02Icon } from '../../components/icons/Delete02Icon';
import { InfoCircleIcon } from '../../components/icons/InfoCircleIcon';
import { clearTokens } from '../../lib/api';

export default function DeleteAccountScreen() {
  const [understood, setUnderstood] = useState(false);

  const handleDelete = async () => {
    if (!understood) return;
    await clearTokens();
    router.replace('/(auth)/register');
  };

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-6 mt-2 mb-8">
        <Pressable 
          className="w-10 h-10 rounded-full border border-gray-200 items-center justify-center mr-4 bg-white"
          onPress={() => router.back()}
        >
          <ArrowLeft02Icon size={20} color="#111827" />
        </Pressable>
        <Text className="text-[22px] font-jakarta-bold text-[#0A4D33]">Delete Account</Text>
      </View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Warning Icon and Title */}
        <View className="items-center mb-8">
          <View className="w-[60px] h-[60px] rounded-full bg-[#FFB5B5] items-center justify-center mb-6">
            <Alert01Icon size={28} color="#DC2626" />
          </View>
          <Text className="text-[26px] font-jakarta-bold text-[#0A4D33]">Are you absolutely sure?</Text>
        </View>

        {/* Checkbox Card */}
        <View className="bg-white rounded-[28px] border border-gray-100 p-6 mb-6">
          <Text className="text-[13px] font-inter-regular text-gray-500 leading-5 mb-6">
            Deleting your account permanently removes your medical profile and personal information. This action cannot be undone and you will lose access to all your clinical records stored on Hakeem.
          </Text>
          
          <View className="h-[1px] bg-gray-100 mb-6" />

          <Pressable 
            className="flex-row items-start"
            onPress={() => setUnderstood(!understood)}
          >
            <View className={`w-5 h-5 rounded-[4px] border-[1.5px] mr-4 items-center justify-center mt-0.5 ${understood ? 'bg-[#0A4D33] border-[#0A4D33]' : 'bg-white border-gray-300'}`}>
              {understood && <Text className="text-white text-[10px] font-bold">✓</Text>}
            </View>
            <Text className="flex-1 text-[13px] font-inter-medium text-gray-500 leading-5">
              I understand this action is permanent and my clinical data will be irrecoverable.
            </Text>
          </Pressable>
        </View>

        {/* Info Card */}
        <View className="bg-[#F5F5F5] rounded-[20px] p-5 flex-row items-start mb-8">
          <View className="mr-3 mt-0.5">
            <InfoCircleIcon size={20} color="#4B5563" />
          </View>
          <Text className="flex-1 text-[13px] font-inter-regular text-gray-500 leading-5">
            In compliance with HIPAA and local medical record regulations, some transactional logs may be retained for auditing purposes in a secure, non-identifiable state.
          </Text>
        </View>

        {/* Action Buttons */}
        <Pressable 
          className={`flex-row h-14 rounded-3xl items-center justify-center mb-4 ${understood ? 'bg-[#FEE2E2]' : 'bg-[#FEE2E2] opacity-50'}`}
          onPress={handleDelete}
          disabled={!understood}
        >
          <Delete02Icon size={20} color={understood ? '#DC2626' : '#DC2626'} className="mr-2" />
          <Text className={`font-jakarta-bold text-[15px] ${understood ? 'text-[#DC2626]' : 'text-[#DC2626]'}`}>Delete Account</Text>
        </Pressable>

        <Pressable 
          className="bg-[#E5E7EB] h-14 rounded-3xl items-center justify-center mb-8"
          onPress={() => router.back()}
        >
          <Text className="text-secondary-900 font-jakarta-bold text-[15px]">Cancel</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
