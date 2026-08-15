import type { KeyboardTypeOptions } from 'react-native';

import type {
    ApiThrownError,
    EditableProfileField,
    ProfileData,
} from '@/types/profile';

export const PROFILE_FIELD_TITLES: Record<
    EditableProfileField,
    string
> = {
    firstName: 'Edit First Name',
    lastName: 'Edit Last Name',
    email: 'Edit Email Address',
    phoneNumber: 'Edit Phone Number',
};

const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

export function getProfileFieldValue(
    profile: ProfileData,
    field: EditableProfileField,
): string {
    return profile[field] ?? '';
}

export function getProfileFieldPlaceholder(
    field: EditableProfileField | null,
): string {
    switch (field) {
        case 'firstName':
            return 'Enter your first name';

        case 'lastName':
            return 'Enter your last name';

        case 'email':
            return 'Enter your email address';

        case 'phoneNumber':
            return 'Enter your phone number';

        default:
            return '';
    }
}

export function getProfileFieldKeyboardType(
    field: EditableProfileField | null,
): KeyboardTypeOptions {
    if (field === 'email') {
        return 'email-address';
    }

    if (field === 'phoneNumber') {
        return 'phone-pad';
    }

    return 'default';
}

export function validateProfileField(
    field: EditableProfileField,
    value: string,
): string | null {
    const cleanedValue = value.trim();

    if (!cleanedValue) {
        return 'This field is required.';
    }

    if (
        field === 'email' &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanedValue)
    ) {
        return 'Enter a valid email address.';
    }

    if (
        (field === 'firstName' || field === 'lastName') &&
        cleanedValue.length < 2
    ) {
        return field === 'firstName'
            ? 'Enter a valid first name.'
            : 'Enter a valid last name.';
    }

    if (
        field === 'phoneNumber' &&
        !/^01[0-9]{9}$/.test(cleanedValue)
    ) {
        return 'Enter a valid Egyptian phone number starting with 01 and containing 11 digits.';
    }

    return null;
}

export function formatProfileBirthDate(
    dateValue: string,
): string {
    if (!dateValue) {
        return 'Not provided';
    }

    const dateOnly = dateValue.slice(0, 10);
    const [year, month, day] = dateOnly.split('-').map(Number);

    if (
        !year ||
        !month ||
        !day ||
        month < 1 ||
        month > 12 ||
        day < 1 ||
        day > 31
    ) {
        return dateValue;
    }

    return `${months[month - 1]} ${day}, ${year}`;
}

export function buildProfileDisplayName(
    profile: ProfileData,
): string {
    const nameFromParts =
        `${profile.firstName} ${profile.lastName}`.trim();

    return (
        nameFromParts ||
        profile.fullName.trim() ||
        'Hakeem User'
    );
}

export function getInitials(name: string): string {
    const nameParts = name
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (nameParts.length === 0) {
        return '';
    }

    return nameParts
        .slice(0, 2)
        .map((part) => part.charAt(0))
        .join('')
        .toUpperCase();
}

export function getApiErrorMessage(
    error: unknown,
    fallbackMessage: string,
): string {
    if (!error || typeof error !== 'object') {
        return fallbackMessage;
    }

    const apiError = error as ApiThrownError;

    const fieldError = apiError.errorList?.find(
        (item) => item.message,
    );

    return (
        fieldError?.message ||
        apiError.message ||
        fallbackMessage
    );
}