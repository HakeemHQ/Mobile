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

export interface DoctorAccessItem {
  accessId: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  expiresAt: string;
}

export interface DoctorAccessResponse {
  success: boolean;
  message: string;
  data: {
    items: DoctorAccessItem[];
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

export interface RevokeAccessResponse {
  success: boolean;
  message: string;
  data: any;
}

export const getAccessRequests = async (status?: string, pageNumber = 1, pageSize = 50): Promise<AccessRequestsResponse> => {
  const params: Record<string, any> = {
    PageNumber: pageNumber,
    PageSize: pageSize,
  };
  if (status && status !== 'all') {
    let queryStatus = status.toLowerCase();
    if (queryStatus === 'active') queryStatus = 'approved';
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

export const revokeAccess = async (accessId: string): Promise<boolean> => {
  const response = await apiClient.delete(`/doctor-access/${accessId}`);
  return response.status >= 200 && response.status < 300;
};

export const getDoctorAccesses = async (pageNumber = 1, pageSize = 50): Promise<DoctorAccessResponse> => {
  const params: Record<string, any> = {
    PageNumber: pageNumber,
    PageSize: pageSize,
  };
  const response = await apiClient.get<DoctorAccessResponse>('/doctor-access', { params });
  return response.data;
};
