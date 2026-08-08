import { Modal, Pressable, View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Delete02Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { colors } from '@/lib/theme';

export interface DeleteReminderModalProps {
  visible: boolean;
  reminderTitle?: string;
  onClose: () => void;
  onConfirm: () => void;
  isDeleting?: boolean;
}

export function DeleteReminderModal({
  visible,
  reminderTitle,
  onClose,
  onConfirm,
  isDeleting = false,
}: DeleteReminderModalProps) {
  const { t, i18n } = useTranslation('reminders');
  const isRTL = i18n.language === 'ar';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable 
        className="flex-1 justify-center items-center bg-black/50 px-6" 
        onPress={onClose}
      >
        <Pressable 
          className="bg-white rounded-[28px] p-6 w-full max-w-[360px] shadow-2xl items-center"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Close button top right */}
          <TouchableOpacity 
            onPress={onClose} 
            className={cn("absolute top-5", isRTL ? "left-5" : "right-5")}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={22} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Delete Icon Badge */}
          <View className="h-16 w-16 rounded-full bg-red-50 border border-red-100 items-center justify-center mb-4 mt-2">
            <HugeiconsIcon icon={Delete02Icon} size={30} color={colors.danger.DEFAULT} />
          </View>

          {/* Title */}
          <Text className="text-[18px] font-jakarta-bold text-center text-text-900 mb-2">
            {t('deleteTitle')}
          </Text>

          {/* Description */}
          <Text className="text-[14px] font-inter-regular text-center text-text2-400 mb-6 leading-5">
            {reminderTitle
              ? t('deleteConfirmWithName', { name: reminderTitle })
              : t('deleteConfirm')}
          </Text>

          {/* Action Buttons */}
          <View className="w-full gap-3">
            <Button
              title={t('delete')}
              variant="primary"
              disabled={isDeleting}
              onPress={onConfirm}
              className="h-12 w-full bg-red-600"
            />
            <Button
              title={t('cancel')}
              variant="outline"
              disabled={isDeleting}
              onPress={onClose}
              className="h-12 w-full"
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
