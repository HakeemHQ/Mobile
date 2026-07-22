import { View, Text } from "react-native";

export default function Screen() {
  return (
    <View className="flex-1 p-4 gap-4">
      <View className="h-20 w-full bg-primary" />

      <Text className="text-primary-700">Primary Text</Text>

      <View className="h-20 w-full bg-secondary-500" />

      <View className="h-20 w-full bg-primary" />

      <Text className="text-text">Normal Text</Text>
    </View>
  );
}