import {
    useState,
} from 'react';

import {
    Text,
} from 'react-native';

import {
    useTranslation,
} from 'react-i18next';

import DateTimePicker, {
    type DateTimePickerChangeEvent,
} from '@react-native-community/datetimepicker';

import {
    DateTimeField,
} from '@/components/reminders/DateTimeField';

import {
    formatDateTimeDate,
    formatDateTimeTime,
} from '@/lib/reminder-utils';

import {
    colors,
} from '@/lib/theme/colors';

type PickerMode =
    | 'date'
    | 'time';

interface ReminderDateTimeFieldsProps {
    value: Date;
    onChange: (
        value: Date,
    ) => void;
    error?: string;
    showDate?: boolean;
    timeLabel?: string;
}

function mergeDateTime(
    currentValue: Date,
    selectedValue: Date,
    mode: PickerMode,
): Date {
    const nextValue =
        new Date(currentValue);

    if (mode === 'date') {
        nextValue.setFullYear(
            selectedValue.getFullYear(),
            selectedValue.getMonth(),
            selectedValue.getDate(),
        );

        return nextValue;
    }

    nextValue.setHours(
        selectedValue.getHours(),
        selectedValue.getMinutes(),
        0,
        0,
    );

    return nextValue;
}

export function ReminderDateTimeFields({
    value,
    onChange,
    error,
    showDate = true,
    timeLabel = 'Time',
}: ReminderDateTimeFieldsProps) {
    const { t, i18n } = useTranslation('reminders');
    const isRTL = i18n.language === 'ar';

    const [
        pickerMode,
        setPickerMode,
    ] =
        useState<PickerMode | null>(
            null,
        );

    const handlePickerValueChange = (
        _event:
            DateTimePickerChangeEvent,
        selectedValue: Date,
    ) => {
        if (!pickerMode) {
            return;
        }

        onChange(
            mergeDateTime(
                value,
                selectedValue,
                pickerMode,
            ),
        );

        setPickerMode(null);
    };

    const handlePickerDismiss = () => {
        setPickerMode(null);
    };

    return (
        <>
            <ReminderDateTimeFieldsContent
                value={value}
                showDate={showDate}
                timeLabel={timeLabel}
                language={i18n.language}
                onOpenDate={() =>
                    setPickerMode(
                        'date',
                    )
                }
                onOpenTime={() =>
                    setPickerMode(
                        'time',
                    )
                }
                hasError={!!error}
            />

            {error ? (
                <Text
                    className={`mt-2 mb-4 font-inter-medium text-[13px] text-red-500 ${isRTL ? 'text-right' : 'text-left'}`}
                >
                    {error}
                </Text>
            ) : null}

            {pickerMode ? (
                <DateTimePicker
                    value={value}
                    mode={pickerMode}
                    display="default"
                    minimumDate={
                        pickerMode ===
                            'date'
                            ? new Date()
                            : undefined
                    }
                    onValueChange={
                        handlePickerValueChange
                    }
                    onDismiss={
                        handlePickerDismiss
                    }
                />
            ) : null}
        </>
    );
}

function ReminderDateTimeFieldsContent({
    value,
    showDate,
    timeLabel,
    language,
    onOpenDate,
    onOpenTime,
    hasError,
}: {
    value: Date;
    showDate: boolean;
    timeLabel: string;
    language?: string;
    onOpenDate: () => void;
    onOpenTime: () => void;
    hasError?: boolean;
}) {
    const { t } = useTranslation('reminders');

    return (
        <>
            {showDate ? (
                <DateTimeField
                    label={t('date')}
                    value={formatDateTimeDate(
                        value,
                        language,
                    )}
                    mode="date"
                    onPress={
                        onOpenDate
                    }
                    hasError={hasError}
                />
            ) : null}

            <DateTimeField
                label={timeLabel === 'Time' ? t('time') : timeLabel}
                value={formatDateTimeTime(
                    value,
                    language,
                )}
                mode="time"
                onPress={
                    onOpenTime
                }
                hasError={hasError}
            />
        </>
    );
}