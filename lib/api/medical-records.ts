/**
 * Medical Records API Module
 * Endpoints for listing, searching, and fetching medical record details.
 */
import { apiClient } from './client';
import type {
  MedicalRecordsListResponse,
  MedicalRecordDetailResponse,
  MedicalRecordType,
} from '@/types/medical-record';

export interface GetMedicalRecordsParams {
  pageNumber?: number;
  pageSize?: number;
  recordType?: MedicalRecordType;
  search?: string;
  fromDate?: string;
  toDate?: string;
}

export interface SearchMedicalRecordsParams {
  query: string;
  patientProfileId?: string;
  limit?: number;
}

/**
 * Fetch paginated medical records list.
 * Supports Search, RecordType, FromDate, ToDate, PageNumber, and PageSize query parameters.
 */
export const getMedicalRecords = async (
  params?: GetMedicalRecordsParams
): Promise<MedicalRecordsListResponse> => {
  const queryParams: Record<string, string | number> = {};

  if (params?.pageNumber !== undefined) {
    queryParams.PageNumber = params.pageNumber;
    queryParams.pageNumber = params.pageNumber;
  }
  if (params?.pageSize !== undefined) {
    queryParams.PageSize = params.pageSize;
    queryParams.pageSize = params.pageSize;
  }
  if (params?.recordType) {
    queryParams.RecordType = params.recordType;
    queryParams.recordType = params.recordType;
  }
  if (params?.search) {
    queryParams.Search = params.search;
    queryParams.search = params.search;
  }
  if (params?.fromDate) {
    queryParams.FromDate = params.fromDate;
    queryParams.fromDate = params.fromDate;
  }
  if (params?.toDate) {
    queryParams.ToDate = params.toDate;
    queryParams.toDate = params.toDate;
  }

  const response = await apiClient.get('/medical-records', { params: queryParams });
  return response.data;
};

/**
 * Search medical records via GET /medical-records with Search parameter.
 * Returns matching records based on query string.
 */
export const searchMedicalRecords = async (
  params: SearchMedicalRecordsParams
): Promise<MedicalRecordsListResponse> => {
  return getMedicalRecords({
    search: params.query,
    pageSize: params.limit || 50,
  });
};

/**
 * Fetch a single medical record by ID (includes fields and sources).
 */
export const getMedicalRecordById = async (
  id: string
): Promise<MedicalRecordDetailResponse> => {
  const response = await apiClient.get(`/medical-records/${id}`);
  return response.data;
};
