import React, { useState, useEffect } from 'react';
import { Modal, Pressable, View, Text, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { 
  Cancel01Icon, 
  PillIcon,
  Calendar03Icon,
  FlaskConicalIcon
} from '@hugeicons/core-free-icons';
import { Bell, AlarmClock } from 'lucide-react-native';

import { InputField } from '@/components/ui/InputField';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { colors } from '@/lib/theme';
import { formatLocalTime, formatLocalTimeValue, localTimeToDate } from '@/lib/reminder-utils';
import { useReminderStore } from '@/store/useReminderStore';
import type { 
  Reminder, 
  ReminderDeliveryMode, 
  ReminderScheduleInput, 
  UpdateReminderInput 
} from '@/types/reminder';

export interface EditReminderModalProps {
  visible: boolean;
  reminder: Reminder | null;
  onClose: () => void;
  onSaved?: () => void;
}

function DeliveryModeButton({
  mode,
  selected,
  onPress,
}: {
  mode: ReminderDeliveryMode;
  selected: boolean;
  onPress?: () => void;
}) {
  const { t, i18n } = useTranslation('reminders');
  const isRTL = i18n.language === 'ar';
  const isNotification = mode === 'NOTIFICATION';
  const Icon = isNotification ? Bell : AlarmClock;
  const label = isNotification ? t('notifications') : t('alarm');
  const activeColor = isNotification ? colors.primary[500] : colors.text2[400];

  const buttonClassName = cn(
    'h-9 flex-row items-center justify-center rounded-xl border px-2.5',
    isRTL && 'flex-row-reverse',
    selected
      ? isNotification
        ? 'border-primary-500 bg-primary-500'
        : 'border-text2-400 bg-text2-400'
      : 'border-text2-100 bg-surface'
  );

  const textClassName = cn(
    'font-jakarta-bold text-[11px]',
    isRTL ? 'mr-1' : 'ml-1',
    selected
      ? 'text-surface'
      : isNotification
        ? 'text-primary-500'
        : 'text-text2-400'
  );

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      disabled={!onPress}
      onPress={onPress}
      className={buttonClassName}
      style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
    >
      <Icon
        size={15}
        strokeWidth={2}
        color={selected ? colors.surface.DEFAULT : activeColor}
      />
      <Text className={textClassName} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

function parseTimeToMinutes(localTime: string): number {
  const [h, m] = localTime.split(':').map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function formatMinutesToTime(totalMinutes: number): string {
  const normalized = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

function updateEqualIntervalSchedules(
  schedules: ReminderScheduleInput[],
  changedIndex: number,
  newTime: string
): ReminderScheduleInput[] {
  const count = schedules.length;
  if (count <= 1) {
    return schedules.map((s, idx) =>
      idx === changedIndex ? { ...s, localTime: newTime } : s
    );
  }

  const intervalMinutes = Math.round(1440 / count);
  const baseMinutes = parseTimeToMinutes(newTime);

  return schedules.map((schedule, i) => {
    const offset = ((i - changedIndex) * intervalMinutes + 1440) % 1440;
    const computedMinutes = (baseMinutes + offset) % 1440;
    return {
      ...schedule,
      localTime: formatMinutesToTime(computedMinutes),
    };
  });
}

export function EditReminderModal({
  visible,
  reminder,
  onClose,
  onSaved,
}: EditReminderModalProps) {
  const { t, i18n } = useTranslation('reminders');
  const isRTL = i18n.language === 'ar';
  const updateReminder = useReminderStore((state) => state.updateReminder);

  const [title, setTitle] = useState('');
  const [dosage, setDosage] = useState('');
  const [instructions, setInstructions] = useState('');
  const [providerName, setProviderName] = useState('');
  const [labName, setLabName] = useState('');
  const [schedules, setSchedules] = useState<ReminderScheduleInput[]>([]);
  const [editingDoseIndex, setEditingDoseIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  useEffect(() => {
    if (reminder) {
      setTitle(reminder.title || '');
      setDosage((reminder as any).dosage || '');
      setInstructions((reminder as any).instructions || '');
      setProviderName((reminder as any).providerName || '');
      setLabName((reminder as any).labName || '');
      setSchedules(
        (reminder.schedules || []).map((s) => ({
          doseSequence: s.doseSequence,
          localTime: s.localTime,
          deliveryMode: s.deliveryMode || 'NOTIFICATION',
        }))
      );
      setErrorText(null);
    }
  }, [reminder, visible]);

  if (!reminder) return null;

  const isMedication = reminder.reminderType === 'MEDICATION';
  const isAppointment = reminder.reminderType === 'APPOINTMENT';
  const isLabTest = reminder.reminderType === 'LAB_TEST';

  const handleDeliveryModeChange = (index: number, mode: ReminderDeliveryMode) => {
    setSchedules((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, deliveryMode: mode } : item))
    );
  };

  const handleTimePickerChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      const activeIdx = editingDoseIndex;
      setEditingDoseIndex(null);
      if (event.type === 'set' && selectedDate && activeIdx !== null) {
        const timeStr = formatLocalTimeValue(selectedDate);
        setSchedules((prev) => updateEqualIntervalSchedules(prev, activeIdx, timeStr));
      }
    } else if (selectedDate && editingDoseIndex !== null) {
      const timeStr = formatLocalTimeValue(selectedDate);
      setSchedules((prev) => updateEqualIntervalSchedules(prev, editingDoseIndex, timeStr));
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setErrorText(t('enterTitle', 'Please enter a title'));
      return;
    }

    setIsSaving(true);
    setErrorText(null);

    try {
      const updatePayload: UpdateReminderInput = {
        reminderId: reminder.reminderId,
        title: title.trim(),
        schedules: schedules.map((s, idx) => ({
          doseSequence: s.doseSequence || idx + 1,
          localTime: s.localTime,
          deliveryMode: s.deliveryMode,
        })),
      };

      if (isMedication) {
        updatePayload.medication = {
          dosage: dosage.trim() || null,
          instructions: instructions.trim() || null,
        };
      } else if (isAppointment) {
        updatePayload.appointment = {
          providerName: providerName.trim() || null,
        };
      } else if (isLabTest) {
        updatePayload.labTest = {
          labName: labName.trim() || null,
        };
      }

      await updateReminder(updatePayload);
      setIsSaving(false);
      onSaved?.();
      onClose();
    } catch (err: unknown) {
      setIsSaving(false);
      setErrorText(err instanceof Error ? err.message : 'Failed to save changes');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <Pressable 
        className="flex-1 bg-black/50 justify-end"
        onPress={onClose}
      >
        <Pressable 
          className="bg-white rounded-t-[32px] px-6 pt-6 pb-8 w-full max-h-[85%] shadow-2xl"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View className={cn("flex-row items-center justify-between mb-5", isRTL && "flex-row-reverse")}>
            <View className={cn("flex-row items-center gap-2.5", isRTL && "flex-row-reverse")}>
              <View className="h-10 w-10 rounded-full bg-primary-50 items-center justify-center">
                <HugeiconsIcon
                  icon={isMedication ? PillIcon : isAppointment ? Calendar03Icon : FlaskConicalIcon}
                  size={22}
                  color={colors.primary.DEFAULT}
                />
              </View>
              <Text className="text-[20px] font-jakarta-bold text-text-900">
                {t('editReminder', 'Edit Reminder')}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <HugeiconsIcon icon={Cancel01Icon} size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} className="flex-grow-0">
            {errorText ? (
              <View className="mb-4 rounded-xl bg-red-50 border border-red-200 p-3">
                <Text className="text-[13px] font-inter-medium text-red-700">{errorText}</Text>
              </View>
            ) : null}

            <InputField
              label={t('reminderTitle')}
              placeholder={t('enterTitle')}
              value={title}
              onChangeText={setTitle}
              containerClassName="mb-4"
            />

            {/* Type Specific Details */}
            {isMedication ? (
              <View className={cn("flex-row gap-3 mb-4", isRTL && "flex-row-reverse")}>
                <View className="flex-1">
                  <InputField
                    label={t('dosage')}
                    placeholder={t('enterDosage')}
                    value={dosage}
                    onChangeText={setDosage}
                  />
                </View>
                <View className="flex-1">
                  <InputField
                    label={t('instructions')}
                    placeholder={t('enterInstructions')}
                    value={instructions}
                    onChangeText={setInstructions}
                  />
                </View>
              </View>
            ) : isAppointment ? (
              <InputField
                label={t('providerName')}
                placeholder={t('enterProvider')}
                value={providerName}
                onChangeText={setProviderName}
                containerClassName="mb-4"
              />
            ) : isLabTest ? (
              <InputField
                label={t('labName')}
                placeholder={t('enterLab')}
                value={labName}
                onChangeText={setLabName}
                containerClassName="mb-4"
              />
            ) : null}

            {/* Dose Rows */}
            <View className="mb-4">
              <Text className={cn("text-[13px] font-jakarta-semibold text-text2-500 mb-3", isRTL ? "text-right" : "text-left")}>
                {t('dosesAndAlerts')}
              </Text>

              {schedules.map((schedule, index) => (
                <View
                  key={`dose-${index}`}
                  className={cn(
                    "mb-3 flex-row items-center justify-between rounded-xl border border-bg-200 bg-surface p-3",
                    isRTL && "flex-row-reverse"
                  )}
                >
                  <View className="h-7 w-7 items-center justify-center rounded-full bg-primary-50">
                    <Text className="font-jakarta-bold text-[12px] text-primary">
                      {schedule.doseSequence || index + 1}
                    </Text>
                  </View>

                  <Pressable
                    onPress={() => setEditingDoseIndex(index)}
                    className={cn("flex-1", isRTL ? "mr-2.5" : "ml-2.5")}
                  >
                    <Text className={cn("font-jakarta-bold text-[14px] text-primary-900", isRTL ? "text-right" : "text-left")}>
                      {formatLocalTime(schedule.localTime)}
                    </Text>
                  </Pressable>

                  <View className={cn("flex-row items-center gap-1.5", isRTL && "flex-row-reverse")}>
                    <DeliveryModeButton
                      mode="NOTIFICATION"
                      selected={schedule.deliveryMode === 'NOTIFICATION'}
                      onPress={() => handleDeliveryModeChange(index, 'NOTIFICATION')}
                    />
                    <DeliveryModeButton
                      mode="ALARM"
                      selected={schedule.deliveryMode === 'ALARM'}
                      onPress={() => handleDeliveryModeChange(index, 'ALARM')}
                    />
                  </View>
                </View>
              ))}
            </View>

            {/* Time Picker Component */}
            {editingDoseIndex !== null && (
              <DateTimePicker
                value={localTimeToDate(schedules[editingDoseIndex]?.localTime || '08:00')}
                mode="time"
                is24Hour={false}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleTimePickerChange}
              />
            )}
          </ScrollView>

          {/* Action Buttons */}
          <View className="mt-2 pt-2 gap-2">
            <Button
              title={isSaving ? t('saving', 'Saving...') : t('saveChanges', 'Save Changes')}
              variant="primary"
              disabled={isSaving}
              onPress={handleSave}
              className="h-14 w-full"
            />
            <Button
              title={t('cancel', 'Cancel')}
              variant="outline"
              disabled={isSaving}
              onPress={onClose}
              className="h-12 w-full"
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
