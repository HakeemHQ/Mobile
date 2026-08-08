import React, { useRef } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  TouchableOpacity,
  View,
} from 'react-native';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Delete02Icon } from '@hugeicons/core-free-icons';

import { useTranslation } from 'react-i18next';
import { ReminderListCard } from '@/components/reminders/ReminderListCard';
import type { Reminder } from '@/types/reminder';

interface SwipeableReminderCardProps {
  reminder: Reminder;
  onToggleMedication?: (isEnabled: boolean) => void;
  onPress?: () => void;
  onDelete?: () => void;
}

export function SwipeableReminderCard({
  reminder,
  onToggleMedication,
  onPress,
  onDelete,
}: SwipeableReminderCardProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const SWIPE_DISTANCE = 84;
  const MAX_SWIPE = isRTL ? SWIPE_DISTANCE : -SWIPE_DISTANCE;
  const SWIPE_THRESHOLD = isRTL ? 40 : -40;

  const translateX = useRef(new Animated.Value(0)).current;
  const isSwipedOpen = useRef(false);

  const resetPosition = () => {
    isSwipedOpen.current = false;
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 6,
    }).start();
  };

  const openSwipe = () => {
    isSwipedOpen.current = true;
    Animated.spring(translateX, {
      toValue: MAX_SWIPE,
      useNativeDriver: true,
      bounciness: 6,
    }).start();
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10 && Math.abs(gestureState.dy) < 15;
      },
      onPanResponderMove: (_, gestureState) => {
        const initialX = isSwipedOpen.current ? MAX_SWIPE : 0;
        let newX = initialX + gestureState.dx;
        if (isRTL) {
          if (newX < 0) newX = 0;
          if (newX > MAX_SWIPE + 20) newX = MAX_SWIPE + 20;
        } else {
          if (newX > 0) newX = 0;
          if (newX < MAX_SWIPE - 20) newX = MAX_SWIPE - 20;
        }
        translateX.setValue(newX);
      },
      onPanResponderRelease: (_, gestureState) => {
        const currentX = (translateX as any)._value || 0;
        if (isRTL) {
          if (currentX > SWIPE_THRESHOLD || gestureState.vx > 0.5) {
            openSwipe();
          } else {
            resetPosition();
          }
        } else {
          if (currentX < SWIPE_THRESHOLD || gestureState.vx < -0.5) {
            openSwipe();
          } else {
            resetPosition();
          }
        }
      },
    })
  ).current;

  const handleDeletePress = () => {
    resetPosition();
    onDelete?.();
  };

  const handleCardPress = () => {
    if (isSwipedOpen.current) {
      resetPosition();
    } else {
      onPress?.();
    }
  };

  return (
    <View className="mb-4 overflow-hidden rounded-2xl relative">
      {/* Hidden background Delete Action */}
      <View
        className={`absolute inset-y-0 ${
          isRTL ? 'left-0' : 'right-0'
        } w-20 bg-red-500 rounded-2xl items-center justify-center`}
      >
        <TouchableOpacity
          onPress={handleDeletePress}
          className="h-full w-full items-center justify-center"
          activeOpacity={0.7}
        >
          <HugeiconsIcon icon={Delete02Icon} size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Foreground Card */}
      <Animated.View
        {...panResponder.panHandlers}
        style={{
          transform: [{ translateX }],
        }}
      >
        <Pressable 
          onPress={handleCardPress} 
          style={({ pressed }) => ({ opacity: pressed ? 0.95 : 1 })}
        >
          <ReminderListCard
            reminder={reminder}
            onToggleMedication={onToggleMedication}
            onDelete={onDelete}
            onPress={handleCardPress}
            isSwipeable
          />
        </Pressable>
      </Animated.View>
    </View>
  );
}
