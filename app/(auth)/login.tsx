import { Text  ,TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function LoginScreen() {
  const handleComplete = () => {
    router.push('/(tabs)');
  };
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-bg">
      <Text className="text-header font-jakarta-bold text-text">Login</Text>
      <TouchableOpacity
        className="w-full bg-transparent py-4 rounded-xl items-center border border-gray-300"
        onPress={() => handleComplete()}
      >
        <Text>Next</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
