import type {
    ReactNode,
} from 'react';

import {
    Pressable,
    Text,
    View,
} from 'react-native';

import {
    ArrowLeft02Icon,
} from '@/components/icons/ArrowLeft02Icon';

import {
    colors,
} from '@/lib/theme/colors';

interface ReminderScreenHeaderProps {
    title: string;
    onBack: () => void;
    rightContent?: ReactNode;
}

export function ReminderScreenHeader({
    title,
    onBack,
    rightContent,
}: ReminderScreenHeaderProps) {
    return (
        <View className="mb-5 mt-1 flex-row items-center px-6">
            <Pressable
                accessibilityLabel="Go back"
                accessibilityRole="button"
                className="h-10 w-10 items-center justify-center rounded-full border border-bg-600 bg-surface"
                hitSlop={8}
                onPress={onBack}
                style={({ pressed }: { pressed: boolean }) => ({
                    opacity:
                        pressed
                            ? 0.7
                            : 1,
                })}
            >
                <ArrowLeft02Icon
                    size={20}
                    color={
                        colors.text[800]
                    }
                />
            </Pressable>

            <Text
                className="mx-3 flex-1 text-center font-jakarta-bold text-[21px] color-primary-900"
                numberOfLines={1}
            >
                {title}
            </Text>

            <View className="h-10 w-10 items-center justify-center">
                {rightContent}
            </View>
        </View>
    );
}
