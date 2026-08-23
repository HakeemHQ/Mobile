/**
 * useDocuments Hook
 * Manages fetching document list, total counts, loading/error states, and refreshing.
 */
import { useState, useEffect, useCallback } from 'react';
import { getDocumentsApi, getDocumentByIdApi } from '@/lib/api/documents';
import type { DocumentItem, DocumentDetail } from '@/types/document';

export function useDocuments() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setError(null);
      const res = await getDocumentsApi({ pageSize: 50 });
      if (res.success && res.data) {
        const items = res.data.items || [];
        setDocuments(items);
        setTotalCount(res.data.totalCount ?? items.length);
      } else {
        setDocuments([]);
        setTotalCount(0);
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load documents');
      setDocuments([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    totalCount,
    loading,
    refreshing,
    error,
    refresh,
    fetchDocuments,
  };
}

export function useDocumentDetail(documentId: string) {
  const [document, setDocument] = useState<DocumentDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!documentId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await getDocumentByIdApi(documentId);
      if (res.success && res.data) {
        setDocument(res.data);
      } else {
        setError(res.message || 'Failed to load document');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load document');
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    document,
    loading,
    error,
    retry: fetchDetail,
  };
}
