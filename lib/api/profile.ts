import { apiClient } from './client';
import type {
    ProfileResponse,
    ProfileUpdatePayload,
    ProfileUpdateResponse,
} from '@/types/profile';

export const getProfileApi = async (): Promise<ProfileResponse> => {
    const response = await apiClient.get('/profile');
    return response.data;
};

export const updateProfileApi = async (
    payload: ProfileUpdatePayload
): Promise<ProfileUpdateResponse> => {
    const response = await apiClient.patch('/profile', payload);
    return response.data;
};

export const logoutApi = async (): Promise<void> => {
    await apiClient.post('/auth/logout').catch(() => {});
};
