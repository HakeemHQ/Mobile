import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { ArrowLeft02Icon } from '@/components/icons/ArrowLeft02Icon';
import { LockIcon } from '@/components/icons/LockIcon';
import { EditProfileFieldModal } from '@/components/personal-info/EditProfileFieldModal';
import { PersonalInfoCard } from '@/components/personal-info/PersonalInfoCard';
import { ProfileSummaryCard } from '@/components/personal-info/ProfileSummaryCard';
import { useProfileStore } from '@/store/useProfileStore';
import { getProfileFieldValue } from '@/lib/profile-utils';
import { colors } from '@/lib/theme/colors';
import type { EditableProfileField } from '@/types/profile';

export default function PersonalInfoScreen() {
    const { t, i18n } = useTranslation('profile');
    const isRTL = i18n.language === 'ar';
    const [activeField, setActiveField] =
        useState<EditableProfileField | null>(null);

    const profile = useProfileStore(
        (state) => state.profile,
    );

    const fetchStatus = useProfileStore(
        (state) => state.fetchStatus,
    );

    const fetchError = useProfileStore(
        (state) => state.fetchError,
    );

    const isSaving = useProfileStore(
        (state) => state.isSaving,
    );

    const saveError = useProfileStore(
        (state) => state.saveError,
    );

    const fetchProfile = useProfileStore(
        (state) => state.fetchProfile,
    );

    const updateProfileField = useProfileStore(
        (state) => state.updateProfileField,
    );

    const clearSaveError = useProfileStore(
        (state) => state.clearSaveError,
    );

    const isLoading =
        fetchStatus === 'idle' ||
        fetchStatus === 'loading';

    useEffect(() => {
        void fetchProfile();
    }, [fetchProfile]);

    const openEditor = (
        field: EditableProfileField,
    ) => {
        clearSaveError();
        setActiveField(field);
    };

    const closeEditor = () => {
        if (isSaving) {
            return;
        }

        clearSaveError();
        setActiveField(null);
    };

    const saveField = async (
        value: string,
    ): Promise<boolean> => {
        if (!activeField) {
            return false;
        }

        const wasUpdated = await updateProfileField(
            activeField,
            value,
        );

        if (wasUpdated) {
            setActiveField(null);
        }

        return wasUpdated;
    };

    const activeFieldValue =
        profile && activeField
            ? getProfileFieldValue(profile, activeField)
            : '';

    return (
        <SafeAreaView
            className="flex-1 bg-bg"
            edges={['top']}
        >
            {/* Header */}
            <View className={`mb-6 mt-2 flex-row items-center px-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Pressable
                    accessibilityLabel={t('profileScreens.personalInfo.backToProfile')}
                    accessibilityRole="button"
                    className={`${isRTL ? 'ml-4' : 'mr-4'} h-10 w-10 items-center justify-center rounded-full border border-bg-600 bg-surface`}
                    hitSlop={8}
                    onPress={() => router.back()}
                    style={({ pressed }) => ({
                        opacity: pressed ? 0.7 : 1,
                    })}
                >
                    <View
                        style={
                            isRTL
                                ? {
                                    transform: [
                                        { scaleX: -1 },
                                    ],
                                }
                                : undefined
                        }
                    >
                        <ArrowLeft02Icon
                            size={20}
                            color={colors.text[800]}
                        />
                    </View>
                </Pressable>

                <Text className={`font-jakarta-bold text-[22px] text-primary-900 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('profileScreens.personalInfo.title')}
                </Text>
            </View>

            {isLoading ? (
                <View className="flex-1 items-center justify-center px-6">
                    <ActivityIndicator
                        size="large"
                        color={colors.primary[900]}
                    />

                    <Text className={`mt-4 font-inter-regular text-[13px] text-text2-500 ${isRTL ? 'self-stretch text-right' : ''}`}>
                        {t('profileScreens.personalInfo.loading')}
                    </Text>
                </View>
            ) : fetchError ? (
                <View className="flex-1 items-center justify-center px-6">
                    <Text className={`font-jakarta-semibold text-[16px] text-primary-900 ${isRTL ? 'self-stretch text-right' : 'text-center'}`}>
                        {t('profileScreens.personalInfo.loadError')}
                    </Text>

                    <Text className={`mt-2 max-w-[280px] font-inter-regular text-[13px] leading-5 text-text2-500 ${isRTL ? 'self-stretch text-right' : 'text-center'}`}>
                        {fetchError}
                    </Text>

                    <Pressable
                        accessibilityLabel={t('profileScreens.personalInfo.retryAccessibility')}
                        accessibilityRole="button"
                        className="mt-6 h-12 items-center justify-center rounded-2xl bg-primary-900 px-8"
                        onPress={() => {
                            void fetchProfile(true);
                        }}
                    >
                        <Text className="font-jakarta-semibold text-[14px] text-surface">
                            {t('profileScreens.personalInfo.tryAgain')}
                        </Text>
                    </Pressable>
                </View>
            ) : profile ? (
                <ScrollView
                    className="flex-1 px-6"
                    contentContainerStyle={{
                        paddingBottom: 32,
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <ProfileSummaryCard profile={profile} />

                    <PersonalInfoCard
                        profile={profile}
                        onEdit={openEditor}
                    />

                    {/* Security information */}
                    <View className="mt-9 items-center px-4">
                        <Text className={`max-w-[260px] font-inter-regular text-[11px] leading-[17px] text-text2-500 ${isRTL ? 'self-stretch text-right' : 'text-center'}`}>
                            {t('profileScreens.personalInfo.securityDescription')}
                        </Text>

                        <View className={`mt-3 flex-row items-center rounded-full bg-bg-600/30 px-4 py-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <LockIcon
                                size={14}
                                color={colors.primary[900]}
                            />

                            <Text className={`${isRTL ? 'mr-2' : 'ml-2'} font-jakarta-semibold text-[11px] text-primary-900`}>
                                {t('profileScreens.personalInfo.hipaaSecurity')}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            ) : null}

            <EditProfileFieldModal
                visible={activeField !== null}
                field={activeField}
                initialValue={activeFieldValue}
                isSaving={isSaving}
                saveError={saveError}
                onClose={closeEditor}
                onSave={saveField}
                onClearSaveError={clearSaveError}
            />
        </SafeAreaView>
    );
}
