import {
    useEffect,
    useState,
} from 'react';

import {
    Pressable,
    Text,
    TextInput,
    View,
} from 'react-native';

import {
    ChevronDown,
    ChevronUp,
    FileText,
} from 'lucide-react-native';

import {
    ReminderSegmentedControl,
    type ReminderSegmentOption,
} from '@/components/reminders/ReminderSegmentedControl';

import {
    colors,
} from '@/lib/theme/colors';

import type {
    MedicationMealName,
    MedicationMealRelation,
} from '@/types/reminder';

interface MedicationInstructionsSectionProps {
    instructions: string;
    mealRelation:
    MedicationMealRelation;
    mealName:
    MedicationMealName;
    isExpanded: boolean;
    onInstructionsChange: (
        value: string,
    ) => void;
    onMealRelationChange: (
        value:
            MedicationMealRelation,
    ) => void;
    onMealNameChange: (
        value:
            MedicationMealName,
    ) => void;
    onExpandedChange: (
        value: boolean,
    ) => void;
}

const mealRelationOptions: readonly ReminderSegmentOption<MedicationMealRelation>[] =
    [
        {
            label: 'Before',
            value: 'BEFORE',
        },
        {
            label: 'After',
            value: 'AFTER',
        },
    ];

const mealNames: readonly MedicationMealName[] =
    [
        'Breakfast',
        'Lunch',
        'Dinner',
        'Snack',
    ];

export function MedicationInstructionsSection({
    instructions,
    mealRelation,
    mealName,
    isExpanded,
    onInstructionsChange,
    onMealRelationChange,
    onMealNameChange,
    onExpandedChange,
}: MedicationInstructionsSectionProps) {
    const [
        isMealMenuOpen,
        setIsMealMenuOpen,
    ] = useState(false);

    useEffect(() => {
        if (!isExpanded) {
            setIsMealMenuOpen(
                false,
            );
        }
    }, [isExpanded]);

    return (
        <View
            className="mt-1 rounded-2xl bg-surface px-3 py-3"
            style={{
                borderColor:
                    colors.primary[300],
                borderStyle:
                    'dashed',
                borderWidth: 1,
            }}
        >
            <Pressable
                accessibilityLabel={
                    isExpanded
                        ? 'Collapse instructions and meal timing'
                        : 'Expand instructions and meal timing'
                }
                accessibilityRole="button"
                className="flex-row items-center"
                onPress={() =>
                    onExpandedChange(
                        !isExpanded,
                    )
                }
                style={({ pressed }: { pressed: boolean }) => ({
                    opacity: pressed
                        ? 0.75
                        : 1,
                })}
            >
                <View
                    className="h-9 w-9 items-center justify-center rounded-full"
                    style={{
                        backgroundColor:
                            colors.primary[50],
                    }}
                >
                    <FileText
                        size={19}
                        color={
                            colors.primary
                                .DEFAULT
                        }
                        strokeWidth={2}
                    />
                </View>

                <View className="ml-3 flex-1">
                    <Text className="font-jakarta-bold text-[13px] text-text-900">
                        Instructions & Meal Timing
                        <Text className="font-jakarta-semibold text-text2-400">
                            {' '}
                            (Optional)
                        </Text>
                    </Text>

                    {!isExpanded ? (
                        <Text className="mt-0.5 font-inter-regular text-[11px] text-text2-400">
                            Add notes and set relation to meals
                        </Text>
                    ) : null}
                </View>

                {isExpanded ? (
                    <ChevronUp
                        size={20}
                        color={
                            colors.text[800]
                        }
                        strokeWidth={2}
                    />
                ) : (
                    <ChevronDown
                        size={20}
                        color={
                            colors.text[800]
                        }
                        strokeWidth={2}
                    />
                )}
            </Pressable>

            {isExpanded ? (
                <View className="mt-4">
                    <TextInput
                        accessibilityLabel="Additional medication instructions"
                        className="min-h-[82px] rounded-xl border bg-surface px-3 py-3 font-inter-regular text-[13px] text-text-900"
                        multiline
                        onChangeText={
                            onInstructionsChange
                        }
                        placeholder="Additional instructions"
                        placeholderTextColor={
                            colors.text2[300]
                        }
                        textAlignVertical="top"
                        value={
                            instructions
                        }
                        style={{
                            borderColor:
                                colors.text2[100],
                        }}
                    />

                    <Text className="mt-2 font-inter-regular text-[11px] text-text2-400">
                        Optional notes for this medication
                    </Text>

                    <Text className="mb-2 mt-4 font-jakarta-semibold text-[12px] text-text2-500">
                        Meal Timing
                    </Text>

                    <ReminderSegmentedControl
                        accessibilityLabel="Meal timing relation"
                        options={
                            mealRelationOptions
                        }
                        value={
                            mealRelation
                        }
                        onChange={
                            onMealRelationChange
                        }
                        height={42}
                    />

                    <Pressable
                        accessibilityLabel={`Meal: ${mealName}`}
                        accessibilityRole="button"
                        className="mt-2 h-11 flex-row items-center rounded-xl border bg-surface px-3"
                        onPress={() =>
                            setIsMealMenuOpen(
                                (current) =>
                                    !current,
                            )
                        }
                        style={({ pressed }: { pressed: boolean }) => ({
                            borderColor:
                                colors.text2[100],
                            opacity: pressed
                                ? 0.78
                                : 1,
                        })}
                    >
                        <Text className="flex-1 font-jakarta-medium text-[13px] text-text-900">
                            {mealName}
                        </Text>

                        <ChevronDown
                            size={18}
                            color={
                                colors.text2[500]
                            }
                            strokeWidth={2}
                        />
                    </Pressable>

                    {isMealMenuOpen ? (
                        <View
                            className="mt-1 overflow-hidden rounded-xl border bg-surface"
                            style={{
                                borderColor:
                                    colors.text2[100],
                            }}
                        >
                            {mealNames.map(
                                (
                                    option,
                                ) => (
                                    <Pressable
                                        key={
                                            option
                                        }
                                        accessibilityRole="button"
                                        className="min-h-10 justify-center px-3"
                                        onPress={() => {
                                            onMealNameChange(
                                                option,
                                            );
                                            setIsMealMenuOpen(
                                                false,
                                            );
                                        }}
                                        style={({ pressed }: { pressed: boolean }) => ({
                                            backgroundColor:
                                                option ===
                                                    mealName
                                                    ? colors
                                                        .primary[50]
                                                    : colors
                                                        .surface
                                                        .DEFAULT,
                                            opacity:
                                                pressed
                                                    ? 0.75
                                                    : 1,
                                        })}
                                    >
                                        <Text className="font-jakarta-medium text-[13px] text-text-900">
                                            {option}
                                        </Text>
                                    </Pressable>
                                ),
                            )}
                        </View>
                    ) : null}
                </View>
            ) : null}
        </View>
    );
}
