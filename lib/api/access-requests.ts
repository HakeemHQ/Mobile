import { apiClient } from './client';

export interface DoctorInfo {
  doctorId: string;
  fullName: string;
  specialty: string;
}

export interface AccessRequestItem {
  requestId: string;
  doctor: DoctorInfo;
  status: string;
  requestedAt: string;
  oneTimeCode?: string;
  codeExpiresAt?: string;
}

export interface AccessRequestsResponse {
  success: boolean;
  message: string;
  data: {
    items: AccessRequestItem[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
  };
}

export interface ApproveAccessRequestResponse {
  success: boolean;
  message: string;
  data: {
    requestId: string;
    status: string;
    oneTimeCode: string;
    codeExpiresAt: string;
  };
}

export interface RejectAccessRequestResponse {
  success: boolean;
  message: string;
  data: {
    requestId: string;
    status: string;
  };
}

export const getAccessRequests = async (status?: string, pageNumber = 1, pageSize = 50): Promise<AccessRequestsResponse> => {
  const params: Record<string, any> = {
    PageNumber: pageNumber,
    PageSize: pageSize,
  };
  if (status && status !== 'all') {
    let queryStatus = status.toLowerCase();
    if (queryStatus === 'active') queryStatus = 'approved';
    if (queryStatus === 'revoked') queryStatus = 'rejected';
    params.Status = queryStatus;
  }
  const response = await apiClient.get<AccessRequestsResponse>('/patient-access-requests', { params });
  return response.data;
};

export const approveAccessRequest = async (requestId: string): Promise<ApproveAccessRequestResponse> => {
  const response = await apiClient.post<ApproveAccessRequestResponse>(`/patient-access-requests/${requestId}/approve`);
  return response.data;
};

export const rejectAccessRequest = async (requestId: string): Promise<RejectAccessRequestResponse> => {
  const response = await apiClient.post<RejectAccessRequestResponse>(`/patient-access-requests/${requestId}/reject`);
  return response.data;
};
