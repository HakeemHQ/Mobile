export interface ChatbotRequest {
    message: string;
}

export interface ChatbotErrorItem {
    propertyName: string;
    message: string;
    code: string;
}

export interface ChatbotRagResult {
    medicalRecordId: string;
    score: number;
    recordType: string;
    displayName: string;
    status: string;
    clinicalDate: string;
    content: string;
    fields: string;
}

export interface ChatbotGeneratedCv {
    medicalCvId: string;
    medicalCvVersionId: string;
    title: string;
    focus: string;
    versionNumber: number;
    status: string;
    createdAt: string;
    previewUrl: string;
    previewExpiresAt: string;
}

export interface ChatbotResponseData {
    message: string;
    ragResults: ChatbotRagResult[];
    generatedCv: ChatbotGeneratedCv | null;
}

export interface ChatbotResponse {
    success: boolean;
    message: string;
    errorList: ChatbotErrorItem[];
    globalErrorCode: string;
    data: ChatbotResponseData | null;
}