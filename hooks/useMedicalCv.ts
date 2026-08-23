import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import {
    getMedicalCvByIdApi,
    getMedicalCvsApi,
    getMedicalCvVersionPdfApi,
} from '@/lib/api';
import {
    openMedicalCvPdf,
    saveMedicalCvPdf,
} from '@/lib/medical-cv-utils';

import type {
    MedicalCvDetails,
    MedicalCvItem,
    MedicalCvPagination,
    MedicalCvRequestStatus,
} from '@/types/medical-cv';

export function useMedicalCvs() {
    const [
        medicalCvs,
        setMedicalCvs,
    ] = useState<
        MedicalCvItem[]
    >([]);

    const [
        pagination,
        setPagination,
    ] =
        useState<MedicalCvPagination | null>(
            null,
        );

    const [
        listStatus,
        setListStatus,
    ] =
        useState<MedicalCvRequestStatus>(
            'idle',
        );

    const [
        listError,
        setListError,
    ] = useState('');

    const isMountedRef =
        useRef(true);

    const isFetchingRef =
        useRef(false);

    useEffect(() => {
        isMountedRef.current =
            true;

        return () => {
            isMountedRef.current =
                false;
        };
    }, []);

    const fetchMedicalCvs =
        useCallback(
            async () => {
                if (
                    isFetchingRef.current
                ) {
                    return;
                }

                isFetchingRef.current =
                    true;

                if (
                    isMountedRef.current
                ) {
                    setListStatus(
                        'loading',
                    );
                    setListError('');
                }

                try {
                    const response =
                        await getMedicalCvsApi();

                    if (
                        !response.success ||
                        !response.data
                    ) {
                        if (
                            isMountedRef.current
                        ) {
                            setMedicalCvs(
                                [],
                            );
                            setPagination(
                                null,
                            );
                            setListStatus(
                                'error',
                            );
                            setListError(
                                response.message ||
                                'Unable to load your Medical CVs.',
                            );
                        }

                        return;
                    }

                    if (
                        !isMountedRef.current
                    ) {
                        return;
                    }

                    setMedicalCvs(
                        response.data
                            .items,
                    );

                    setPagination(
                        response.data
                            .pagination,
                    );

                    setListStatus(
                        'success',
                    );

                    setListError('');
                } catch (
                error: unknown
                ) {
                    if (
                        !isMountedRef.current
                    ) {
                        return;
                    }

                    const apiError =
                        error as {
                            message?:
                            string;
                        };

                    setMedicalCvs([]);

                    setPagination(
                        null,
                    );

                    setListStatus(
                        'error',
                    );

                    setListError(
                        apiError.message ||
                        'Unable to load your Medical CVs.',
                    );
                } finally {
                    isFetchingRef.current =
                        false;
                }
            },
            [],
        );

    useEffect(() => {
        void fetchMedicalCvs();
    }, [fetchMedicalCvs]);

    return {
        medicalCvs,
        pagination,
        listStatus,
        listError,
        fetchMedicalCvs,
    };
}

