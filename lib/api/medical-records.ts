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
}

export interface SearchMedicalRecordsParams {
  query: string;
  patientProfileId?: string;
  limit?: number;
}

/**
 * Fetch paginated medical records list.
 * Supports pagination via pageNumber/pageSize and optional recordType filter.
 */
export const getMedicalRecords = async (
  params?: GetMedicalRecordsParams
): Promise<MedicalRecordsListResponse> => {
  const queryParams: Record<string, string | number> = {};

  if (params?.pageNumber) queryParams.pageNumber = params.pageNumber;
  if (params?.pageSize) queryParams.pageSize = params.pageSize;
  if (params?.recordType) queryParams.recordType = params.recordType;

  const response = await apiClient.get('/medical-records', { params: queryParams });
  return response.data;
};

/**
 * Search medical records via POST /medical-records/search.
 * Returns matching records based on query string.
 */
export const searchMedicalRecords = async (
  params: SearchMedicalRecordsParams
): Promise<MedicalRecordsListResponse> => {
  const body: Record<string, unknown> = {
    query: params.query,
  };
  if (params.patientProfileId) body.patientProfileId = params.patientProfileId;
  if (params.limit) body.limit = params.limit;

  const response = await apiClient.post('/medical-records/search', body);
  return response.data;
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
