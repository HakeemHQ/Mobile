import {
    CalendarDays,
    Stethoscope,
    X,
} from 'lucide-react-native';

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
    const addAppointment =
        useReminderStore(
            (state) =>
                state.addAppointment,
        );

    return useSingleEventReminderForm({
        titleRequiredMessage:
            'Appointment title is required.',
        dateTimeMessage:
            'Select a future appointment date and time.',
        failureAlertTitle:
            'Unable to add appointment',
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
    return (
        <>
            <InputField
                label="Title"
                value={form.title}
                onChangeText={
                    form.onTitleChange
                }
                placeholder="Appointment title"
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
                label="Provider"
                value={form.detail}
                onChangeText={
                    form.onDetailChange
                }
                placeholder="Doctor or clinic (optional)"
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
