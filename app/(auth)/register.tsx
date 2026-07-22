import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-bg">
      <Text className="text-header font-jakarta-bold text-text">Register</Text>
    </SafeAreaView>
  );
}
