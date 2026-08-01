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

import { ArrowLeft02Icon } from '@/components/icons/ArrowLeft02Icon';
import { LockIcon } from '@/components/icons/LockIcon';
import { EditProfileFieldModal } from '@/components/personal-info/EditProfileFieldModal';
import { PersonalInfoCard } from '@/components/personal-info/PersonalInfoCard';
import { ProfileSummaryCard } from '@/components/personal-info/ProfileSummaryCard';
import { useProfileStore } from '@/stores/useProfileStore';
import { getProfileFieldValue } from '@/lib/profile-utils';
import { colors } from '@/lib/theme/colors';
import type { EditableProfileField } from '@/types/profile';

export default function PersonalInfoScreen() {
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
            <View className="mb-6 mt-2 flex-row items-center px-6">
                <Pressable
                    accessibilityLabel="Return to Profile"
                    accessibilityRole="button"
                    className="mr-4 h-10 w-10 items-center justify-center rounded-full border border-bg-600 bg-surface"
                    hitSlop={8}
                    onPress={() => router.replace('/profile')}
                >
                    <ArrowLeft02Icon
                        size={20}
                        color={colors.text[800]}
                    />
                </Pressable>

                <Text className="font-jakarta-bold text-[22px] text-primary-900">
                    Personal Info
                </Text>
            </View>

            {isLoading ? (
                <View className="flex-1 items-center justify-center px-6">
                    <ActivityIndicator
                        size="large"
                        color={colors.primary[900]}
                    />

                    <Text className="mt-4 font-inter-regular text-[13px] text-text2-500">
                        Loading your profile...
                    </Text>
                </View>
            ) : fetchError ? (
                <View className="flex-1 items-center justify-center px-6">
                    <Text className="text-center font-jakarta-semibold text-[16px] text-primary-900">
                        Could not load your profile
                    </Text>

                    <Text className="mt-2 max-w-[280px] text-center font-inter-regular text-[13px] leading-5 text-text2-500">
                        {fetchError}
                    </Text>

                    <Pressable
                        accessibilityLabel="Retry loading profile"
                        accessibilityRole="button"
                        className="mt-6 h-12 items-center justify-center rounded-2xl bg-primary-900 px-8"
                        onPress={() => {
                            void fetchProfile(true);
                        }}
                    >
                        <Text className="font-jakarta-semibold text-[14px] text-surface">
                            Try Again
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
                        <Text className="max-w-[260px] text-center font-inter-regular text-[11px] leading-[17px] text-text2-500">
                            Your personal information is encrypted
                            and stored according to Hakeem Privacy
                            Standards.
                        </Text>

                        <View className="mt-3 flex-row items-center rounded-full bg-bg-600/30 px-4 py-2">
                            <LockIcon
                                size={14}
                                color={colors.primary[900]}
                            />

                            <Text className="ml-2 font-jakarta-semibold text-[11px] text-primary-900">
                                HIPAA Compliant Security
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