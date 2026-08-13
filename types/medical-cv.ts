export type ExpiryType =
    | '24h'
    | '7d'
    | '30d'
    | 'custom';

export type MedicalCvLoadStatus =
    | 'loading'
    | 'success'
    | 'error';

export interface MedicalCvLatestVersion {
    medicalCvVersionId: string;
    versionNumber: number;
    status: string;
}

export interface MedicalCvItem {
    medicalCvId: string;
    title: string;
    scopeType: string;
    focus: string | null;
    latestVersion: MedicalCvLatestVersion | null;
}

export interface MedicalCvPagination {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
}

export interface MedicalCvsData {
    items: MedicalCvItem[];
    pagination: MedicalCvPagination;
}

export interface PreviewLinkData {
    pdfUrl: string;
    previewExpiresAt: string;
}

interface MedicalCvApiResponse<T> {
    data?: T;
    success: boolean;
    message?: string;
    errorList?: unknown[];
    globalErrorCode?: string | null;
}

export type MedicalCvsResponse =
    MedicalCvApiResponse<MedicalCvsData>;

export type PreviewLinkResponse =
    MedicalCvApiResponse<PreviewLinkData>;