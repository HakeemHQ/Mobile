import { View, Text, Modal } from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { CheckmarkCircle01Icon } from '@hugeicons/core-free-icons';
import { Button } from './Button';

interface SuccessModalProps {
  visible: boolean;
  title: string;
  subtitle?: string;
  buttonText: string;
  onConfirm: () => void;
}

export function SuccessModal({
  visible,
  title,
  subtitle,
  buttonText,
  onConfirm,
}: SuccessModalProps) {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onConfirm}>
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-[32px] p-6 w-full max-w-sm items-center shadow-xl">
          <View className="w-16 h-16 rounded-full bg-[#E0E7FF] items-center justify-center mb-4">
            <HugeiconsIcon icon={CheckmarkCircle01Icon} size={36} color="#4F46E5" />
          </View>
          <Text className="text-[22px] font-jakarta-bold text-text-500 mb-2 text-center">
            {title}
          </Text>
          {subtitle && (
            <Text className="text-[15px] font-jakarta-regular text-text2-500 mb-6 text-center leading-5 px-2">
              {subtitle}
            </Text>
          )}
          <Button title={buttonText} onPress={onConfirm} className="w-full mt-2" />
        </View>
      </View>
    </Modal>
  );
}
