export type EditableProfileField =
    | 'firstName'
    | 'lastName'
    | 'email'
    | 'phoneNumber';

export interface ProfileData {
    userId: string;
    email: string;
    fullName: string;
    birthDate: string;
    status: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    gender: string;
}

export type ProfileGenderIconProps = {
    gender?: string | null;
    size?: number;
    color?: string;
};

export type ProfileUpdatePayload = Partial<
    Pick<
        ProfileData,
        'firstName' | 'lastName' | 'email' | 'phoneNumber'
    >
>;

export interface ApiFieldError {
    propertyName?: string;
    message?: string;
}

export interface ProfileResponse {
    data: ProfileData | null;
    success: boolean;
    message?: string;
    errorList?: ApiFieldError[];
    globalErrorCode?: string | null;
}

export interface ProfileUpdateResponse {
    data?: Partial<ProfileData> | null;
    success?: boolean;
    message?: string;
    errorList?: ApiFieldError[];
    globalErrorCode?: string | null;
}

export interface ApiThrownError {
    message?: string;
    errorList?: ApiFieldError[];
}