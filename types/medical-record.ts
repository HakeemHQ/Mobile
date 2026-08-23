/**
 * Medical Record Types
 * Defines all interfaces for the /medical-records API endpoints.
 */

// The 8 supported record types from the AI extraction agent
export type MedicalRecordType =
  | 'Medication'
  | 'LabResult'
  | 'Condition'
  | 'Allergy'
  | 'Procedure'
  | 'Visit'
  | 'Facility'
  | 'PatientInformation';

// All supported field names from the AI extraction agent
export type MedicalRecordFieldName =
  | 'MedicationName'
  | 'Dose'
  | 'Quantity'
  | 'Frequency'
  | 'Route'
  | 'LabTestName'
  | 'LabValue'
  | 'Unit'
  | 'ReferenceRange'
  | 'ConditionName'
  | 'AllergyName'
  | 'ProcedureName'
  | 'Date'
  | 'DoctorName'
  | 'FacilityName'
  | 'PatientName';

/** A single medical record in the list response */
export interface MedicalRecordItem {
  medicalRecordId: string;
  recordType: MedicalRecordType;
  displayName: string;
  clinicalDate: string;
  status: string;
}

/** A key-value field within a record detail */
export interface MedicalRecordField {
  id: string;
  fieldName: MedicalRecordFieldName;
  fieldValue: string;
}

/** A source document reference within a record detail */
export interface MedicalRecordSource {
  documentId: string;
  documentTitle: string;
  pageReference: string;
}

/** Full record detail (extends list item with fields and sources) */
export interface MedicalRecordDetail extends MedicalRecordItem {
  sources: MedicalRecordSource[];
  fields: MedicalRecordField[];
}

/** Paginated list API response */
export interface MedicalRecordsListResponse {
  data: {
    items: MedicalRecordItem[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
  success: boolean;
  message: string;
  errorList: any[];
  globalErrorCode: string | null;
}

/** Single record detail API response */
export interface MedicalRecordDetailResponse {
  data: MedicalRecordDetail;
  success: boolean;
  message: string;
  errorList: any[];
  globalErrorCode: string | null;
}
