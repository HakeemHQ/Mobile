import {
    ScrollView,
    Text,
    View,
} from 'react-native';

import {
    useState,
} from 'react';

import {
    useRouter,
} from 'expo-router';

import {
    SafeAreaView,
} from 'react-native-safe-area-context';

import {
    StatusBar,
} from 'expo-status-bar';

import {
    useTranslation,
} from 'react-i18next';

import {
    MedicationSummaryCard,
} from '@/components/reminders/MedicationSummaryCard';

import {
    ReminderScreenHeader,
} from '@/components/reminders/ReminderScreenHeader';

import {
    colors,
} from '@/lib/theme/colors';

import {
    formatDateForDisplay,
    formatMedicationFrequencySummary,
    parseDatabaseDate,
} from '@/lib/reminder-utils';

import {
    useMedicationDraftStore,
} from '@/store/useMedicationDraftStore';
import { Button } from '@/components/ui/Button';
import { DeleteReminderModal } from '@/components/reminders/DeleteReminderModal';
import { HugeiconsIcon } from '@hugeicons/react-native';
import { Add02Icon } from '@hugeicons/core-free-icons';

const medicationAccents = [
    'primary',
    'secondary',
    'tertiary',
] as const;

export default function MedicationReviewScreen() {
    const router =
        useRouter();

    const { t, i18n } =
        useTranslation(['reminders', 'common']);
    const isRTL =
        (i18n.language || '').startsWith('ar');

    const drafts =
        useMedicationDraftStore(
            (state) =>
                state.drafts,
        );

    const removeDraft =
        useMedicationDraftStore(
            (state) =>
                state.removeDraft,
        );

    const openAddMedication =
        () => {
            router.push({
                pathname:
                    '/reminders/add',
                params: {
                    batch: '1',
                    type: 'MEDICATION',
                },
            });
        };

    const [deleteModalVisible, setDeleteModalVisible] =
        useState(false);
    const [draftToDelete, setDraftToDelete] =
        useState<{
            draftId: string;
            title: string;
        } | null>(null);

    const handleDeleteDraft = (
        draftId: string,
        title: string,
    ) => {
        setDraftToDelete({
            draftId,
            title,
        });
        setDeleteModalVisible(true);
    };

    const closeDeleteModal = () => {
        setDeleteModalVisible(false);
        setDraftToDelete(null);
    };

    const confirmDeleteDraft = () => {
        if (draftToDelete) {
            removeDraft(draftToDelete.draftId);
        }
        closeDeleteModal();
    };

    const handleBack = () => {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.replace('/reminders');
        }
    };

    return (
        <>
            <StatusBar style="dark" />

            <SafeAreaView
                className="flex-1 bg-bg"
                edges={[
                    'top',
                    'bottom',
                ]}
            >
                <ReminderScreenHeader
                    title={t('reviewMedications', { defaultValue: 'مراجعة الأدوية' })}
                    onBack={handleBack}
                />

                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{
                        paddingHorizontal:
                            20,
                        paddingBottom:
                            28,
                    }}
                    showsVerticalScrollIndicator={
                        false
                    }
                >
                    <Text className={`mb-5 font-jakarta-bold text-[19px] text-text2-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                        {t('yourMedications', { defaultValue: 'أدويتك المضافة' })}
                    </Text>

                    {drafts.length >
                        0 ? (
                        drafts.map(
                            (
                                draft,
                                index,
                            ) => {
                                const startDate =
                                    parseDatabaseDate(
                                        draft.startDate,
                                    );

                                return (
                                    <MedicationSummaryCard
                                        key={
                                            draft.draftId
                                        }
                                        title={
                                            draft.title
                                        }
                                        frequencySummary={formatMedicationFrequencySummary(
                                            draft,
                                        )}
                                        startDateLabel={
                                            startDate
                                                ? formatDateForDisplay(
                                                    startDate,
                                                    i18n.language,
                                                )
                                                : undefined
                                        }
                                        accent={
                                            medicationAccents[
                                                index % medicationAccents.length
                                            ]

                                        }
                                        onPress={() =>
                                            router.push(
                                                {
                                                    pathname:
                                                        '/reminders/add',
                                                    params: {
                                                        batch: '1',
                                                        draftId:
                                                            draft.draftId,
                                                    },
                                                },
                                            )
                                        }
                                        onDelete={() =>
                                            handleDeleteDraft(
                                                draft.draftId,
                                                draft.title,
                                            )
                                        }
                                    />
                                );
                            },
                        )
                    ) : (
                        <View className="mb-5 rounded-3xl border border-dashed border-text2-50 bg-surface p-8 items-center justify-center">
                            <View className="mb-5 h-16 w-16 items-center justify-center rounded-full bg-primary-50">
                                <HugeiconsIcon icon={Add02Icon} size={26} color={colors.primary.DEFAULT} />
                            </View>

                            <Text className="font-jakarta-bold text-[18px] text-text-900 text-center">
                                {t('noMedicationsAdded', { defaultValue: 'لم تتم إضافة أي أدوية بعد' })}
                            </Text>

                            <Text className="mt-2 text-center font-inter-regular text-[13px] leading-6 text-text2-400">
                                {t('noMedicationsAddedDesc', { defaultValue: 'ابدأ بإضافة الدواء الأول الآن، ثم تابع إعداد التذكيرات.' })}
                            </Text>

                            <Button
                                title={t('addMedicationCTA', { defaultValue: 'أضف دواءً الآن' })}
                                variant="primary"
                                className="mt-5 h-14 w-full"
                                onPress={openAddMedication}
                            />
                        </View>
                    )}

                    <Button
                        title={t('addAnotherMedication', { defaultValue: 'إضافة دواء آخر' })}
                        variant="outline"
                        className="h-14"
                        onPress={
                            openAddMedication
                        }
                    />
                </ScrollView>

                <View className="px-5 pb-1 pt-2">
                    <Button
                        title={t('continue', { defaultValue: 'المتابعة' })}
                        variant="primary"
                        className="h-14"
                        disabled={
                            drafts.length === 0
                        }
                        onPress={() =>
                            router.replace(
                                '/reminders/schedule',
                            )
                        }
                    />
                </View>

                <DeleteReminderModal
                    visible={deleteModalVisible}
                    reminderTitle={draftToDelete?.title}
                    onClose={closeDeleteModal}
                    onConfirm={confirmDeleteDraft}
                />
            </SafeAreaView>
        </>
    );
}
