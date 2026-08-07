import {
    useState,
} from 'react';

import {
    Platform,
    Pressable,
    Text,
    View,
} from 'react-native';

import DateTimePicker, {
    type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import {
    ChevronRight,
    Clock3,
    Pill,
    X,
} from 'lucide-react-native';
import {
    InputField,
} from '@/components/ui/InputField';

import {
    MedicationDurationSection,
} from '@/components/reminders/forms/medication/MedicationDurationSection';

import {
    MedicationFrequencySection,
} from '@/components/reminders/forms/medication/MedicationFrequencySection';

import {
    MedicationInstructionsSection,
} from '@/components/reminders/forms/medication/MedicationInstructionsSection';

import {
    colors,
} from '@/lib/theme/colors';

import {
    createMedicationEndDate,
    createMedicationStartDate,
    formatDatabaseDate,
    formatDateTimeTime,
    formatLocalTimeValue,
    localTimeToDate,
    parseDatabaseDate,
} from '@/lib/reminder-utils';

import {
    validateMedicationDraft,
    validateRequiredText,
} from '@/lib/reminder-validation';

import type {
    MedicationDraft,
    MedicationDraftInput,
    MedicationDurationType,
    MedicationFrequencyType,
    MedicationMealName,
    MedicationMealRelation,
    MedicationWeekdayCode,
} from '@/types/reminder';

interface UseMedicationReminderFormOptions {
    initialValue?: MedicationDraft;
    onSuccess: (
        input:
            MedicationDraftInput,
    ) => void | Promise<void>;
}

export interface MedicationReminderFormController {
    name: string;
    nameError?: string;
    durationType:
    MedicationDurationType;
    startDate: Date;
    endDate: Date;
    medicationTime: Date;
    frequencyType:
    MedicationFrequencyType;
    timesPerDay: number;
    weekdays:
    MedicationWeekdayCode[];
    monthDays: number[];
    instructions: string;
    mealRelation:
    MedicationMealRelation;
    mealName:
    MedicationMealName;
    isInstructionsExpanded:
    boolean;
    scheduleError?: string;
    isSubmitting: boolean;
    onNameChange: (
        value: string,
    ) => void;
    clearName: () => void;
    setDurationType: (
        value:
            MedicationDurationType,
    ) => void;
    setStartDate: (
        value: Date,
    ) => void;
    setEndDate: (
        value: Date,
    ) => void;
    setMedicationTime: (
        value: Date,
    ) => void;
    setFrequencyType: (
        value:
            MedicationFrequencyType,
    ) => void;
    setTimesPerDay: (
        value: number,
    ) => void;
    toggleWeekday: (
        value:
            MedicationWeekdayCode,
    ) => void;
    toggleMonthDay: (
        value: number,
    ) => void;
    setInstructions: (
        value: string,
    ) => void;
    setMealRelation: (
        value:
            MedicationMealRelation,
    ) => void;
    setMealName: (
        value:
            MedicationMealName,
    ) => void;
    setInstructionsExpanded: (
        value: boolean,
    ) => void;
    submit: () => Promise<void>;
}

interface MedicationReminderFormProps {
    form:
    MedicationReminderFormController;
}

function getInitialStartDate(
    initialValue?: MedicationDraft,
): Date {
    return initialValue
        ? parseDatabaseDate(
            initialValue.startDate,
        ) ??
        createMedicationStartDate()
        : createMedicationStartDate();
}

function getInitialEndDate(
    initialValue?: MedicationDraft,
): Date {
    if (
        initialValue?.endDate
    ) {
        return (
            parseDatabaseDate(
                initialValue.endDate,
            ) ??
            createMedicationEndDate()
        );
    }

    return createMedicationEndDate();
}

function getInitialMedicationTime(
    initialValue?: MedicationDraft,
): Date {
    const savedTime =
        initialValue?.firstDoseTime ??
        initialValue?.schedules[0]
            ?.localTime ??
        '08:00';

    return localTimeToDate(
        savedTime,
    );
}

export function useMedicationReminderForm({
    initialValue,
    onSuccess,
}: UseMedicationReminderFormOptions): MedicationReminderFormController {
    const [
        name,
        setName,
    ] = useState(
        initialValue?.title ?? '',
    );

    const [
        nameError,
        setNameError,
    ] = useState<string>();

    const [
        durationType,
        setDurationType,
    ] =
        useState<MedicationDurationType>(
            initialValue?.durationType ??
            'FINITE',
        );

    const [
        startDate,
        setStartDateState,
    ] = useState(() =>
        getInitialStartDate(
            initialValue,
        ),
    );

    const [
        endDate,
        setEndDate,
    ] = useState(() =>
        getInitialEndDate(
            initialValue,
        ),
    );

    const [
        medicationTime,
        setMedicationTimeState,
    ] = useState(() =>
        getInitialMedicationTime(
            initialValue,
        ),
    );

    const [
        frequencyType,
        setFrequencyTypeState,
    ] =
        useState<MedicationFrequencyType>(
            initialValue?.frequencyType ??
            'DAILY',
        );

    const [
        timesPerDay,
        setTimesPerDay,
    ] = useState(
        initialValue?.timesPerDay ??
        1,
    );

    const [
        weekdays,
        setWeekdays,
    ] =
        useState<
            MedicationWeekdayCode[]
        >(
            initialValue?.weekdays ??
            ['SUN'],
        );

    const [
        monthDays,
        setMonthDays,
    ] = useState<number[]>(
        initialValue?.monthDays ??
        [1],
    );

    const [
        instructions,
        setInstructions,
    ] = useState(
        initialValue?.instructions ??
        '',
    );

    const [
        mealRelation,
        setMealRelation,
    ] =
        useState<MedicationMealRelation>(
            initialValue?.mealRelation ??
            'BEFORE',
        );

    const [
        mealName,
        setMealName,
    ] =
        useState<MedicationMealName>(
            initialValue?.mealName ??
            'Breakfast',
        );

    const [
        isInstructionsExpanded,
        setInstructionsExpanded,
    ] = useState(
        Boolean(
            initialValue?.instructions ||
            initialValue?.mealRelation ||
            initialValue?.mealName,
        ),
    );

    const [
        scheduleError,
        setScheduleError,
    ] = useState<string>();

    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false);

    const onNameChange = (
        value: string,
    ) => {
        setName(value);

        if (nameError) {
            setNameError(
                undefined,
            );
        }
    };

    const clearName = () => {
        setName('');
        setNameError(
            undefined,
        );
    };

    const setMedicationTime = (
        value: Date,
    ) => {
        const normalizedTime =
            new Date(value);

        normalizedTime.setSeconds(
            0,
            0,
        );

        setMedicationTimeState(
            normalizedTime,
        );

        setScheduleError(
            undefined,
        );
    };

    const setStartDate = (
        value: Date,
    ) => {
        const normalizedValue =
            new Date(value);

        normalizedValue.setHours(
            0,
            0,
            0,
            0,
        );

        setStartDateState(
            normalizedValue,
        );

        if (
            endDate.getTime() <
            normalizedValue.getTime()
        ) {
            setEndDate(
                normalizedValue,
            );
        }

        setScheduleError(
            undefined,
        );
    };

    const setFrequencyType = (
        value:
            MedicationFrequencyType,
    ) => {
        setFrequencyTypeState(
            value,
        );

        setScheduleError(
            undefined,
        );
    };

    const toggleWeekday = (
        value:
            MedicationWeekdayCode,
    ) => {
        setWeekdays(
            (current) =>
                current.includes(
                    value,
                )
                    ? current.filter(
                        (
                            weekday,
                        ) =>
                            weekday !==
                            value,
                    )
                    : [
                        ...current,
                        value,
                    ],
        );

        setScheduleError(
            undefined,
        );
    };

    const toggleMonthDay = (
        value: number,
    ) => {
        setMonthDays(
            (current) =>
                current.includes(
                    value,
                )
                    ? current.filter(
                        (
                            monthDay,
                        ) =>
                            monthDay !==
                            value,
                    )
                    : [
                        ...current,
                        value,
                    ].sort(
                        (
                            first,
                            second,
                        ) =>
                            first -
                            second,
                    ),
        );

        setScheduleError(
            undefined,
        );
    };

    const submit = async () => {
        const requiredError =
            validateRequiredText(
                name,
                'Medication name is required.',
            );

        if (requiredError) {
            setNameError(
                requiredError,
            );

            return;
        }

        const input: MedicationDraftInput =
        {
            title:
                name.trim(),
            dosage:
                initialValue?.dosage ??
                null,
            instructions:
                instructions.trim() ||
                null,
            durationType,
            startDate:
                formatDatabaseDate(
                    startDate,
                ),
            endDate:
                durationType ===
                    'FINITE'
                    ? formatDatabaseDate(
                        endDate,
                    )
                    : null,
            frequencyType,
            weekdays:
                frequencyType ===
                    'WEEKLY'
                    ? weekdays
                    : [],
            monthDays:
                frequencyType ===
                    'MONTHLY'
                    ? monthDays
                    : [],
            timesPerDay,
            firstDoseTime:
                formatLocalTimeValue(
                    medicationTime,
                ),
            mealRelation:
                isInstructionsExpanded
                    ? mealRelation
                    : null,
            mealName:
                isInstructionsExpanded
                    ? mealName
                    : null,
        };

        const validationError =
            validateMedicationDraft(
                input,
            );

        if (validationError) {
            setScheduleError(
                validationError,
            );

            return;
        }

        setNameError(undefined);
        setScheduleError(
            undefined,
        );
        setIsSubmitting(true);

        try {
            await onSuccess(input);
        } finally {
            setIsSubmitting(
                false,
            );
        }
    };

    return {
        name,
        nameError,
        durationType,
        startDate,
        endDate,
        medicationTime,
        frequencyType,
        timesPerDay,
        weekdays,
        monthDays,
        instructions,
        mealRelation,
        mealName,
        isInstructionsExpanded,
        scheduleError,
        isSubmitting,
        onNameChange,
        clearName,
        setDurationType,
        setStartDate,
        setEndDate,
        setMedicationTime,
        setFrequencyType,
        setTimesPerDay,
        toggleWeekday,
        toggleMonthDay,
        setInstructions,
        setMealRelation,
        setMealName,
        setInstructionsExpanded,
        submit,
    };
}

