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
