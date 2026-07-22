import { View, Text } from 'react-native';
import { fonts } from '@/lib/theme';

export default function Screen() {
  return (
    <View className="flex-1 gap-4 p-4">
      <View className="h-20 w-full bg-primary" />
      <View className="bg-secondary-500 h-20 w-full" />
      {/* Font classes */}
      <Text className="text-header text-text">Header </Text>
      <Text className="text-subheader text-text">Subheader </Text>
      <Text className="text-regular text-text">Regular </Text>

      {/* Direct Tailwind font utilities */}
      <Text className="font-inter-bold text-text text-xl">Inter Bold</Text>
      <Text className="font-jakarta-bold text-text text-4xl">Jakarta Bold</Text>
      <Text className=" text-text text-4xl">Jakarta Bold</Text>
      <Text className="font-inter-bold text-text text-4xl">Jakarta Bold</Text>

    </View>
  );
}