export function MedicationReminderForm({
    form,
}: MedicationReminderFormProps) {
    const [
        isTimePickerOpen,
        setIsTimePickerOpen,
    ] = useState(false);

    const handleTimeChange = (
        event: DateTimePickerEvent,
        selectedTime?: Date,
    ) => {
        const wasDismissed =
            event.type ===
            'dismissed';

        if (
            Platform.OS ===
            'android' ||
            wasDismissed
        ) {
            setIsTimePickerOpen(
                false,
            );
        }

        if (
            !selectedTime ||
            wasDismissed
        ) {
            return;
        }

        form.setMedicationTime(
            selectedTime,
        );

        if (
            Platform.OS === 'ios'
        ) {
            setIsTimePickerOpen(
                false,
            );
        }
    };

    return (
        <>
            <InputField
                label="Name"
                value={form.name}
                onChangeText={
                    form.onNameChange
                }
                placeholder="Medication name"
                icon={
                    <Pill
                        size={21}
                        color={
                            colors.text2[400]
                        }
                        strokeWidth={2}
                    />
                }
                rightIcon={
                    form.name ? (
                        <X
                            size={20}
                            color={
                                colors.text2[400]
                            }
                            strokeWidth={2}
                        />
                    ) : undefined
                }
                onRightIconPress={
                    form.clearName
                }
                error={
                    form.nameError
                }
                bgClassName="bg-surface border border-text2-100"
                containerClassName="mb-5"
                autoCapitalize="words"
                returnKeyType="done"
            />

            <View className="mb-5">
                <Text className="mb-2 font-jakarta-semibold text-[13px] text-text2-500">
                    Medication Time
                </Text>

                <Pressable
                    accessibilityLabel={`Medication Time: ${formatDateTimeTime(
                        form.medicationTime,
                    )}`}
                    accessibilityRole="button"
                    className="h-14 flex-row items-center rounded-2xl border bg-surface px-4 border border-text2-100"
                    onPress={() =>
                        setIsTimePickerOpen(
                            true,
                        )
                    }
                    style={({
                        pressed,
                    }: {
                        pressed: boolean;
                    }) => ({
                        borderColor:
                            colors.text2[200],
                        opacity:
                            pressed
                                ? 0.8
                                : 1,
                    })}
                >
                    <Clock3
                        size={21}
                        color={
                            colors.text2[400]
                        }
                        strokeWidth={2}
                    />

                    <Text className="ml-3 flex-1 font-jakarta-semibold text-[15px] text-text2-500">
                        {formatDateTimeTime(
                            form.medicationTime,
                        )}
                    </Text>

                    <ChevronRight
                        size={21}
                        color={
                            colors.text2[400]
                        }
                        strokeWidth={2}
                    />
                </Pressable>

                {isTimePickerOpen ? (
                    <DateTimePicker
                        value={
                            form.medicationTime
                        }
                        mode="time"
                        display="default"
                        onChange={
                            handleTimeChange
                        }
                    />
                ) : null}
            </View>

            <MedicationDurationSection
                durationType={
                    form.durationType
                }
                startDate={
                    form.startDate
                }
                endDate={
                    form.endDate
                }
                onDurationTypeChange={
                    form.setDurationType
                }
                onStartDateChange={
                    form.setStartDate
                }
                onEndDateChange={
                    form.setEndDate
                }
            />

            <MedicationFrequencySection
                frequencyType={
                    form.frequencyType
                }
                timesPerDay={
                    form.timesPerDay
                }
                weekdays={
                    form.weekdays
                }
                monthDays={
                    form.monthDays
                }
                scheduleError={
                    form.scheduleError
                }
                onFrequencyTypeChange={
                    form.setFrequencyType
                }
                onTimesPerDayChange={
                    form.setTimesPerDay
                }
                onToggleWeekday={
                    form.toggleWeekday
                }
                onToggleMonthDay={
                    form.toggleMonthDay
                }
            />

            <MedicationInstructionsSection
                instructions={
                    form.instructions
                }
                mealRelation={
                    form.mealRelation
                }
                mealName={
                    form.mealName
                }
                isExpanded={
                    form.isInstructionsExpanded
                }
                onInstructionsChange={
                    form.setInstructions
                }
                onMealRelationChange={
                    form.setMealRelation
                }
                onMealNameChange={
                    form.setMealName
                }
                onExpandedChange={
                    form.setInstructionsExpanded
                }
            />
        </>
    );
}
