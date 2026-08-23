export interface ExtractedField {
  extractedFieldId: string;
  fieldName: string;
  extractedValue: string;
  confidence: number;
  evidenceText?: string;
  issues?: any[];
}

export interface ExtractedItem {
  extractedItemId: string;
  itemType: string;
  sequenceNumber: number;
  pageNumber: number;
  fields: ExtractedField[];
}

export interface ExtractedDocumentData {
  documentId: string;
  documentType: string;
  extractionStatus: string;
  items: ExtractedItem[];
}

export interface ExtractionResponse {
  data: ExtractedDocumentData;
  success: boolean;
  message: string;
  errorList?: any[];
  globalErrorCode?: string | null;
}

export interface UploadDocumentPayload {
  file: {
    uri: string;
    name: string;
    type: string;
  };
  documentType: string;
  title: string;
  documentDate: string;
}

/** Document list item from GET /documents */
export interface DocumentItem {
  documentId: string;
  documentType: string;
  title: string;
  documentDate: string;
  extractionStatus: string;
}

/** Document detail from GET /documents/{id} */
export interface DocumentDetail extends DocumentItem {
  failureCode?: string | null;
  documentPath?: string | null;
}

/** List API response wrapper for GET /documents */
export interface DocumentsListResponse {
  data: {
    items: DocumentItem[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
  success: boolean;
  message: string;
  errorList?: any[];
  globalErrorCode?: string | null;
}

/** Detail API response wrapper for GET /documents/{id} */
export interface DocumentDetailResponse {
  data: DocumentDetail;
  success: boolean;
  message: string;
  errorList?: any[];
  globalErrorCode?: string | null;
}
