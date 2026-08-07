import { create } from 'zustand';

import { getProfileApi, updateProfileApi } from '@/lib/api';
import { upsertDeviceUser } from '@/database/device-users';
import type {
    EditableProfileField,
    ProfileData,
    ProfileResponse,
    ProfileUpdatePayload,
    ProfileUpdateResponse,
} from '@/types/profile';

type ProfileRequestStatus =
    | 'idle'
    | 'loading'
    | 'success'
    | 'error';

interface ProfileStore {
    profile: ProfileData | null;
    fetchStatus: ProfileRequestStatus;
    fetchError: string;
    isSaving: boolean;
    saveError: string;

    fetchProfile: (force?: boolean) => Promise<void>;

    updateProfileField: (
        field: EditableProfileField,
        value: string,
    ) => Promise<boolean>;

    clearSaveError: () => void;
    resetProfile: () => void;
}

async function syncDeviceUser(
    profile: ProfileData,
): Promise<void> {
    const userId = profile.userId?.trim();
    const email = profile.email?.trim().toLowerCase();

    if (!userId || !email) {
        console.warn(
            'The authenticated profile does not contain a valid userId and email.',
        );

        return;
    }

    try {
        await upsertDeviceUser({
            userId,
            email,
        });
    } catch (error: unknown) {
        console.error(
            'Failed to synchronize the authenticated user with SQLite:',
            error,
        );
    }
}

export const useProfileStore = create<ProfileStore>()(
    (set, get) => ({
        profile: null,
        fetchStatus: 'idle',
        fetchError: '',
        isSaving: false,
        saveError: '',

        fetchProfile: async (force = false) => {
            const { profile, fetchStatus } = get();

            // A request is already running.
            if (fetchStatus === 'loading') {
                return;
            }

            // Cached profile exists, so do not request it again.
            if (profile && !force) {
                await syncDeviceUser(profile);
                return;
            }

            set({
                fetchStatus: 'loading',
                fetchError: '',
            });

            try {
                const response = await getProfileApi();

                if (!response.success || !response.data) {
                    set({
                        fetchStatus: 'error',
                        fetchError:
                            response.message ||
                            'Unable to load your profile.',
                    });

                    return;
                }

                const profileData = response.data;

                await syncDeviceUser(profileData);

                set({
                    profile: profileData,
                    fetchStatus: 'success',
                    fetchError: '',
                });
            } catch (error: unknown) {
                const apiError = error as {
                    message?: string;
                };

                set({
                    fetchStatus: 'error',
                    fetchError:
                        apiError.message ||
                        'Unable to load your profile.',
                });
            }
        },

        updateProfileField: async (field, value) => {
            const currentProfile = get().profile;

            if (!currentProfile || get().isSaving) {
                return false;
            }

            const payload = {
                [field]: value,
            } as ProfileUpdatePayload;

            set({
                isSaving: true,
                saveError: '',
            });

            try {
                const response = await updateProfileApi(payload);

                if (response?.success === false) {
                    set({
                        saveError:
                            response.message ||
                            'Unable to update your profile.',
                    });

                    return false;
                }

                const updatedProfile: ProfileData = {
                    ...currentProfile,
                    ...payload,
                    ...(response?.data ?? {}),
                };

                updatedProfile.fullName =
                    `${updatedProfile.firstName} ${updatedProfile.lastName}`.trim();

                if (field === 'email') {
                    await syncDeviceUser(updatedProfile);
                }

                set({
                    profile: updatedProfile,
                    saveError: '',
                });

                return true;
            } catch (error: unknown) {
                const apiError = error as {
                    message?: string;
                };

                set({
                    saveError:
                        apiError.message ||
                        'Unable to update your profile.',
                });

                return false;
            } finally {
                set({
                    isSaving: false,
                });
            }
        },

        clearSaveError: () => {
            set({
                saveError: '',
            });
        },

        resetProfile: () => {
            set({
                profile: null,
                fetchStatus: 'idle',
                fetchError: '',
                isSaving: false,
                saveError: '',
            });
        },
    }),
);