export function useMedicalCvDetails(
    medicalCvId:
        | string
        | undefined,
) {
    const [
        selectedMedicalCv,
        setSelectedMedicalCv,
    ] =
        useState<MedicalCvDetails | null>(
            null,
        );

    const [
        detailsStatus,
        setDetailsStatus,
    ] =
        useState<MedicalCvRequestStatus>(
            'idle',
        );

    const [
        detailsError,
        setDetailsError,
    ] = useState('');

    const isMountedRef =
        useRef(true);

    const requestIdRef =
        useRef(0);

    useEffect(() => {
        isMountedRef.current =
            true;

        return () => {
            isMountedRef.current =
                false;

            requestIdRef.current +=
                1;
        };
    }, []);

    const fetchMedicalCv =
        useCallback(
            async () => {
                if (
                    !medicalCvId
                        ?.trim()
                ) {
                    return;
                }

                const requestId =
                    ++requestIdRef.current;

                if (
                    isMountedRef.current
                ) {
                    setSelectedMedicalCv(
                        null,
                    );

                    setDetailsStatus(
                        'loading',
                    );

                    setDetailsError('');
                }

                try {
                    const response =
                        await getMedicalCvByIdApi(
                            medicalCvId,
                        );

                    if (
                        !isMountedRef.current ||
                        requestId !==
                        requestIdRef.current
                    ) {
                        return;
                    }

                    if (
                        !response.success ||
                        !response.data
                    ) {
                        setDetailsStatus(
                            'error',
                        );

                        setDetailsError(
                            response.message ||
                            'Unable to load the Medical CV.',
                        );

                        return;
                    }

                    setSelectedMedicalCv(
                        response.data,
                    );

                    setDetailsStatus(
                        'success',
                    );

                    setDetailsError('');
                } catch (
                error: unknown
                ) {
                    if (
                        !isMountedRef.current ||
                        requestId !==
                        requestIdRef.current
                    ) {
                        return;
                    }

                    const apiError =
                        error as {
                            message?:
                            string;
                        };

                    setDetailsStatus(
                        'error',
                    );

                    setDetailsError(
                        apiError.message ||
                        'Unable to load the Medical CV.',
                    );
                }
            },
            [medicalCvId],
        );

    useEffect(() => {
        if (!medicalCvId) {
            return;
        }

        void fetchMedicalCv();
    }, [
        fetchMedicalCv,
        medicalCvId,
    ]);

    return {
        selectedMedicalCv,
        detailsStatus,
        detailsError,
        fetchMedicalCv,
    };
}

interface MedicalCvPdfDownloadResult {
    success: boolean;
    error?: string;
}

export function useMedicalCvPdf(
    medicalCv:
        | MedicalCvDetails
        | null,
) {
    const [
        downloadingVersionId,
        setDownloadingVersionId,
    ] =
        useState<string | null>(
            null,
        );

    const isDownloadingRef =
        useRef(false);

    const isMountedRef =
        useRef(true);

    useEffect(() => {
        isMountedRef.current =
            true;

        return () => {
            isMountedRef.current =
                false;
        };
    }, []);

    const downloadVersionPdf =
        useCallback(
            async (
                versionId: string,
            ): Promise<MedicalCvPdfDownloadResult> => {
                if (
                    !versionId.trim()
                ) {
                    return {
                        success: false,
                        error:
                            'No Medical CV version is available.',
                    };
                }

                if (
                    isDownloadingRef.current
                ) {
                    return {
                        success: false,
                    };
                }

                isDownloadingRef.current =
                    true;

                if (
                    isMountedRef.current
                ) {
                    setDownloadingVersionId(
                        versionId,
                    );
                }

                try {
                    const pdfData =
                        await getMedicalCvVersionPdfApi(
                            versionId,
                        );

                    const version =
                        medicalCv?.versions.find(
                            (
                                item,
                            ) =>
                                item.medicalCvVersionId ===
                                versionId,
                        );

                    const file =
                        saveMedicalCvPdf(
                            pdfData,
                            versionId,
                            version
                                ?.versionNumber,
                        );

                    try {
                        await openMedicalCvPdf(
                            file,
                        );
                    } catch {
                        return {
                            success: false,
                            error:
                                'The PDF was downloaded, but no PDF viewer could open it.',
                        };
                    }

                    return {
                        success: true,
                    };
                } catch (
                error: unknown
                ) {
                    const apiError =
                        error as {
                            message?:
                            string;
                        };

                    return {
                        success: false,
                        error:
                            apiError.message ||
                            'Unable to download the Medical CV PDF.',
                    };
                } finally {
                    isDownloadingRef.current =
                        false;

                    if (
                        isMountedRef.current
                    ) {
                        setDownloadingVersionId(
                            null,
                        );
                    }
                }
            },
            [medicalCv],
        );

    return {
        downloadingVersionId,
        downloadVersionPdf,
    };
}