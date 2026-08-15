/**
 * useMedicalRecords Hook
 * Fetches medical records with pagination (infinite scroll),
 * server-side search via /medical-records/search, and year-grouping.
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { getMedicalRecords, searchMedicalRecords } from '@/lib/api/medical-records';
import { useProfileStore } from '@/store/useProfileStore';
import type { MedicalRecordItem, MedicalRecordType } from '@/types/medical-record';

const PAGE_SIZE = 15;

export interface MedicalRecordGroup {
  year: string;
  items: MedicalRecordItem[];
}

/**
 * Groups medical record items by year (extracted from clinicalDate).
 * Sorted in descending order (newest year first).
 */
const groupByYear = (items: MedicalRecordItem[]): MedicalRecordGroup[] => {
  const yearMap = new Map<string, MedicalRecordItem[]>();

  for (const item of items) {
    const year = new Date(item.clinicalDate).getFullYear().toString();
    const existing = yearMap.get(year) || [];
    existing.push(item);
    yearMap.set(year, existing);
  }

  // Sort years descending (newest first)
  const sortedYears = Array.from(yearMap.keys()).sort((a, b) => Number(b) - Number(a));

  return sortedYears.map((year) => ({
    year,
    // Sort items within each year by clinicalDate descending
    items: yearMap.get(year)!.sort(
      (a, b) => new Date(b.clinicalDate).getTime() - new Date(a.clinicalDate).getTime()
    ),
  }));
};

export function useMedicalRecords() {
  const { profile } = useProfileStore();

  // All items (accumulated across pages)
  const [allItems, setAllItems] = useState<MedicalRecordItem[]>([]);
  const [groupedRecords, setGroupedRecords] = useState<MedicalRecordGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MedicalRecordItem[] | null>(null);
  const [searching, setSearching] = useState(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pagination tracking
  const currentPageRef = useRef(1);
  const currentFilterRef = useRef<MedicalRecordType | undefined>(undefined);

  /**
   * Fetch a specific page of records. Appends to existing items if append=true.
   */
  const fetchPage = useCallback(async (
    pageNumber: number,
    recordType?: MedicalRecordType,
    append = false
  ) => {
    try {
      setError(null);
      const response = await getMedicalRecords({
        pageNumber,
        pageSize: PAGE_SIZE,
        recordType,
      });

      if (response.success && response.data) {
        const newItems = response.data.items || [];
        const totalCount = response.data.totalCount || 0;

        setAllItems((prevItems) => {
          const updatedItems = append ? [...prevItems, ...newItems] : newItems;
          setGroupedRecords(groupByYear(updatedItems));
          setHasMore(updatedItems.length < totalCount);
          return updatedItems;
        });
        currentPageRef.current = pageNumber;
      } else {
        if (!append) {
          setAllItems([]);
          setGroupedRecords([]);
        }
        setHasMore(false);
      }
    } catch (err: any) {
      const message = err?.message || 'Failed to load records';
      setError(message);
      if (!append) {
        setAllItems([]);
        setGroupedRecords([]);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, []);

  /**
   * Initial fetch / filter change: resets to page 1.
   */
  const fetchRecords = useCallback(async (recordType?: MedicalRecordType) => {
    currentFilterRef.current = recordType;
    currentPageRef.current = 1;
    setLoading(true);
    setHasMore(true);
    setSearchResults(null);
    setSearchQuery('');

    await fetchPage(1, recordType, false);
  }, [fetchPage]);

  /**
   * Load next page (infinite scroll).
   */
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || searching || searchResults !== null) return;

    setLoadingMore(true);
    const nextPage = currentPageRef.current + 1;
    await fetchPage(nextPage, currentFilterRef.current, true);
  }, [loadingMore, hasMore, searching, searchResults, fetchPage]);

  /**
   * Pull-to-refresh: resets to page 1.
   */
  const refresh = useCallback(async (recordType?: MedicalRecordType) => {
    setRefreshing(true);
    currentPageRef.current = 1;
    setHasMore(true);
    setSearchResults(null);
    setSearchQuery('');

    await fetchPage(1, recordType ?? currentFilterRef.current, false);
  }, [fetchPage]);

  /**
   * Server-side search with debounce.
   */
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);

    // Clear previous debounce timer
    if (searchTimerRef.current) {
      clearTimeout(searchTimerRef.current);
    }

    const trimmed = query.trim();

    // If query is empty, revert to normal paginated data
    if (!trimmed) {
      setSearchResults(null);
      setSearching(false);
      setGroupedRecords(groupByYear(allItems));
      return;
    }

    // Debounce 400ms before hitting the search API
    setSearching(true);
    searchTimerRef.current = setTimeout(async () => {
      try {
        const response = await getMedicalRecords({
          search: trimmed,
          pageNumber: 1,
          pageSize: 50,
          recordType: currentFilterRef.current,
        });

        const resData = (response as any)?.data;
        const items: MedicalRecordItem[] | null =
          (Array.isArray(resData?.items) ? resData.items : null) ||
          (Array.isArray(resData) ? resData : null) ||
          (Array.isArray((response as any)?.items) ? (response as any).items : null) ||
          (Array.isArray(response) ? (response as any) : null);

        if (items) {
          setSearchResults(items);
          setGroupedRecords(groupByYear(items));
        } else {
          setSearchResults([]);
          setGroupedRecords([]);
        }
      } catch (err) {
        console.warn('Search API call failed, falling back to local filter:', err);
        const lowerQuery = trimmed.toLowerCase();
        const localMatches = allItems.filter(
          (item) =>
            item.displayName?.toLowerCase().includes(lowerQuery) ||
            item.recordType?.toLowerCase().includes(lowerQuery)
        );
        setSearchResults(localMatches);
        setGroupedRecords(groupByYear(localMatches));
      } finally {
        setSearching(false);
      }
    }, 400);
  }, [allItems]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current);
      }
    };
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return {
    groupedRecords,
    loading,
    error,
    refreshing,
    loadingMore,
    hasMore,
    searching,
    searchQuery,
    /** Whether search results are active (vs paginated list) */
    isSearchActive: searchResults !== null,
    refresh,
    fetchRecords,
    loadMore,
    handleSearch,
  };
}
