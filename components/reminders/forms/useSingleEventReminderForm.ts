import {
    useState,
} from 'react';

import {
    Alert,
} from 'react-native';

import {
    createDefaultReminderDateTime,
    createSingleEventSchedule,
    getErrorMessage,
    isFutureDateTime,
} from '@/lib/reminder-utils';

export interface SingleEventReminderFormController {
    title: string;
    detail: string;
    dateTime: Date;
    titleError?: string;
    dateTimeError?: string;
    onTitleChange: (
        value: string,
    ) => void;
    onDetailChange: (
        value: string,
    ) => void;
    setDateTime: (
        value: Date,
    ) => void;
    clearTitle: () => void;
    submit: () => Promise<void>;
}

interface SaveSingleEventInput {
    title: string;
    detail: string;
    dateTime: Date;
    schedule:
    ReturnType<
        typeof createSingleEventSchedule
    >;
}

interface UseSingleEventReminderFormOptions {
    titleRequiredMessage: string;
    dateTimeMessage: string;
    failureAlertTitle: string;
    save: (
        input: SaveSingleEventInput,
    ) => Promise<void>;
    onSuccess: () => void;
}

export function useSingleEventReminderForm({
    titleRequiredMessage,
    dateTimeMessage,
    failureAlertTitle,
    save,
    onSuccess,
}: UseSingleEventReminderFormOptions): SingleEventReminderFormController {
    const [
        title,
        setTitle,
    ] = useState('');

    const [
        detail,
        setDetail,
    ] = useState('');

    const [
        dateTime,
        setDateTimeState,
    ] = useState(
        createDefaultReminderDateTime,
    );

    const [
        titleError,
        setTitleError,
    ] = useState<string>();

    const [
        dateTimeError,
        setDateTimeError,
    ] = useState<string>();

    const onTitleChange = (
        value: string,
    ) => {
        setTitle(value);

        if (titleError) {
            setTitleError(
                undefined,
            );
        }
    };

    const setDateTime = (
        value: Date,
    ) => {
        setDateTimeState(value);

        if (dateTimeError) {
            setDateTimeError(
                undefined,
            );
        }
    };

    const clearTitle = () => {
        setTitle('');
        setTitleError(
            undefined,
        );
    };

    const submit = async () => {
        const normalizedTitle =
            title.trim();

        if (!normalizedTitle) {
            setTitleError(
                titleRequiredMessage,
            );

            return;
        }

        if (
            !isFutureDateTime(
                dateTime,
            )
        ) {
            setDateTimeError(
                dateTimeMessage,
            );

            return;
        }

        setTitleError(undefined);
        setDateTimeError(
            undefined,
        );

        try {
            await save({
                title:
                    normalizedTitle,
                detail:
                    detail.trim(),
                dateTime,
                schedule:
                    createSingleEventSchedule(
                        dateTime,
                    ),
            });

            onSuccess();
        } catch (error) {
            Alert.alert(
                failureAlertTitle,
                getErrorMessage(
                    error,
                ),
            );
        }
    };

    return {
        title,
        detail,
        dateTime,
        titleError,
        dateTimeError,
        onTitleChange,
        onDetailChange:
            setDetail,
        setDateTime,
        clearTitle,
        submit,
    };
}
