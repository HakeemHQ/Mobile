import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { StethoscopeIcon, UserIcon, HomeIcon } from '@/components/icons';

export default function Screen() {
  return (
    <ScrollView className="flex-1 bg-bg p-4" contentContainerStyle={{ paddingBottom: 40 }}>
      <View className="gap-6">
        {/* Colors Test Section */}
        <View className="gap-3">
          <Text className="text-subheader text-text font-jakarta-bold">Color Classes</Text>
          <View className="h-16 w-full bg-primary rounded-xl justify-center px-4">
            <Text className="text-white font-inter-bold">bg-primary (#1A56DB)</Text>
          </View>
          <View className="h-16 w-full bg-secondary-500 rounded-xl justify-center px-4">
            <Text className="text-white font-inter-bold">bg-secondary-500 (#10B981)</Text>
          </View>
        </View>

        {/* Icons Test Section */}
        <View className="gap-3">
          <Text className="text-subheader text-text font-jakarta-bold">Icons Test (Props: color, size)</Text>
          <View className="flex-row items-center justify-around bg-surface p-4 rounded-xl border border-gray-100 shadow-sm">
            <View className="items-center gap-1">
              <StethoscopeIcon size={36} color="primary" />
              <Text className="text-xs text-text2 font-inter-regular">primary</Text>
            </View>
            <View className="items-center gap-1">
              <UserIcon size={36} color="secondary" />
              <Text className="text-xs text-text2 font-inter-regular">secondary</Text>
            </View>
            <View className="items-center gap-1">
              <HomeIcon size={36} color="text" />
              <Text className="text-xs text-text2 font-inter-regular">text token</Text>
            </View>
          </View>
        </View>

        {/* Font Classes Test Section */}
        <View className="gap-2 bg-surface p-4 rounded-xl border border-gray-100 shadow-sm">
          <Text className="text-subheader text-text font-jakarta-bold mb-1">Font Classes</Text>

          <Text className="text-header text-text">Header Style</Text>
          <Text className="text-subheader text-text">Subheader Style</Text>
          <Text className="text-regular text-text">Regular Style</Text>

          <View className="h-px bg-gray-100 my-2" />

          <Text className="font-jakarta-bold text-primary text-xl">Jakarta Bold Font</Text>
          <Text className="font-inter-bold text-primary text-xl">Inter Bold Font</Text>

          <Text className="text-text2 text-sm">Text2 Color (#6B7280)</Text>
        </View>
      </View>
    </ScrollView>
  );
}
