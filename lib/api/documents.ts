import { UploadDocumentPayload, ExtractionResponse } from '@/types/document';
import { apiClient } from './client';

export const getExtractedFieldsApi = async (documentId: string): Promise<ExtractionResponse> => {
  const response = await apiClient.get(`/documents/${documentId}/extracted-fields`);
  return response.data;
};

export const pollExtractedFields = async (
  documentId: string,
  intervalMs = 3000,
  maxAttempts = 60
): Promise<ExtractionResponse> => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const responseData = await getExtractedFieldsApi(documentId);
      const status =
        responseData?.data?.extractionStatus ||
        (responseData as any)?.extractionStatus ||
        (responseData as any)?.data?.status ||
        (responseData as any)?.status;

      console.log(`[Poll Attempt ${attempt + 1}/${maxAttempts}] Status: ${status}`);

      const normalizedStatus = typeof status === 'string' ? status.trim().toLowerCase() : '';
      const items = responseData?.data?.items || (responseData as any)?.items;

      // Complete condition: explicit completion status OR presence of extracted items
      if (
        normalizedStatus === 'completed' ||
        normalizedStatus === 'success' ||
        normalizedStatus === 'done' ||
        normalizedStatus === 'finished' ||
        normalizedStatus === 'processed' ||
        (Array.isArray(items) && items.length > 0)
      ) {
        console.log('🎉 ================================================');
        console.log('✅ [Document Extraction Completed Response]:');
        console.log(JSON.stringify(responseData, null, 2));
        console.log('🎉 ================================================');
        return responseData;
      }

      // Explicit failure condition
      if (
        normalizedStatus === 'failed' ||
        normalizedStatus === 'error' ||
        normalizedStatus === 'rejected'
      ) {
        throw new Error(
          responseData?.message ||
          (responseData as any)?.error ||
          'Document extraction failed on server'
        );
      }
    } catch (err: any) {
      if (err?.message && (err.message.includes('failed') || err.message.includes('Failed'))) {
        throw err;
      }
      console.warn(`[Poll Attempt ${attempt + 1}] Warning polling document:`, err?.message || err);
    }

    await new Promise((res) => setTimeout(res, intervalMs));
  }

  throw new Error('AI extraction is taking longer than expected. Please check your timeline in a few moments.');
};

export const uploadDocumentApi = async (payload: UploadDocumentPayload): Promise<string> => {
  const formData = new FormData();

  if (payload.file && payload.file.uri) {
    formData.append('File', {
      uri: payload.file.uri,
      name: payload.file.name || 'document.jpg',
      type: payload.file.type || 'image/jpeg',
    } as any);
  }

  formData.append('DocumentType', payload.documentType || 'Prescription');
  formData.append('Title', payload.title || 'Document');
  formData.append('DocumentDate', payload.documentDate || new Date().toISOString().split('T')[0]);

  const response = await apiClient.post('/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const resData = response.data;
  const documentId =
    resData?.data?.documentId ||
    resData?.documentId ||
    resData?.data?.id ||
    resData?.id;

  if (!documentId) {
    throw new Error('No documentId returned from upload');
  }

  return documentId;
};

/**
 * Fetch list of uploaded documents from GET /documents
 */
export const getDocumentsApi = async (params?: {
  pageNumber?: number;
  pageSize?: number;
}): Promise<import('@/types/document').DocumentsListResponse> => {
  const response = await apiClient.get('/documents', { params });
  return response.data;
};

/**
 * Fetch a single document detail from GET /documents/{id}
 */
export const getDocumentByIdApi = async (
  documentId: string
): Promise<import('@/types/document').DocumentDetailResponse> => {
  const response = await apiClient.get(`/documents/${documentId}`);
  return response.data;
};

