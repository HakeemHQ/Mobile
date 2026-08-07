import {
    Pressable,
    Text,
    View,
} from 'react-native';

import { colors } from '@/lib/theme/colors';

type SegmentValue =
    | string
    | number;

export interface ReminderSegmentOption<
    TValue extends SegmentValue,
> {
    label: string;
    value: TValue;
    accessibilityLabel?: string;
}

interface ReminderSegmentedControlProps<
    TValue extends SegmentValue,
> {
    options: readonly ReminderSegmentOption<TValue>[];
    value: TValue;
    onChange: (
        value: TValue,
    ) => void;
    accessibilityLabel: string;
    disabled?: boolean;
    height?: number;
    selectedBackgroundColor?: string;
    selectedTextColor?: string;
}

export function ReminderSegmentedControl<
    TValue extends SegmentValue,
>({
    options,
    value,
    onChange,
    accessibilityLabel,
    disabled = false,
    height = 46,
    selectedBackgroundColor =
    colors.primary.DEFAULT,
    selectedTextColor =
    colors.surface.DEFAULT,
}: ReminderSegmentedControlProps<TValue>) {
    return (
        <View
            accessibilityLabel={
                accessibilityLabel
            }
            className="flex-row rounded-2xl border bg-surface p-0.5"
            style={{
                borderColor:
                    colors.text2[100],
                height,
            }}
        >
            {options.map((option) => {
                const isSelected =
                    option.value === value;

                return (
                    <Pressable
                        key={String(
                            option.value,
                        )}
                        accessibilityLabel={
                            option.accessibilityLabel ??
                            option.label
                        }
                        accessibilityRole="radio"
                        accessibilityState={{
                            checked:
                                isSelected,
                            disabled,
                        }}
                        disabled={disabled}
                        className="flex-1 overflow-hidden rounded-[14px]"
                        onPress={() =>
                            onChange(
                                option.value,
                            )
                        }
                        style={({ pressed }: { pressed: boolean }) => ({
                            opacity: disabled
                                ? 0.5
                                : pressed
                                    ? 0.78
                                    : 1,
                        })}
                    >
                        <View
                            className="h-full w-full items-center justify-center"
                            style={{
                                backgroundColor:
                                    isSelected
                                        ? selectedBackgroundColor
                                        : colors
                                            .surface
                                            .DEFAULT,
                            }}
                        >
                            <Text
                                className="font-jakarta-semibold text-[13px]"
                                style={{
                                    color: isSelected
                                        ? selectedTextColor
                                        : colors
                                            .text2[500],
                                }}
                            >
                                {option.label}
                            </Text>
                        </View>
                    </Pressable>
                );
            })}
        </View>
    );
}