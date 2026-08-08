import {
    CalendarDays,
    Stethoscope,
    X,
} from 'lucide-react-native';

import {
    useTranslation,
} from 'react-i18next';

import {
    ReminderDateTimeFields,
} from '@/components/reminders/ReminderDateTimeFields';

import {
    InputField,
} from '@/components/ui/InputField';

import {
    colors,
} from '@/lib/theme/colors';

import {
    useReminderStore,
} from '@/store/useReminderStore';

import {
    useSingleEventReminderForm,
    type SingleEventReminderFormController,
} from '@/components/reminders/forms/useSingleEventReminderForm';

interface UseAppointmentReminderFormOptions {
    onSuccess: () => void;
}

export type AppointmentReminderFormController =
    SingleEventReminderFormController;

interface AppointmentReminderFormProps {
    form:
    AppointmentReminderFormController;
}

export function useAppointmentReminderForm({
    onSuccess,
}: UseAppointmentReminderFormOptions): AppointmentReminderFormController {
    const { t } = useTranslation('reminders');
    const addAppointment =
        useReminderStore(
            (state) =>
                state.addAppointment,
        );

    return useSingleEventReminderForm({
        titleRequiredMessage:
            t('appointmentTitleRequired'),
        dateTimeMessage:
            t('appointmentDateTimeMessage'),
        failureAlertTitle:
            t('unableToAddAppointment'),
        onSuccess,
        save: async ({
            title,
            detail,
            dateTime,
            schedule,
        }) => {
            await addAppointment({
                reminderType:
                    'APPOINTMENT',
                title,
                appointmentDate:
                    dateTime.toISOString(),
                providerName:
                    detail || null,
                schedules: [
                    schedule,
                ],
            });
        },
    });
}

export function AppointmentReminderForm({
    form,
}: AppointmentReminderFormProps) {
    const { t } = useTranslation('reminders');

    return (
        <>
            <InputField
                label={t('appointmentTitle')}
                value={form.title}
                onChangeText={
                    form.onTitleChange
                }
                placeholder={t('enterAppointmentTitle')}
                icon={
                    <CalendarDays
                        size={21}
                        color={
                            colors.text2[400]
                        }
                        strokeWidth={2}
                    />
                }
                rightIcon={
                    form.title ? (
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
                    form.clearTitle
                }
                error={
                    form.titleError
                }
                bgClassName="bg-surface border border-text2-100"
                containerClassName="mb-5"
                autoCapitalize="sentences"
                returnKeyType="next"
            />

            <InputField
                label={t('provider')}
                value={form.detail}
                onChangeText={
                    form.onDetailChange
                }
                placeholder={t('enterProviderOptional')}
                icon={
                    <Stethoscope
                        size={21}
                        color={
                            colors.text2[400]
                        }
                        strokeWidth={2}
                    />
                }
                bgClassName="bg-surface border border-text2-100"
                containerClassName="mb-5"
                autoCapitalize="words"
                returnKeyType="done"
            />

            <ReminderDateTimeFields
                value={
                    form.dateTime
                }
                onChange={
                    form.setDateTime
                }
                error={
                    form.dateTimeError
                }
            />
        </>
    );
}
