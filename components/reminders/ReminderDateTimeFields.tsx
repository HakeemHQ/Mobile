import {
    useState,
} from 'react';

import {
    Platform,
    Text,
} from 'react-native';

import {
    useTranslation,
} from 'react-i18next';

import DateTimePicker, {
    type DateTimePickerEvent,
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

    const handlePickerChange = (
        event: DateTimePickerEvent,
        selectedValue?: Date,
    ) => {
        const wasDismissed =
            event.type ===
            'dismissed';

        if (
            Platform.OS ===
            'android' ||
            wasDismissed
        ) {
            setPickerMode(null);
        }

        if (
            !selectedValue ||
            !pickerMode ||
            wasDismissed
        ) {
            return;
        }

        onChange(
            mergeDateTime(
                value,
                selectedValue,
                pickerMode,
            ),
        );

        if (
            Platform.OS === 'ios'
        ) {
            setPickerMode(null);
        }
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
            />

            {error ? (
                <Text
                    className={`-mt-2 mb-4 font-inter-medium text-[12px] ${isRTL ? 'text-right' : 'text-left'}`}
                    style={{
                        color:
                            colors.primary[700],
                    }}
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
                    onChange={
                        handlePickerChange
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
}: {
    value: Date;
    showDate: boolean;
    timeLabel: string;
    language?: string;
    onOpenDate: () => void;
    onOpenTime: () => void;
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
            />
        </>
    );
}