import {
    useState,
} from 'react';

import {
    useTranslation,
} from 'react-i18next';

import {
    Pressable,
    Text,
    View,
} from 'react-native';

import DateTimePicker, {
    type DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker';

import {
    ChevronLeft,
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
    hasSelectedStartDate: boolean;
    endDate: Date;
    hasSelectedEndDate: boolean;
    showValidationError: boolean;
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
    const { t } = useTranslation('reminders');

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
        hasSelectedStartDate,
        setHasSelectedStartDate,
    ] = useState(!!initialValue);

    const [
        endDate,
        setEndDateState,
    ] = useState(() =>
        getInitialEndDate(
            initialValue,
        ),
    );

    const [
        hasSelectedEndDate,
        setHasSelectedEndDate,
    ] = useState(!!initialValue);

    const [
        showValidationError,
        setShowValidationError,
    ] = useState(false);


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

        setHasSelectedStartDate(true);
        setShowValidationError(false);

        const nextDay = new Date(normalizedValue);
        nextDay.setDate(nextDay.getDate() + 1);
        setEndDateState(nextDay);

        setScheduleError(
            undefined,
        );
    };

    const setEndDate = (
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

        setEndDateState(
            normalizedValue,
        );

        setHasSelectedEndDate(true);
        setShowValidationError(false);

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
        console.log('--- Medication Form Submit Triggered ---');
        console.log('Name:', name);
        console.log('HasSelectedStartDate:', hasSelectedStartDate);
        console.log('HasSelectedEndDate:', hasSelectedEndDate);
        console.log('DurationType:', durationType);

        let hasError = false;

        const requiredError =
            validateRequiredText(
                name,
                t('medicationNameRequired'),
            );

        if (requiredError) {
            console.log('Validation failed: Name is empty');
            setNameError(
                requiredError,
            );
            hasError = true;
        } else {
            setNameError(undefined);
        }

        if (!hasSelectedStartDate || (durationType === 'FINITE' && !hasSelectedEndDate)) {
            setShowValidationError(true);
            hasError = true;
        }

        if (!hasSelectedStartDate) {
            console.log('Validation failed: Start date not explicitly selected');
            setScheduleError(
                t('startDateRequired'),
            );
        } else if (durationType === 'FINITE' && !hasSelectedEndDate) {
            console.log('Validation failed: End date not explicitly selected');
            setScheduleError(
                t('endDateRequired'),
            );
        } else {
            setScheduleError(undefined);
        }

        if (hasError) {
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
        hasSelectedStartDate,
        endDate,
        hasSelectedEndDate,
        showValidationError,
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
    const { t, i18n } = useTranslation('reminders');
    const isRTL = i18n.language === 'ar';
    const ChevronIcon = isRTL ? ChevronLeft : ChevronRight;

    const [
        isTimePickerOpen,
        setIsTimePickerOpen,
    ] = useState(false);

    const handleTimeValueChange = (
        _event: DateTimePickerChangeEvent,
        selectedTime: Date,
    ) => {

        form.setMedicationTime(
            selectedTime,
        );

        setIsTimePickerOpen(
            false,
        );
    };

    const handleTimeDismiss = () => {
        setIsTimePickerOpen(
            false,
        );
    };

    return (
        <>
            <InputField
                label={t('reminderTitle')}
                value={form.name}
                onChangeText={
                    form.onNameChange
                }
                placeholder={t('enterTitle')}
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
                <Text className={`mb-2 font-jakarta-semibold text-[13px] text-text2-500 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('medicationTime')}
                </Text>

                <Pressable
                    accessibilityLabel={`Medication Time: ${formatDateTimeTime(
                        form.medicationTime,
                        i18n.language,
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

                    <Text className={`${isRTL ? 'mr-3 text-right' : 'ml-3 text-left'} flex-1 font-jakarta-semibold text-[15px] text-text2-500`}>
                        {formatDateTimeTime(
                            form.medicationTime,
                            i18n.language,
                        )}
                    </Text>

                    <ChevronIcon
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
                        onValueChange={
                            handleTimeValueChange
                        }
                        onDismiss={
                            handleTimeDismiss
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
                hasSelectedStartDate={
                    form.hasSelectedStartDate
                }
                endDate={
                    form.endDate
                }
                hasSelectedEndDate={
                    form.hasSelectedEndDate
                }
                showValidationError={
                    form.showValidationError
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
