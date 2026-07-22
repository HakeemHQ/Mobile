import { Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TimelineScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-bg" edges={['top', 'left', 'right']}>
      <Text className="text-header font-jakarta-bold text-text">Timeline</Text>
    </SafeAreaView>
  );
}
