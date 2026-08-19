import {
    Alert,
    ScrollView,
    StatusBar,
    Text,
    View,
} from 'react-native';
import {
    router,
    useLocalSearchParams,
} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import {
    MedicalCvEmptyState,
    MedicalCvErrorState,
    MedicalCvScreenHeader,
    MedicalCvSummaryCard,
    MedicalCvVersionCard,
    MedicalCvVersionsSkeleton,
} from '@/components/medical-cv';
import {
    useMedicalCvDetails,
    useMedicalCvPdf,
} from '@/hooks/useMedicalCv';

export default function MedicalCvVersionsScreen() {
    const { t } =
        useTranslation('medicalCv');

    const params =
        useLocalSearchParams<{
            medicalCvId?:
            | string
            | string[];
        }>();

    const medicalCvId =
        Array.isArray(
            params.medicalCvId,
        )
            ? params.medicalCvId[0]
            : params.medicalCvId;

    const {
        selectedMedicalCv,
        detailsStatus,
        detailsError,
        fetchMedicalCv,
    } =
        useMedicalCvDetails(
            medicalCvId,
        );

    const {
        downloadingVersionId,
        downloadVersionPdf,
    } =
        useMedicalCvPdf(
            selectedMedicalCv,
        );

    const isLoading =
        detailsStatus === 'idle' ||
        detailsStatus === 'loading';

    const handleDownload =
        async (
            versionId: string,
        ) => {
            const result =
                await downloadVersionPdf(
                    versionId,
                );

            if (!result.success) {
                Alert.alert(
                    t(
                        'downloadPdf',
                        'Download PDF',
                    ),
                    result.error ||
                    t(
                        'medicalCvPdfOpenError',
                        'Unable to open the Medical CV PDF. Please try again.',
                    ),
                );
            }
        };

    return (
        <>
            <StatusBar
                barStyle="dark-content"
            />

            <SafeAreaView
                className="flex-1 bg-bg"
                edges={[
                    'top',
                    'left',
                    'right',
                ]}
            >
                <View className="flex-1 px-5 pt-3">
                    <MedicalCvScreenHeader
                        title={t(
                            'versionsTitle',
                            'CV Versions',
                        )}
                        showBack
                        onBack={() =>
                            router.back()
                        }
                    />

                    <ScrollView
                        className="flex-1"
                        showsVerticalScrollIndicator={
                            false
                        }
                        contentContainerStyle={{
                            paddingBottom: 40,
                        }}
                    >
                        {!medicalCvId ? (
                            <MedicalCvErrorState
                                title={t(
                                    'medicalCvUnavailableTitle',
                                    'Medical CV unavailable',
                                )}
                                message={t(
                                    'invalidMedicalCv',
                                    'The selected Medical CV is unavailable.',
                                )}
                                showRetry={false}
                            />
                        ) : isLoading ? (
                            <MedicalCvVersionsSkeleton />
                        ) : detailsStatus ===
                            'error' ? (
                            <MedicalCvErrorState
                                title={t(
                                    'versionsLoadErrorTitle',
                                    "We couldn't load the versions",
                                )}
                                message={
                                    detailsError ||
                                    t(
                                        'versionsLoadErrorDescription',
                                        'Something went wrong. Please try again in a moment.',
                                    )
                                }
                                onRetry={() => {
                                    void fetchMedicalCv();
                                }}
                            />
                        ) : !selectedMedicalCv ? (
                            <MedicalCvErrorState
                                title={t(
                                    'medicalCvUnavailableTitle',
                                    'Medical CV unavailable',
                                )}
                                message={t(
                                    'invalidMedicalCv',
                                    'The selected Medical CV is unavailable.',
                                )}
                                showRetry={false}
                            />
                        ) : (
                            <>
                                <MedicalCvSummaryCard
                                    medicalCv={
                                        selectedMedicalCv
                                    }
                                />

                                <View className="mb-4 mt-7">
                                    <Text className="font-jakarta-bold text-[24px] text-primary-900">
                                        {t(
                                            'versions',
                                            'Versions',
                                        )}
                                    </Text>

                                    <Text className="mt-1 font-inter-regular text-[14px] text-text2">
                                        {t(
                                            'versionsCount',
                                            {
                                                count:
                                                    selectedMedicalCv
                                                        .versions
                                                        .length,
                                            },
                                        )}
                                    </Text>
                                </View>

                                {selectedMedicalCv
                                    .versions.length ===
                                    0 ? (
                                    <MedicalCvEmptyState variant="versions" />
                                ) : (
                                    selectedMedicalCv.versions.map(
                                        (version) => (
                                            <MedicalCvVersionCard
                                                key={
                                                    version.medicalCvVersionId
                                                }
                                                version={
                                                    version
                                                }
                                                isDownloading={
                                                    downloadingVersionId ===
                                                    version.medicalCvVersionId
                                                }
                                                onDownload={() => {
                                                    void handleDownload(
                                                        version.medicalCvVersionId,
                                                    );
                                                }}
                                            />
                                        ),
                                    )
                                )}
                            </>
                        )}
                    </ScrollView>
                </View>
            </SafeAreaView>
        </>
    );
}