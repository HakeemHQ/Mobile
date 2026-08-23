import {
    File,
    Paths,
} from 'expo-file-system';
import * as IntentLauncher from 'expo-intent-launcher';
import {
    Platform,
} from 'react-native';

export type MedicalCvStatusTone =
    | 'draft'
    | 'approved'
    | 'default';

export function formatMedicalCvDate(
    value: string,
    language: string,
): string {
    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {
        return value;
    }

    const locale =
        language.startsWith('ar')
            ? 'ar-EG'
            : 'en-GB';

    return new Intl.DateTimeFormat(
        locale,
        {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        },
    ).format(date);
}

export function getMedicalCvScopeTranslationKey(
    scopeType: string,
):
    | 'scopeFocused'
    | 'scopeFull'
    | null {
    const normalized =
        scopeType
            .trim()
            .toLowerCase();

    if (
        normalized ===
        'focused'
    ) {
        return 'scopeFocused';
    }

    if (
        normalized ===
        'full'
    ) {
        return 'scopeFull';
    }

    return null;
}

export function getMedicalCvStatusTranslationKey(
    status: string,
):
    | 'statusDraft'
    | 'statusApproved'
    | null {
    const normalized =
        status
            .trim()
            .toLowerCase();

    if (
        normalized ===
        'draft'
    ) {
        return 'statusDraft';
    }

    if (
        normalized ===
        'approved'
    ) {
        return 'statusApproved';
    }

    return null;
}

export function getMedicalCvStatusTone(
    status: string,
): MedicalCvStatusTone {
    const normalized =
        status
            .trim()
            .toLowerCase();

    if (
        normalized ===
        'draft'
    ) {
        return 'draft';
    }

    if (
        normalized ===
        'approved'
    ) {
        return 'approved';
    }

    return 'default';
}

function sanitizePdfFileName(
    value: string,
): string {
    return value.replace(
        /[^a-zA-Z0-9-_]/g,
        '-',
    );
}

export function saveMedicalCvPdf(
    data: ArrayBuffer,
    versionId: string,
    versionNumber?: number,
): File {
    const identifier =
        versionNumber !== undefined
            ? `version-${versionNumber}`
            : sanitizePdfFileName(
                versionId,
            );

    const file =
        new File(
            Paths.document,
            `medical-cv-${identifier}.pdf`,
        );

    if (file.exists) {
        file.delete();
    }

    file.create();

    file.write(
        new Uint8Array(data),
    );

    return file;
}

export async function openMedicalCvPdf(
    file: File,
): Promise<boolean> {
    if (
        Platform.OS !==
        'android'
    ) {
        return false;
    }

    await IntentLauncher.startActivityAsync(
        'android.intent.action.VIEW',
        {
            data: file.contentUri,
            type: 'application/pdf',
            flags: 1,
        },
    );

    return true;
}