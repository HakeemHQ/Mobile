import { apiFetch } from './client';

import type {
    MedicalCvsResponse,
    PreviewLinkData,
    PreviewLinkResponse,
} from '@/types/medical-cv';

function getApiErrorMessage(
    error: unknown,
    fallback: string,
): string {
    if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        typeof error.message === 'string' &&
        error.message.trim()
    ) {
        return error.message;
    }

    return fallback;
}

export async function getLatestMedicalCvVersionId(): Promise<
    string | null
> {
    try {
        const response = (await apiFetch('/medical-cvs', {
            method: 'GET',
        })) as MedicalCvsResponse;

        if (!response.success || !response.data) {
            throw new Error(
                response.message ||
                'Unable to load your Medical CV.',
            );
        }

        const medicalCvWithVersion =
            response.data.items.find((item) =>
                Boolean(
                    item.latestVersion?.medicalCvVersionId,
                ),
            );

        return (
            medicalCvWithVersion?.latestVersion
                ?.medicalCvVersionId ?? null
        );
    } catch (error: unknown) {
        throw new Error(
            getApiErrorMessage(
                error,
                'Unable to load your Medical CV.',
            ),
        );
    }
}

export async function createMedicalCvPreviewLink(
    versionId: string,
): Promise<PreviewLinkData> {
    if (!versionId.trim()) {
        throw new Error(
            'No Medical CV version is available.',
        );
    }

    try {
        const response = (await apiFetch(
            `/medical-cv-versions/${encodeURIComponent(
                versionId,
            )}/preview-link`,
            {
                method: 'POST',
            },
        )) as PreviewLinkResponse;

        if (
            !response.success ||
            !response.data?.pdfUrl
        ) {
            throw new Error(
                response.message ||
                'Unable to create a Medical CV preview link.',
            );
        }

        return response.data;
    } catch (error: unknown) {
        throw new Error(
            getApiErrorMessage(
                error,
                'Unable to create a Medical CV preview link.',
            ),
        );
    }
}