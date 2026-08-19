import {
    apiClient,
    apiFetch,
} from './client';

import type {
    MedicalCvDetailsResponse,
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

export async function getMedicalCvsApi(): Promise<
    MedicalCvsResponse
> {
    try {
        const response = (await apiFetch(
            '/medical-cvs',
            {
                method: 'GET',
            },
        )) as MedicalCvsResponse;

        if (
            !response.success ||
            !response.data
        ) {
            throw new Error(
                response.message ||
                'Unable to load your Medical CVs.',
            );
        }

        return response;
    } catch (error: unknown) {
        throw new Error(
            getApiErrorMessage(
                error,
                'Unable to load your Medical CVs.',
            ),
        );
    }
}

export async function getMedicalCvByIdApi(
    medicalCvId: string,
): Promise<MedicalCvDetailsResponse> {
    if (!medicalCvId.trim()) {
        throw new Error(
            'No Medical CV was selected.',
        );
    }

    try {
        const response = (await apiFetch(
            `/medical-cvs/${encodeURIComponent(
                medicalCvId,
            )}`,
            {
                method: 'GET',
            },
        )) as MedicalCvDetailsResponse;

        if (
            !response.success ||
            !response.data
        ) {
            throw new Error(
                response.message ||
                'Unable to load the Medical CV.',
            );
        }

        return response;
    } catch (error: unknown) {
        throw new Error(
            getApiErrorMessage(
                error,
                'Unable to load the Medical CV.',
            ),
        );
    }
}

export async function getMedicalCvVersionPdfApi(
    versionId: string,
): Promise<ArrayBuffer> {
    if (!versionId.trim()) {
        throw new Error(
            'No Medical CV version is available.',
        );
    }

    try {
        const response =
            await apiClient.get<ArrayBuffer>(
                `/medical-cv-versions/${encodeURIComponent(
                    versionId,
                )}/pdf`,
                {
                    responseType:
                        'arraybuffer',
                    headers: {
                        Accept:
                            'application/pdf',
                    },
                },
            );

        const contentType =
            response.headers[
                'content-type'
            ];

        if (
            typeof contentType ===
                'string' &&
            !contentType
                .toLowerCase()
                .includes(
                    'application/pdf',
                )
        ) {
            throw new Error(
                'The server did not return a PDF file.',
            );
        }

        if (
            !response.data ||
            response.data.byteLength ===
                0
        ) {
            throw new Error(
                'The returned PDF file is empty.',
            );
        }

        return response.data;
    } catch (error: unknown) {
        throw new Error(
            getApiErrorMessage(
                error,
                'Unable to download the Medical CV PDF.',
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