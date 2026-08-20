import React from 'react';
import {
    Image,
    RefreshControl,
    ScrollView,
    StatusBar,
    Text,
    View,
} from 'react-native';
import {
    router,
} from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import {
    MedicalCvCard,
    MedicalCvEmptyState,
    MedicalCvErrorState,
    MedicalCvInfoBanner,
    MedicalCvListSkeleton,
    MedicalCvScreenHeader,
} from '@/components/medical-cv';
import { useMedicalCvs } from '@/hooks/useMedicalCv';
import { colors } from '@/lib/theme';
import { useProfileStore } from '@/store/useProfileStore';

export default function MedicalCvScreen() {
    const { t } =
        useTranslation('medicalCv');
    const { t: tHome } =
        useTranslation('home');

    const profile =
        useProfileStore(
            (state) => state.profile,
        );
    const fetchProfile =
        useProfileStore(
            (state) =>
                state.fetchProfile,
        );

    const {
        medicalCvs,
        pagination,
        listStatus,
        listError,
        fetchMedicalCvs,
    } = useMedicalCvs();

    const [
        isRefreshing,
        setIsRefreshing,
    ] = React.useState(false);

    React.useEffect(() => {
        if (!profile) {
            void fetchProfile();
        }
    }, [profile, fetchProfile]);

    const totalItems =
        pagination?.totalItems ??
        medicalCvs.length;

    const isLoading =
        listStatus === 'idle' ||
        listStatus === 'loading';

    const isPending =
        profile?.identityVerificationStatus
            ?.toLowerCase() ===
        'pending';

    const handleMedicalCvPress = (
        medicalCvId: string,
    ) => {
        router.push({
            pathname: '/(tabs)/medical-cv/[medicalCvId]',
            params: {
                medicalCvId,
            },
        });
    };

    const handleRefresh = async () => {
        if (isRefreshing) {
            return;
        }

        setIsRefreshing(true);

        try {
            await Promise.all([
                fetchProfile(),
                fetchMedicalCvs(),
            ]);
        } finally {
            setIsRefreshing(false);
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
                            'title',
                            'Medical CV',
                        )}
                        subtitle={
                            isLoading
                                ? t(
                                    'loadingCvs',
                                    'Loading your CVs...',
                                )
                                : t(
                                    'cvCount',
                                    {
                                        count:
                                            totalItems,
                                    },
                                )
                        }
                    />

                    {isPending ? (
                        <ScrollView
                            className="flex-1"
                            showsVerticalScrollIndicator={
                                false
                            }
                            contentContainerStyle={{
                                flexGrow: 1,
                                alignItems:
                                    'center',
                                justifyContent:
                                    'center',
                                paddingHorizontal:
                                    24,
                                paddingBottom: 32,
                            }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={
                                        isRefreshing
                                    }
                                    onRefresh={() => {
                                        void handleRefresh();
                                    }}
                                    colors={[
                                        colors
                                            .primary[900],
                                    ]}
                                    tintColor={
                                        colors
                                            .primary[900]
                                    }
                                />
                            }
                        >
                            <Image
                                source={require('@/assets/images/Pending.webp')}
                                style={{
                                    width: 250,
                                    height: 180,
                                }}
                                resizeMode="contain"
                                className="mb-4"
                            />

                            <Text className="mb-2 text-center font-jakarta-bold text-[18px] text-text">
                                {tHome(
                                    'pendingDoctorReviewTitle',
                                    {
                                        defaultValue:
                                            'Pending Doctor Review',
                                    },
                                )}
                            </Text>

                            <Text className="text-center font-inter-regular text-[14px] leading-5 text-text2">
                                {tHome(
                                    'pendingDoctorReviewSubtitle',
                                    {
                                        defaultValue:
                                            'Please wait while the doctor reviews your profile.',
                                    },
                                )}
                            </Text>
                        </ScrollView>
                    ) : (
                        <ScrollView
                            className="flex-1"
                            showsVerticalScrollIndicator={
                                false
                            }
                            contentContainerStyle={{
                                flexGrow: 1,
                                paddingBottom: 32,
                            }}
                            refreshControl={
                                <RefreshControl
                                    refreshing={
                                        isRefreshing
                                    }
                                    onRefresh={() => {
                                        void handleRefresh();
                                    }}
                                    colors={[
                                        colors
                                            .primary[900],
                                    ]}
                                    tintColor={
                                        colors
                                            .primary[900]
                                    }
                                />
                            }
                        >
                            {isLoading ? (
                                <MedicalCvListSkeleton />
                            ) : (
                                <>
                                    <MedicalCvInfoBanner />

                                    {listStatus ===
                                        'error' ? (
                                        <MedicalCvErrorState
                                            title={t(
                                                'medicalCvsLoadErrorTitle',
                                                "We couldn't load your medical CVs",
                                            )}
                                            message={
                                                listError ||
                                                t(
                                                    'medicalCvsLoadErrorDescription',
                                                    'Something went wrong. Please try again in a moment.',
                                                )
                                            }
                                            onRetry={() => {
                                                void fetchMedicalCvs();
                                            }}
                                        />
                                    ) : medicalCvs.length ===
                                        0 ? (
                                        <MedicalCvEmptyState variant="cvs" />
                                    ) : (
                                        <>
                                            {medicalCvs.map(
                                                (
                                                    medicalCv,
                                                ) => (
                                                    <MedicalCvCard
                                                        key={
                                                            medicalCv.medicalCvId
                                                        }
                                                        medicalCv={
                                                            medicalCv
                                                        }
                                                        onPress={() =>
                                                            handleMedicalCvPress(
                                                                medicalCv.medicalCvId,
                                                            )
                                                        }
                                                    />
                                                ),
                                            )}

                                            <Text className="mt-2 text-center font-inter-regular text-[13px] text-text2">
                                                {t(
                                                    'showingCvCount',
                                                    {
                                                        visible:
                                                            medicalCvs.length,
                                                        total:
                                                            totalItems,
                                                    },
                                                )}
                                            </Text>
                                        </>
                                    )}
                                </>
                            )}
                        </ScrollView>
                    )}
                </View>
            </SafeAreaView>
        </>
    );
}