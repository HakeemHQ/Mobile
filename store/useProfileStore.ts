import { create } from 'zustand';

import { apiFetch } from '@/lib/api';
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
                return;
            }

            set({
                fetchStatus: 'loading',
                fetchError: '',
            });

            try {
                const response = (await apiFetch('/profile', {
                    method: 'GET',
                })) as ProfileResponse;

                if (!response.success || !response.data) {
                    set({
                        fetchStatus: 'error',
                        fetchError:
                            response.message ||
                            'Unable to load your profile.',
                    });

                    return;
                }

                set({
                    profile: response.data,
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
                const response = (await apiFetch('/profile', {
                    method: 'PATCH',
                    body: JSON.stringify(payload),
                })) as ProfileUpdateResponse | null;

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