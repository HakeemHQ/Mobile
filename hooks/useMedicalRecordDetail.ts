/**
 * useMedicalRecordDetail Hook
 * Fetches a single medical record by ID, including fields and sources.
 */
import { useState, useEffect, useCallback } from 'react';
import { getMedicalRecordById } from '@/lib/api/medical-records';
import type { MedicalRecordDetail } from '@/types/medical-record';

export function useMedicalRecordDetail(id: string) {
  const [record, setRecord] = useState<MedicalRecordDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const response = await getMedicalRecordById(id);

      if (response.success && response.data) {
        setRecord(response.data);
      } else {
        setError(response.message || 'Failed to load record');
      }
    } catch (err: any) {
      const message = err?.message || 'Failed to load record';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return {
    record,
    loading,
    error,
    retry: fetchDetail,
  };
}
