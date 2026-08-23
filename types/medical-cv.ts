export type ExpiryType =
    | '24h'
    | '7d'
    | '30d'
    | 'custom';

export type MedicalCvLoadStatus =
    | 'loading'
    | 'success'
    | 'error';

export type MedicalCvRequestStatus =
    | 'idle'
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

export interface MedicalCvVersion {
    medicalCvVersionId: string;
    versionNumber: number;
    status: string;
    createdAt: string;
    approvedAt: string | null;
    pdfAvailable: boolean;
}

export interface MedicalCvDetails {
    medicalCvId: string;
    title: string;
    scopeType: string;
    focus: string | null;
    createdAt: string;
    updatedAt: string;
    versions: MedicalCvVersion[];
}

export interface PreviewLinkData {
    pdfUrl: string;
    previewExpiresAt: string;
}

export interface MedicalCvApiResponse<T> {
    data?: T;
    success: boolean;
    message?: string;
    errorList?: unknown[];
    globalErrorCode?: string | null;
}

export type MedicalCvsResponse =
    MedicalCvApiResponse<MedicalCvsData>;

export type MedicalCvDetailsResponse =
    MedicalCvApiResponse<MedicalCvDetails>;

export type PreviewLinkResponse =
    MedicalCvApiResponse<PreviewLinkData>;