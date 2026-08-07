import {
    Building2,
    FlaskConical,
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

interface UseLabTestReminderFormOptions {
    onSuccess: () => void;
}

export type LabTestReminderFormController =
    SingleEventReminderFormController;

interface LabTestReminderFormProps {
    form:
    LabTestReminderFormController;
}

export function useLabTestReminderForm({
    onSuccess,
}: UseLabTestReminderFormOptions): LabTestReminderFormController {
    const addLabTest =
        useReminderStore(
            (state) =>
                state.addLabTest,
        );

    return useSingleEventReminderForm({
        titleRequiredMessage:
            'Lab test title is required.',
        dateTimeMessage:
            'Select a future lab-test date and time.',
        failureAlertTitle:
            'Unable to add lab test',
        onSuccess,
        save: async ({
            title,
            detail,
            dateTime,
            schedule,
        }) => {
            await addLabTest({
                reminderType:
                    'LAB_TEST',
                title,
                dueDate:
                    dateTime.toISOString(),
                labName:
                    detail || null,
                schedules: [
                    schedule,
                ],
            });
        },
    });
}

export function LabTestReminderForm({
    form,
}: LabTestReminderFormProps) {
    return (
        <>
            <InputField
                label="Title"
                value={form.title}
                onChangeText={
                    form.onTitleChange
                }
                placeholder="Lab test title"
                icon={
                    <FlaskConical
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
                label="Laboratory"
                value={form.detail}
                onChangeText={
                    form.onDetailChange
                }
                placeholder="Laboratory name (optional)"
                icon={
                    <Building2
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
