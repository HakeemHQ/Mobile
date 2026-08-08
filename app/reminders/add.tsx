import {
    useState,
} from 'react';

import {
    Stack,
    useLocalSearchParams,
    useRouter,
} from 'expo-router';

import {
    AppointmentReminderForm,
    useAppointmentReminderForm,
} from '@/components/reminders/forms/AppointmentReminderForm';

import {
    LabTestReminderForm,
    useLabTestReminderForm,
} from '@/components/reminders/forms/LabTestReminderForm';

import {
    MedicationReminderForm,
    useMedicationReminderForm,
} from '@/components/reminders/forms/MedicationReminderForm';

import {
    ReminderFormScaffold,
} from '@/components/reminders/ReminderFormScaffold';

import {
    useMedicationDraftStore,
} from '@/store/useMedicationDraftStore';

import {
    useReminderStore,
} from '@/store/useReminderStore';

import type {
    ReminderType,
} from '@/types/reminder';

import {
    useTranslation,
} from 'react-i18next';

function getFirstParam(
    value:
        | string
        | string[]
        | undefined,
): string | undefined {
    return Array.isArray(value)
        ? value[0]
        : value;
}

export default function AddReminderScreen() {
    const router =
        useRouter();

    const { t } =
        useTranslation('reminders');

    const params =
        useLocalSearchParams<{
            batch?: string;
            draftId?: string;
            type?: string;
        }>();

    const batch =
        getFirstParam(
            params.batch,
        );

    const draftId =
        getFirstParam(
            params.draftId,
        );

    const requestedType =
        getFirstParam(
            params.type,
        );

    const batchMode =
        batch === '1' ||
        Boolean(draftId);

    const existingDraft =
        useMedicationDraftStore(
            (state) =>
                state.drafts.find(
                    (draft) =>
                        draft.draftId ===
                        draftId,
                ),
        );

    const addDraft =
        useMedicationDraftStore(
            (state) =>
                state.addDraft,
        );

    const updateDraft =
        useMedicationDraftStore(
            (state) =>
                state.updateDraft,
        );

    const isMutating =
        useReminderStore(
            (state) =>
                state.isMutating,
        );

    const initialType:
        ReminderType =
        batchMode ||
            requestedType ===
            'MEDICATION'
            ? 'MEDICATION'
            : requestedType ===
                'APPOINTMENT'
                ? 'APPOINTMENT'
                : requestedType ===
                    'LAB_TEST'
                    ? 'LAB_TEST'
                    : 'MEDICATION';

    const [
        selectedType,
        setSelectedType,
    ] =
        useState<ReminderType>(
            initialType,
        );

    const goToReminderList = () => {
        router.replace(
            '/reminders',
        );
    };

    const finishMedicationForm =
        () => {
            if (batchMode) {
                if (router.canGoBack()) {
                    router.back();
                } else {
                    router.replace('/reminders/medications');
                }
                return;
            }

            router.replace(
                '/reminders/medications',
            );
        };

    const medicationForm =
        useMedicationReminderForm({
            initialValue:
                existingDraft,
            onSuccess: async (
                input,
            ) => {
                if (
                    draftId &&
                    existingDraft
                ) {
                    updateDraft(
                        draftId,
                        input,
                    );
                } else {
                    addDraft(input);
                }

                finishMedicationForm();
            },
        });

    const appointmentForm =
        useAppointmentReminderForm({
            onSuccess:
                goToReminderList,
        });

    const labTestForm =
        useLabTestReminderForm({
            onSuccess:
                goToReminderList,
        });

    const handleSubmit = () => {
        switch (selectedType) {
            case 'MEDICATION':
                void medicationForm.submit();
                break;

            case 'APPOINTMENT':
                void appointmentForm.submit();
                break;

            case 'LAB_TEST':
                void labTestForm.submit();
                break;
        }
    };

    const submitTitle =
        selectedType ===
            'MEDICATION'
            ? existingDraft
                ? t('updateMedication')
                : t('addMedication')
            : selectedType ===
                'APPOINTMENT'
                ? t('addAppointment')
                : t('addLabTest');

    const handleBack = () => {
        if (batchMode) {
            if (router.canGoBack()) {
                router.back();
            } else {
                router.replace('/reminders/medications');
            }
            return;
        }

        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/reminders');
        }
    };

    return (
        <>
            <ReminderFormScaffold
                selectedType={
                    selectedType
                }
                onSelectType={
                    setSelectedType
                }
                onBack={
                    handleBack
                }
                onSubmit={
                    handleSubmit
                }
                submitTitle={
                    submitTitle
                }
                isSubmitting={
                    selectedType ===
                        'MEDICATION'
                        ? medicationForm.isSubmitting
                        : isMutating
                }
                showTypeSelector={
                    !batchMode
                }
            >
                {selectedType ===
                    'MEDICATION' ? (
                    <MedicationReminderForm
                        form={
                            medicationForm
                        }
                    />
                ) : selectedType ===
                    'APPOINTMENT' ? (
                    <AppointmentReminderForm
                        form={
                            appointmentForm
                        }
                    />
                ) : (
                    <LabTestReminderForm
                        form={
                            labTestForm
                        }
                    />
                )}
            </ReminderFormScaffold>
        </>
    );
}
