import { useState, useEffect, useCallback } from "react";

export function usePaginated(fetchFunction, initialFilters = {}) {
  const [data, setData] = useState({
    items: [],
    total: 0,
    pages: 1,
    page: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(initialFilters);

  const load = useCallback(async () => {
    try {
      setLoading(true);

      const result = await fetchFunction({
        ...filters,
        page,
        page_size: 20,
      });

      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [fetchFunction, filters, page]);

  useEffect(() => {
    load();
  }, [load]);

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setPage(1);
  }, [initialFilters]);

  return {
    data,
    loading,
    error,
    filters,
    updateFilter,
    resetFilters,
    page,
    setPage,
    reload: load,
  };
}